import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { ABI, Checksum256, PrivateKey, Serializer } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
let chain: Blockchain,
  core: ReturnType<typeof load>,
  decide: ReturnType<typeof load>,
  works: ReturnType<typeof load>;
const keys = [PrivateKey.generate('K1'), PrivateKey.generate('K1'), PrivateKey.generate('K1')];
const policy = {
  participant_mode: 0,
  decide: 'decide',
  guardian: 'guardian',
  kind: 0,
  duration: 300,
  quorum: 5000,
  approval: 5001,
  governed_works: true,
  max_commitment: 100000,
  daily_commitment: 300000,
};
async function act(target: string, action: string, fields: object, member = 1) {
  const memberKey = keys[member - 1];
  if (!memberKey) throw new Error('Fixture member');
  const person = z.object({ nonce: z.number() }).parse(row(core, 'members', 1n, BigInt(member)));
  const abi = ABI.from(
    readFileSync(
      target === 'daclifycore'
        ? '.artifacts/core-release/runtime.abi'
        : '.artifacts/contracts/' + target + '.abi',
      'utf8',
    ),
  );
  const data = Serializer.encode({
    abi,
    type: action,
    object: { runtime: 'daclifycore', dao_id: 1, member_id: member, ...fields },
  }).hexString;
  const request = {
    version: 1,
    chain_id: 'ab'.repeat(32),
    deployment: 'daclifycore',
    dao_id: 1,
    member_id: member,
    nonce: person.nonce,
    expires: chain.timestamp.toMilliseconds() / 1000 + 300,
    target,
    action,
    data,
  };
  const coreAbi = ABI.from(readFileSync('.artifacts/core-release/runtime.abi', 'utf8'));
  const digest = Checksum256.hash(
    Serializer.encode({ abi: coreAbi, type: 'instruction', object: request }),
  );
  await send(core, 'submit', [request, memberKey.signDigest(digest).toString()], 'relay@active');
}
const totals = () =>
  z
    .object({ available: z.number(), reserved: z.number() })
    .parse(row(core, 'daos', core.toBigInt(), 1n));
