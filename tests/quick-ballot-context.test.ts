import { expect, it } from 'vitest';
import { ABI, Checksum256, Name, Serializer, UInt32, UInt64 } from '@wharfkit/antelope';
import { quickvoteAbi } from '../sdk/generated/quickvote.js';
import {
  quickBallotDefinitionHash,
  quickKeyContext,
  quickResponseContext,
  quickTallyContext,
} from '../sdk/quick-ballots.js';

const input = {
  chainId: '11'.repeat(32),
  runtime: 'daclifycore1',
  source: 'quickvote',
  ballotId: '123',
  daoId: '7',
  creatorId: '1',
  definition: {
    protocol: 1,
    question: 'A question?',
    explanation: '',
    all_accounts: true,
    audience: [],
    closes: 0,
    readers: [{ member_id: '1', encryption_key: 'public-reader-key' }],
  },
};
function joined(parts: Uint8Array[]) {
  const bytes = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return Checksum256.hash(bytes).toString();
}
it('binds the definition to the exact source, creator, question and fixed reader keys', () => {
  const expected = joined([
    Serializer.encode({ object: 'daclify.quick-ballot.definition.v1', type: 'string' }).array,
    Checksum256.from(input.chainId).array,
    ...[input.runtime, input.source].map(
      (value) => Serializer.encode({ object: Name.from(value) }).array,
    ),
    ...[input.ballotId, input.daoId, input.creatorId].map(
      (value) => Serializer.encode({ object: UInt64.from(value) }).array,
    ),
    Serializer.encode({
      abi: ABI.from(quickvoteAbi),
      type: 'quick_definition',
      object: input.definition,
    }).array,
  ]);
  expect(quickBallotDefinitionHash(input)).toBe(expected);
  for (const change of [
    { source: 'othermod' },
    { daoId: '8' },
    { creatorId: '2' },
    { definition: { ...input.definition, question: 'A different question?' } },
    {
      definition: {
        ...input.definition,
        readers: [{ member_id: '1', encryption_key: 'another-key' }],
      },
    },
  ])
    expect(quickBallotDefinitionHash({ ...input, ...change })).not.toBe(expected);
});
it('binds private questions to the originating DAO and exact ballot without changing the proof domains', () => {
  const reference = { documentId: input.ballotId, version: 1, commitment: 'ab'.repeat(32), keyEpoch: '1' };
  const privateInput = { ...input, definition: { ...input.definition, protocol: 2, all_accounts: false, audience: [input.daoId], question: JSON.stringify(reference) } };
  const hash = quickBallotDefinitionHash(privateInput);
  expect(hash).toMatch(/^[0-9a-f]{64}$/);
  for (const change of [
    { question: JSON.stringify({ ...reference, version: 2 }) },
    { question: JSON.stringify({ ...reference, commitment: 'cd'.repeat(32) }) },
    { question: JSON.stringify({ ...reference, keyEpoch: '2' }) },
    { readers: [{ member_id: '2', encryption_key: 'different-executive-key' }] },
  ]) expect(quickBallotDefinitionHash({ ...privateInput, definition: { ...privateInput.definition, ...change } })).not.toBe(hash);
  for (const change of [
    { question: 'Plaintext must not be accepted' },
    { explanation: 'Private explanation must not leak here' },
    { question: JSON.stringify({ ...reference, documentId: '999' }) },
    { all_accounts: true, audience: [] },
    { audience: ['8'] },
    { audience: ['7', '8'] },
  ]) expect(() => quickBallotDefinitionHash({ ...privateInput, definition: { ...privateInput.definition, ...change } })).toThrow();
  expect(quickBallotDefinitionHash({ ...input, definition: { ...input.definition, protocol: 3 } })).not.toBe(quickBallotDefinitionHash(input));
});
it('separates key, per-account revision and frozen tally contexts', () => {
  const definitionHash = quickBallotDefinitionHash(input),
    base = {
      chainId: input.chainId,
      runtime: input.runtime,
      ballotId: input.ballotId,
      definitionHash,
    };
  const independent = joined([
    new TextEncoder().encode('daclify.quick-ballot.context.key.v1\0'),
    Checksum256.from(input.chainId).array,
    Serializer.encode({ object: Name.from(input.runtime) }).array,
    Serializer.encode({ object: UInt64.from(input.ballotId) }).array,
    Checksum256.from(definitionHash).array,
    Serializer.encode({ object: UInt32.from(1) }).array,
  ]);
  expect(quickKeyContext(base)).toBe(independent);
  const response = { ...base, identity: '22'.repeat(32), revision: '1' };
  expect(quickResponseContext(response)).not.toBe(independent);
  expect(quickResponseContext({ ...response, revision: '2' })).not.toBe(
    quickResponseContext(response),
  );
  expect(quickResponseContext({ ...response, identity: '33'.repeat(32) })).not.toBe(
    quickResponseContext(response),
  );
  const tally = { ...base, root: '44'.repeat(32), count: '2', aggregate: '00'.repeat(192) };
  expect(quickTallyContext(tally)).not.toBe(independent);
  expect(quickTallyContext({ ...tally, count: '3' })).not.toBe(quickTallyContext(tally));
  expect(quickTallyContext({ ...tally, root: '55'.repeat(32) })).not.toBe(quickTallyContext(tally));
});
