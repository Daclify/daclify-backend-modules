import { expect, it } from 'vitest';
import { Name } from '@wharfkit/antelope';
import {
  planOrdinaryPollArchive,
  archiveSourceSchema,
  decodeReleasedArchiveRow,
} from '../archive/index.js';
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
