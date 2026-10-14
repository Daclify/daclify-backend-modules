import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { ABI, Checksum256, PrivateKey, Serializer } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, ballotExpectation, listFirstParty, replaceContract } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';

let chain: Blockchain, core: ReturnType<typeof load>, decide: ReturnType<typeof load>;
const keys = Array.from({ length: 3 }, () => PrivateKey.generate('K1'));
const policy = {
  participant_mode: 0,
  decide: 'decide',
  guardian: 'alice',
  kind: 0,
  duration: 60,
  quorum: 5000,
  approval: 5001,
  governed_works: false,
  max_commitment: 100000,
  daily_commitment: 300000,
};
async function act(target: string, action: string, fields: object, member = 1, dao = 1) {
  const key = keys[member - 1];
  if (!key) throw new Error('FIXTURE_MEMBER');
  const person = z
    .object({ nonce: z.number() })
    .parse(row(core, 'members', BigInt(dao), BigInt(member)));
  const abi = ABI.from(
    readFileSync(
      target === 'daclifycore'
        ? '.artifacts/core-release/runtime.abi'
        : '.artifacts/contracts/decide.abi',
      'utf8',
    ),
  );
  const boundFields = action === 'votecommit' ? { ...fields, expected: ballotExpectation(decide, 'daclifycore', z.object({ballot_id:z.union([z.number(),z.string()])}).parse(fields).ballot_id) } : fields;
  const data = Serializer.encode({
    abi,
    type: action,
    object: { runtime: 'daclifycore', dao_id: dao, member_id: member, ...boundFields },
  }).hexString;
  const request = {
    version: 1,
    chain_id: 'ab'.repeat(32),
    deployment: 'daclifycore',
    dao_id: dao,
    member_id: member,
    nonce: person.nonce,
    expires: chain.timestamp.toMilliseconds() / 1000 + 300,
    target,
    action,
    data,
  };
  const digest = Checksum256.hash(
    Serializer.encode({
      abi: ABI.from(readFileSync('.artifacts/core-release/runtime.abi', 'utf8')),
      type: 'instruction',
      object: request,
    }),
  );
  await send(core, 'submit', [request, key.signDigest(digest).toString()], 'relay@active');
}
const reg = () =>
  z
    .object({
      adopted_id: z.number(),
      pending_id: z.number(),
      revision: z.number(),
      approval: z.number(),
    })
    .parse(row(decide, 'docregs', core.toBigInt(), 1n));
const change = (id = 1n) =>
  z
    .object({ document_version: z.number(), status: z.number(), commitment: z.string() })
    .parse(row(decide, 'docchanges', core.toBigInt(), id));