async function open(ballotId = 1) {
  await act('decide', 'openwork', {
    ballot_id: ballotId,
    works: 'works',
    project_id: 1,
    duration: 300,
    quorum: 5000,
    approval: 5001,
    metadata: '{}',
  });
}
async function pass() {
  for (const member of [1, 2]) await act('decide', 'vote', { ballot_id: 1, choice: 1 }, member);
  chain.addTime(TimePointSec.from(301));
  await send(decide, 'finalize', ['daclifycore', 1, 1], 'relay@active');
}
beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'guardian', 'relay');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  works = load(chain, 'works', '.artifacts/contracts/works');
  const token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  for (const module of ['decide', 'works'])
    await listFirstParty(core, module, wasmCodeHash('.artifacts/contracts/' + module + '.wasm'));
  await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  await send(core, 'initgov', [1, policy], 'alice@active');
  for (const [index, key] of keys.entries())
    await send(
      core,
      'enroll',
      [1, index + 1, '', key.toPublic().toString(), 'key', 0],
      'alice@active',
    );
  await send(
    core,
    'setmodule',
    [
      1,
      'decide',
      1,
      ['open', 'vote', 'openwork'],
      ['govlock'],
      wasmCodeHash('.artifacts/contracts/decide.wasm'),
    ],
    'alice@active',
  );
  await send(
    core,
    'setmodule',
    [
      1,
      'works',
      1,
      ['propose', 'accept', 'submitwork', 'review', 'cancel'],
      ['reserve', 'approve', 'cancel'],
      wasmCodeHash('.artifacts/contracts/works.wasm'),
    ],
    'alice@active',
  );
  await send(token, 'create', ['alice', '1000.0000 TLOS'], 'eosio.token@active');
  await send(token, 'issue', ['alice', '100.0000 TLOS', ''], 'alice@active');
  await send(token, 'transfer', ['alice', 'daclifycore', '20.0000 TLOS', 'dao:1'], 'alice@active');
  await act('daclifycore', 'putjson', {
    document_id: 1,
    version: 1,
    value: '{"project":"test"}',
    envelope_version: 0,
    key_epoch: 0,
  });
  await act('works', 'propose', {
    project_id: 1,
    contributor: 3,
    document_id: 1,
    document_version: 1,
    payments: ['1.0000 TLOS', '2.0000 TLOS'],
    dues: [0, 0],
  });
});
describe('vote-authorised Works funding', () => {
  it('refuses administrator acceptance under governed funding', async () => {
    await expect(act('works', 'accept', { project_id: 1 })).rejects.toThrow('GOVERNANCE_REQUIRED');
    expect(totals().reserved).toBe(0);
  });
  it('enforces DAO policy on ordinary ballots as well as funding votes', async () => {
    await expect(
      act('decide', 'open', {
        ballot_id: 1,
        kind: 0,
        choices: 2,
        duration: 60,
        quorum: 1,
        approval: 5001,
        metadata: '{}',
      }),
    ).rejects.toThrow('BALLOT_POLICY');
  });
  it('reserves an approved project once and preserves milestone review', async () => {
    await open();
    await pass();
    await send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active');
    expect(totals()).toMatchObject({ available: 170000, reserved: 30000 });
    await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
      'ALREADY_EXECUTED',
    );
    await act('works', 'submitwork', { milestone_id: 1, document_id: 1, document_version: 1 }, 3);
    await act('works', 'review', {
      milestone_id: 1,
      approve: true,
      document_id: 1,
      document_version: 1,
    });
    await send(works, 'settle', ['daclifycore', 1, 1], 'relay@active');
    expect(totals().reserved).toBe(20000);
  });
  it('cannot execute pending or failed votes', async () => {
    await open();
    await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
      'BALLOT_NOT_PASSED',
    );
    chain.addTime(TimePointSec.from(301));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'relay@active');
    await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
      'BALLOT_NOT_PASSED',
    );
  });
  it('rolls back every reservation and execution marker when a later milestone exceeds its cap', async () => {
    await act('daclifycore', 'setdaogov', {
      settings: { ...policy, max_commitment: 10000, daily_commitment: 20000 },
    });
    await open();
    await pass();
    await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
      'COMMITMENT_LIMIT',
    );
    expect(totals()).toMatchObject({ available: 200000, reserved: 0 });
    expect(row(core, 'obligations', 1n, 1n)).toBeUndefined();
    expect(
      z.object({ executed: z.boolean() }).parse(row(decide, 'executions', core.toBigInt(), 1n))
        .executed,
    ).toBe(false);
    expect(
      z.object({ status: z.number() }).parse(row(works, 'milestones', core.toBigInt(), 1n)).status,
    ).toBe(0);
  });
  it('rejects a cancelled project even if its vote passes', async () => {
    await open();
    await act('works', 'cancel', { project_id: 1 });
    await pass();
    await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
      'PROJECT_NOT_PROPOSED',
    );
    expect(totals().reserved).toBe(0);
  });
  it('rejects execution under a different DAO and direct govaccept calls', async () => {
    await open();
    await pass();
    await expect(send(decide, 'execute', ['daclifycore', 2, 1], 'relay@active')).rejects.toThrow(
      'BALLOT_DOMAIN',
    );
    await expect(
      send(works, 'govaccept', ['daclifycore', 1, 1, 1], 'decide@active'),
    ).rejects.toThrow('EXECUTOR_SENDER');
  });
  it('invalidates funding authority when the policy revision changes', async () => {
    await open();
    await pass();
    await act('daclifycore', 'setdaogov', { settings: { ...policy, approval: 6667 } });
    await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
      'POLICY_CHANGED',
    );
  });
  it('bounds execution lifetime and obeys the guardian pause', async () => {
    await open();
    await pass();
    await send(
      core,
      'guardpause',
      [1, chain.timestamp.toMilliseconds() / 1000 + 60, 'ab'.repeat(32)],
      'guardian@active',
    );
    await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
      'DAO_PAUSED',
    );
    chain.addTime(TimePointSec.from(604801));
    await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
      'EXECUTION_EXPIRED',
    );
  });
});
