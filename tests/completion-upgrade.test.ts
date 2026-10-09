import { Blockchain } from '@proton/vert';
import { PrivateKey } from '@wharfkit/antelope';
import { expect, it } from 'vitest';
import { RuntimeTableSchemas } from '@daclify/core-protocol/sdk';
import { load, send, row, listFirstParty, replaceContract } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';

it('adopts missing completion rows in an actual metered release without rescanning its occupied state', async () => {
  const chain = new Blockchain();
  chain.createAccounts('alice', 'bob', 'relay');
  const old = '.artifacts/document-upgrade-old';
  const core = load(chain, 'daclifycore', old + '/runtime');
  const previous = (name: string) =>
    name === 'decide' ? '.artifacts/archive-upgrade-old/decide' : old + '/' + name;
  const sources = ['works', 'payroll', 'decide'].map((name) => ({
    name,
    account: load(chain, name, previous(name)),
  }));
  const token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await send(core, 'initramobs', [], 'daclifycore@active');
  for (const source of sources) {
    const hash = wasmCodeHash(previous(source.name) + '.wasm');
    await listFirstParty(core, source.name, hash);
    await send(core, 'setramcode', [source.name, hash], 'daclifycore@active');
  }
  await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  for (const id of [1, 2])
    await send(
      core,
      'enroll',
      [1, id, '', PrivateKey.generate('K1').toPublic().toString(), 'original identity', 0],
      'alice@active',
    );
  for (const source of sources)
    await send(
      core,
      'setmodule',
      [
        1,
        source.name,
        1,
        source.name === 'works'
          ? ['propose', 'accept', 'submitwork', 'review']
          : source.name === 'payroll'
            ? ['commit']
            : ['open', 'vote'],
        source.name === 'decide' ? ['govlock'] : ['reserve', 'approve'],
        wasmCodeHash(previous(source.name) + '.wasm'),
      ],
      'alice@active',
    );
  await send(token, 'create', ['alice', '1000.0000 TLOS'], 'eosio.token@active');
  await send(token, 'issue', ['alice', '100.0000 TLOS', ''], 'alice@active');
  await send(token, 'transfer', ['alice', 'daclifycore', '10.0000 TLOS', 'dao:1'], 'alice@active');
  await send(core, 'putjson', ['daclifycore', 1, 1, 1, 1, '{}', 0, 0], 'daclifycore@active');
  const works = sources[0]?.account,
    payroll = sources[1]?.account,
    decide = sources[2]?.account;
  if (!works || !payroll || !decide) throw new Error('COMPLETION_FIXTURE_REQUIRED');
  await send(
    works,
    'propose',
    ['daclifycore', 1, 1, 1, 2, 1, 1, ['1.0000 TLOS'], [0]],
    'daclifycore@active',
  );
  await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
  await send(
    payroll,
    'commit',
    ['daclifycore', 1, 1, 1, 2, '1.0000 TLOS', 1, 86400, 60],
    'daclifycore@active',
  );
  await send(
    decide,
    'open',
    ['daclifycore', 1, 1, 1, 0, 2, 300, 5000, 5001, '{}'],
    'daclifycore@active',
  );
  const original = {
    milestone: row(works, 'milestones', core.toBigInt(), 1n),
    schedule: row(payroll, 'schedules', core.toBigInt(), 1n),
    ballot: row(decide, 'ballots', core.toBigInt(), 1n),
    member: row(core, 'members', 1n, 2n),
  };
  replaceContract(core, '.artifacts/core-release/runtime');
  await send(
    core,
    'rebindramobs',
    [wasmCodeHash(old + '/runtime.wasm'), wasmCodeHash('.artifacts/core-release/runtime.wasm')],
    'daclifycore@active',
  );
  for (const source of sources) {
    replaceContract(source.account, '.artifacts/contracts/' + source.name);
    const hash = wasmCodeHash('.artifacts/contracts/' + source.name + '.wasm');
    await send(core, 'setramcode', [source.name, hash], 'daclifycore@active');
    await listFirstParty(core, source.name, hash);
    await send(
      core,
      'setmodule',
      [
        1,
        source.name,
        1,
        source.name === 'works'
          ? ['propose', 'accept', 'submitwork', 'review']
          : source.name === 'payroll'
            ? ['commit']
            : ['open', 'vote'],
        source.name === 'decide' ? ['govlock'] : ['reserve', 'approve'],
        hash,
      ],
      'alice@active',
    );
  }
  await expect(send(works, 'checkquota', ['daclifycore', 1], 'daclifycore@active')).rejects.toThrow(
    'RAM_WORK_REFS_REQUIRED',
  );
  await expect(
    send(payroll, 'checkquota', ['daclifycore', 1], 'daclifycore@active'),
  ).rejects.toThrow('RAM_PAYROLL_CONTROL_REQUIRED');
  await expect(
    send(decide, 'checkquota', ['daclifycore', 1], 'daclifycore@active'),
  ).rejects.toThrow('RAM_POLL_END_REQUIRED');
  const before = RuntimeTableSchemas.ramstats.parse(row(core, 'ramstats', 1n, core.toBigInt()));
  for (const claims of [false, true]) {
    await send(core, 'adoptram', [1, claims, 1], 'daclifycore@active');
    await send(core, 'adoptram', [1, claims, 1], 'daclifycore@active');
  }
  for (const [source, table] of [
    [works, 'adoptwork'],
    [payroll, 'adoptpay'],
    [decide, 'adoptpolls'],
  ] as const) {
    await expect(
      send(source, 'scanram', ['daclifycore', table, 26], 'daclifycore@active'),
    ).rejects.toThrow('RAM_MIGRATION_BATCH');
    await send(source, 'scanram', ['daclifycore', table, 1], 'daclifycore@active');
    await send(source, 'checkquota', ['daclifycore', 1], 'daclifycore@active');
  }
  expect({
    milestone: row(works, 'milestones', core.toBigInt(), 1n),
    schedule: row(payroll, 'schedules', core.toBigInt(), 1n),
    ballot: row(decide, 'ballots', core.toBigInt(), 1n),
    member: row(core, 'members', 1n, 2n),
  }).toEqual(original);
  const after = RuntimeTableSchemas.ramstats.parse(row(core, 'ramstats', 1n, core.toBigInt()));
  expect(BigInt(after.identity)).toBeGreaterThan(BigInt(before.identity));
  expect(BigInt(after.retained)).toBeGreaterThan(BigInt(before.retained));
  const counters = sources.map((source) =>
    source.account.tables.ramcursors?.(core.toBigInt()).getTableRows(),
  );
  for (const [source, table] of [
    [works, 'adoptwork'],
    [payroll, 'adoptpay'],
    [decide, 'adoptpolls'],
  ] as const)
    await send(source, 'scanram', ['daclifycore', table, 1], 'daclifycore@active');
  for (const claims of [false, true])
    await send(core, 'adoptram', [1, claims, 1], 'daclifycore@active');
  expect(RuntimeTableSchemas.ramstats.parse(row(core, 'ramstats', 1n, core.toBigInt()))).toEqual(
    after,
  );
  expect(
    sources.map((source) => source.account.tables.ramcursors?.(core.toBigInt()).getTableRows()),
  ).toEqual(counters);
});
