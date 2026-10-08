import { Checksum256, Name } from '@wharfkit/antelope';
import { HostedObjectDescriptorSchema } from '@daclify/core-protocol';
import { z } from 'zod';
import { CID } from 'multiformats/cid';
import { create } from 'multiformats/hashes/digest';
import {
  OrdinaryPollArchivePlanSchema,
  type OrdinaryPollArchivePlan,
  MAX_ARCHIVE_CHUNK_BYTES,
} from '../protocol/archive.js';
import { archiveSourceSchema, decodeReleasedArchiveRow } from './restore.js';
import { buildArchiveTree, encodeArchiveChunk } from './format.js';
import { createArchiveManifest, encodeArchiveManifest } from './manifest.js';

const ReceiptSchema = HostedObjectDescriptorSchema.pick({
  cid: true,
  bytes: true,
  commitment: true,
});
type Receipt = z.infer<typeof ReceiptSchema>;
const hash = (bytes: Uint8Array) => Checksum256.hash(bytes).toString();

export function archiveManifestForPlan(value: OrdinaryPollArchivePlan, values: readonly Receipt[]) {
  const plan = OrdinaryPollArchivePlanSchema.parse(value),
    schema = archiveSourceSchema('ordinary-poll-votes'),
    scope = Name.from(plan.dao.contract).value.toString();
  if (plan.blocked.length || !plan.families.length) throw new RangeError('ARCHIVE_NOT_ELIGIBLE');
  if (plan.source.codeHash !== schema.codeHash || plan.source.abiHash !== schema.rawAbiHash)
    throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  if (values.length !== plan.families.reduce((n, f) => n + f.chunks.length, 0))
    throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
  let cursor = 0;
  const families = plan.families.map((family) => ({
    kind: family.kind,
    parentId: family.parentId,
    table: 'votes',
    scope,
    schemaHash: schema.schemaHash,
    records: String(family.chunks.reduce((n, c) => n + c.rows.length, 0)),
    chunks: family.chunks.map((chunk) => {
      const receipt = ReceiptSchema.parse(values[cursor++]),
        bytes = encodeArchiveChunk(chunk.domain, chunk.rows);
      if (
        chunk.root !== buildArchiveTree(chunk.domain, chunk.rows).root ||
        chunk.bytes !== bytes.length ||
        receipt.bytes !== bytes.length ||
        receipt.commitment !== hash(bytes)
      )
        throw new RangeError('ARCHIVE_CONTENT_COMMITMENT');
      for (const row of chunk.rows) decodeReleasedArchiveRow(chunk.domain, row, family.parentId);
      return {
        domain: chunk.domain,
        root: chunk.root,
        ...receipt,
        firstKey: chunk.rows[0]?.primaryKey,
        lastKey: chunk.rows.at(-1)?.primaryKey,
      };
    }),
  }));
  return createArchiveManifest({
    schemaVersion: 1,
    dao: plan.dao,
    source: plan.source,
    snapshot: plan.snapshot,
    families,
    files: [],
  });
}

// Consent binds immutable rows/source; a newer LIB alone does not change the selected export.
export function archiveExportConsent(value: OrdinaryPollArchivePlan) {
  const plan = OrdinaryPollArchivePlanSchema.parse(value);
  const chunks = plan.families.flatMap((f) => f.chunks),
    receipts = chunks.map((c) => {
      const digest = Checksum256.hash(encodeArchiveChunk(c.domain, c.rows));
      return {
        cid: CID.createV1(0x55, create(0x12, digest.array)).toString(),
        bytes: c.bytes,
        commitment: digest.toString(),
      };
    }),
    manifest = archiveManifestForPlan(plan, receipts);
  // Provider CIDs can be longer than the placeholder; reserve their schema maximum up front.
  const manifestLimit =
    encodeArchiveManifest(manifest).length + receipts.reduce((n, r) => n + 128 - r.cid.length, 0);
  if (manifestLimit > MAX_ARCHIVE_CHUNK_BYTES) throw new RangeError('ARCHIVE_MANIFEST_SIZE');
  return {
    selectionCommitment: hash(
      new TextEncoder().encode(
        JSON.stringify({ dao: plan.dao, source: plan.source, families: plan.families }),
      ),
    ),
    maximumStoredBytes: String(manifestLimit + chunks.reduce((n, c) => n + c.bytes, 0)),
  };
}
