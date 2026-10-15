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

function input(fixture = snapshotFixture()) {
  const schema = archiveSourceSchema('quick-ballot-responses');
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

function archiveFixture(value = input()) {
  const plan = planQuickBallotArchive(value),
    chunks = plan.families
      .flatMap((f) => f.chunks)
      .map((chunk) => {
        const bytes = encodeArchiveChunk(chunk.domain, chunk.rows),
          digest = Checksum256.hash(bytes);
        return {
          bytes,
          cid: CID.createV1(0x55, create(0x12, digest.array)).toString(),
          commitment: digest.toString(),
        };
      });
  const manifest = archiveManifestForPlan(
      plan,
      chunks.map((chunk) => ({
        cid: chunk.cid,
        bytes: chunk.bytes.length,
        commitment: chunk.commitment,
      })),
    ),
    body = encodeArchiveManifest(manifest),
    commitment = Checksum256.hash(body).toString();
  const bundle = {
    id: '00000000-0000-4000-8000-000000000002',
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
  const anchor = {
    ...archiveAttestation(
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
    ),
    id: '2',
    descriptor_commitment: manifest.descriptorCommitment,
    verifier: 'gateway',
    attestation_transaction: '44'.repeat(32),
    approval_transaction: '00'.repeat(32),
    attested_at: 30 * 86400,
    approved_by: '0',
    approved_at: 0,
    revoked: false,
  };
  return { value, plan, bundle, anchor };
}
it('recovers complete encrypted history after pruning and merges identical surviving live rows once', async () => {
  const { recoverQuickBallotHistory } = await import('../archive/quick-ballots.js');
  const f = archiveFixture(),
    domain = f.plan.families[0]?.chunks[0]?.domain;
  if (!domain) throw Error('FIXTURE_ARCHIVE');
  const live = f.value.rows
    .map((row) => decodeReleasedArchiveRow(domain, row, f.value.ballot.id))
    .map((row) => row.value);
  const value = {
    chainId: f.value.dao.chainId,
    runtime: f.value.dao.contract,
    source: f.value.source.account,
    ballot: { ...f.value.ballot, pruned: true },
    responses: live.slice(0, 1),
    grants: null,
    archives: [{ anchor: f.anchor, bundle: f.bundle }],
  };
  const restored = recoverQuickBallotHistory(value);
  expect(restored.snapshot.responses).toHaveLength(3);
  expect(restored.snapshot.result).toBeNull();
  expect(() =>
    recoverQuickBallotHistory({
      ...value,
      ballot: { ...value.ballot, response_root: 'ff'.repeat(32) },
    }),
  ).toThrow('QUICK_SNAPSHOT');
  expect(() => recoverQuickBallotHistory({ ...value, source: 'otherballot' })).toThrow(
    'ARCHIVE_DOMAIN',
  );
  const first = restored.snapshot.responses[0];
  if (!first) throw Error('FIXTURE_ROW');
  expect(() =>
    recoverQuickBallotHistory({ ...value, responses: [{ ...first, revision: '99' }] }),
  ).toThrow('ARCHIVE_HISTORY_CONFLICT');
});
it('publishes a bounded public archive route without requiring membership to read ciphertext', async () => {
  const { QuickBallotRoutes } = await import('../protocol/quick-ballots.js');
  expect(QuickBallotRoutes.quickArchive.method).toBe('GET');
  expect(QuickBallotRoutes.quickArchive.response.parse({ archives: [], complete: false })).toEqual({
    archives: [],
    complete: false,
  });
});

it('recovers the fixed reader grants and verifies a late result after untallied pruning', async () => {
  const { recoverQuickBallotHistory } = await import('../archive/quick-ballots.js');
  const { quickTallyContext } = await import('../sdk/quick-ballots.js');
  const { proveBallotTally } = await import('../sdk/quick-ballot-proof.js');
  const f = snapshotFixture(),
    value = input(f),
    responses = archiveFixture(value),
    grants = { id: f.ballot.id, dao_id: f.ballot.dao_id, grants: ['ab'.repeat(96)] };
  const saved = archiveFixture({
    ...value,
    kind: 'quick-ballot-grants',
    rows: [
      {
        primaryKey: f.ballot.id,
        packed: Serializer.encode({
          abi: ABI.from(quickvoteAbi),
          type: 'quick_grant',
          object: grants,
        }).hexString,
      },
    ],
  });
  const archives = [
    { anchor: responses.anchor, bundle: responses.bundle },
    {
      anchor: { ...saved.anchor, id: '3' },
      bundle: { ...saved.bundle, id: '00000000-0000-4000-8000-000000000003' },
    },
  ];
  const original = {
    ...f.domain,
    ballot: { ...f.ballot, pruned: true },
    responses: [],
    grants: null,
    archives,
  };
  expect(recoverQuickBallotHistory(original).grants).toEqual(grants);
  const transcript = quickTallyContext({
    chainId: f.domain.chainId,
    runtime: f.domain.runtime,
    ballotId: f.ballot.id,
    definitionHash: f.ballot.definition_hash,
    root: f.ballot.response_root,
    count: '2',
    aggregate: f.ballot.aggregate,
  });
  const proof = proveBallotTally(transcript, f.key.secret, f.ballot.aggregate, 2n, 1n);
  expect(
    recoverQuickBallotHistory({
      ...original,
      ballot: { ...original.ballot, up: 1, final_proof: proof, verified: true },
    }).snapshot.result,
  ).toEqual({ up: 1, down: 1, count: 2 });
});

it('derives the backup bundle ID from its on-chain manifest commitment after SQL metadata loss', async () => {
  const { archiveRecoveryId } = await import('../archive/recovery.js');
  const commitment = 'ab'.repeat(32);
  expect(archiveRecoveryId(commitment)).toBe('abababab-abab-4bab-8bab-abababababab');
  expect(() => archiveRecoveryId('not-a-commitment')).toThrow();
});

it('keeps the previous pinned native archive readable after the recovery release', async () => {
  const { previousContactArchiveReleases } =
    await import('../archive/releases/trusted-contact-previous.js');
  const release = previousContactArchiveReleases['quick-ballot-responses'];
  const snapshot = input();
  snapshot.source.codeHash = release.identity.codeHash;
  snapshot.source.abiHash = release.identity.rawAbiHash;
  expect(planQuickBallotArchive(snapshot).blocked).toEqual([]);
  const archived = archiveFixture(snapshot);
  expect(
    verifyArchiveBundle(archived.bundle, archived.bundle.manifestFile.commitment).manifest.source,
  ).toEqual(snapshot.source);
  snapshot.source.codeHash = 'ff'.repeat(32);
  expect(() => planQuickBallotArchive(snapshot)).toThrow('ARCHIVE_SCHEMA_UNSUPPORTED');
});
