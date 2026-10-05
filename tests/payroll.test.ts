import { beforeEach, describe, it, expect } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { PrivateKey } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row } from './helpers/vert.js';
import { ZERO_CODE_HASH, wasmCodeHash } from './helpers/code-hash.js';
const payrollHash = wasmCodeHash('.artifacts/contracts/payroll.wasm');
let chain: Blockchain;
let core: ReturnType<typeof load>;
let payroll: ReturnType<typeof load>;
let token: ReturnType<typeof load>;
beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'bob');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  payroll = load(chain, 'payroll', '.artifacts/contracts/payroll');
  token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
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
    [1, 'payroll', 1, ['commit'], ['reserve', 'approve'], payrollHash],
    'alice@active',
  );
  await send(token, 'create', ['alice', '1000.0000 TLOS'], 'eosio.token@active');
  await send(token, 'issue', ['alice', '100.0000 TLOS', ''], 'alice@active');
  await send(token, 'transfer', ['alice', 'daclifycore', '10.0000 TLOS', 'dao:1'], 'alice@active');
});
const commit = (quantity = '1.0000 TLOS', periods = 2, interval = 86400) => [
  'daclifycore',
  1,
  1,
  1,
  2,
  quantity,
  periods,
  interval,
  Math.floor(chain.timestamp.toMilliseconds() / 1000) + 60,
];
const totals = () =>
  z
    .object({ available: z.number(), reserved: z.number(), claims: z.number() })
    .parse(row(core, 'daos', core.toBigInt(), 1n));
describe('fixed-term funded payroll', () => {
  it('reserves and approves the entire bounded commitment', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    expect(totals()).toMatchObject({ available: 80000, reserved: 20000, claims: 0 });
  });
  it('requires administrator permission', async () => {
    const data = commit();
    data[2] = 2;
    await expect(send(payroll, 'commit', data, 'daclifycore@active')).rejects.toThrow(
      'ADMIN_REQUIRED',
    );
  });
  it('rejects unfunded schedules atomically', async () => {
    await expect(
      send(payroll, 'commit', commit('6.0000 TLOS'), 'daclifycore@active'),
    ).rejects.toThrow('INSUFFICIENT_AVAILABLE');
    expect(totals()).toMatchObject({ available: 100000, reserved: 0 });
  });
  it('rejects duplicate schedules', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    await expect(send(payroll, 'commit', commit(), 'daclifycore@active')).rejects.toThrow(
      'SCHEDULE_EXISTS',
    );
  });
  it('bounds periods and frequency', async () => {
    await expect(
      send(payroll, 'commit', commit('1.0000 TLOS', 13), 'daclifycore@active'),
    ).rejects.toThrow('PAYROLL_LIMIT');
    await expect(
      send(payroll, 'commit', commit('1.0000 TLOS', 2, 1), 'daclifycore@active'),
    ).rejects.toThrow('PAYROLL_LIMIT');
  });
  it('cannot settle before the due date', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    await expect(send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active')).rejects.toThrow(
      'NOT_PAYABLE',
    );
  });
  it('settles a due installment once', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    chain.addTime(TimePointSec.from(61));
    await send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active');
    expect(totals()).toMatchObject({ reserved: 10000, claims: 10000 });
    await expect(send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active')).rejects.toThrow(
      'NOT_PAYABLE',
    );
  });
  it('pays only the oldest missed period', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    chain.addTime(TimePointSec.from(61 + 86400));
    await expect(send(payroll, 'settle', ['daclifycore', 1, 2], 'bob@active')).rejects.toThrow(
      'PAYROLL_OLDEST',
    );
    await send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active');
    await send(payroll, 'settle', ['daclifycore', 1, 2], 'bob@active');
  });
  it('preserves due commitments after module removal and offboarding', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    await send(core, 'setmodule', [1, 'payroll', 1, [], [], ZERO_CODE_HASH], 'alice@active');
    await send(core, 'setactive', ['daclifycore', 1, 1, 2, false], 'daclifycore@active');
    chain.addTime(TimePointSec.from(61));
    await send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active');
    expect(totals().claims).toBe(10000);
  });
});
