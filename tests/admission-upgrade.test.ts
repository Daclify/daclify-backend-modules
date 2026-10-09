import { Blockchain } from '@proton/vert';
import { PrivateKey } from '@wharfkit/antelope';
import { expect, it } from 'vitest';
import { z } from 'zod';
import { ModulePermissions } from '../protocol/index.js';
import { encodeEndorse, EndorseTableSchemas, type EndorseActions } from '../sdk/index.js';
import {
  encodeAction,
  makeInstruction,
  instructionDigest,
  RuntimeTableSchemas,
  type RuntimeActions,
} from '@daclify/core-protocol/sdk';
import { load, send, row, listFirstParty, replaceContract } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
it.each([false, true])(
  'preserves actual old endorsement applications and rechecks witnesses after upgrade, offboarded=%s',
  async (offboarded) => {
    const chain = new Blockchain();
    chain.createAccounts('alice', 'relay', 'decide', 'eosio.token');
    const old = '.artifacts/document-upgrade-old';
    const core = load(chain, 'daclifycore', old + '/runtime'),
      endorse = load(chain, 'endorse', old + '/endorse');
    expect(wasmCodeHash(old + '/runtime.wasm')).toBe(
      '5a7d037c3e9557b123edfaedbc1248b9a01f8c27f85c11f99d1e63acd5dd3c1a',
    );
    expect(wasmCodeHash(old + '/endorse.wasm')).toBe(
      '1933fae4f474abe3fe1fb22ed3f5dbdf5752da66a77256b83e6b756814289086',
    );
    const keys = Array.from({ length: 3 }, () => PrivateKey.generate('K1')),
      applicant = PrivateKey.generate('K1');
    await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
    await send(core, 'initramobs', [], 'daclifycore@active');
    const register = async (hash: string) => {
      await listFirstParty(core, 'endorse', hash);
      await send(core, 'setramcode', ['endorse', hash], 'daclifycore@active');
    };
    const enable = async (hash: string) =>
      send(
        core,
        'setmodule',
        [
          1,
          'endorse',
          1,
          ModulePermissions['endorsement-admission'].actions,
          ModulePermissions['endorsement-admission'].grants,
          hash,
        ],
        'alice@active',
      );
    await register(wasmCodeHash(old + '/endorse.wasm'));
    await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
    await send(
      core,
      'initgov',
      [
        1,
        {
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
        },
      ],
      'alice@active',
    );
    for (const [index, key] of keys.entries())
      await send(
        core,
        'enroll',
        [1, index + 1, '', key.toPublic().toString(), 'original member encryption', 0],
        'alice@active',
      );
    await enable(wasmCodeHash(old + '/endorse.wasm'));
    async function act(target: string, action: string, data: Uint8Array, memberId = '1') {
      const person = RuntimeTableSchemas.members.parse(row(core, 'members', 1n, BigInt(memberId))),
        key = keys[Number(memberId) - 1];
      if (!key) throw new Error('ADMISSION_FIXTURE_KEY_REQUIRED');
      const request = makeInstruction(
        { chainId: 'ab'.repeat(32), contract: 'daclifycore', daoId: '1', interfaceVersion: 1 },
        memberId,
        person.nonce,
        Math.floor(chain.timestamp.toMilliseconds() / 1000) + 120,
        target,
        action,
        data,
      );
      await send(
        core,
        'submit',
        [request, key.signDigest(instructionDigest(request)).toString()],
        'relay@active',
      );
    }
    const actor = (member_id = '1') => ({ runtime: 'daclifycore', dao_id: '1', member_id });
    const coreAct = <K extends keyof RuntimeActions>(action: K, data: RuntimeActions[K]) =>
      act('daclifycore', action, encodeAction(action, data));
    const moduleAct = <K extends keyof EndorseActions>(
      action: K,
      data: EndorseActions[K],
      memberId = '1',
    ) => act('endorse', action, encodeEndorse(action, data), memberId);
    await coreAct('putjson', {
      ...actor(),
      document_id: '1',
      version: 1,
      value: '{"kind":"join"}',
      envelope_version: 0,
      key_epoch: '0',
    });
    await coreAct('setadmit', {
      ...actor(),
      enabled: true,
      source: 'endorse',
      threshold: 2,
      allow_agents: false,
      admin_override: false,
    });
    await moduleAct('applyjoin', {
      ...actor(),
      application_id: '1',
      signing_key: applicant.toPublic().toString(),
      encryption_key: 'original applicant encryption',
      custody: 0,
      kind: 0,
      operator_label: '',
      document_id: '1',
      document_version: 1,
      expires: 600,
    });
    for (const memberId of ['2', '3'])
      await moduleAct(
        'witness',
        { ...actor(memberId), application_id: '1', revision: '1' },
        memberId,
      );
    const application = () =>
      EndorseTableSchemas.joinapps.parse(row(endorse, 'joinapps', core.toBigInt(), 1n));
    const members = () =>
      keys.map((_, index) =>
        RuntimeTableSchemas.members.parse(row(core, 'members', 1n, BigInt(index + 1))),
      );
    const original = {
      application: application(),
      members: members(),
      policy: RuntimeTableSchemas.admpolicies.parse(row(core, 'admpolicies', core.toBigInt(), 1n)),
    };
    expect(original.application.witnesses).toEqual(['2', '3']);
    replaceContract(core, '.artifacts/core-release/runtime');
    await send(
      core,
      'rebindramobs',
      [wasmCodeHash(old + '/runtime.wasm'), wasmCodeHash('.artifacts/core-release/runtime.wasm')],
      'daclifycore@active',
    );
    replaceContract(endorse, '.artifacts/contracts/endorse');
    await register(wasmCodeHash('.artifacts/contracts/endorse.wasm'));
    await enable(wasmCodeHash('.artifacts/contracts/endorse.wasm'));
    expect({
      application: application(),
      members: members(),
      policy: RuntimeTableSchemas.admpolicies.parse(row(core, 'admpolicies', core.toBigInt(), 1n)),
    }).toEqual(original);
    await send(endorse, 'backfillrefs', ['daclifycore', 1, 'joinapps', 1], 'daclifycore@active');
    const references = () =>
      z.array(RuntimeTableSchemas.docrefs).parse(core.tables.docrefs?.(1n).getTableRows());
    const firstReferences = references(),
      counters = () =>
        RuntimeTableSchemas.ramstats.parse(row(core, 'ramstats', 1n, core.toBigInt()));
    expect(firstReferences).toHaveLength(1);
    const firstCounters = counters();
    await send(endorse, 'backfillrefs', ['daclifycore', 1, 'joinapps', 1], 'daclifycore@active');
    expect(references()).toEqual(firstReferences);
    expect(counters()).toEqual(firstCounters);
    expect(application()).toEqual(original.application);
    if (offboarded) {
      await coreAct('setactive', { ...actor(), target: '3', active: false });
      const before = { application: application(), members: members(), counters: counters() };
      await expect(
        moduleAct('admit', { ...actor(), application_id: '1', revision: '1' }),
      ).rejects.toThrow('ENDORSEMENT_THRESHOLD');
      expect({ application: application(), members: members(), counters: counters() }).toEqual(
        before,
      );
      await coreAct('setactive', { ...actor(), target: '3', active: true });
    }
    await moduleAct('admit', { ...actor(), application_id: '1', revision: '1' });
    expect(RuntimeTableSchemas.members.parse(row(core, 'members', 1n, 4n))).toMatchObject({
      signing_key: applicant.toPublic().toString(),
      encryption_key: 'original applicant encryption',
      native_account: '',
      nonce: '0',
      admin: false,
      reviewer: false,
      credits: '0',
      active: true,
    });
    expect(application()).toMatchObject({
      ...original.application,
      admitted: true,
      member_id: '4',
    });
    const after = {
      application: application(),
      members: members(),
      counters: counters(),
      dao: RuntimeTableSchemas.daos.parse(row(core, 'daos', core.toBigInt(), 1n)),
    };
    await expect(
      moduleAct('admit', { ...actor(), application_id: '1', revision: '1' }),
    ).rejects.toThrow('APPLICATION_FROZEN');
    await expect(send(core, 'admitfrom', [1, 'endorse', 1, 1], 'endorse@active')).rejects.toThrow(
      'SOURCE_SENDER',
    );
    expect({
      application: application(),
      members: members(),
      counters: counters(),
      dao: RuntimeTableSchemas.daos.parse(row(core, 'daos', core.toBigInt(), 1n)),
    }).toEqual(after);
    expect(references()).toEqual(firstReferences);
  },
);
