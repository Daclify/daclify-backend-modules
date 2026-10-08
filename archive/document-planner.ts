import { ABI, Checksum256, Serializer } from '@wharfkit/antelope';
import { runtimeAbi } from '@daclify/core-protocol/sdk';
import { ramRowBytes } from '@daclify/core-protocol';
import {
  DocumentArchiveInputSchema,
  OrdinaryPollArchivePlanSchema,
  type OrdinaryPollArchivePlan,
} from '../protocol/archive.js';
import { archiveSourceSchema } from './restore.js';
import { buildArchiveTree } from './format.js';
export function planDocumentArchive(value: unknown): OrdinaryPollArchivePlan {
  const input = DocumentArchiveInputSchema.parse(value),
    schema = archiveSourceSchema('document-versions'),
    abi = ABI.from(runtimeAbi),
    time = Date.parse(input.snapshot.timestamp) / 1000;
  if (
    input.source.account !== input.dao.contract ||
    input.source.codeHash !== schema.codeHash ||
    input.source.abiHash !== schema.rawAbiHash
  )
    throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  if (
    parseInt(input.snapshot.blockId.slice(0, 8), 16) !== input.snapshot.blockNumber ||
    Date.parse(input.sourceUpdatedAt) > Date.parse(input.snapshot.timestamp)
  )
    throw new RangeError('ARCHIVE_SNAPSHOT_UNQUALIFIED');
  const heads = new Map(input.heads.map((r) => [r.document_id, r])),
    clocks = new Map(input.clocks.map((r) => [r.id, r]));
  if (
    heads.size !== input.heads.length ||
    clocks.size !== input.clocks.length ||
    new Set(input.documents.map((r) => r.id)).size !== input.documents.length
  )
    throw new RangeError('ARCHIVE_DUPLICATE_ROW');
  if (new Set(input.documents.map((r) => r.document_id)).size !== 1)
    throw new RangeError('ARCHIVE_DOCUMENT_PARENT');
  const plan: OrdinaryPollArchivePlan = {
      dao: input.dao,
      source: input.source,
      snapshot: input.snapshot,
      pruningAuthorized: false,
      grossRamBytes: '0',
      blocked: [],
      families: [],
    },
    rows = [];
  const parent = input.documents[0]?.document_id;
  if (!parent) throw new RangeError('ARCHIVE_DOCUMENT_PARENT');
  for (const document of [...input.documents].sort((a, b) =>
    BigInt(a.id) < BigInt(b.id) ? -1 : 1,
  )) {
    const head = heads.get(document.document_id),
      clock = clocks.get(document.id),
      packed = Serializer.encode({ abi, type: schema.rowType, object: document }).array;
    if (
      !head ||
      !clock ||
      clock.document_id !== document.document_id ||
      clock.version !== document.version ||
      clock.row_hash !== Checksum256.hash(packed).toString() ||
      document.version > head.version
    )
      throw new RangeError('ARCHIVE_DOCUMENT_CHANGED');
    const reason = !input.coverageComplete
      ? 'reference-backfill-required'
      : document.version === head.version
        ? 'latest-version'
        : input.references.some(
              (r) => r.document_id === document.document_id && r.version === document.version,
            )
          ? 'referenced-version'
          : clock.created_at > time
            ? 'terminal-not-irreversible'
            : time - clock.created_at < input.retentionSeconds
              ? 'retention'
              : undefined;
    if (reason) {
      plan.blocked.push({ parentId: document.id, reason });
      continue;
    }
    rows.push({
      primaryKey: document.id,
      packed: Serializer.encode({ abi, type: schema.rowType, object: document }).hexString,
    });
  }
  if (rows.length) {
    const domain = {
        format_version: 1 as const,
        chain_id: input.dao.chainId,
        runtime: input.dao.contract,
        dao_id: input.dao.daoId,
        source: input.source.account,
        code_hash: schema.codeHash,
        abi_hash: schema.rawAbiHash,
        schema_hash: schema.schemaHash,
        table: 'documents',
        scope: input.dao.daoId,
        chunk_ordinal: 0,
        leaf_count: rows.length,
      },
      tree = buildArchiveTree(domain, rows),
      gross = rows.reduce((sum, r) => sum + ramRowBytes(r.packed.length / 2, [16]), 0n);
    plan.grossRamBytes = gross.toString();
    plan.families.push({
      kind: 'document-versions',
      parentId: parent,
      grossRamBytes: gross.toString(),
      chunks: [{ domain, rows, root: tree.root, bytes: tree.encodedBytes }],
    });
  }
  return OrdinaryPollArchivePlanSchema.parse(plan);
}
