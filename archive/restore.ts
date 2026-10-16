import { previousContactArchiveReleases } from './releases/trusted-contact-previous.js';
import { contentPrivacyArchiveReleases } from './releases/content-privacy-previous.js';
import type { z } from 'zod';
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
import { quickvoteAbi, quickvoteAbiHash } from '../sdk/generated/quickvote.js';
import { QuickvoteTableSchemas } from '../sdk/generated/quickvote-schemas.js';
import { QuickBallotResponseSchema } from '../protocol/quick-ballots.js';
import { ModuleCodeHashes } from '../sdk/generated/releases.js';
import {
  ArchiveDomainSchema,
  ArchiveRowSchema,
  type ArchiveDomain,
  type ArchiveRow,
  ArchiveBundleSchema,
  ArchiveFileReferenceSchema,
} from '../protocol/archive.js';
import { decodeArchiveManifest, verifyArchiveChunks } from './manifest.js';
import { previousPollRelease } from './releases/ordinary-polls-observer.js';
import { pruningPollRelease } from './releases/ordinary-polls-pruning.js';
import { previousDocumentRelease } from './releases/document-versions-before-pools.js';
import {
  qualifiedResourceCheckpoint,
  documentReferencesIdentity,
  documentReferencePollIdentity,
  documentAllocationIdentity,
  documentPreallocatedIdentity,
  preallocatedPollIdentity,
  receiptHoldDocumentIdentity,
  receiptHoldPollIdentity,
  completedHoldDocumentIdentity,
  completedHoldPollIdentity,
  migrationKernelDocumentIdentity,
  migrationKernelPollIdentity,
  migrationControllerDocumentIdentity,
  migrationControllerPollIdentity,
  quotaDocumentIdentity,
  quotaPollIdentity,
  acceptedWorkDocumentIdentity,
  completionDocumentIdentity,
  grantsQualifiedDocumentIdentity,
  completionPollIdentity,
} from './releases/qualified-resource-checkpoint.js';
import { documentPoolsIdentity } from './releases/document-versions-pools.js';
import {
  precedingPollIdentity,
  precedingDocumentIdentity,
} from './releases/governing-documents-previous.js';
const sources = {
  'quick-ballot-responses': {
    abi: ABI.from(quickvoteAbi),
    canonicalAbiHash: quickvoteAbiHash,
    codeHash: ModuleCodeHashes['quick-ballots'],
    table: 'qresponses',
  },
  'quick-ballot-grants': {
    abi: ABI.from(quickvoteAbi),
    canonicalAbiHash: quickvoteAbiHash,
    codeHash: ModuleCodeHashes['quick-ballots'],
    table: 'qgrants',
  },
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
export function archiveSourceSchema(
  kind: keyof typeof sources,
  identity?: { codeHash: string; abiHash: string },
) {
  const source = sources[kind],
    rowType = source.abi.tables.find((table) => table.name.toString() === source.table)?.type;
  if (!rowType) throw new Error('ARCHIVE_RELEASE_SCHEMA_MISSING');
  const current = {
    table: source.table,
    codeHash: source.codeHash,
    rawAbiHash: Checksum256.hash(Serializer.encode({ object: source.abi }).array).toString(),
    schemaHash: Checksum256.hash(
      new TextEncoder().encode(
        kind === 'quick-ballot-responses'
          ? 'daclify.quick-ballot.responses.row.v1'
          : kind === 'quick-ballot-grants'
            ? 'daclify.quick-ballot.grants.row.v1'
            : JSON.stringify({
                formatVersion: 1,
                canonicalAbiHash: source.canonicalAbiHash,
                table: source.table,
                rowType,
              }),
      ),
    ).toString(),
    rowType,
  };
  if (
    !identity ||
    (identity.codeHash === current.codeHash && identity.abiHash === current.rawAbiHash)
  )
    return current;
  const previous = previousContactArchiveReleases[kind].identity;
  if (identity.codeHash === previous.codeHash && identity.abiHash === previous.rawAbiHash)
    return { table: source.table, ...previous };
  const historical = contentPrivacyArchiveReleases[kind].find(
    (release) => release.codeHash === identity.codeHash && release.rawAbiHash === identity.abiHash,
  );
  if (historical) return { table: source.table, ...historical };
  throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
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
  const previous = previousContactArchiveReleases[kind];
  for (const release of contentPrivacyArchiveReleases[kind])
    if (codeHash === release.codeHash && rawAbiHash === release.rawAbiHash && schemaHash === release.schemaHash)
      return { abi: ABI.from(previous.abi), rowType: release.rowType };
  if (
    codeHash === previous.identity.codeHash &&
    rawAbiHash === previous.identity.rawAbiHash &&
    schemaHash === previous.identity.schemaHash
  )
    return { abi: ABI.from(previous.abi), rowType: previous.identity.rowType };
  if (kind === 'ordinary-poll-votes')
    for (const release of [
      previousPollRelease,
      pruningPollRelease,
      { identity: qualifiedResourceCheckpoint.poll, abi: pruningPollRelease.abi },
      { identity: documentReferencePollIdentity, abi: pruningPollRelease.abi },
      { identity: preallocatedPollIdentity, abi: pruningPollRelease.abi },
      { identity: receiptHoldPollIdentity, abi: pruningPollRelease.abi },
      { identity: completedHoldPollIdentity, abi: pruningPollRelease.abi },
      { identity: migrationKernelPollIdentity, abi: pruningPollRelease.abi },
      { identity: migrationControllerPollIdentity, abi: pruningPollRelease.abi },
      { identity: quotaPollIdentity, abi: pruningPollRelease.abi },
      { identity: completionPollIdentity, abi: pruningPollRelease.abi },
      { identity: precedingPollIdentity, abi: pruningPollRelease.abi },
    ])
      if (
        codeHash === release.identity.codeHash &&
        rawAbiHash === release.identity.rawAbiHash &&
        schemaHash === release.identity.schemaHash
      )
        return { abi: ABI.from(release.abi), rowType: 'vote_record' };
  if (kind === 'document-versions')
    for (const identity of [
      previousDocumentRelease.identity,
      documentPoolsIdentity,
      qualifiedResourceCheckpoint.document,
      documentReferencesIdentity,
      documentAllocationIdentity,
      documentPreallocatedIdentity,
      receiptHoldDocumentIdentity,
      completedHoldDocumentIdentity,
      migrationKernelDocumentIdentity,
      migrationControllerDocumentIdentity,
      quotaDocumentIdentity,
      acceptedWorkDocumentIdentity,
      completionDocumentIdentity,
      grantsQualifiedDocumentIdentity,
      precedingDocumentIdentity,
    ])
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
        : domain.table === 'qresponses'
          ? 'quick-ballot-responses'
          : domain.table === 'qgrants'
            ? 'quick-ballot-grants'
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
  if (kind === 'quick-ballot-responses' || kind === 'quick-ballot-grants') {
    const value =
      kind === 'quick-ballot-responses'
        ? QuickBallotResponseSchema.parse(decoded)
        : QuickvoteTableSchemas.qgrants.parse(decoded);
    if (
      value.id !== row.primaryKey ||
      value.dao_id !== domain.dao_id ||
      ('ballot_id' in value ? value.ballot_id !== parent : value.id !== parent)
    )
      throw new RangeError('ARCHIVE_ROW_DOMAIN');
    if (
      Serializer.encode({ abi: source.abi, type: source.rowType, object: value }).hexString !==
      row.packed
    )
      throw new RangeError('ARCHIVE_ROW_CANONICAL');
    if (
      'grants' in value &&
      (value.grants.length < 1 ||
        value.grants.length > 8 ||
        value.grants.some((grant) => grant.length === 0 || grant.length > 1536))
    )
      throw new RangeError('ARCHIVE_ROW_DOMAIN');
    return { kind, value, original: row } as const;
  }
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
  const expectedFiles: z.infer<typeof ArchiveFileReferenceSchema>[] = [];
  for (const row of rows) {
    const family = manifest.families[row.family],
      chunk = family?.chunks.find(
        (c) =>
          BigInt(row.primaryKey) >= BigInt(c.firstKey) &&
          BigInt(row.primaryKey) <= BigInt(c.lastKey),
      );
    if (!family || !chunk) throw new RangeError('ARCHIVE_CONTENTS_INCOMPLETE');
    const decoded = decodeReleasedArchiveRow(
      chunk.domain,
      { primaryKey: row.primaryKey, packed: row.packed },
      family.parentId,
    );
    if (decoded.kind === 'document-versions' && decoded.value.cid) {
      const d = decoded.value;
      expectedFiles.push(
        ArchiveFileReferenceSchema.parse({
          document_id: d.document_id,
          version: d.version,
          cid: d.cid,
          bytes: String(d.bytes),
          commitment: d.commitment,
          envelope_version: d.envelope_version,
          key_epoch: d.key_epoch,
        }),
      );
    }
  }
  expectedFiles.sort((a, b) =>
    BigInt(a.document_id) < BigInt(b.document_id)
      ? -1
      : BigInt(a.document_id) > BigInt(b.document_id)
        ? 1
        : a.version - b.version,
  );
  if (JSON.stringify(expectedFiles) !== JSON.stringify(manifest.files))
    throw new RangeError('ARCHIVE_FILE_COVERAGE');
  return bundle;
}
