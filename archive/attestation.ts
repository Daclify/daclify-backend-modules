import { ABI, Checksum256, Serializer } from '@wharfkit/antelope';
import { RuntimeActionSchemas, runtimeAbi } from '@daclify/core-protocol/sdk';
import {
  ArchiveBackupReceiptSchema,
  ArchiveBundleSchema,
  ArchivePreviewRequestSchema,
} from '../protocol/archive.js';
import { verifyArchiveBundle } from './restore.js';
export function archiveAttestation(value: unknown, savedBackup: unknown, retentionSeconds: number) {
  const input = ArchiveBundleSchema.parse(value),
    bundle = verifyArchiveBundle(input, input.manifestFile.commitment),
    backup = ArchiveBackupReceiptSchema.parse(savedBackup),
    m = bundle.manifest;
  if (backup.manifestCommitment !== bundle.manifestFile.commitment)
    throw new RangeError('ARCHIVE_BACKUP_DOMAIN');
  const attestation = RuntimeActionSchemas.archattest.parse({
    dao_id: m.dao.daoId,
    retention_seconds: ArchivePreviewRequestSchema.shape.retentionSeconds.parse(retentionSeconds),
    manifest: {
      format_version: m.schemaVersion,
      chain_id: m.dao.chainId,
      runtime: m.dao.contract,
      dao_id: m.dao.daoId,
      source: m.source.account,
      code_hash: m.source.codeHash,
      abi_hash: m.source.abiHash,
      block_number: m.snapshot.blockNumber,
      block_id: m.snapshot.blockId,
      timestamp: m.snapshot.timestamp,
      families: m.families.map((f) => ({
        kind: f.kind,
        parent_id: f.parentId,
        table: f.table,
        scope: f.scope,
        schema_hash: f.schemaHash,
        records: f.records,
        chunks: f.chunks.map((c) => ({
          domain: c.domain,
          root: c.root,
          cid: c.cid,
          bytes: c.bytes,
          commitment: c.commitment,
          first_key: c.firstKey,
          last_key: c.lastKey,
        })),
      })),
      files: m.files,
    },
    manifest_cid: bundle.manifestFile.cid,
    manifest_bytes: bundle.manifestFile.bytes,
    manifest_commitment: bundle.manifestFile.commitment,
    backup_commitment: backup.commitment,
  });
  const bytes = Serializer.encode({
    abi: ABI.from(runtimeAbi),
    type: 'archive_manifest_descriptor',
    object: attestation.manifest,
  }).array;
  if (Checksum256.hash(bytes).toString() !== m.descriptorCommitment)
    throw new RangeError('ARCHIVE_DESCRIPTOR_COMMITMENT');
  if (
    m.families.length !== 1 ||
    m.families[0]?.kind !== 'ordinary-poll-votes' ||
    m.files.length ||
    (m.families[0]?.chunks.length ?? 0) > 32
  )
    throw new RangeError('ARCHIVE_NATIVE_FAMILY_UNSUPPORTED');
  if (
    Serializer.encode({ abi: ABI.from(runtimeAbi), type: 'archattest', object: attestation }).array
      .length > 16384
  )
    throw new RangeError('ARCHIVE_ACTION_SIZE');
  return attestation;
}
