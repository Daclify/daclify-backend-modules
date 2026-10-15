import { expect, it } from 'vitest';
import { ABI, Checksum256, Serializer } from '@wharfkit/antelope';
import { CID } from 'multiformats/cid';
import { create } from 'multiformats/hashes/digest';
import {
  archiveSourceSchema,
  planQuickBallotArchive,
  archiveManifestForPlan,
  encodeArchiveChunk,
  encodeArchiveManifest,
  verifyArchiveBundle,
  decodeReleasedArchiveRow,
  archiveAttestation,
  quickArchivePruneBatch,
} from '../archive/index.js';
import { quickvoteAbi } from '../sdk/generated/quickvote.js';
import { snapshotFixture } from './helpers/quick-ballot.js';

function input() {
  const fixture = snapshotFixture(),
    schema = archiveSourceSchema('quick-ballot-responses');
  return {
    dao: {
      chainId: fixture.domain.chainId,
      contract: fixture.domain.runtime,
      daoId: fixture.ballot.dao_id,
      interfaceVersion: 1,
    },
    source: {
      account: fixture.domain.source,
      codeHash: schema.codeHash,
      abiHash: schema.rawAbiHash,
    },
    snapshot: {
      blockNumber: 1,
      blockId: '00000001' + 'ab'.repeat(28),
      timestamp: new Date((fixture.ballot.closed_at + 30 * 86400) * 1000).toISOString(),
    },
    sourceUpdatedAt: new Date(0).toISOString(),
    kind: 'quick-ballot-responses',
    ballot: fixture.ballot,
    rows: fixture.responses.map((row) => ({
      primaryKey: row.id,
      packed: Serializer.encode({
        abi: ABI.from(quickvoteAbi),
        type: 'quick_response',
        object: row,
      }).hexString,
    })),
  };
}
it('exports exact encrypted rows without a tally at the thirty-day boundary', () => {
  const value = input(),
    plan = planQuickBallotArchive(value);
  expect(plan.blocked).toEqual([]);
  expect(plan.families[0]?.kind).toBe('quick-ballot-responses');
  const chunks = plan.families
    .flatMap((family) => family.chunks)
    .map((chunk) => {
      const bytes = encodeArchiveChunk(chunk.domain, chunk.rows),
        digest = Checksum256.hash(bytes);
      return {
        bytes,
        commitment: digest.toString(),
        cid: CID.createV1(0x55, create(0x12, digest.array)).toString(),
      };
    });
  const manifest = archiveManifestForPlan(
    plan,
    chunks.map((chunk) => ({
      cid: chunk.cid,
      bytes: chunk.bytes.length,
      commitment: chunk.commitment,
    })),
  );
  const body = encodeArchiveManifest(manifest),
    commitment = Checksum256.hash(body).toString();
  const bundle = {
    id: '00000000-0000-4000-8000-000000000001',
    manifest,
    manifestFile: {
      cid: CID.createV1(0x55, create(0x12, Checksum256.hash(body).array)).toString(),
      bytes: body.length,
      commitment,
      content: Buffer.from(body).toString('base64'),
    },
    chunks: chunks.map((chunk) => ({
      cid: chunk.cid,
      content: Buffer.from(chunk.bytes).toString('base64'),
    })),
  };
  expect(verifyArchiveBundle(bundle, commitment)).toEqual(bundle);
  const attestation = archiveAttestation(
    bundle,
    {
      formatVersion: 1,
      storeId: 'owned-fixture',
      keyId: 'owned-fixture',
      commitment: '55'.repeat(32),
      manifestCommitment: commitment,
      bytes: '4096',
      verifiedAt: value.snapshot.timestamp,
    },
    90 * 86400,
  );
  const anchor = {
    ...attestation,
    id: '1',
    descriptor_commitment: manifest.descriptorCommitment,
    verifier: 'gateway',
    attestation_transaction: '44'.repeat(32),
    approval_transaction: '00'.repeat(32),
    attested_at: 30 * 86400,
    approved_by: '0',
    approved_at: 0,
    revoked: false,
  };
  const batch = quickArchivePruneBatch(bundle, anchor, { chunkOrdinal: 0, start: 0 });
  expect(batch).toMatchObject({
    action: 'prune',
    data: { ballot_id: '9', start: 0, archive_id: '1' },
  });
  expect(batch?.action === 'prune' ? batch.data.proofs.length : 0).toBe(3);
  expect(quickArchivePruneBatch(bundle, anchor, { chunkOrdinal: 0, start: 3 })).toBeNull();
  expect(() =>
    quickArchivePruneBatch(bundle, { ...anchor, revoked: true }, { chunkOrdinal: 0, start: 0 }),
  ).toThrow('ARCHIVE_APPROVAL');
  expect(JSON.stringify(bundle)).not.toContain('secret');
  const family = plan.families[0],
    chunk = family?.chunks[0],
    row = chunk?.rows[0];
  if (!row || !chunk) throw Error('FIXTURE_ARCHIVE');
  expect(decodeReleasedArchiveRow(chunk.domain, row, value.ballot.id).kind).toBe(
    'quick-ballot-responses',
  );
  expect(() => decodeReleasedArchiveRow(chunk.domain, row, '10')).toThrow('ARCHIVE_ROW_DOMAIN');
});

it('blocks early/open exports and fails closed on omitted or noncanonical source rows', () => {
  const value = input();
  expect(
    planQuickBallotArchive({
      ...value,
      snapshot: {
        ...value.snapshot,
        timestamp: new Date(Date.parse(value.snapshot.timestamp) - 1000).toISOString(),
      },
    }).blocked[0]?.reason,
  ).toBe('retention');
  expect(
    planQuickBallotArchive({ ...value, ballot: { ...value.ballot, closed_at: 0, prepared: false } })
      .blocked[0]?.reason,
  ).toBe('ballot-active');
  expect(() => planQuickBallotArchive({ ...value, rows: value.rows.slice(1) })).toThrow(
    'QUICK_SNAPSHOT',
  );
  const first = value.rows[0];
  if (!first) throw Error('FIXTURE_ARCHIVE');
  expect(() =>
    planQuickBallotArchive({
      ...value,
      rows: [{ ...first, packed: first.packed + '00' }, ...value.rows.slice(1)],
    }),
  ).toThrow('ARCHIVE_ROW_TRAILING');
});
