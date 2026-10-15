import { expect, it } from 'vitest';
import {
  quickTallyContext,
  verifyQuickBallotSnapshot,
  verifyQuickBallotResult,
} from '../sdk/quick-ballots.js';
import { proveBallotTally } from '../sdk/quick-ballot-proof.js';
import { snapshotFixture } from './helpers/quick-ballot.js';

it('verifies every canonical current row and the exact frozen source without claiming a result', () => {
  const fixture = snapshotFixture();
  expect(
    verifyQuickBallotSnapshot({
      ...fixture.domain,
      ballot: fixture.ballot,
      responses: fixture.responses,
    }).result,
  ).toBeNull();
  expect(verifyQuickBallotResult({ ...fixture.domain, ballot: fixture.ballot })).toBeNull();
  for (const rows of [
    fixture.responses.slice(0, 2),
    [...fixture.responses].reverse(),
    [fixture.responses[0], fixture.responses[0], fixture.responses[2]],
  ])
    expect(() =>
      verifyQuickBallotSnapshot({ ...fixture.domain, ballot: fixture.ballot, responses: rows }),
    ).toThrow();
  const altered = structuredClone(fixture.responses);
  if (!altered[0]) throw Error('FIXTURE');
  altered[0].proof = '00'.repeat(128);
  expect(() =>
    verifyQuickBallotSnapshot({ ...fixture.domain, ballot: fixture.ballot, responses: altered }),
  ).toThrow('QUICK_RESPONSE_PROOF');
});

it('verifies the public final proof even after individual rows are archived', () => {
  const fixture = snapshotFixture();
  const tallyContext = quickTallyContext({
    chainId: fixture.domain.chainId,
    runtime: fixture.domain.runtime,
    ballotId: fixture.ballot.id,
    definitionHash: fixture.ballot.definition_hash,
    root: fixture.ballot.response_root,
    count: '2',
    aggregate: fixture.ballot.aggregate,
  });
  const ballot = {
    ...fixture.ballot,
    verified: true,
    pruned: true,
    up: 1,
    final_proof: proveBallotTally(
      tallyContext,
      fixture.key.secret,
      fixture.ballot.aggregate,
      2n,
      1n,
    ),
  };
  expect(verifyQuickBallotResult({ ...fixture.domain, ballot })).toEqual({
    up: 1,
    down: 1,
    count: 2,
  });
  expect(() =>
    verifyQuickBallotResult({ ...fixture.domain, ballot: { ...ballot, up: 2 } }),
  ).toThrow('QUICK_TALLY_PROOF');
  expect(() =>
    verifyQuickBallotResult({
      ...fixture.domain,
      ballot: { ...ballot, response_root: '22'.repeat(32) },
    }),
  ).toThrow('QUICK_TALLY_PROOF');
  expect(() => verifyQuickBallotResult({ ...fixture.domain, source: 'othermod', ballot })).toThrow(
    'QUICK_DEFINITION',
  );
});
