import { beforeEach, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { PrivateKey } from '@wharfkit/antelope';
import { encodeAction, instructionDigest, makeInstruction } from '@daclify/core-protocol/sdk';
import { DaoRefSchema } from '@daclify/core-protocol';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
import { z } from 'zod';
import { ModulePermissions } from '../protocol/index.js';
import { encodeActivity, encodeWorks } from '../sdk/index.js';
import { TimePointSec } from '@greymass/eosio';
const permissions = {
  decide: ModulePermissions.decide,
  works: ModulePermissions.works,
  payroll: ModulePermissions.payroll,
  grants: ModulePermissions['grants-rounds'],
  endorse: ModulePermissions['endorsement-admission'],
  activity: ModulePermissions.activity,
};
let core: ReturnType<typeof load>;
let chain: Blockchain;
const root = PrivateKey.generate('K1');
const ref = DaoRefSchema.parse({
  chainId: 'ab'.repeat(32),
  contract: 'daclifycore',
  daoId: '1',
  interfaceVersion: 1,
});
const kinds = ['decide', 'works', 'payroll', 'grants', 'endorse', 'activity'] as const;
const fixtures = new Map<string, ReturnType<typeof load>>();
async function closing(action = 'startclose') {
  return signed(
    'daclifycore',
    action,
    encodeAction('refreshgov', { runtime: ref.contract, dao_id: '1', member_id: '1' }),
  );
}
async function signed(target: string, action: string, data: Uint8Array, member = '1', key = root) {
  const nonce = z
    .object({ nonce: z.union([z.number().int().safe(), z.string()]) })
    .parse(row(core, 'members', 1n, BigInt(member))).nonce;
  const request = makeInstruction(
    ref,
    member,
    String(nonce),
    chain.timestamp.toMilliseconds() / 1000 + 300,
    target,
    action,
    data,
  );
  await send(
    core,
    'submit',
    [request, key.signDigest(instructionDigest(request)).toString()],
    'alice@active',
  );
}
beforeEach(async () => {
  fixtures.clear();
  chain = new Blockchain();
  chain.createAccounts('alice', 'eosio.token');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  await send(core, 'init', [ref.chainId], 'daclifycore@active');
  await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  await send(core, 'enroll', [1, 1, '', root.toPublic().toString(), 'fixture', 0], 'alice@active');
  for (const [index, account] of kinds.entries()) {
    fixtures.set(account, load(chain, account, '.artifacts/contracts/' + account));
    const hash = wasmCodeHash('.artifacts/contracts/' + account + '.wasm');
    await listFirstParty(core, account, hash);
    await send(
      core,
      'setmodule',
      [1, account, 1, permissions[account].actions, permissions[account].grants, hash],
      'alice@active',
    );
    await send(core, 'setlifecode', [account, hash, index + 1], 'daclifycore@active');
  }
});
it('refuses final closure without every qualified module proof and reclaims only temporary proofs afterward', async () => {
  await closing();
  await expect(closing('closedao')).rejects.toThrow('DAO_MODULE_LIABILITIES_REMAIN');
  for (const account of kinds) {
    const module = fixtures.get(account);
    if (!module) throw new Error('FIXTURE_MODULE');
    await expect(send(module, 'scanclose', ['daclifycore', 1, 26], 'alice@active')).rejects.toThrow(
      'CLOSURE_SCAN_BOUNDS',
    );
    for (let step = 0; step < 3; step++)
      await send(module, 'scanclose', ['daclifycore', 1, 25], 'alice@active');
    expect(row(module, 'closechecks', core.toBigInt(), 1n)).toMatchObject({ complete: true });
    await expect(send(module, 'clearclose', ['daclifycore', 1], 'alice@active')).rejects.toThrow(
      'DAO_NOT_CLOSED',
    );
  }
  await closing('closedao');
  for (const account of kinds) {
    const module = fixtures.get(account);
    if (!module) throw new Error('FIXTURE_MODULE');
    await send(module, 'clearclose', ['daclifycore', 1], 'alice@active');
    expect(row(module, 'closechecks', core.toBigInt(), 1n)).toBeUndefined();
    await send(module, 'clearclose', ['daclifycore', 1], 'alice@active');
  }
});
it('refuses an installed module whose qualification is removed', async () => {
  await send(core, 'clearlifecode', ['activity'], 'daclifycore@active');
  await closing();
  await expect(closing('closedao')).rejects.toThrow('DAO_MODULE_CLOSURE_REQUIRED');
});
it.each([
  ['decide', 'regdoc', [1, 0, 0, false]],
  ['works', 'propose', [1, 1, 1, 1, ['1.0000 TLOS'], [1000]]],
  ['payroll', 'commit', [1, 1, '1.0000 TLOS', 1, 86400, 1000]],
  ['grants', 'newround', [1, 1, 1, 1000, 2000, 3000, '1.0000 TLOS', false, 'works']],
  [
    'endorse',
    'applyjoin',
    [1, PrivateKey.generate('K1').toPublic().toString(), 'fixture', 0, 0, '', 1, 1, 1000],
  ],
  [
    'activity',
    'recordact',
    [1, 'ab'.repeat(32), 'cd'.repeat(32), 'ef'.repeat(32), '', 'ab'.repeat(32), 0],
  ],
] as const)(
  'rejects new %s %s at its own module entry point during retirement',
  async (account, action, fields) => {
    await closing();
    const module = fixtures.get(account);
    if (!module) throw new Error('FIXTURE_MODULE');
    await expect(
      send(module, action, ['daclifycore', 1, 1, ...fields], 'daclifycore@active'),
    ).rejects.toThrow(account === 'activity' ? 'ACTOR_SENDER' : 'DAO_CLOSING');
  },
);
it('blocks unresolved Works agreements and preserves their history after explicit cancellation', async () => {
  const works = fixtures.get('works');
  if (!works) throw new Error('FIXTURE_MODULE');
  await send(core, 'putjson', ['daclifycore', 1, 1, 1, 1, '{}', 0, 0], 'daclifycore@active');
  await send(
    works,
    'propose',
    ['daclifycore', 1, 1, 1, 1, 1, 1, ['1.0000 TLOS'], [1000]],
    'daclifycore@active',
  );
  const project = row(works, 'projects', core.toBigInt(), 1n);
  await closing();
  await expect(send(works, 'scanclose', ['daclifycore', 1, 25], 'alice@active')).rejects.toThrow(
    'DAO_MODULE_LIABILITIES_REMAIN',
  );
  expect(row(works, 'projects', core.toBigInt(), 1n)).toEqual(project);
  await send(works, 'cancel', ['daclifycore', 1, 1, 1], 'daclifycore@active');
  await send(works, 'scanclose', ['daclifycore', 1, 25], 'alice@active');
  expect(row(works, 'projects', core.toBigInt(), 1n)).toMatchObject({ status: 2 });
  expect(row(works, 'closechecks', core.toBigInt(), 1n)).toMatchObject({ complete: true });
});
it('scans 26 actual activity receipts in two bounded batches and retains every receipt', async () => {
  const activity = fixtures.get('activity');
  if (!activity) throw new Error('FIXTURE_MODULE');
  await signed(
    'daclifycore',
    'setapp',
    encodeAction('setapp', {
      runtime: 'daclifycore',
      dao_id: '1',
      member_id: '1',
      app_id: '1',
      target: 'activity',
      revision: '1',
      config_hash: 'ab'.repeat(32),
      enabled: true,
    }),
  );
  for (let index = 1; index <= 26; index++)
    await signed(
      'activity',
      'recordact',
      encodeActivity('recordact', {
        runtime: 'daclifycore',
        dao_id: '1',
        member_id: '1',
        app_id: '1',
        source_id: 'ab'.repeat(32),
        source_revision: 'cd'.repeat(32),
        event_id: index.toString(16).padStart(64, '0'),
        evidence_cid: '',
        evidence_hash: '0'.repeat(64),
        key_epoch: '0',
      }),
    );
  await closing();
  await send(activity, 'scanclose', ['daclifycore', 1, 25], 'alice@active');
  expect(
    z
      .object({
        cursor: z.union([z.string(), z.number()]).transform(String),
        complete: z.boolean(),
      })
      .parse(row(activity, 'closechecks', core.toBigInt(), 1n)),
  ).toEqual({ cursor: '25', complete: false });
  await send(activity, 'scanclose', ['daclifycore', 1, 25], 'alice@active');
  expect(row(activity, 'closechecks', core.toBigInt(), 1n)).toMatchObject({ complete: true });
  for (let index = 1; index <= 26; index++)
    expect(row(activity, 'activities', core.toBigInt(), BigInt(index))).toMatchObject({
      status: 0,
    });
});
it('finishes pre-existing work during closing and preserves once-only claims for its departed contributor', async () => {
  const works = fixtures.get('works');
  if (!works) throw new Error('FIXTURE_MODULE');
  chain.createAccounts('bob');
  const contributor = PrivateKey.generate('K1');
  await send(
    core,
    'enroll',
    [1, 2, '', contributor.toPublic().toString(), 'fixture', 0],
    'alice@active',
  );
  const token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(token, 'create', ['alice', '1000.0000 TLOS'], 'eosio.token@active');
  await send(token, 'issue', ['alice', '10.0000 TLOS', ''], 'alice@active');
  await send(token, 'transfer', ['alice', 'daclifycore', '10.0000 TLOS', 'dao:1'], 'alice@active');
  await signed(
    'daclifycore',
    'putjson',
    encodeAction('putjson', {
      runtime: 'daclifycore',
      dao_id: '1',
      member_id: '1',
      document_id: '1',
      version: 1,
      value: '{}',
      envelope_version: 0,
      key_epoch: '0',
    }),
  );
  await signed(
    'works',
    'propose',
    encodeWorks('propose', {
      runtime: 'daclifycore',
      dao_id: '1',
      member_id: '2',
      project_id: '1',
      contributor: '2',
      document_id: '1',
      document_version: 1,
      payments: ['1.0000 TLOS'],
      dues: [1000],
    }),
    '2',
    contributor,
  );
  await signed(
    'works',
    'accept',
    encodeWorks('accept', { runtime: 'daclifycore', dao_id: '1', member_id: '1', project_id: '1' }),
  );
  await closing();
  await signed(
    'works',
    'submitwork',
    encodeWorks('submitwork', {
      runtime: 'daclifycore',
      dao_id: '1',
      member_id: '2',
      milestone_id: '1',
      document_id: '1',
      document_version: 1,
    }),
    '2',
    contributor,
  );
  await signed(
    'works',
    'review',
    encodeWorks('review', {
      runtime: 'daclifycore',
      dao_id: '1',
      member_id: '1',
      milestone_id: '1',
      approve: true,
      document_id: '1',
      document_version: 1,
    }),
  );
  await signed(
    'daclifycore',
    'leave',
    encodeAction('leave', { runtime: 'daclifycore', dao_id: '1', member_id: '2' }),
    '2',
    contributor,
  );
  await expect(send(works, 'scanclose', ['daclifycore', 1, 25], 'alice@active')).rejects.toThrow(
    'DAO_MODULE_LIABILITIES_REMAIN',
  );
  chain.addTime(TimePointSec.from(1001));
  await send(works, 'settle', ['daclifycore', 1, 1], 'alice@active');
  expect(row(core, 'members', 1n, 2n)).toMatchObject({ active: false, claim: 10000 });
  await send(works, 'scanclose', ['daclifycore', 1, 25], 'alice@active');
  expect(row(works, 'closechecks', core.toBigInt(), 1n)).toMatchObject({ complete: true });
  await send(token, 'open', ['bob', '4,TLOS', 'bob'], 'bob@active');
  const withdrawal = encodeAction('withdraw', {
    runtime: 'daclifycore',
    dao_id: '1',
    member_id: '2',
    destination: 'bob',
    quantity: '1.0000 TLOS',
  });
  await signed('daclifycore', 'withdraw', withdrawal, '2', contributor);
  await expect(signed('daclifycore', 'withdraw', withdrawal, '2', contributor)).rejects.toThrow(
    'INSUFFICIENT_CLAIM',
  );
  expect(row(core, 'members', 1n, 2n)).toMatchObject({ active: false, claim: 0 });
});
it('can independently review existing receipts after an app is disabled during closing', async () => {
  const activity = fixtures.get('activity');
  if (!activity) throw new Error('FIXTURE_MODULE');
  const requester = PrivateKey.generate('K1');
  await send(
    core,
    'enroll',
    [1, 2, '', requester.toPublic().toString(), 'fixture', 0],
    'alice@active',
  );
  const app = {
    runtime: 'daclifycore',
    dao_id: '1',
    member_id: '1',
    app_id: '1',
    target: 'activity',
    revision: '1',
    config_hash: 'ab'.repeat(32),
    enabled: true,
  };
  await signed('daclifycore', 'setapp', encodeAction('setapp', app));
  await signed(
    'activity',
    'askreview',
    encodeActivity('askreview', {
      runtime: 'daclifycore',
      dao_id: '1',
      member_id: '2',
      app_id: '1',
      source_id: 'ab'.repeat(32),
      source_revision: 'cd'.repeat(32),
      event_id: 'ef'.repeat(32),
      evidence_cid: '',
      evidence_hash: '0'.repeat(64),
      key_epoch: '0',
    }),
    '2',
    requester,
  );
  await closing();
  await signed(
    'daclifycore',
    'setapp',
    encodeAction('setapp', { ...app, revision: '2', enabled: false }),
  );
  await expect(send(activity, 'scanclose', ['daclifycore', 1, 25], 'alice@active')).rejects.toThrow(
    'DAO_MODULE_LIABILITIES_REMAIN',
  );
  await signed(
    'activity',
    'reviewact',
    encodeActivity('reviewact', {
      runtime: 'daclifycore',
      dao_id: '1',
      member_id: '1',
      app_id: '1',
      receipt_id: '1',
      source_revision: 'cd'.repeat(32),
      accepted: true,
      evidence_cid: '',
      evidence_hash: '0'.repeat(64),
      key_epoch: '0',
    }),
  );
  await send(activity, 'scanclose', ['daclifycore', 1, 25], 'alice@active');
  expect(row(activity, 'activities', core.toBigInt(), 1n)).toMatchObject({ status: 2 });
});
