import { expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { PrivateKey } from '@wharfkit/antelope';
import {
  encodeAction,
  makeInstruction,
  instructionDigest,
  RuntimeActionSchemas,
} from '@daclify/core-protocol/sdk';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
import { encodeEndorse } from '../sdk/index.js';
it('keeps private agent operating names out of public admission applications', async () => {
  const chain = new Blockchain();
  chain.setTime(TimePointSec.from(1000));
  chain.createAccounts('alice', 'relay', 'guardian', 'decide', 'eosio.token');
  const core = load(chain, 'daclifycore', '.artifacts/core-release/runtime'),
    endorse = load(chain, 'endorse', '.artifacts/contracts/endorse'),
    key = PrivateKey.generate('K1'),
    hash = wasmCodeHash('.artifacts/contracts/endorse.wasm');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await listFirstParty(core, 'endorse', hash);
  await send(
    core,
    'createdao',
    [
      1,
      'alice',
      JSON.stringify({
        schemaVersion: 4,
        title: 'Private DAO',
        description: '',
        purpose: 'custom',
        setup: null,
        privateIdentity: null,
      }),
      1,
      'eosio.token',
      '4,TLOS',
    ],
    'alice@active',
  );
  await send(
    core,
    'initgov',
    [
      1,
      {
        participant_mode: 1,
        decide: 'decide',
        guardian: 'guardian',
        kind: 0,
        duration: 300,
        quorum: 5000,
        approval: 5001,
        governed_works: true,
        max_commitment: 10000,
        daily_commitment: 20000,
      },
    ],
    'alice@active',
  );
  await send(core, 'enroll', [1, 1, '', key.toPublic().toString(), 'fixture', 0], 'alice@active');
  await send(
    core,
    'setmodule',
    [1, 'endorse', 1, ['applyjoin', 'witness', 'admit'], ['admit'], hash],
    'alice@active',
  );
  const actor = { runtime: 'daclifycore', dao_id: '1', member_id: '1' },
    dao = {
      chainId: 'ab'.repeat(32),
      contract: 'daclifycore',
      daoId: '1',
      interfaceVersion: 1 as const,
    };
  let nonce = 0;
  for (const [action, fields] of [
    [
      'setadmit',
      {
        ...actor,
        enabled: true,
        source: 'endorse',
        threshold: 1,
        allow_agents: true,
        admin_override: false,
      },
    ],
    ['commitepoch', { ...actor, epoch: '1', commitment: 'ac'.repeat(32), self_grant: '{}' }],
    [
      'putjson',
      {
        ...actor,
        document_id: '42',
        version: 1,
        value: JSON.stringify({
          version: 1,
          algorithm: 'AES-256-GCM',
          iv: btoa('i'.repeat(12)),
          ciphertext: btoa('c'.repeat(32)),
        }),
        envelope_version: 1,
        key_epoch: '1',
      },
    ],
  ] as const) {
    const request = makeInstruction(
      dao,
      '1',
      String(nonce++),
      1300,
      dao.contract,
      action,
      encodeAction(action, RuntimeActionSchemas[action].parse(fields)),
    );
    await send(
      core,
      'submit',
      [request, key.signDigest(instructionDigest(request)).toString()],
      'relay@active',
    );
  }
  const applicant = PrivateKey.generate('K1').toPublic().toString();
  const apply = async (operator: string) => {
    const request = makeInstruction(
      dao,
      '1',
      String(nonce),
      1300,
      'endorse',
      'applyjoin',
      encodeEndorse('applyjoin', {
        ...actor,
        application_id: '9',
        signing_key: applicant,
        encryption_key: 'fixture',
        custody: 0,
        kind: 1,
        operator_label: operator,
        document_id: '42',
        document_version: 1,
        expires: 1300,
      }),
    );
    await send(
      core,
      'submit',
      [request, key.signDigest(instructionDigest(request)).toString()],
      'relay@active',
    );
    nonce++;
  };
  await expect(apply('secret private operator canary')).rejects.toThrow('PRIVATE_AGENT_REQUIRED');
  expect(row(endorse, 'joinapps', core.toBigInt(), 9n)).toBeUndefined();
  await apply('Agent');
  expect(row(endorse, 'joinapps', core.toBigInt(), 9n)).toMatchObject({
    kind: 1,
    operator_label: 'Agent',
    document_id: 42,
  });
});
