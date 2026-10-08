import { expect, it } from 'vitest';
import { Checksum256, ABI, Serializer, Name } from '@wharfkit/antelope';
import { runtimeAbi } from '@daclify/core-protocol/sdk';
import {
  archiveAttestation,
  archiveSourceSchema,
  createArchiveManifest,
  encodeArchiveManifest,
  ArchiveBackupReceiptSchema,
} from '../archive/index.js';
function fixture() {
  const source = archiveSourceSchema('ordinary-poll-votes'),
    manifest = createArchiveManifest({
      schemaVersion: 1,
      dao: { chainId: 'ab'.repeat(32), contract: 'daclifycore', daoId: '1', interfaceVersion: 1 },
      snapshot: {
        blockNumber: 1,
        blockId: '00000001' + 'ab'.repeat(28),
        timestamp: '2026-01-01T00:00:00.000Z',
      },
      source: { account: 'decide', codeHash: source.codeHash, abiHash: source.rawAbiHash },
      families: [
        {
          kind: 'ordinary-poll-votes',
          parentId: '7',
          table: 'votes',
          scope: Name.from('daclifycore').value.toString(),
          schemaHash: source.schemaHash,
          records: '0',
          chunks: [],
        },
      ],
      files: [],
    }),
    bytes = encodeArchiveManifest(manifest),
    commitment = Checksum256.hash(bytes).toString(),
    bundle = {
      id: '00000000-0000-4000-8000-000000000001',
      manifest,
      manifestFile: {
        cid: 'bafkreiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        bytes: bytes.length,
        commitment,
        content: Buffer.from(bytes).toString('base64'),
      },
      chunks: [],
    },
    receipt = ArchiveBackupReceiptSchema.parse({
      formatVersion: 1,
      storeId: 'fixture-store',
      keyId: 'fixture-key',
      commitment: 'cd'.repeat(32),
      manifestCommitment: commitment,
      bytes: '4096',
      verifiedAt: '2026-10-08T12:00:00.000Z',
    });
  return { bundle, receipt };
}
it('maps the exact verified bundle and backup to producer-owned native fields with the independent descriptor commitment', () => {
  const f = fixture(),
    input = archiveAttestation(f.bundle, f.receipt, 90 * 86400);
  expect(input).toMatchObject({
    dao_id: '1',
    manifest_commitment: f.bundle.manifestFile.commitment,
    backup_commitment: f.receipt.commitment,
  });
  expect(
    Checksum256.hash(
      Serializer.encode({
        abi: ABI.from(runtimeAbi),
        type: 'archive_manifest_descriptor',
        object: input.manifest,
      }).array,
    ).toString(),
  ).toBe(f.bundle.manifest.descriptorCommitment);
});
it('refuses a different backup domain and corrupt manifest contents', () => {
  const f = fixture();
  expect(() =>
    archiveAttestation(f.bundle, { ...f.receipt, manifestCommitment: 'ef'.repeat(32) }, 90 * 86400),
  ).toThrow('ARCHIVE_BACKUP_DOMAIN');
  expect(() =>
    archiveAttestation(
      {
        ...f.bundle,
        manifestFile: {
          ...f.bundle.manifestFile,
          content: Buffer.from('corrupt').toString('base64'),
        },
      },
      f.receipt,
      90 * 86400,
    ),
  ).toThrow();
});
