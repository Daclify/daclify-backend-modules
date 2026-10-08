import { RuntimeTableSchemas } from '@daclify/core-protocol/sdk';
import {
  ArchiveHistoryPageRequestSchema,
  ArchiveHistoryPageSchema,
  ArchiveBundleSchema,
} from '../protocol/archive.js';
import { verifyArchiveBundle, decodeReleasedArchiveRow } from './restore.js';
import { verifyArchiveChunks } from './manifest.js';
export function verifyAnchoredArchive(value: unknown, anchorValue: unknown) {
  const anchor = RuntimeTableSchemas.archives.parse(anchorValue),
    bundle = verifyArchiveBundle(value, anchor.manifest_commitment),
    m = bundle.manifest;
  if (
    m.dao.chainId !== anchor.manifest.chain_id ||
    m.dao.contract !== anchor.manifest.runtime ||
    m.dao.daoId !== anchor.dao_id ||
    m.descriptorCommitment !== anchor.descriptor_commitment ||
    bundle.manifestFile.cid !== anchor.manifest_cid ||
    bundle.manifestFile.bytes !== anchor.manifest_bytes
  )
    throw new RangeError('ARCHIVE_DOMAIN');
  return bundle;
}
export function archiveHistoryPage(value: unknown, inputValue: unknown) {
  const input = ArchiveHistoryPageRequestSchema.parse(inputValue),
    bundle = ArchiveBundleSchema.parse(value);
  verifyArchiveBundle(bundle, input.manifestCommitment);
  if (
    bundle.manifest.dao.chainId !== input.dao.chainId ||
    bundle.manifest.dao.contract !== input.dao.contract ||
    bundle.manifest.dao.daoId !== input.dao.daoId ||
    bundle.manifest.families.length !== 1 ||
    bundle.manifest.families[0]?.kind !== 'ordinary-poll-votes'
  )
    throw new RangeError('ARCHIVE_DOMAIN');
  const family = bundle.manifest.families[0];
  const rows = verifyArchiveChunks(
    bundle.manifest,
    bundle.chunks.map((c) => ({
      cid: c.cid,
      bytes: Uint8Array.from(atob(c.content), (v) => v.charCodeAt(0)),
    })),
  );
  const decoded = rows.map((r) => {
    const chunk = family.chunks.find(
      (c) =>
        BigInt(r.primaryKey) >= BigInt(c.firstKey) && BigInt(r.primaryKey) <= BigInt(c.lastKey),
    );
    if (!chunk) throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
    const row = decodeReleasedArchiveRow(
      chunk.domain,
      { primaryKey: r.primaryKey, packed: r.packed },
      family.parentId,
    );
    if (row.kind !== 'ordinary-poll-votes') throw new RangeError('ARCHIVE_FAMILY_PROTECTED');
    return row.value;
  });
  const after = BigInt(input.cursor ?? '0'),
    page = decoded
      .filter((r) => BigInt(r.id) > after)
      .sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1))
      .slice(0, 26);
  return ArchiveHistoryPageSchema.parse({
    dao: input.dao,
    manifestCommitment: input.manifestCommitment,
    parentId: family.parentId,
    records: page.slice(0, 25),
    next: page.length > 25 ? page[24]?.id : null,
    coverage: 'verified-archive',
    liveRowsIncluded: false,
  });
}
