import { it, expect } from 'vitest';
import { Blockchain } from '@proton/vert';
import { encodeGrants, encodeDecide, encodeEndorse } from '../sdk/index.js';
import { encodeAction, makeInstruction, instructionDigest } from '@daclify/core-protocol/sdk';
import { PrivateKey } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
import { ModulePermissions } from '../protocol/index.js';
it('isolates new module records for two independent runtimes with identical DAO and record IDs and no Hub', async () => {
  const chain = new Blockchain();
  chain.createAccounts('alice', 'relay');
  load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  const contracts = {
    decide: load(chain, 'decide', '.artifacts/contracts/decide'),
    works: load(chain, 'works', '.artifacts/contracts/works'),
    grants: load(chain, 'grants', '.artifacts/contracts/grants'),
    endorse: load(chain, 'endorse', '.artifacts/contracts/endorse'),
  };
  const runtimes = [
    load(chain, 'daoone', '.artifacts/core-release/runtime'),
    load(chain, 'daotwo', '.artifacts/core-release/runtime'),
  ];
  for (const [index, core] of runtimes.entries()) {
    const runtime = core.name.toString(),
      key = PrivateKey.generate('K1');
    async function act(target: string, action: string, data: Uint8Array) {
      const member = z.object({ nonce: z.number() }).parse(row(core, 'members', 1n, 1n));
      const request = makeInstruction(
        { chainId: 'ab'.repeat(32), contract: runtime, daoId: '1', interfaceVersion: 1 },
        '1',
        String(member.nonce),
        Math.floor(chain.timestamp.toMilliseconds() / 1000) + 300,
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
    const actor = { runtime, dao_id: '1', member_id: '1' };
    await send(core, 'init', ['ab'.repeat(32)], runtime + '@active');
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
          duration: 300,
          quorum: 5000,
          approval: 5001,
          governed_works: true,
          max_commitment: 100000,
          daily_commitment: 300000,
        },
      ],
      'alice@active',
    );
    await send(core, 'enroll', [1, 1, '', key.toPublic().toString(), 'fixture', 0], 'alice@active');
    for (const name of ['decide', 'works', 'grants', 'endorse'] as const) {
      const id =
        name === 'grants' ? 'grants-rounds' : name === 'endorse' ? 'endorsement-admission' : name;
      const hash = wasmCodeHash('.artifacts/contracts/' + name + '.wasm');
      await listFirstParty(core, name, hash);
      await send(
        core,
        'setmodule',
        [1, name, 1, [...ModulePermissions[id].actions], [...ModulePermissions[id].grants], hash],
        'alice@active',
      );
    }
    await act(
      runtime,
      'putjson',
      encodeAction('putjson', {
        ...actor,
        document_id: '1',
        version: 1,
        value: '{"terms":"Runtime-specific rules"}',
        envelope_version: 0,
        key_epoch: '0',
      }),
    );
    const now = Math.floor(chain.timestamp.toMilliseconds() / 1000);
    await act(
      'grants',
      'newround',
      encodeGrants('newround', {
        ...actor,
        round_id: '1',
        document_id: '1',
        document_version: 1,
        applications_close: now + 1000,
        review_close: now + 2000,
        awards_close: now + 3000,
        maximum: `${index + 1}.0000 TLOS`,
        allow_agents: false,
        works: 'works',
      }),
    );
    await act(
      'decide',
      'newelect',
      encodeDecide('newelect', {
        ...actor,
        election_id: '1',
        title: `Council ${index}`,
        document_id: '1',
        document_version: 1,
        nomination_close: now + 1000,
        term_start: now + 2000,
        term_end: now + 3000,
        seats: 1,
      }),
    );
    await act(
      runtime,
      'setadmit',
      encodeAction('setadmit', {
        ...actor,
        enabled: true,
        source: 'endorse',
        threshold: 1,
        allow_agents: false,
        admin_override: false,
      }),
    );
    await act(
      'endorse',
      'applyjoin',
      encodeEndorse('applyjoin', {
        ...actor,
        application_id: '1',
        signing_key: PrivateKey.generate('K1').toPublic().toString(),
        encryption_key: 'public-key',
        custody: 0,
        kind: 0,
        operator_label: '',
        document_id: '1',
        document_version: 1,
        expires: now + 1000,
      }),
    );
  }
  for (const [index, core] of runtimes.entries()) {
    expect(
      z.object({ maximum: z.string() }).parse(row(contracts.grants, 'rounds', core.toBigInt(), 1n))
        .maximum,
    ).toBe(`${index + 1}.0000 TLOS`);
    expect(
      z.object({ title: z.string() }).parse(row(contracts.decide, 'elections', core.toBigInt(), 1n))
        .title,
    ).toBe(`Council ${index}`);
    expect(
      z
        .object({ id: z.number(), admitted: z.boolean() })
        .parse(row(contracts.endorse, 'joinapps', core.toBigInt(), 1n)),
    ).toEqual({ id: 1, admitted: false });
  }
});
