import { ABI, ABIDecoder, Bytes, Checksum256, Name, Serializer } from '@wharfkit/antelope';
import { IdSchema, ChainIdSchema } from '@daclify/core-protocol';
import {
  runtimeAbi,
  runtimeAbiHash,
  RuntimeCodeHash,
  RuntimeTableSchemas,
} from '@daclify/core-protocol/sdk';
import { decideAbi, decideAbiHash } from '../sdk/generated/decide.js';
import { DecideTableSchemas } from '../sdk/generated/decide-schemas.js';
import { ModuleCodeHashes } from '../sdk/generated/releases.js';
import {
  ArchiveDomainSchema,
  ArchiveRowSchema,
  type ArchiveDomain,
  type ArchiveRow,
  ArchiveBundleSchema,
} from '../protocol/archive.js';
import { decodeArchiveManifest, verifyArchiveChunks } from './manifest.js';
import { previousPollRelease } from './releases/ordinary-polls-observer.js';
import { pruningPollRelease } from './releases/ordinary-polls-pruning.js';
import { previousDocumentRelease } from './releases/document-versions-before-pools.js';
import { documentPoolsIdentity } from './releases/document-versions-pools.js';
const sources = {
  'ordinary-poll-votes': {
    abi: ABI.from(decideAbi),
    canonicalAbiHash: decideAbiHash,
    codeHash: ModuleCodeHashes.decide,
    table: 'votes',
  },
  'document-versions': {
    abi: ABI.from(runtimeAbi),
    canonicalAbiHash: runtimeAbiHash,
    codeHash: RuntimeCodeHash,
    table: 'documents',
  },
};
export function archiveSourceSchema(kind: keyof typeof sources) {
  const source = sources[kind],
    rowType = source.abi.tables.find((table) => table.name.toString() === source.table)?.type;
  if (!rowType) throw new Error('ARCHIVE_RELEASE_SCHEMA_MISSING');
  return {
    codeHash: source.codeHash,
    rawAbiHash: Checksum256.hash(Serializer.encode({ object: source.abi }).array).toString(),
    schemaHash: Checksum256.hash(
      new TextEncoder().encode(
        JSON.stringify({
          formatVersion: 1,
          canonicalAbiHash: source.canonicalAbiHash,
          table: source.table,
          rowType,
        }),
      ),
    ).toString(),
    rowType,
  };
}
function releasedSource(
  kind: keyof typeof sources,
  codeHash: string,
  rawAbiHash: string,
  schemaHash: string,
) {
  const current = archiveSourceSchema(kind);
  if (
    codeHash === current.codeHash &&
    rawAbiHash === current.rawAbiHash &&
    schemaHash === current.schemaHash
  )
    return { abi: sources[kind].abi, rowType: current.rowType };
  if (kind === 'ordinary-poll-votes')
    for (const release of [previousPollRelease, pruningPollRelease])
      if (
        codeHash === release.identity.codeHash &&
        rawAbiHash === release.identity.rawAbiHash &&
        schemaHash === release.identity.schemaHash
      )
        return { abi: ABI.from(release.abi), rowType: 'vote_record' };
  if (kind === 'document-versions')
    for (const identity of [previousDocumentRelease.identity, documentPoolsIdentity])
      if (
        codeHash === identity.codeHash &&
        rawAbiHash === identity.rawAbiHash &&
        schemaHash === identity.schemaHash
      )
        return { abi: ABI.from(previousDocumentRelease.abi), rowType: 'document_record' };
  throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
}
export function decodeReleasedArchiveRow(
  value: ArchiveDomain,
  original: ArchiveRow,
  parentId: string,
) {
  const domain = ArchiveDomainSchema.parse(value),
    row = ArchiveRowSchema.parse(original),
    parent = IdSchema.parse(parentId);
  const kind =
    domain.table === 'votes'
      ? 'ordinary-poll-votes'
      : domain.table === 'documents'
        ? 'document-versions'
        : undefined;
  if (!kind) throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  const source = releasedSource(kind, domain.code_hash, domain.abi_hash, domain.schema_hash);
  if (
    kind === 'document-versions'
      ? domain.source !== domain.runtime || domain.scope !== domain.dao_id
      : domain.source === domain.runtime ||
        domain.scope !== Name.from(domain.runtime).value.toString()
  )
    throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  const reader = new ABIDecoder(Bytes.from(row.packed).array);
  const decoded: unknown = JSON.parse(
    JSON.stringify(Serializer.decode({ abi: source.abi, type: source.rowType, data: reader })),
  );
  if (reader.canRead()) throw new RangeError('ARCHIVE_ROW_TRAILING');
  if (kind === 'ordinary-poll-votes') {
    const vote = DecideTableSchemas.votes.parse(decoded);
    if (vote.id !== row.primaryKey || vote.ballot !== parent)
      throw new RangeError('ARCHIVE_ROW_DOMAIN');
    if (
      Serializer.encode({ abi: source.abi, type: source.rowType, object: vote }).hexString !==
      row.packed
    )
      throw new RangeError('ARCHIVE_ROW_CANONICAL');
    return { kind, value: vote, original: row } as const;
  }
  const document = RuntimeTableSchemas.documents.parse(decoded);
  if (document.id !== row.primaryKey || document.document_id !== parent)
    throw new RangeError('ARCHIVE_ROW_DOMAIN');
  if (
    Serializer.encode({ abi: source.abi, type: source.rowType, object: document }).hexString !==
    row.packed
  )
    throw new RangeError('ARCHIVE_ROW_CANONICAL');
  return { kind, value: document, original: row } as const;
}
// Standalone verification uses no server database or decryption keys; original files are separate.
export function verifyArchiveBundle(value: unknown, expectedManifestCommitment: string) {
  const bundle = ArchiveBundleSchema.parse(value),
    expected = ChainIdSchema.parse(expectedManifestCommitment),
    decode = (content: string) => Uint8Array.from(atob(content), (c) => c.charCodeAt(0)),
    bytes = decode(bundle.manifestFile.content),
    manifest = decodeArchiveManifest(bytes, expected);
  if (bundle.manifestFile.commitment !== expected)
    throw new RangeError('ARCHIVE_MANIFEST_COMMITMENT');
  if (
    bytes.length !== bundle.manifestFile.bytes ||
    JSON.stringify(manifest) !== JSON.stringify(bundle.manifest)
  )
    throw new RangeError('ARCHIVE_BUNDLE_METADATA');
  for (const family of manifest.families) {
    if (family.kind === 'protected-export') throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
    releasedSource(
      family.kind,
      manifest.source.codeHash,
      manifest.source.abiHash,
      family.schemaHash,
    );
    if (
      family.table !== sources[family.kind].table ||
      (family.kind === 'document-versions'
        ? manifest.source.account !== manifest.dao.contract || family.scope !== manifest.dao.daoId
        : manifest.source.account === manifest.dao.contract ||
          family.scope !== Name.from(manifest.dao.contract).value.toString())
    )
      throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  }
  const decodedLength = (content: string) =>
    (content.length / 4) * 3 - (content.endsWith('==') ? 2 : content.endsWith('=') ? 1 : 0);
  if (bundle.chunks.reduce((n, c) => n + decodedLength(c.content), bytes.length) > 64 * 1024 * 1024)
    throw new RangeError('ARCHIVE_RESTORE_LIMIT');
  const rows = verifyArchiveChunks(
    manifest,
    bundle.chunks.map((c) => ({ cid: c.cid, bytes: decode(c.content) })),
  );
  for (const row of rows) {
    const family = manifest.families[row.family],
      chunk = family?.chunks.find(
        (c) =>
          BigInt(row.primaryKey) >= BigInt(c.firstKey) &&
          BigInt(row.primaryKey) <= BigInt(c.lastKey),
      );
    if (!family || !chunk) throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
    decodeReleasedArchiveRow(
      chunk.domain,
      { primaryKey: row.primaryKey, packed: row.packed },
      family.parentId,
    );
  }
  return bundle;
}
