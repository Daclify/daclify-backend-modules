import { expect, it } from 'vitest';
import { BallotMetadataV4Schema } from '../protocol/ballots.js';
import { encodeBallotMetadata, readBallotMetadata } from '../sdk/ballots.js';
import { prepareBallotVote } from '../sdk/ballot-vote.js';
import { ballotCommitment } from '../sdk/ballot-commitment.js';
import { makeBallotExport } from '../sdk/ballot-export.js';
const reference = { documentId: '9', version: 1, keyEpoch: '1', commitment: 'cd'.repeat(32) };
const metadata = {
  schemaVersion: 4 as const,
  semantics: 'poll' as const,
  options: [0, 1, 2],
  privateContent: reference,
};
const dao = {
  chainId: 'ab'.repeat(32),
  contract: 'daclifycore',
  daoId: '1',
  interfaceVersion: 1 as const,
};
const payload = {
  schemaVersion: 1 as const,
  kind: 'ballot-content' as const,
  source: 'decide',
  recordId: '9',
  body: {
    semantics: 'poll' as const,
    title: 'Private title canary',
    description: 'Private explanation canary',
    options: ['Secret A', 'Secret B', 'Secret C'],
  },
};
function frozen() {
  const ballot = {
    id: '9',
    dao_id: '1',
    creator: '1',
    kind: 0,
    choices: 3,
    closes: 1300,
    quorum: 5000,
    approval: 5001,
    denominator: '3',
    max_member: '3',
    cast: '0',
    tallies: ['0', '0', '0'],
    status: 0,
    winner: -1,
    metadata: JSON.stringify(metadata),
  };
  const definition = {
    ballot_id: '9',
    dao_id: '1',
    version: 3,
    purpose: 1,
    policy_revision: '0',
    policy_hash: '00'.repeat(32),
    commitment: '00'.repeat(32),
  };
  definition.commitment = ballotCommitment({
    chainId: dao.chainId,
    runtime: dao.contract,
    decide: 'decide',
    ballot,
    definition,
  });
  return { ballot, definition };
}
it('publishes only ordered technical choices and an exact private reference', () => {
  const encoded = encodeBallotMetadata(metadata);
  expect(JSON.parse(encoded)).toEqual(metadata);
  expect(readBallotMetadata(encoded, 3)).toMatchObject({
    privateContent: reference,
    options: ['Choice 1', 'Choice 2', 'Choice 3'],
  });
  for (const changed of [
    { options: [1, 0, 2] },
    { options: [0, 1, 1] },
    { title: 'accidental disclosure' },
    { privateContent: { ...reference, keyEpoch: '0' } },
  ])
    expect(BallotMetadataV4Schema.safeParse({ ...metadata, ...changed }).success).toBe(false);
  expect(readBallotMetadata(encoded, 2)).toBeUndefined();
});
it('refuses blind voting, copied parent/reference, changed semantics and unfrozen private metadata', () => {
  const { ballot, definition } = frozen();
  const input = {
    dao,
    decide: 'decide',
    memberId: '1',
    choice: 2,
    ballot,
    definitions: [definition],
  };
  expect(() => prepareBallotVote(input)).toThrow('PRIVATE_BALLOT_REVIEW_REQUIRED');
  const privateContent = { reference, payload };
  expect(prepareBallotVote({ ...input, privateContent }).action).toBe('votecommit');
  for (const changed of [
    { reference: { ...reference, version: 2 }, payload },
    { reference, payload: { ...payload, recordId: '10' } },
    { reference, payload: { ...payload, source: 'otherdecide' } },
    {
      reference,
      payload: {
        ...payload,
        body: { ...payload.body, semantics: 'proposal', options: ['Reject', 'Approve'] },
      },
    },
  ])
    expect(() => prepareBallotVote({ ...input, privateContent: changed })).toThrow();
  expect(() => prepareBallotVote({ ...input, definitions: [], privateContent })).toThrow(
    'BALLOT_DEFINITION_REQUIRED',
  );
  const malformed = { ...ballot, metadata: JSON.stringify({ ...metadata, options: [0, 1, 1] }) };
  expect(() =>
    ballotCommitment({
      chainId: dao.chainId,
      runtime: dao.contract,
      decide: 'decide',
      ballot: malformed,
      definition,
    }),
  ).toThrow();
  const legacy = { ...definition, version: 1 };
  legacy.commitment = ballotCommitment({
    chainId: dao.chainId,
    runtime: dao.contract,
    decide: 'decide',
    ballot: malformed,
    definition: legacy,
  });
  expect(() =>
    prepareBallotVote({ ...input, ballot: malformed, definitions: [legacy], privateContent }),
  ).toThrow('BALLOT_OPTIONS');
});
it('exports verifiable ciphertext references and tallies without decrypted private text', () => {
  const { ballot, definition } = frozen();
  const result = makeBallotExport({ dao, decide: 'decide', ballot, definition, votes: [] });
  expect(result.verification).toBe('verified');
  expect(JSON.stringify(result)).not.toContain('Private title canary');
  expect(() =>
    makeBallotExport({
      dao,
      decide: 'decide',
      ballot: {
        ...ballot,
        metadata: JSON.stringify({ ...metadata, privateContent: { ...reference, version: 2 } }),
      },
      definition,
      votes: [],
    }),
  ).toThrow('BALLOT_DEFINITION_CHANGED');
});