async function publish(version: number, document = 7) {
  await act('daclifycore', 'putjson', {
    document_id: document,
    version,
    value: JSON.stringify({ constitution: version }),
    envelope_version: 0,
    key_epoch: 0,
  });
}
async function register(approval = 0, document = 7, category = 0) {
  await act('decide', 'regdoc', {
    document_id: document,
    category,
    approval,
    track_acceptance: true,
  });
}
async function propose(version = 1, revision = 0, ballot = 0) {
  await act('decide', 'proposedoc', {
    register_id: 1,
    document_version: version,
    expected_revision: revision,
    ballot_id: ballot,
  });
}
beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'relay', 'eosio.token');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await listFirstParty(core, 'decide', wasmCodeHash('.artifacts/contracts/decide.wasm'));
  for (const dao of [1, 2]) {
    await send(core, 'createdao', [dao, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
    await send(core, 'initgov', [dao, policy], 'alice@active');
    for (const [index, key] of keys.entries())
      await send(
        core,
        'enroll',
        [dao, index + 1, '', key.toPublic().toString(), 'key', 0],
        'alice@active',
      );
    await send(
      core,
      'setmodule',
      [
        dao,
        'decide',
        1,
        ['regdoc', 'proposedoc', 'adoptdoc', 'canceldoc', 'ackdoc', 'vote', 'votecommit', 'open'],
        ['govlock'],
        wasmCodeHash('.artifacts/contracts/decide.wasm'),
      ],
      'alice@active',
    );
  }
  await publish(1);
});
describe('governing documents', () => {
  it('keeps uploaded amendments as drafts, protects exact versions and records once-only acceptance', async () => {
    await register();
    await propose();
    await act('decide', 'adoptdoc', { proposal_id: 1 });
    await publish(2);
    expect(reg()).toMatchObject({ adopted_id: 1, pending_id: 0, revision: 1 });
    expect(change()).toMatchObject({ document_version: 1, status: 1 });
    await act('decide', 'ackdoc', { adoption_id: 1 }, 2);
    await expect(act('decide', 'ackdoc', { adoption_id: 1 }, 2)).rejects.toThrow(
      'DOCUMENT_ALREADY_ACCEPTED',
    );
    await expect(act('decide', 'adoptdoc', { proposal_id: 1 })).rejects.toThrow(
      'DOCUMENT_PROPOSAL_CLOSED',
    );
    await propose(2, 1);
    await act('decide', 'adoptdoc', { proposal_id: 2 });
    await expect(act('decide', 'ackdoc', { adoption_id: 1 }, 3)).rejects.toThrow(
      'DOCUMENT_ADOPTION_CHANGED',
    );
    expect(row(decide, 'docaccepts', core.toBigInt(), 1n)).toMatchObject({
      adoption_id: 1,
      member_id: 2,
    });
    expect(row(core, 'docrefs', 1n, 1n)).toBeTruthy();
  });
  it('requires administrators, one Constitution and immutable approval settings', async () => {
    await expect(
      act(
        'decide',
        'regdoc',
        { document_id: 7, category: 0, approval: 0, track_acceptance: true },
        2,
      ),
    ).rejects.toThrow('ADMIN_REQUIRED');
    await register(1);
    await expect(register()).rejects.toThrow('DOCUMENT_REGISTERED');
    await publish(1, 8);
    await expect(register(0, 8)).rejects.toThrow('CONSTITUTION_REGISTERED');
    expect(reg().approval).toBe(1);
    await expect(propose(1, 0, 0)).rejects.toThrow('BALLOT_ID');
  });
  it('binds a member vote to an exact version and rejects admin override, veto and replay', async () => {
    await register(1);
    await propose(1, 0, 31);
    await publish(2);
    await expect(act('decide', 'adoptdoc', { proposal_id: 1 })).rejects.toThrow(
      'BALLOT_NOT_PASSED',
    );
    for (const member of [1, 2]) await act('decide', 'votecommit', { ballot_id: 31, choice: 1 }, member);
    chain.addTime(TimePointSec.from(61));
    await send(decide, 'finalize', ['daclifycore', 1, 31], 'relay@active');
    await expect(act('decide', 'canceldoc', { proposal_id: 1 })).rejects.toThrow(
      'DOCUMENT_APPROVAL_READY',
    );
    await act('decide', 'adoptdoc', { proposal_id: 1 }, 3);
    expect(change()).toMatchObject({ document_version: 1, status: 1 });
    expect(reg().revision).toBe(1);
    await expect(act('decide', 'adoptdoc', { proposal_id: 1 }, 3)).rejects.toThrow(
      'DOCUMENT_PROPOSAL_CLOSED',
    );
  });
  it('rejects stale revisions, cross-DAO requests and unsigned module calls', async () => {
    await register();
    await expect(propose(1, 1)).rejects.toThrow('DOCUMENT_REVISION_CHANGED');
    await propose();
    await expect(act('decide', 'adoptdoc', { proposal_id: 1 }, 1, 2)).rejects.toThrow(
      'DOCUMENT_DOMAIN',
    );
    await expect(
      send(decide, 'adoptdoc', ['daclifycore', 1, 1, 1], 'relay@active'),
    ).rejects.toThrow();
    await expect(act('decide', 'adoptdoc', { proposal_id: 1 }, 2)).rejects.toThrow(
      'ADMIN_REQUIRED',
    );
  });
  it('expires in bounded batches, releases pending refs and preserves audit history', async () => {
    await register();
    await propose();
    await expect(
      send(decide, 'cleardocs', ['daclifycore', 1, Array(26).fill(1)], 'relay@active'),
    ).rejects.toThrow('DOCUMENT_CLEANUP_BOUNDS');
    chain.addTime(TimePointSec.from(604801));
    await expect(act('decide', 'adoptdoc', { proposal_id: 1 })).rejects.toThrow(
      'DOCUMENT_PROPOSAL_EXPIRED',
    );
    await send(decide, 'cleardocs', ['daclifycore', 1, [1]], 'relay@active');
    expect(reg().pending_id).toBe(0);
    expect(change().status).toBe(4);
    expect(row(core, 'docrefs', 1n, 1n)).toBeUndefined();
  });
  it('refuses approval after the governance policy changes', async () => {
    await register(1);
    await propose(1, 0, 31);
    for (const member of [1, 2]) await act('decide', 'votecommit', { ballot_id: 31, choice: 1 }, member);
    chain.addTime(TimePointSec.from(61));
    await send(decide, 'finalize', ['daclifycore', 1, 31], 'relay@active');
    await act('daclifycore', 'setdaogov', { settings: { ...policy, duration: 120 } });
    await expect(act('decide', 'adoptdoc', { proposal_id: 1 })).rejects.toThrow('POLICY_CHANGED');
  });
  it('retains pending and adopted rows when identical code is replaced', async () => {
    await register();
    await propose();
    replaceContract(decide, '.artifacts/contracts/decide');
    await act('decide', 'adoptdoc', { proposal_id: 1 });
    expect(change().status).toBe(1);
    expect(reg().adopted_id).toBe(1);
  });
});
