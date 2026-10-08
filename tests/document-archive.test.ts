import { expect, it } from 'vitest';
import { ABI, Checksum256, Serializer } from '@wharfkit/antelope';
import { RuntimeTableSchemas, runtimeAbi } from '@daclify/core-protocol/sdk';
import { archiveSourceSchema } from '../archive/restore.js';
import { planDocumentArchive } from '../archive/document-planner.js';
import { archiveAttestation } from '../archive/attestation.js';
import { archiveExportConsent, archiveManifestForPlan } from '../archive/export.js';
const dao = {
  chainId: 'ab'.repeat(32),
  contract: 'daclifycore',
  daoId: '1',
  interfaceVersion: 1 as const,
};
function fixture() {
  const source = archiveSourceSchema('document-versions'),
    original = RuntimeTableSchemas.documents.parse({
      id: '1',
      document_id: '9',
      version: 1,
      author: '1',
      cid: '',
      metadata: '{}',
      commitment: Checksum256.hash(new TextEncoder().encode('{}')).toString(),
      bytes: 2,
      envelope_version: 0,
      key_epoch: '0',
    });
  const packed = Serializer.encode({
    abi: ABI.from(runtimeAbi),
    type: 'document_record',
    object: original,
  }).array;
  return {
    dao,
    source: { account: dao.contract, codeHash: source.codeHash, abiHash: source.rawAbiHash },
    snapshot: {
      blockNumber: 100,
      blockId: '00000064' + 'ab'.repeat(28),
      timestamp: '2026-10-08T00:00:00Z',
    },
    sourceUpdatedAt: '2026-01-01T00:00:00Z',
    retentionSeconds: 7776000,
    coverageComplete: true,
    documents: [original],
    heads: [{ document_id: '9', version: 2, author: '1' }],
    clocks: [
      {
        id: '1',
        document_id: '9',
        version: 1,
        created_at: 1,
        legacy: false,
        row_hash: Checksum256.hash(packed).toString(),
      },
    ],
    references: [],
  };
}
it('archives only mature unreferenced old rows and excludes latest, untracked and foreign data', () => {
  const input = fixture(),
    plan = planDocumentArchive(input);
  expect(plan.families[0]).toMatchObject({ kind: 'document-versions', parentId: '9' });
  expect(plan.blocked).toEqual([]);
  expect(archiveExportConsent(plan).maximumStoredBytes).toMatch(/^[1-9][0-9]*$/);
  expect(planDocumentArchive({ ...input, coverageComplete: false }).blocked[0]?.reason).toBe(
    'reference-backfill-required',
  );
  expect(
    planDocumentArchive({ ...input, heads: [{ document_id: '9', version: 1, author: '1' }] })
      .blocked[0]?.reason,
  ).toBe('latest-version');
  expect(
    planDocumentArchive({ ...input, references: [{ document_id: '9', version: 1 }] }).blocked[0]
      ?.reason,
  ).toBe('referenced-version');
  expect(() =>
    planDocumentArchive({ ...input, clocks: [{ ...input.clocks[0], row_hash: 'cd'.repeat(32) }] }),
  ).toThrow('ARCHIVE_DOCUMENT_CHANGED');
  expect(() =>
    planDocumentArchive({ ...input, source: { ...input.source, account: 'foreign' } }),
  ).toThrow('ARCHIVE_SCHEMA_UNSUPPORTED');
});
it('keeps private file references in the manifest without publishing plaintext labels', () => {
  const input = fixture(),
    original = {
      ...input.documents[0],
      cid: 'bafkreiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      bytes: 100,
      metadata: '{}',
      envelope_version: 1,
      key_epoch: '3',
    },
    packed = Serializer.encode({
      abi: ABI.from(runtimeAbi),
      type: 'document_record',
      object: original,
    }).array;
  const plan = planDocumentArchive({
    ...input,
    documents: [original],
    clocks: [{ ...input.clocks[0], row_hash: Checksum256.hash(packed).toString() }],
  });
  const chunk = plan.families[0]?.chunks[0];
  if (!chunk) throw new Error('Fixture chunk');
  const bytes = encodeArchiveChunk(chunk.domain, chunk.rows);
  const manifest = archiveManifestForPlan(plan, [
    { cid: original.cid, bytes: bytes.length, commitment: Checksum256.hash(bytes).toString() },
  ]);
  const encoded = encodeArchiveManifest(manifest),
    bundle = {
      id: '00000000-0000-4000-8000-000000000001',
      manifest,
      manifestFile: {
        cid: original.cid,
        bytes: encoded.length,
        commitment: Checksum256.hash(encoded).toString(),
        content: Buffer.from(encoded).toString('base64'),
      },
      chunks: [{ cid: original.cid, content: Buffer.from(bytes).toString('base64') }],
    };
  expect(verifyArchiveBundle(bundle, bundle.manifestFile.commitment)).toEqual(bundle);
  const receipt = {
    formatVersion: 1,
    storeId: 'fixture-store',
    keyId: 'fixture-key',
    commitment: 'cd'.repeat(32),
    manifestCommitment: bundle.manifestFile.commitment,
    bytes: '4096',
    verifiedAt: '2026-10-08T12:00:00Z',
  };
  expect(archiveAttestation(bundle, receipt, 7776000).manifest.source).toBe(input.dao.contract);

  const { descriptorCommitment: _descriptor, ...body } = manifest,
    damaged = createArchiveManifest({ ...body, files: [] }),
    damagedBytes = encodeArchiveManifest(damaged),
    damagedHash = Checksum256.hash(damagedBytes).toString();
  expect(() =>
    verifyArchiveBundle(
      {
        ...bundle,
        manifest: damaged,
        manifestFile: {
          ...bundle.manifestFile,
          bytes: damagedBytes.length,
          commitment: damagedHash,
          content: Buffer.from(damagedBytes).toString('base64'),
        },
      },
      damagedHash,
    ),
  ).toThrow('ARCHIVE_FILE_COVERAGE');
  expect(manifest.files).toEqual([
    expect.objectContaining({
      document_id: '9',
      version: 1,
      cid: original.cid,
      envelope_version: 1,
      key_epoch: '3',
      bytes: '100',
    }),
  ]);
});
import { verifyArchiveBundle } from '../archive/restore.js';
import { encodeArchiveManifest, createArchiveManifest } from '../archive/manifest.js';
import { encodeArchiveChunk } from '../archive/format.js';
