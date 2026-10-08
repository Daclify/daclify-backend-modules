import { z } from 'zod';
import { RuntimeTableSchemas } from '@daclify/core-protocol/sdk';
import { DecideActionSchemas } from '../sdk/generated/decide-schemas.js';
import { verifyArchiveBundle } from './restore.js';
import { buildArchiveTree } from './format.js';
import { verifyArchiveChunkDescriptor } from './manifest.js';
export function archivePruneBatch(value: unknown, anchorValue: unknown, progressValue: unknown) {
  const anchor = RuntimeTableSchemas.archives.parse(anchorValue),
    progress = RuntimeTableSchemas.archpos.parse(progressValue);
  const bundle = verifyArchiveBundle(value, anchor.manifest_commitment),
    manifest = bundle.manifest;
  if (
    manifest.dao.daoId !== anchor.dao_id ||
    manifest.dao.contract !== anchor.manifest.runtime ||
    manifest.dao.chainId !== anchor.manifest.chain_id ||
    manifest.descriptorCommitment !== anchor.descriptor_commitment ||
    progress.archive_id !== anchor.id ||
    progress.dao_id !== anchor.dao_id ||
    BigInt(progress.id) !== BigInt(anchor.id) * 32n + BigInt(progress.chunk_ordinal)
  )
    throw new RangeError('ARCHIVE_DOMAIN');
  if (
    manifest.families.length !== 1 ||
    !['ordinary-poll-votes', 'document-versions'].includes(manifest.families[0]?.kind ?? '') ||
    (manifest.families[0]?.kind === 'ordinary-poll-votes' && manifest.files.length > 0)
  )
    throw new RangeError('ARCHIVE_FAMILY_PROTECTED');
  const family = manifest.families[0];
  if (!family) throw new RangeError('ARCHIVE_FAMILY_PROTECTED');
  const chunk = family.chunks[progress.chunk_ordinal];
  if (!chunk) throw new RangeError('ARCHIVE_PROGRESS');
  const asset = bundle.chunks.find((c) => c.cid === chunk.cid);
  if (!asset) throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
  const decoded = verifyArchiveChunkDescriptor(
    chunk,
    Uint8Array.from(atob(asset.content), (c) => c.charCodeAt(0)),
  );
  const rows = decoded;
  if (progress.pruned > rows.length) throw new RangeError('ARCHIVE_PROGRESS');
  if (progress.pruned === rows.length) return null;
  const tree = buildArchiveTree(chunk.domain, rows);
  const data = DecideActionSchemas.prunevotes.parse({
    runtime: manifest.dao.contract,
    dao_id: anchor.dao_id,
    archive_id: anchor.id,
    chunk_ordinal: progress.chunk_ordinal,
    start: progress.pruned,
    proofs: rows.slice(progress.pruned, progress.pruned + 25).map((row, i) => ({
      primary_key: row.primaryKey,
      siblings: tree.proof(progress.pruned + i),
    })),
  });
  return data;
}
export type ArchivePruneBatch = NonNullable<ReturnType<typeof archivePruneBatch>>;
export const ArchivePruneBatchSchema = DecideActionSchemas.prunevotes;
export const ArchiveProgressSchema = z.strictObject({
  anchor: RuntimeTableSchemas.archives,
  positions: z.array(RuntimeTableSchemas.archpos).max(32),
  enabled: z.boolean(),
});
