import { beforeEach, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { PrivateKey } from '@wharfkit/antelope';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { encodeAction, instructionDigest, makeInstruction } from '@daclify/core-protocol/sdk';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
import { PayrollTableSchemas } from '../sdk/generated/payroll-schemas.js';
let chain: Blockchain, core: ReturnType<typeof load>, payroll: ReturnType<typeof load>;
const envelope = (char: string) =>
  JSON.stringify({
    version: 1,
    algorithm: 'AES-256-GCM',
    iv: btoa(char.repeat(12)),
    ciphertext: btoa(char.repeat(32)),
  });
const ref = (version = 1) => ({
  document_id: 9,
  version,
  commitment: createHash('sha256')
    .update(envelope(String(version)))
    .digest('hex'),
  key_epoch: 1,
});
const agreement = createHash('sha256').update(envelope('a')).digest('hex');
const commit = (reference = ref()) => [
  'daclifycore',
  1,
  1,
  9,
  2,
  '1.0000 TLOS',
  2,
  86400,
  1060,
  reference,
  42,
  1,
  agreement,
  0,
];
const totals = () =>
  z
    .object({ available: z.number(), reserved: z.number(), claims: z.number() })
    .parse(row(core, 'daos', core.toBigInt(), 1n));
beforeEach(async () => {
  chain = new Blockchain();
  chain.setTime(TimePointSec.from(1000));
  chain.createAccounts('alice', 'bob', 'relay');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  payroll = load(chain, 'payroll', '.artifacts/contracts/payroll');
  const token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken'),
    key = PrivateKey.generate('K1'),
    hash = wasmCodeHash('.artifacts/contracts/payroll.wasm');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await listFirstParty(core, 'payroll', hash);
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
  for (const id of [1, 2])
    await send(
      core,
      'enroll',
      [1, id, '', (id === 1 ? key : PrivateKey.generate('K1')).toPublic().toString(), 'fixture', 0],
      'alice@active',
    );
  await send(
    core,
    'setmodule',
    [
      1,
      'payroll',
      1,
      ['commit', 'commitdoc', 'commitpriv', 'edit', 'editpriv'],
      ['reserve', 'approve'],
      hash,
    ],
    'alice@active',
  );
  const dao = {
      chainId: 'ab'.repeat(32),
      contract: 'daclifycore',
      daoId: '1',
      interfaceVersion: 1 as const,
    },
    actor = { runtime: dao.contract, dao_id: '1', member_id: '1' };
  let nonce = 0;
  for (const [action, fields] of [
    ['commitepoch', { ...actor, epoch: '1', commitment: 'ac'.repeat(32), self_grant: '{}' }],
    ...[1, 2].map(
      (version) =>
        [
          'putjson',
          {
            ...actor,
            document_id: '9',
            version,
            value: envelope(String(version)),
            envelope_version: 1,
            key_epoch: '1',
          },
        ] as const,
    ),
    [
      'putjson',
      {
        ...actor,
        document_id: '42',
        version: 1,
        value: envelope('a'),
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
      encodeAction(action, fields),
    );
    await send(
      core,
      'submit',
      [request, key.signDigest(instructionDigest(request)).toString()],
      'relay@active',
    );
  }
  await send(token, 'create', ['alice', '1000.0000 TLOS'], 'eosio.token@active');
  await send(token, 'issue', ['alice', '100.0000 TLOS', ''], 'alice@active');
  await send(token, 'transfer', ['alice', 'daclifycore', '10.0000 TLOS', 'dao:1'], 'alice@active');
});
it('pins an encrypted agreed name and edits only its display reference without changing approved debt', async () => {
  await send(payroll, 'commitpriv', commit(), 'daclifycore@active');
  const terms = row(payroll, 'payterms', core.toBigInt(), 9n),
    debt = row(core, 'obligations', 1n, 1n);
  expect(terms).toMatchObject({
    label: 'Private payroll',
    private_label: ref(),
    schema_version: 2,
  });
  expect(totals()).toMatchObject({ available: 80000, reserved: 20000 });
  await send(payroll, 'edit', ['daclifycore', 1, 1, 9, 1, 'Private payroll'], 'daclifycore@active');
  await send(payroll, 'editpriv', ['daclifycore', 1, 1, 9, ref(2)], 'daclifycore@active');
  expect(row(payroll, 'payterms', core.toBigInt(), 9n)).toEqual(terms);
  expect(row(core, 'obligations', 1n, 1n)).toEqual(debt);
  expect(row(payroll, 'controls', core.toBigInt(), 9n)).toMatchObject({
    paused: 1,
    label: 'Private payroll',
    private_label: ref(2),
  });
  await send(payroll, 'backfillrefs', ['daclifycore', 1], 'daclifycore@active');
  const scans = core.tables.docscan;
  if (!scans) throw Error('fixture docscan');
  expect(
    z.array(z.object({ table: z.string(), complete: z.boolean() })).parse(scans(1n).getTableRows()),
  ).toEqual(
    expect.arrayContaining([
      { table: 'controls', complete: true },
      { table: 'payterms', complete: true },
    ]),
  );
  await expect(
    send(payroll, 'edit', ['daclifycore', 1, 1, 9, 0, 'secret label canary'], 'daclifycore@active'),
  ).rejects.toThrow('PRIVATE_PAYROLL_REQUIRED');
  await send(payroll, 'edit', ['daclifycore', 1, 1, 9, 1, 'Private payroll'], 'daclifycore@active');
  expect(row(payroll, 'controls', core.toBigInt(), 9n)).toMatchObject({
    paused: 1,
    private_label: ref(2),
  });
});
it('rolls back all funding for a substituted label, wrong epoch or another schedule parent', async () => {
  for (const [reference, failure] of [
    [{ ...ref(), commitment: '00'.repeat(32) }, 'PRIVATE_CONTENT_REFERENCE'],
    [{ ...ref(), key_epoch: 2 }, 'PRIVATE_CONTENT_EPOCH'],
    [{ ...ref(), document_id: 42, commitment: agreement }, 'PRIVATE_PAYROLL_PARENT'],
  ] as const) {
    await expect(
      send(payroll, 'commitpriv', commit(reference), 'daclifycore@active'),
    ).rejects.toThrow(failure);
    expect(totals()).toMatchObject({ available: 100000, reserved: 0 });
    expect(row(payroll, 'schedules', core.toBigInt(), 9n)).toBeUndefined();
  }
});
it('blocks new public names and releases encrypted references only after all installments settle', async () => {
  const publicCommit = [...commit().slice(0, 9), 'secret agreed label canary', 42, 1, agreement, 0];
  await expect(send(payroll, 'commitdoc', publicCommit, 'daclifycore@active')).rejects.toThrow(
    'PRIVATE_PAYROLL_REQUIRED',
  );
  await send(payroll, 'commitpriv', commit(), 'daclifycore@active');
  await expect(send(payroll, 'releaseterms', ['daclifycore', 1, 9], 'bob@active')).rejects.toThrow(
    'PAYROLL_UNSETTLED',
  );
  await expect(send(payroll, 'releaselabel', ['daclifycore', 1, 9], 'bob@active')).rejects.toThrow(
    'PAYROLL_UNSETTLED',
  );
  chain.addTime(TimePointSec.from(86461));
  await send(payroll, 'settle', ['daclifycore', 1, 1], 'bob@active');
  expect(totals()).toMatchObject({ available: 80000, reserved: 0, claims: 20000 });
  await send(payroll, 'releaseterms', ['daclifycore', 1, 9], 'bob@active');
  await send(payroll, 'releaselabel', ['daclifycore', 1, 9], 'bob@active');
  expect(
    PayrollTableSchemas.controls.parse(row(payroll, 'controls', core.toBigInt(), 9n)).private_label,
  ).toBeUndefined();
  const table = core.tables.docrefs;
  if (!table) throw Error('fixture docrefs');
  expect(
    z
      .array(z.object({ document_id: z.coerce.string() }))
      .parse(table(1n).getTableRows())
      .every((row) => row.document_id === '0'),
  ).toBe(true);
  expect(row(payroll, 'payterms', core.toBigInt(), 9n)).toMatchObject({
    private_label: ref(),
    references_released: true,
  });
});
