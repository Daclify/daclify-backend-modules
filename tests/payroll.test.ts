import { beforeEach, describe, it, expect } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { ABI, PrivateKey, Serializer } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { ZERO_CODE_HASH, wasmCodeHash } from './helpers/code-hash.js';
import { PayrollTableSchemas, payrollAbi } from '../sdk/index.js';
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
  await listFirstParty(core, 'payroll', payrollHash);
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
  it('allocates its fixed control row when work is accepted and keeps its size stable on first settlement', async () => {
    await send(payroll, 'commit', commit('1.0000 TLOS', 1), 'daclifycore@active');
    const before = PayrollTableSchemas.controls.parse(
      row(payroll, 'controls', core.toBigInt(), 1n),
    );
    expect(before).toMatchObject({ schedule_id: '1', paused: 0, last_payout: 0, label: '' });
    chain.addTime(TimePointSec.from(61));
    await send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active');
    const after = PayrollTableSchemas.controls.parse(row(payroll, 'controls', core.toBigInt(), 1n));
    expect(after).toMatchObject({ schedule_id: '1', paused: 0, label: '' });
    const abi = ABI.from(payrollAbi);
    expect(Serializer.encode({ abi, type: 'control_record', object: after }).array.length).toBe(
      Serializer.encode({ abi, type: 'control_record', object: before }).array.length,
    );
    expect(totals().claims).toBe(10000);
  });
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
      send(payroll, 'commit', commit('1.0000 TLOS', 0), 'daclifycore@active'),
    ).rejects.toThrow('PAYROLL_LIMIT');
    await expect(
      send(payroll, 'commit', commit('1.0000 TLOS', 2, 1), 'daclifycore@active'),
    ).rejects.toThrow('PAYROLL_LIMIT');
    await expect(
      send(payroll, 'commit', commit('1.0000 TLOS', 1, 2678401), 'daclifycore@active'),
    ).rejects.toThrow('PAYROLL_LIMIT');
    chain.addTime(TimePointSec.from(120));
    const now = Math.floor(chain.timestamp.toMilliseconds() / 1000);
    const past = commit('1.0000 TLOS', 1);
    past[8] = now - 1;
    await expect(send(payroll, 'commit', past, 'daclifycore@active')).rejects.toThrow(
      'PAYROLL_START',
    );
    const distant = commit('1.0000 TLOS', 1);
    distant[8] = now + 2678401;
    await expect(send(payroll, 'commit', distant, 'daclifycore@active')).rejects.toThrow(
      'PAYROLL_START',
    );
  });
  it('pays a one-time installment once the single period is due', async () => {
    await send(payroll, 'commit', commit('1.0000 TLOS', 1, 2678400), 'daclifycore@active');
    expect(totals()).toMatchObject({ available: 90000, reserved: 10000, claims: 0 });
    chain.addTime(TimePointSec.from(61));
    await send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active');
    expect(totals()).toMatchObject({ available: 90000, reserved: 0, claims: 10000 });
    await expect(send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active')).rejects.toThrow(
      'NOT_PAYABLE',
    );
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
  it('pays every due installment in one settlement and leaves a future one', async () => {
    await send(payroll, 'commit', commit('1.0000 TLOS', 3), 'daclifycore@active');
    chain.addTime(TimePointSec.from(61 + 86400));
    await send(payroll, 'settle', ['daclifycore', 1, 3], 'bob@active');
    expect(totals()).toMatchObject({ available: 70000, reserved: 10000, claims: 20000 });
    await expect(send(payroll, 'settle', ['daclifycore', 1, 3], 'bob@active')).rejects.toThrow(
      'NOT_PAYABLE',
    );
    chain.addTime(TimePointSec.from(86400));
    await send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active');
    expect(totals()).toMatchObject({ reserved: 0, claims: 30000 });
  });
  it('pauses every outstanding installment and keeps an editable label', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    await expect(
      send(payroll, 'edit', ['daclifycore', 1, 1, 1, 1, 'Contributor'], 'daclifycore@active'),
    ).rejects.toThrow('MODULE_ACTION');
    await send(
      core,
      'setmodule',
      [1, 'payroll', 1, ['commit', 'edit'], ['reserve', 'approve'], payrollHash],
      'alice@active',
    );
    const denied = ['daclifycore', 1, 2, 1, 1, 'Contributor'];
    await expect(send(payroll, 'edit', denied, 'daclifycore@active')).rejects.toThrow(
      'ADMIN_REQUIRED',
    );
    await send(payroll, 'edit', ['daclifycore', 1, 1, 1, 1, 'Contributor'], 'daclifycore@active');
    chain.addTime(TimePointSec.from(61 + 86400));
    await expect(send(payroll, 'settle', ['daclifycore', 1, 2], 'bob@active')).rejects.toThrow(
      'PAYROLL_PAUSED',
    );
    expect(totals()).toMatchObject({ reserved: 20000, claims: 0 });
    await send(payroll, 'edit', ['daclifycore', 1, 1, 1, 0, 'Contributor'], 'daclifycore@active');
    await send(payroll, 'settle', ['daclifycore', 1, 2], 'bob@active');
    expect(totals()).toMatchObject({ reserved: 0, claims: 20000 });
    const control = z
      .object({ paused: z.number(), label: z.string(), last_payout: z.number() })
      .parse(row(payroll, 'controls', core.toBigInt(), 1n));
    expect(control).toMatchObject({ paused: 0, label: 'Contributor' });
    expect(control.last_payout).toBeGreaterThan(0);
    const schedule = z
      .object({ quantity: z.string(), recipient: z.number() })
      .parse(row(payroll, 'schedules', core.toBigInt(), 1n));
    expect(schedule).toMatchObject({ quantity: '1.0000 TLOS', recipient: 2 });
  });
  it('rejects a pause flag or label outside the payroll bounds', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    await send(
      core,
      'setmodule',
      [1, 'payroll', 1, ['commit', 'edit'], ['reserve', 'approve'], payrollHash],
      'alice@active',
    );
    await expect(
      send(payroll, 'edit', ['daclifycore', 1, 1, 1, 2, 'Contributor'], 'daclifycore@active'),
    ).rejects.toThrow('PAYROLL_STATE');
    await expect(
      send(payroll, 'edit', ['daclifycore', 1, 1, 1, 0, 'x'.repeat(81)], 'daclifycore@active'),
    ).rejects.toThrow('PAYROLL_LABEL');
  });
  it('keeps a pause after the module is removed', async () => {
    await send(payroll, 'commit', commit(), 'daclifycore@active');
    await send(
      core,
      'setmodule',
      [1, 'payroll', 1, ['commit', 'edit'], ['reserve', 'approve'], payrollHash],
      'alice@active',
    );
    await send(payroll, 'edit', ['daclifycore', 1, 1, 1, 1, 'Held'], 'daclifycore@active');
    await send(core, 'setmodule', [1, 'payroll', 1, [], [], ZERO_CODE_HASH], 'alice@active');
    chain.addTime(TimePointSec.from(61));
    await expect(send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active')).rejects.toThrow(
      'PAYROLL_PAUSED',
    );
    expect(totals().claims).toBe(0);
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
