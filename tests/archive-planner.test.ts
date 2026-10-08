import { expect, it } from 'vitest';
import { Name } from '@wharfkit/antelope';
import {
  planOrdinaryPollArchive,
  archiveSourceSchema,
  decodeReleasedArchiveRow,
  archiveExportConsent,
  archiveManifestForPlan,
  encodeArchiveChunk,
  encodeArchiveManifest,
  verifyArchiveChunks,
  verifyArchiveBundle,
} from '../archive/index.js';
import { Checksum256 } from '@wharfkit/antelope';
import { CID } from 'multiformats/cid';
import { create } from 'multiformats/hashes/digest';
const source = archiveSourceSchema('ordinary-poll-votes');
const completed = 1_700_000_000,
  retention = 90 * 86400;
const ballot = {
  id: '7',
  dao_id: '1',
  creator: '1',
  kind: 1,
  choices: 2,
  closes: completed - 100 * 86400,
  quorum: 5000,
  approval: 5001,
  denominator: '100',
  max_member: '3',
  cast: '30',
  tallies: ['10', '20'],
  status: 1,
  winner: 1,
  metadata: '{}',
};
const votes = [
  { id: '2', ballot: '7', member: '1', weight: '10', choice: 0 },
  { id: '9', ballot: '7', member: '2', weight: '20', choice: 1 },
];
const input = () => ({
  dao: { chainId: 'ab'.repeat(32), contract: 'daclifycore', daoId: '1', interfaceVersion: 1 },
  source: { account: 'decide', codeHash: source.codeHash, abiHash: source.rawAbiHash },
  snapshot: {
    blockNumber: 1,
    blockId: '00000001' + 'ab'.repeat(28),
    timestamp: new Date((completed + retention) * 1000).toISOString(),
  },
  sourceUpdatedAt: new Date((completed - 200) * 1000).toISOString(),
  retentionSeconds: retention,
  ballots: [ballot],
  votes,
  terminals: [{ ballot_id: '7', dao_id: '1', completed_at: completed, legacy: false }],
  elections: [],
  executions: [],
  grantplans: [],
});
it('binds export consent to exact source rows while allowing a newer irreversible snapshot', () => {
  const plan = planOrdinaryPollArchive(input()),
    consent = archiveExportConsent(plan);
  const newer = {
    ...plan,
    snapshot: { ...plan.snapshot, blockNumber: 2, blockId: '00000002' + 'cd'.repeat(28) },
  };
  expect(archiveExportConsent(newer).selectionCommitment).toBe(consent.selectionCommitment);
  expect(() => archiveExportConsent({ ...plan, dao: { ...plan.dao, daoId: '2' } })).toThrow();
  const chunks = plan.families.flatMap((f) =>
    f.chunks.map((c) => {
      const bytes = encodeArchiveChunk(c.domain, c.rows);
      const digest = Checksum256.hash(bytes);
      return {
        cid: CID.createV1(0x55, create(0x12, digest.array)).toString(),
        bytes,
        commitment: digest.toString(),
      };
    }),
  );
  const manifest = archiveManifestForPlan(
    plan,
    chunks.map((c) => ({ cid: c.cid, bytes: c.bytes.length, commitment: c.commitment })),
  );
  expect(verifyArchiveChunks(manifest, chunks)).toHaveLength(2);
  const manifestBytes = encodeArchiveManifest(manifest);
  const bundle = {
    id: '00000000-0000-4000-8000-000000000001',
    manifest,
    manifestFile: {
      cid: 'bafkreiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      bytes: manifestBytes.length,
      commitment: Checksum256.hash(manifestBytes).toString(),
      content: Buffer.from(manifestBytes).toString('base64'),
    },
    chunks: chunks.map((c) => ({ cid: c.cid, content: Buffer.from(c.bytes).toString('base64') })),
  };
  expect(verifyArchiveBundle(bundle, bundle.manifestFile.commitment)).toEqual(bundle);
  const actual =
    encodeArchiveManifest(manifest).length + chunks.reduce((n, c) => n + c.bytes.length, 0);
  expect(BigInt(consent.maximumStoredBytes)).toBeGreaterThanOrEqual(BigInt(actual));
  expect(() => archiveManifestForPlan(plan, [])).toThrow('ARCHIVE_CONTENTS_INCOMPLETE');
  expect(() =>
    archiveManifestForPlan(
      plan,
      chunks.map((c) => ({ cid: c.cid, bytes: c.bytes.length, commitment: '00'.repeat(32) })),
    ),
  ).toThrow('ARCHIVE_CONTENT_COMMITMENT');
});
it('exports zero-vote families and rejects blocked or altered plans before storage consent', () => {
  const empty = planOrdinaryPollArchive({
    ...input(),
    ballots: [{ ...ballot, cast: '0', tallies: ['0', '0'] }],
    votes: [],
  });
  expect(archiveManifestForPlan(empty, []).families[0]).toMatchObject({ records: '0', chunks: [] });
  expect(BigInt(archiveExportConsent(empty).maximumStoredBytes)).toBeGreaterThan(0n);
  expect(() =>
    archiveExportConsent(planOrdinaryPollArchive({ ...input(), terminals: [] })),
  ).toThrow('ARCHIVE_NOT_ELIGIBLE');
  const altered = planOrdinaryPollArchive(input());
  const chunk = altered.families[0]?.chunks[0];
  if (!chunk) throw new Error('Missing chunk');
  chunk.root = '00'.repeat(32);
  expect(() => archiveExportConsent(altered)).toThrow('ARCHIVE_CONTENT_COMMITMENT');
});
it('reserves a manifest with distinct CID descriptors across multiple selected polls', () => {
  const value = input();
  value.ballots.push({ ...ballot, id: '8' });
  value.terminals.push({
    ...value.terminals[0],
    ballot_id: '8',
    dao_id: '1',
    completed_at: completed,
    legacy: false,
  });
  value.votes = [
    ...votes,
    ...votes.map((row) => ({ ...row, id: String(BigInt(row.id) + 10n), ballot: '8' })),
  ];
  expect(
    BigInt(archiveExportConsent(planOrdinaryPollArchive(value)).maximumStoredBytes),
  ).toBeGreaterThan(0n);
});
it('uses the actual terminal timestamp and verified tally coverage, preserving canonical rows', () => {
  const plan = planOrdinaryPollArchive(input());
  expect(plan.pruningAuthorized).toBe(false);
  expect(plan.blocked).toEqual([]);
  expect(plan.families).toHaveLength(1);
  const family = plan.families[0];
  if (!family) throw new Error('Missing family');
  expect(family.grossRamBytes).toBe('578');
  const chunk = family.chunks[0];
  if (!chunk) throw new Error('Missing chunk');
  expect(chunk.domain.scope).toBe(Name.from('daclifycore').value.toString());
  expect(chunk.rows.map((row) => decodeReleasedArchiveRow(chunk.domain, row, '7').value)).toEqual(
    votes,
  );
});
it('waits ninety full days and never substitutes closes or retries for finalization time', () => {
  const value = input();
  value.snapshot.timestamp = new Date((completed + retention - 1) * 1000).toISOString();
  expect(planOrdinaryPollArchive(value).blocked).toEqual([{ parentId: '7', reason: 'retention' }]);
  expect(planOrdinaryPollArchive({ ...input(), terminals: [] }).blocked[0]?.reason).toBe(
    'terminal-marker-required',
  );
  expect(
    planOrdinaryPollArchive({
      ...input(),
      terminals: [{ ...input().terminals[0], completed_at: 0 }],
    }).blocked[0]?.reason,
  ).toBe('terminal-marker-required');
  expect(
    planOrdinaryPollArchive({
      ...input(),
      terminals: [{ ...input().terminals[0], completed_at: completed + retention + 1 }],
    }).blocked[0]?.reason,
  ).toBe('terminal-not-irreversible');
  expect(
    planOrdinaryPollArchive({ ...input(), terminals: [{ ...input().terminals[0], legacy: true }] })
      .families,
  ).toHaveLength(1);
  expect(() => planOrdinaryPollArchive({ ...input(), retentionSeconds: retention - 1 })).toThrow();
  expect(() =>
    planOrdinaryPollArchive({ ...input(), ballots: [{ ...ballot, closes: completed + 1 }] }),
  ).toThrow('ARCHIVE_TERMINAL_INVALID');
});
it('excludes active ballots, elections and every executable-work family', () => {
  expect(
    planOrdinaryPollArchive({ ...input(), ballots: [{ ...ballot, status: 0 }] }).blocked[0]?.reason,
  ).toBe('ballot-active');
  for (const field of ['elections', 'executions', 'grantplans']) {
    const record =
      field === 'elections' ? { id: '7', dao_id: '1' } : { ballot_id: '7', dao_id: '1' };
    expect(planOrdinaryPollArchive({ ...input(), [field]: [record] }).blocked[0]?.reason).toBe(
      'protected-family',
    );
  }
});
it('rejects truncated, forged, duplicated or cross-DAO coverage and unsupported source snapshots', () => {
  for (const bad of [
    votes.slice(0, 1),
    [...votes, votes[0]],
    [{ ...votes[0], weight: '11' }, votes[1]],
    [{ ...votes[0], choice: 1 }, votes[1]],
    [{ ...votes[0], ballot: '8' }, votes[1]],
    [{ ...votes[0], member: '2' }, votes[1]],
  ])
    expect(() => planOrdinaryPollArchive({ ...input(), votes: bad })).toThrow();
  expect(() =>
    planOrdinaryPollArchive({ ...input(), ballots: [{ ...ballot, dao_id: '2' }] }),
  ).toThrow();
  expect(() =>
    planOrdinaryPollArchive({
      ...input(),
      source: { ...input().source, codeHash: '00'.repeat(32) },
    }),
  ).toThrow();
  expect(() =>
    planOrdinaryPollArchive({
      ...input(),
      sourceUpdatedAt: new Date((completed + retention + 1) * 1000).toISOString(),
    }),
  ).toThrow();
  expect(() =>
    planOrdinaryPollArchive({ ...input(), snapshot: { ...input().snapshot, blockNumber: 2 } }),
  ).toThrow();
});
