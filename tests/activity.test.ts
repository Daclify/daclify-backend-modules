import { readFileSync } from 'node:fs';
import { beforeEach, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { ABI, Checksum256, PrivateKey, Serializer } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';

const wrappedGrant = JSON.stringify({
  version: 1,
  ephemeralKey: { kty: 'EC', crv: 'P-256', x: 'a'.repeat(43), y: 'b'.repeat(43) },
  salt: 'c'.repeat(43) + '=',
  envelope: {
    version: 1,
    algorithm: 'AES-256-GCM',
    iv: 'd'.repeat(16),
    ciphertext: 'e'.repeat(64),
  },
});
const keys = Array.from({ length: 3 }, () => PrivateKey.generate('K1'));
let chain: Blockchain, core: ReturnType<typeof load>, activity: ReturnType<typeof load>;
async function act(action: string, fields: object, member = 1, target = 'activity') {
  const key = keys[member - 1];
  if (!key) throw new Error('FIXTURE_MEMBER');
  const nonce = z
    .object({ nonce: z.number() })
    .parse(row(core, 'members', 1n, BigInt(member))).nonce;
  const abi = ABI.from(
    readFileSync(
      target === 'daclifycore'
        ? '.artifacts/core-release/runtime.abi'
        : `.artifacts/contracts/${target}.abi`,
      'utf8',
    ),
  );
  const request = {
    version: 1,
    chain_id: 'ab'.repeat(32),
    deployment: 'daclifycore',
    dao_id: 1,
    member_id: member,
    nonce,
    expires: 300,
    target,
    action,
    data: Serializer.encode({
      abi,
      type: action,
      object: { runtime: 'daclifycore', dao_id: 1, member_id: member, ...fields },
    }).hexString,
  };
  const coreAbi = ABI.from(readFileSync('.artifacts/core-release/runtime.abi', 'utf8'));
  await send(
    core,
    'submit',
    [
      request,
      key
        .signDigest(
          Checksum256.hash(
            Serializer.encode({ abi: coreAbi, type: 'instruction', object: request }),
          ),
        )
        .toString(),
    ],
    'relay@active',
  );
}
const item = (event = 'aa', app = 1) => ({
  app_id: app,
  source_id: 'bb'.repeat(32),
  source_revision: 'cc'.repeat(32),
  event_id: event.repeat(32),
  evidence_cid: '',
  evidence_hash: '00'.repeat(32),
  key_epoch: 0,
});
beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'relay');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  activity = load(chain, 'activity', '.artifacts/contracts/activity');
  load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await listFirstParty(core, 'activity', wasmCodeHash('.artifacts/contracts/activity.wasm'));
  await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  for (const [index, key] of keys.entries())
    await send(
      core,
      'enroll',
      [1, index + 1, '', key.toPublic().toString(), 'encryption-key', 0],
      'alice@active',
    );
  await send(
    core,
    'setmodule',
    [
      1,
      'activity',
      1,
      ['recordact', 'askreview', 'reviewact', 'newappkey', 'grantappkey', 'linkdecision'],
      [],
      wasmCodeHash('.artifacts/contracts/activity.wasm'),
    ],
    'alice@active',
  );
  for (const app_id of [1, 2])
    await act(
      'setapp',
      { app_id, target: 'activity', revision: 1, config_hash: 'dd'.repeat(32), enabled: true },
      1,
      'daclifycore',
    );
});
it('records the actual author, opaque source and exact revision without task content', async () => {
  await act('recordact', item(), 3);
  expect(row(activity, 'activities', core.toBigInt(), 1n)).toMatchObject({
    dao_id: 1,
    app_id: 1,
    actor: 3,
    kind: 1,
    source_revision: 'cc'.repeat(32),
    status: 0,
  });
});
it('retries one event once and rejects changed content under the same event', async () => {
  await act('recordact', item(), 3);
  await act('recordact', item(), 3);
  expect(row(activity, 'activities', core.toBigInt(), 2n)).toBeUndefined();
  await expect(
    act('recordact', { ...item(), source_revision: 'ee'.repeat(32) }, 3),
  ).rejects.toThrow('ACTIVITY_CONFLICT');
  await expect(act('recordact', item(), 2)).rejects.toThrow('ACTIVITY_CONFLICT');
});
it('keeps the same source and event IDs independent between apps', async () => {
  await act('recordact', item(), 3);
  await act('recordact', item('aa', 2), 3);
  expect(row(activity, 'activities', core.toBigInt(), 2n)).toMatchObject({ app_id: 2 });
});
it('rejects direct module calls even with runtime account authority', async () => {
  await expect(
    send(
      activity,
      'recordact',
      ['daclifycore', 1, 3, ...Object.values(item())],
      'daclifycore@active',
    ),
  ).rejects.toThrow('ACTOR_SENDER');
});
it('requires independent current reviewers and exact source revision', async () => {
  await act('askreview', item(), 3);
  const review = {
    app_id: 1,
    receipt_id: 1,
    source_revision: 'cc'.repeat(32),
    accepted: true,
    evidence_cid: '',
    evidence_hash: '00'.repeat(32),
    key_epoch: 0,
  };
  await expect(act('reviewact', review, 3)).rejects.toThrow('REVIEWER_REQUIRED');
  await act('setroles', { target: 3, admin: false, reviewer: true }, 1, 'daclifycore');
  await expect(act('reviewact', review, 3)).rejects.toThrow('SELF_REVIEW');
  await expect(
    act('reviewact', { ...review, source_revision: 'ff'.repeat(32) }, 1),
  ).rejects.toThrow('ACTIVITY_REVISION');
  await act('reviewact', review, 1);
  expect(row(activity, 'activities', core.toBigInt(), 1n)).toMatchObject({ status: 2 });
  expect(row(activity, 'actreviews', core.toBigInt(), 1n)).toMatchObject({
    reviewer: 1,
    accepted: true,
  });
  await expect(act('reviewact', review, 1)).rejects.toThrow('ACTIVITY_REVIEWED');
});
it('refuses dangling evidence, excessive CIDs and absent encryption epochs', async () => {
  await expect(
    act(
      'recordact',
      { ...item(), evidence_cid: 'b'.repeat(129), evidence_hash: 'ee'.repeat(32) },
      3,
    ),
  ).rejects.toThrow('EVIDENCE_CID');
  await expect(act('recordact', { ...item(), evidence_cid: 'bafytest' }, 3)).rejects.toThrow(
    'EVIDENCE_HASH',
  );
  await expect(
    act(
      'recordact',
      { ...item(), evidence_cid: 'bafytest', evidence_hash: 'ee'.repeat(32), key_epoch: 1 },
      3,
    ),
  ).rejects.toThrow('APP_KEY_UNKNOWN');
});
it('requires app encryption for every nonempty snapshot, including public DAOs', async () => {
  await expect(
    act('recordact', { ...item(), evidence_cid: 'bafytest', evidence_hash: 'ee'.repeat(32) }, 3),
  ).rejects.toThrow('APP_KEY_REQUIRED');
});
it('separates encryption domains and rotates future access after membership changes', async () => {
  await act('newappkey', {
    app_id: 1,
    key_epoch: 1,
    security_epoch: 1,
    app_revision: 1,
    key_commitment: 'de'.repeat(32),
    self_grant: wrappedGrant,
  });
  const evidence = {
    ...item(),
    evidence_cid: 'bafytest',
    evidence_hash: 'ee'.repeat(32),
    key_epoch: 1,
  };
  await act('recordact', evidence, 3);
  await expect(act('recordact', { ...evidence, app_id: 2 }, 3)).rejects.toThrow('APP_KEY_SCOPE');
  await act('setactive', { target: 2, active: false }, 1, 'daclifycore');
  await expect(act('recordact', { ...evidence, event_id: 'ff'.repeat(32) }, 3)).rejects.toThrow(
    'APP_KEY_STALE',
  );
  await act('newappkey', {
    app_id: 1,
    key_epoch: 2,
    security_epoch: 2,
    app_revision: 1,
    key_commitment: 'de'.repeat(32),
    self_grant: wrappedGrant,
  });
  await act('recordact', { ...evidence, event_id: 'ff'.repeat(32), key_epoch: 2 }, 3);
});
it('rotates encrypted review keys for a disabled app while closing without allowing new receipts', async () => {
  await act('newappkey', {
    app_id: 1,
    key_epoch: 1,
    security_epoch: 1,
    app_revision: 1,
    key_commitment: 'de'.repeat(32),
    self_grant: wrappedGrant,
  });
  await act(
    'askreview',
    { ...item(), evidence_cid: 'bafytest', evidence_hash: 'ee'.repeat(32), key_epoch: 1 },
    3,
  );
  await act('startclose', {}, 1, 'daclifycore');
  await act(
    'setapp',
    { app_id: 1, target: 'activity', revision: 2, config_hash: 'dd'.repeat(32), enabled: false },
    1,
    'daclifycore',
  );
  await expect(act('recordact', item('ff'), 3)).rejects.toThrow('DAO_CLOSING');
  await act('newappkey', {
    app_id: 1,
    key_epoch: 2,
    security_epoch: 2,
    app_revision: 2,
    key_commitment: 'df'.repeat(32),
    self_grant: wrappedGrant,
  });
  await expect(
    act('grantappkey', {
      app_id: 1,
      key_epoch: 2,
      recipient: 2,
      encryption_key: 'wrong',
      envelope: wrappedGrant,
    }),
  ).rejects.toThrow('APP_RECIPIENT_KEY');
  await act('grantappkey', {
    app_id: 1,
    key_epoch: 2,
    recipient: 2,
    encryption_key: 'encryption-key',
    envelope: wrappedGrant,
  });
  const review = {
    app_id: 1,
    receipt_id: 1,
    source_revision: 'cc'.repeat(32),
    accepted: true,
    evidence_cid: 'bafyreview',
    evidence_hash: 'ef'.repeat(32),
    key_epoch: 1,
  };
  await expect(act('reviewact', review)).rejects.toThrow('APP_KEY_STALE');
  await act('reviewact', { ...review, key_epoch: 2 });
  expect(row(activity, 'activities', core.toBigInt(), 1n)).toMatchObject({ status: 2 });
});
it('continues to refuse disabled-app review while the DAO is active', async () => {
  await act('askreview', item(), 3);
  await act(
    'setapp',
    { app_id: 1, target: 'activity', revision: 2, config_hash: 'dd'.repeat(32), enabled: false },
    1,
    'daclifycore',
  );
  await expect(
    act('reviewact', {
      app_id: 1,
      receipt_id: 1,
      source_revision: 'cc'.repeat(32),
      accepted: true,
      evidence_cid: '',
      evidence_hash: '00'.repeat(32),
      key_epoch: 0,
    }),
  ).rejects.toThrow('APP_DISABLED');
});
it('rejects encryption grants to inactive members and bounds grant bytes', async () => {
  await act('newappkey', {
    app_id: 1,
    key_epoch: 1,
    security_epoch: 1,
    app_revision: 1,
    key_commitment: 'de'.repeat(32),
    self_grant: wrappedGrant,
  });
  await expect(
    act('grantappkey', {
      app_id: 1,
      key_epoch: 1,
      recipient: 3,
      encryption_key: 'wrong',
      envelope: wrappedGrant,
    }),
  ).rejects.toThrow('APP_RECIPIENT_KEY');
  await expect(
    act('grantappkey', {
      app_id: 1,
      key_epoch: 1,
      recipient: 3,
      encryption_key: 'encryption-key',
      envelope: 'x'.repeat(8193),
    }),
  ).rejects.toThrow('APP_GRANT_SIZE');
  await act('grantappkey', {
    app_id: 1,
    key_epoch: 1,
    recipient: 3,
    encryption_key: 'encryption-key',
    envelope: wrappedGrant,
  });
  await act('setactive', { target: 3, active: false }, 1, 'daclifycore');
  await expect(
    act('grantappkey', {
      app_id: 1,
      key_epoch: 1,
      recipient: 3,
      encryption_key: 'encryption-key',
      envelope: wrappedGrant,
    }),
  ).rejects.toThrow('MEMBER_INACTIVE');
});
it('requires a native commitment to one shared app epoch key', async () => {
  await expect(
    act('newappkey', {
      app_id: 1,
      key_epoch: 1,
      security_epoch: 1,
      app_revision: 1,
      key_commitment: '00'.repeat(32),
      self_grant: wrappedGrant,
    }),
  ).rejects.toThrow('APP_KEY_COMMITMENT');
});
it('rejects plaintext key grant objects', async () => {
  await act('newappkey', {
    app_id: 1,
    key_epoch: 1,
    security_epoch: 1,
    app_revision: 1,
    key_commitment: 'de'.repeat(32),
    self_grant: wrappedGrant,
  });
  await expect(
    act('grantappkey', {
      app_id: 1,
      key_epoch: 1,
      recipient: 3,
      encryption_key: 'encryption-key',
      envelope: '{"plaintext":"secret app key"}',
    }),
  ).rejects.toThrow('APP_GRANT_JSON');
});
it('creates an app epoch only with an atomic wrapped grant to its creator', async () => {
  await expect(
    act('newappkey', {
      app_id: 1,
      key_epoch: 1,
      security_epoch: 1,
      app_revision: 1,
      key_commitment: 'de'.repeat(32),
      self_grant: '',
    }),
  ).rejects.toThrow('APP_GRANT_SIZE');
  expect(row(activity, 'appkeys', core.toBigInt(), 1n)).toBeUndefined();
});
it('invalidates the previous future-content epoch on explicit key rotation', async () => {
  for (const key_epoch of [1, 2])
    await act('newappkey', {
      app_id: 1,
      key_epoch,
      security_epoch: 1,
      app_revision: 1,
      key_commitment: 'de'.repeat(32),
      self_grant: wrappedGrant,
    });
  await expect(
    act(
      'recordact',
      { ...item(), evidence_cid: 'bafytest', evidence_hash: 'ee'.repeat(32), key_epoch: 1 },
      3,
    ),
  ).rejects.toThrow('APP_KEY_STALE');
});
