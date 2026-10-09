import { Blockchain } from '@proton/vert';
import { PrivateKey } from '@wharfkit/antelope';
import { expect, it } from 'vitest';
import { z } from 'zod';
import { RuntimeTableSchemas } from '@daclify/core-protocol/sdk';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';

it.each([false, true])(
  'checks accepted-work reserves before quota activation (observed=%s)',
  async (observed) => {
    const chain = new Blockchain();
    chain.createAccounts('alice', 'bob');
    const core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
    const works = load(chain, 'works', '.artifacts/contracts/works');
    const token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
    const hash = wasmCodeHash('.artifacts/contracts/works.wasm');
    await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
    if (observed) await send(core, 'initramobs', [], 'daclifycore@active');
    await listFirstParty(core, 'works', hash);
    if (observed) await send(core, 'setramcode', ['works', hash], 'daclifycore@active');
    await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
    for (const id of [1, 2])
      await send(
        core,
        'enroll',
        [1, id, '', PrivateKey.generate('K1').toPublic().toString(), 'key', 0],
        'alice@active',
      );
    await send(
      core,
      'setmodule',
      [1, 'works', 1, ['propose', 'accept', 'submitwork', 'review'], ['reserve', 'approve'], hash],
      'alice@active',
    );
    await send(token, 'create', ['alice', '1000.0000 TLOS'], 'eosio.token@active');
    await send(token, 'issue', ['alice', '100.0000 TLOS', ''], 'alice@active');
    await send(
      token,
      'transfer',
      ['alice', 'daclifycore', '10.0000 TLOS', 'dao:1'],
      'alice@active',
    );
    for (const id of [1, 2])
      await send(core, 'putjson', ['daclifycore', 1, 1, id, 1, '{}', 0, 0], 'daclifycore@active');
    await send(
      works,
      'propose',
      ['daclifycore', 1, 2, 1, 2, 1, 1, ['1.0000 TLOS'], [0]],
      'daclifycore@active',
    );
    await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    await expect(send(works, 'checkquota', ['daclifycore', 1], 'alice@active')).rejects.toThrow(
      'missing required authority',
    );
    if (!observed) {
      await expect(
        send(works, 'checkquota', ['daclifycore', 1], 'daclifycore@active'),
      ).rejects.toThrow('RAM_WORK_REFS_REQUIRED');
      return;
    }
    await send(works, 'checkquota', ['daclifycore', 1], 'daclifycore@active');
    await send(core, 'createdao', [2, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
    await send(
      core,
      'enroll',
      [2, 1, '', PrivateKey.generate('K1').toPublic().toString(), 'key', 0],
      'alice@active',
    );
    await send(core, 'setmodule', [2, 'works', 1, ['propose'], [], hash], 'alice@active');
    await send(core, 'putjson', ['daclifycore', 2, 1, 1, 1, '{}', 0, 0], 'daclifycore@active');
    for (let project = 2; project <= 314; project++)
      await send(
        works,
        'propose',
        [
          'daclifycore',
          2,
          1,
          project,
          1,
          1,
          1,
          Array.from({ length: 16 }, () => '1.0000 TLOS'),
          Array.from({ length: 16 }, () => 0),
        ],
        'daclifycore@active',
      );
    await send(works, 'checkquota', ['daclifycore', 1], 'daclifycore@active');
    const refs = core.tables.docrefs;
    if (!refs) throw new Error('DOCUMENT_REFERENCE_LEDGER_MISSING');
    const slots = z
      .array(RuntimeTableSchemas.docrefs)
      .parse(refs(1n).getTableRows())
      .filter((value) => value.table === 'milestones');
    expect(slots).toHaveLength(2);
    expect(slots.map((value) => [value.slot, value.document_id, value.version])).toEqual([
      [0, '0', 0],
      [1, '0', 0],
    ]);
    const before = RuntimeTableSchemas.ramstats.parse(row(core, 'ramstats', 1n, core.toBigInt()));
    const hold = row(core, 'ramholds', 1n, 1n);
    for (const approved of [false, true]) {
      await send(
        works,
        'submitwork',
        ['daclifycore', 1, 2, 1, approved ? 2 : 1, 1],
        'daclifycore@active',
      );
      await send(
        works,
        'review',
        ['daclifycore', 1, 1, 1, approved, approved ? 2 : 1, 1],
        'daclifycore@active',
      );
    }
    expect(RuntimeTableSchemas.ramstats.parse(row(core, 'ramstats', 1n, core.toBigInt()))).toEqual(
      before,
    );
    expect(row(core, 'ramholds', 1n, 1n)).toEqual(hold);
    expect(
      z
        .array(RuntimeTableSchemas.docrefs)
        .parse(refs(1n).getTableRows())
        .filter((value) => value.table === 'milestones')
        .map((value) => value.id),
    ).toEqual(slots.map((value) => value.id));
    await expect(
      send(core, 'docref', [1, 'works', 'milestones', 1, 0, 2, 1], 'works@active'),
    ).rejects.toThrow('DOCUMENT_SOURCE_SENDER');
  },
  60000,
);
