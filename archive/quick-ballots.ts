import { z } from 'zod';
import { Name } from '@wharfkit/antelope';
import { ramRowBytes } from '@daclify/core-protocol';
import { RuntimeTableSchemas } from '@daclify/core-protocol/sdk';
import { QuickBallotRowSchema } from '../protocol/quick-ballots.js';
import {
  ArchiveRowSchema,
  OrdinaryPollArchivePlanSchema,
  type OrdinaryPollArchivePlan,
} from '../protocol/archive.js';
import { archiveSourceSchema, decodeReleasedArchiveRow } from './restore.js';
import { verifyQuickBallotResult, verifyQuickBallotSnapshot } from '../sdk/quick-ballots.js';
import { buildArchiveTree } from './format.js';
import { verifyAnchoredArchive } from './recovery.js';
import { verifyArchiveChunkDescriptor } from './manifest.js';
import { QuickvoteActionSchemas } from '../sdk/generated/quickvote-schemas.js';
import { encodeQuickBallot } from '../sdk/quick-ballots.js';

const InputSchema = OrdinaryPollArchivePlanSchema.pick({
  dao: true,
  source: true,
  snapshot: true,
}).extend({
  sourceUpdatedAt: z.iso.datetime(),
  kind: z.enum(['quick-ballot-responses', 'quick-ballot-grants']),
  ballot: QuickBallotRowSchema,
  rows: z.array(ArchiveRowSchema).min(1).max(5000),
});
export function planQuickBallotArchive(value: unknown): OrdinaryPollArchivePlan {
  const input = InputSchema.parse(value),
    schema = archiveSourceSchema(input.kind),
    { ballot } = input;
  if (
    input.source.codeHash !== schema.codeHash ||
    input.source.abiHash !== schema.rawAbiHash ||
    input.source.account === input.dao.contract
  )
    throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  if (
    ballot.dao_id !== input.dao.daoId ||
    parseInt(input.snapshot.blockId.slice(0, 8), 16) !== input.snapshot.blockNumber ||
    Date.parse(input.sourceUpdatedAt) > Date.parse(input.snapshot.timestamp)
  )
    throw new RangeError('ARCHIVE_SNAPSHOT_UNQUALIFIED');
  const plan: OrdinaryPollArchivePlan = {
    dao: input.dao,
    source: input.source,
    snapshot: input.snapshot,
    pruningAuthorized: false,
    grossRamBytes: '0',
    blocked: [],
    families: [],
  };
  const time = Date.parse(input.snapshot.timestamp) / 1000;
  const reason = !ballot.closed_at
    ? 'ballot-active'
    : !ballot.prepared
      ? 'terminal-marker-required'
      : ballot.closed_at > time
        ? 'terminal-not-irreversible'
        : time - ballot.closed_at < 30 * 86400
          ? 'retention'
          : undefined;
  if (reason) {
    plan.blocked.push({ parentId: ballot.id, reason });
    return plan;
  }
  const base = {
    chainId: input.dao.chainId,
    runtime: input.dao.contract,
    source: input.source.account,
    ballot,
  };
  verifyQuickBallotResult(base);
  const allRows = input.rows,
    chunks: OrdinaryPollArchivePlan['families'][number]['chunks'] = [];
  for (let start = 0; start < allRows.length; start += 250) {
    const rows = allRows.slice(start, start + 250);
    const domain = {
      format_version: 1 as const,
      chain_id: input.dao.chainId,
      runtime: input.dao.contract,
      dao_id: input.dao.daoId,
      source: input.source.account,
      code_hash: schema.codeHash,
      abi_hash: schema.rawAbiHash,
      schema_hash: schema.schemaHash,
      table: schema.table,
      scope: Name.from(input.dao.contract).value.toString(),
      chunk_ordinal: chunks.length,
      leaf_count: rows.length,
    };
    const tree = buildArchiveTree(domain, rows);
    chunks.push({ domain, rows, root: tree.root, bytes: tree.encodedBytes });
  }
  const decoded = chunks.flatMap((chunk) =>
    chunk.rows.map((row) => decodeReleasedArchiveRow(chunk.domain, row, ballot.id)),
  );
  if (input.kind === 'quick-ballot-responses') {
    const responses = decoded.map((row) => {
      if (!('ballot_id' in row.value)) throw new RangeError('ARCHIVE_ROW_DOMAIN');
      return row.value;
    });
    verifyQuickBallotSnapshot({ ...base, responses });
  } else {
    const row = decoded[0];
    if (
      decoded.length !== 1 ||
      !row ||
      !('grants' in row.value) ||
      row.value.grants.length !== ballot.definition.readers.length
    )
      throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
  }
  plan.grossRamBytes = allRows
    .reduce(
      (sum, row) =>
        sum +
        ramRowBytes(row.packed.length / 2, input.kind === 'quick-ballot-responses' ? [32, 16] : []),
      0n,
    )
    .toString();
  plan.families.push({
    kind: input.kind,
    parentId: ballot.id,
    grossRamBytes: plan.grossRamBytes,
    chunks,
  });
  return OrdinaryPollArchivePlanSchema.parse(plan);
}

export function quickArchivePruneBatch(value: unknown, anchorValue: unknown, position: unknown) {
  const anchor = RuntimeTableSchemas.archives.parse(anchorValue);
  const { chunkOrdinal, start } = z
    .strictObject({ chunkOrdinal: z.int().min(0).max(31), start: z.int().min(0).max(5000) })
    .parse(position);
  const bundle = verifyAnchoredArchive(value, anchor),
    family = bundle.manifest.families[0];
  if (
    anchor.revoked ||
    anchor.backup_commitment === '00'.repeat(32) ||
    anchor.attestation_transaction === '00'.repeat(32)
  )
    throw new RangeError('ARCHIVE_APPROVAL');
  if (
    bundle.manifest.families.length !== 1 ||
    !family ||
    !['quick-ballot-responses', 'quick-ballot-grants'].includes(family.kind) ||
    bundle.manifest.files.length
  )
    throw new RangeError('ARCHIVE_FAMILY_PROTECTED');
  const chunk = family.chunks[chunkOrdinal],
    asset = chunk && bundle.chunks.find((item) => item.cid === chunk.cid);
  if (!chunk || !asset) throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
  const rows = verifyArchiveChunkDescriptor(
    chunk,
    Uint8Array.from(atob(asset.content), (character) => character.charCodeAt(0)),
  );
  if (start > rows.length) throw new RangeError('ARCHIVE_PROGRESS');
  if (start === rows.length) return null;
  const tree = buildArchiveTree(chunk.domain, rows);
  if (family.kind === 'quick-ballot-grants') {
    if (rows.length !== 1 || family.chunks.length !== 1 || start !== 0)
      throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
    return {
      action: 'prunegrants',
      data: QuickvoteActionSchemas.prunegrants.parse({
        runtime: bundle.manifest.dao.contract,
        ballot_id: family.parentId,
        archive_id: anchor.id,
        siblings: tree.proof(0),
      }),
    } as const;
  }
  const data = QuickvoteActionSchemas.prune.parse({
    runtime: bundle.manifest.dao.contract,
    ballot_id: family.parentId,
    archive_id: anchor.id,
    chunk_ordinal: chunkOrdinal,
    start,
    proofs: rows
      .slice(start, start + 25)
      .map((row, offset) => ({
        primary_key: row.primaryKey,
        siblings: tree.proof(start + offset),
      })),
  });
  if (encodeQuickBallot('prune', data).length > 16384) throw new RangeError('ARCHIVE_ACTION_SIZE');
  return { action: 'prune', data } as const;
}
