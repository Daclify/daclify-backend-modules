import { beforeEach, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { Name, PrivateKey } from '@wharfkit/antelope';
import { z } from 'zod';
import { DecideTableSchemas } from '../sdk/generated/decide-schemas.js';
import { load, send, row, listFirstParty, replaceContract } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';

let chain: Blockchain, core: ReturnType<typeof load>, decide: ReturnType<typeof load>;
const chainId = 'ab'.repeat(32), zero = '00'.repeat(32);
const metadata = JSON.stringify({ schemaVersion: 3, semantics: 'proposal', title: 'Budget', description: 'Approve the proposal.', options: ['Reject', 'Approve'] });
const markerSchema = z.object({
  ballot_id: z.coerce.string(), dao_id: z.coerce.string(), version: z.literal(1),
  purpose: z.number(), policy_revision: z.coerce.string(), policy_hash: z.string().length(64), commitment: z.string().length(64),
});

beforeEach(async () => {
  chain = new Blockchain();
  chain.setTime(TimePointSec.from(1000));
  chain.createAccounts('alice', 'bob');
  chain.createAccounts('eosio.token');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  await send(core, 'init', [chainId], 'daclifycore@active');
  const hash = wasmCodeHash('.artifacts/contracts/decide.wasm');
  await listFirstParty(core, 'decide', hash);
  for (const dao of [1, 2]) {
    await send(core, 'createdao', [dao, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
    for (const member of [1, 2, 3]) await send(core, 'enroll', [dao, member, '', PrivateKey.generate('K1').toPublic().toString(), 'key', 0], 'alice@active');
    await send(core, 'setmodule', [dao, 'decide', 1, ['open', 'openpoll', 'vote', 'votecommit'], ['govlock'], hash], 'alice@active');
  }
});

const open = (method = 'open', text = metadata) => send(decide, method, ['daclifycore', 1, 1, 1, 0, 2, 300, 5000, 5001, text], 'daclifycore@active');
const marker = () => markerSchema.parse(row(decide, 'ballotdefs', core.toBigInt(), 1n));
const poll = () => DecideTableSchemas.ballots.parse(row(decide, 'ballots', core.toBigInt(), 1n));

// Independent little-endian/varuint encoder; expected hashes do not use the public SDK.
function integer(value: string | number, bytes: number): Buffer {
  let remainder = BigInt(value);
  const result = Buffer.alloc(bytes);
  for (let i = 0; i < bytes; i++) { result[i] = Number(remainder & 255n); remainder >>= 8n; }
  expect(remainder).toBe(0n);
  return result;
}
function textBytes(value: string): Buffer {
  const bytes = Buffer.from(value), length: number[] = [];
  let remaining = bytes.length;
  do { const next = remaining & 127; remaining >>>= 7; length.push(next | (remaining ? 128 : 0)); } while (remaining);
  return Buffer.concat([Buffer.from(length), bytes]);
}
function independentHash(overrides: Partial<ReturnType<typeof poll>> = {}, domain = { chainId, runtime: 'daclifycore', decide: 'decide' }): string {
  const b = { ...poll(), ...overrides }, d = marker();
  const bytes = Buffer.concat([
    integer(1, 2), Buffer.from(domain.chainId, 'hex'), integer(Name.from(domain.runtime).value.toString(), 8), integer(Name.from(domain.decide).value.toString(), 8),
    integer(b.dao_id, 8), integer(b.id, 8), integer(d.purpose, 1), integer(b.creator, 8), integer(b.kind, 1), integer(b.choices, 1), integer(b.closes, 4),
    integer(b.quorum, 2), integer(b.approval, 2), integer(b.denominator, 8), integer(b.max_member, 8), textBytes(b.metadata), integer(d.policy_revision, 8),
    Buffer.from(d.policy_hash, 'hex'), Buffer.from(zero, 'hex'),
  ]);
  return createHash('sha256').update(bytes).digest('hex');
}
const vote = (member: number, choice: number, expected = marker().commitment) => send(decide, 'votecommit', ['daclifycore', 1, member, 1, expected, choice], 'daclifycore@active');

it('writes a canonical domain-bound definition matching independent encoding', async () => {
  await open();
  expect(decide.tables.ballotdefs).toBeDefined();
  expect(marker()).toMatchObject({ ballot_id: '1', dao_id: '1', version: 1, purpose: 0, policy_revision: '0', policy_hash: zero });
  expect(marker().commitment).toBe(independentHash());
  await vote(1, 1);
  expect(poll().tallies).toEqual(['0', '1']);
});

it('rejects the unbound action on every new ballot', async () => {
  await open();
  await expect(send(decide, 'vote', ['daclifycore', 1, 1, 1, 1], 'daclifycore@active')).rejects.toThrow('BALLOT_COMMITMENT_REQUIRED');
  expect(poll().cast).toBe('0');
});

it('rejects altered text, reordered choices and every foreign domain', async () => {
  await open();
  for (const text of [metadata.replace('Budget', 'Changed'), metadata.replace('["Reject","Approve"]', '["Approve","Reject"]')]) {
    await expect(vote(1, 1, independentHash({ metadata: text }))).rejects.toThrow('BALLOT_DEFINITION_CHANGED');
  }
  for (const domain of [
    { chainId: 'cd'.repeat(32), runtime: 'daclifycore', decide: 'decide' },
    { chainId, runtime: 'othercore', decide: 'decide' },
    { chainId, runtime: 'daclifycore', decide: 'otherdecide' },
  ]) await expect(vote(1, 1, independentHash({}, domain))).rejects.toThrow('BALLOT_DEFINITION_CHANGED');
  await expect(vote(1, 1, independentHash({ dao_id: '2' }))).rejects.toThrow('BALLOT_DEFINITION_CHANGED');
  expect(poll().cast).toBe('0');
});

it('keeps the definition fixed across recorded tallies and still rejects duplicate voters', async () => {
  await open();
  const expected = independentHash();
  await vote(1, 1, expected);
  expect(independentHash()).toBe(expected);
  await vote(2, 1, expected);
  await expect(vote(2, 0, expected)).rejects.toThrow('ALREADY_VOTED');
  expect(poll().cast).toBe('2');
});

it('allows option zero to win a neutral two-option poll without approving a binary proposal', async () => {
  await open('openpoll', JSON.stringify({ schemaVersion: 3, semantics: 'poll', title: 'Location', description: 'Choose a meeting venue.', options: ['Garden', 'Hall'] }));
  expect(marker().purpose).toBe(1);
  await vote(1, 0); await vote(2, 0);
  chain.addTime(TimePointSec.from(301));
  await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
  expect(poll()).toMatchObject({ status: 1, winner: 0 });
});

it('preserves truly pre-upgrade ballots and their original vote path', async () => {
  const fixture = '.artifacts/archive-upgrade-old/decide';
  replaceContract(decide, fixture);
  const oldHash = wasmCodeHash(fixture + '.wasm');
  await listFirstParty(core, 'decide', oldHash);
  await send(core, 'setmodule', [1, 'decide', 1, ['open', 'vote'], ['govlock'], oldHash], 'alice@active');
  await open();
  replaceContract(decide, '.artifacts/contracts/decide');
  const hash = wasmCodeHash('.artifacts/contracts/decide.wasm');
  await listFirstParty(core, 'decide', hash);
  await send(core, 'setmodule', [1, 'decide', 1, ['open', 'vote', 'votecommit'], ['govlock'], hash], 'alice@active');
  await send(decide, 'vote', ['daclifycore', 1, 1, 1, 1], 'daclifycore@active');
  expect(poll().cast).toBe('1');
});

it('rejects a declared neutral poll sent through the binary proposal action', async () => {
  const text = JSON.stringify({ schemaVersion:3, semantics:'poll', title:'Location', description:'Choose a venue.', options:['Garden','Hall'] });
  await expect(open('open',text)).rejects.toThrow('BALLOT_SEMANTICS');
  expect(row(decide,'ballots',core.toBigInt(),1n)).toBeUndefined();
});
it('rejects whitespace-only poll choices atomically', async () => {
  const text = JSON.stringify({ schemaVersion:3, semantics:'poll', title:'Location', description:'Choose a venue.', options:[' ','Hall'] });
  await expect(open('openpoll',text)).rejects.toThrow('BALLOT_OPTIONS');
  expect(row(decide,'ballots',core.toBigInt(),1n)).toBeUndefined();
});
