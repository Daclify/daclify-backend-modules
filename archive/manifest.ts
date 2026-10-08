import { Bytes, Checksum256, Serializer, VarUInt } from '@wharfkit/antelope';
import { ChainIdSchema } from '@daclify/core-protocol';
import {
  ArchiveManifestBodySchema,
  ArchiveManifestSchema,
  ArchiveChunkDescriptorSchema,
  MAX_ARCHIVE_CHUNK_BYTES,
  type ArchiveManifest,
  type ArchiveChunkDescriptor,
} from '../protocol/archive.js';
import { packArchiveDomain, decodeArchiveChunk } from './format.js';
const hash = (bytes: Uint8Array) => Checksum256.hash(bytes).toString();
function concatenate(parts: readonly Uint8Array[]) {
  const bytes = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return bytes;
}
const number = (type: 'uint64' | 'uint32' | 'uint16' | 'uint8' | 'name', object: string | number) =>
  Serializer.encode({ type, object }).array;
const text = (object: string) => Serializer.encode({ type: 'string', object }).array;
const count = (object: number) => Serializer.encode({ type: VarUInt, object }).array;
export function archiveDescriptorHash(value: unknown): string {
  const manifest = ArchiveManifestSchema.or(ArchiveManifestBodySchema).parse(value);
  const parts = [
    number('uint16', manifest.schemaVersion),
    Bytes.from(manifest.dao.chainId).array,
    number('name', manifest.dao.contract),
    number('uint64', manifest.dao.daoId),
    number('name', manifest.source.account),
    Bytes.from(manifest.source.codeHash).array,
    Bytes.from(manifest.source.abiHash).array,
    number('uint32', manifest.snapshot.blockNumber),
    Bytes.from(manifest.snapshot.blockId).array,
    text(manifest.snapshot.timestamp),
    count(manifest.families.length),
  ];
  for (const family of manifest.families) {
    parts.push(
      text(family.kind),
      number('uint64', family.parentId),
      number('name', family.table),
      number('uint64', family.scope),
      Bytes.from(family.schemaHash).array,
      number('uint64', family.records),
      count(family.chunks.length),
    );
    for (const chunk of family.chunks)
      parts.push(
        packArchiveDomain(chunk.domain),
        Bytes.from(chunk.root).array,
        text(chunk.cid),
        number('uint32', chunk.bytes),
        Bytes.from(chunk.commitment).array,
        number('uint64', chunk.firstKey),
        number('uint64', chunk.lastKey),
      );
  }
  parts.push(count(manifest.files.length));
  for (const file of manifest.files)
    parts.push(
      number('uint64', file.document_id),
      number('uint32', file.version),
      text(file.cid),
      number('uint64', file.bytes),
      Bytes.from(file.commitment).array,
      number('uint8', file.envelope_version),
      number('uint64', file.key_epoch),
    );
  return hash(concatenate(parts));
}
export function createArchiveManifest(value: unknown): ArchiveManifest {
  const body = ArchiveManifestBodySchema.parse(value);
  return ArchiveManifestSchema.parse({
    ...body,
    descriptorCommitment: archiveDescriptorHash(body),
  });
}
export function encodeArchiveManifest(value: ArchiveManifest): Uint8Array {
  const manifest = ArchiveManifestSchema.parse(value),
    { descriptorCommitment: _commitment, ...body } = manifest;
  if (manifest.descriptorCommitment !== archiveDescriptorHash(body))
    throw new RangeError('ARCHIVE_DESCRIPTOR_COMMITMENT');
  const bytes = new TextEncoder().encode(JSON.stringify(manifest));
  if (bytes.length > MAX_ARCHIVE_CHUNK_BYTES) throw new RangeError('ARCHIVE_MANIFEST_SIZE');
  return bytes;
}
export function decodeArchiveManifest(
  bytes: Uint8Array,
  expectedCommitment: string,
): ArchiveManifest {
  if (!bytes.length || bytes.length > MAX_ARCHIVE_CHUNK_BYTES)
    throw new RangeError('ARCHIVE_MANIFEST_SIZE');
  if (hash(bytes) !== ChainIdSchema.parse(expectedCommitment))
    throw new RangeError('ARCHIVE_MANIFEST_COMMITMENT');
  const parsed: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  const manifest = ArchiveManifestSchema.parse(parsed);
  if (!Bytes.from(encodeArchiveManifest(manifest)).equals(bytes))
    throw new RangeError('ARCHIVE_MANIFEST_CANONICAL');
  return manifest;
}
export function verifyArchiveChunkDescriptor(
  descriptor: ArchiveChunkDescriptor,
  bytes: Uint8Array,
) {
  const chunk = ArchiveChunkDescriptorSchema.parse(descriptor);
  if (bytes.length !== chunk.bytes || hash(bytes) !== chunk.commitment)
    throw new RangeError('ARCHIVE_CONTENT_COMMITMENT');
  const rows = decodeArchiveChunk(bytes, chunk.domain, chunk.root);
  if (rows[0]?.primaryKey !== chunk.firstKey || rows.at(-1)?.primaryKey !== chunk.lastKey)
    throw new RangeError('ARCHIVE_CONTENT_COVERAGE');
  return rows;
}
export function verifyArchiveChunks(
  value: ArchiveManifest,
  contents: readonly { cid: string; bytes: Uint8Array }[],
) {
  const manifest = ArchiveManifestSchema.parse(value);
  encodeArchiveManifest(manifest);
  const descriptors = manifest.families.flatMap((family, index) =>
    family.chunks.map((chunk) => ({ family: index, chunk })),
  );
  if (
    descriptors.length !== contents.length ||
    new Set(contents.map((item) => item.cid)).size !== contents.length
  )
    throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
  // ponytail: full-memory convenience import is capped; use per-chunk verification for larger restores.
  if (descriptors.reduce((sum, item) => sum + item.chunk.bytes, 0) > 64 * 1024 * 1024)
    throw new RangeError('ARCHIVE_RESTORE_LIMIT');
  const byCid = new Map(contents.map((item) => [item.cid, item.bytes])),
    seen = new Set<string>();
  return descriptors.flatMap(({ family, chunk }) => {
    const bytes = byCid.get(chunk.cid);
    if (!bytes) throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
    return verifyArchiveChunkDescriptor(chunk, bytes).map((row) => {
      const key = JSON.stringify([chunk.domain.table, chunk.domain.scope, row.primaryKey]);
      if (seen.has(key)) throw new RangeError('ARCHIVE_ROW_DUPLICATE');
      seen.add(key);
      return { family, ...row };
    });
  });
}
