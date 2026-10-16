import { beforeAll, beforeEach, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { PrivateKey } from '@wharfkit/antelope';
import { encodeAction, makeInstruction, instructionDigest } from '@daclify/core-protocol/sdk';
import { load, send, row, listFirstParty, replaceContract } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
import { DecideTableSchemas } from '../sdk/generated/decide-schemas.js';
import { encodeDecide } from '../sdk/index.js';
import { z } from 'zod';
let chain: Blockchain, core: ReturnType<typeof load>, decide: ReturnType<typeof load>;
let memberKey: PrivateKey;
beforeAll(() => {
  execFileSync(
    process.execPath,
    ['node_modules/tsx/dist/cli.mjs', 'tools/build-private-content-legacy.ts'],
    { stdio: 'pipe', timeout: 180000 },
  );
}, 190000);
const source = {
  schemaVersion: 4,
  title: 'Private DAO',
  description: '',
  purpose: 'custom',
  setup: null,
  privateIdentity: null,
};
const envelope = JSON.stringify({
  version: 1,
  algorithm: 'AES-256-GCM',
  iv: btoa('i'.repeat(12)),
  ciphertext: btoa('c'.repeat(32)),
});
const reference = {
  documentId: '9',
  version: 1,
  keyEpoch: '1',
  commitment: createHash('sha256').update(envelope).digest('hex'),
};
const metadata = {
  schemaVersion: 4,
  semantics: 'poll',
  options: [0, 1, 2],
  privateContent: reference,
};
async function setup(governance = false) {
  chain = new Blockchain();
  chain.setTime(TimePointSec.from(1000));
  chain.createAccounts('alice', 'relay', 'eosio.token');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  const hash = wasmCodeHash('.artifacts/contracts/decide.wasm');
  await listFirstParty(core, 'decide', hash);
  await send(
    core,
    'createdao',
    [1, 'alice', JSON.stringify(source), 1, 'eosio.token', '4,TLOS'],
    'alice@active',
  );
  if (governance) await send(core, 'initgov', [1, { participant_mode: 0, decide: 'decide', guardian: '', kind: 0, duration: 300, quorum: 5000, approval: 5001, governed_works: false, max_commitment: 0, daily_commitment: 0 }], 'alice@active');
  const key = PrivateKey.generate('K1');
  memberKey = key;
  await send(core, 'enroll', [1, 1, '', key.toPublic().toString(), 'fixture', 0], 'alice@active');
  await send(
    core,
    'setmodule',
    [1, 'decide', 1, ['open', 'openpoll', 'vote', 'votecommit'], ['govlock'], hash],
    'alice@active',
  );
  const dao = {
    chainId: 'ab'.repeat(32),
    contract: 'daclifycore',
    daoId: '1',
    interfaceVersion: 1 as const,
  };
  let nonce = 0;
  const actor = { runtime: dao.contract, dao_id: '1', member_id: '1' };
  for (const [action, bytes] of [
    [
      'commitepoch',
      encodeAction('commitepoch', {
        ...actor,
        epoch: '1',
        commitment: 'ac'.repeat(32),
        self_grant: '{}',
      }),
    ],
    [
      'putjson',
      encodeAction('putjson', {
        ...actor,
        document_id: '9',
        version: 1,
        value: envelope,
        envelope_version: 1,
        key_epoch: '1',
      }),
    ],
  ] as const) {
    const request = makeInstruction(dao, '1', String(nonce++), 1300, dao.contract, action, bytes);
    await send(
      core,
      'submit',
      [request, key.signDigest(instructionDigest(request)).toString()],
      'relay@active',
    );
  }
}
beforeEach(() => setup());
const open = (id = 9, value: unknown = metadata, choices = 3, action = 'openpoll') =>
  send(
    decide,
    action,
    ['daclifycore', 1, 1, id, 0, choices, 300, 5000, 5001, JSON.stringify(value)],
    'daclifycore@active',
  );
it('keeps private representative titles in encrypted rules while preserving the executive marker', async () => {
  await setup(true);
  await send(core, 'setmodule', [1, 'decide', 1, ['newelect'], [], wasmCodeHash('.artifacts/contracts/decide.wasm')], 'alice@active');
  const create = async (title: string) => {
    const member = z.object({ nonce: z.coerce.string() }).parse(row(core, 'members', 1n, 1n));
    const dao = { chainId: 'ab'.repeat(32), contract: 'daclifycore', daoId: '1', interfaceVersion: 1 as const };
    const request = makeInstruction(dao, '1', member.nonce, 1300, 'decide', 'newelect', encodeDecide('newelect', { runtime: dao.contract, dao_id: '1', member_id: '1', election_id: '88', title, document_id: '9', document_version: 1, nomination_close: 1100, term_start: 1500, term_end: 2500, seats: 1 }));
    await send(core, 'submit', [request, memberKey.signDigest(instructionDigest(request)).toString()], 'relay@active');
  };
  await expect(create('Private office canary')).rejects.toThrow('PRIVATE_ELECTION_REQUIRED');
  await create('Office');
  expect(DecideTableSchemas.elections.parse(row(decide, 'elections', core.toBigInt(), 88n)).title).toBe('Office');
});
it('retains the exact private body and freezes its definition without storing descriptive text', async () => {
  await open();
  const ballot = DecideTableSchemas.ballots.parse(row(decide, 'ballots', core.toBigInt(), 9n));
  expect(JSON.parse(ballot.metadata)).toEqual(metadata);
  const table = core.tables.docrefs;
  if (!table) throw Error('docrefs table missing');
  const refs = z
    .array(
      z.object({
        source: z.string(),
        table: z.string(),
        document_id: z.coerce.string(),
        version: z.number(),
      }),
    )
    .parse(table(1n).getTableRows());
  expect(refs).toContainEqual(
    expect.objectContaining({
      source: 'decide',
      table: 'ballotdefs',
      document_id: '9',
      version: 1,
    }),
  );
  const definition = DecideTableSchemas.ballotdefs.parse(
    row(decide, 'ballotdefs', core.toBigInt(), 9n),
  );
  expect(definition.version).toBe(3);
  await expect(
    send(decide, 'vote', ['daclifycore', 1, 1, 9, 0], 'daclifycore@active'),
  ).rejects.toThrow('BALLOT_COMMITMENT_REQUIRED');
  await send(
    decide,
    'votecommit',
    ['daclifycore', 1, 1, 9, definition.commitment, 2],
    'daclifycore@active',
  );
  chain.addTime(TimePointSec.from(301));
  await send(decide, 'finalize', ['daclifycore', 1, 9], 'alice@active');
  expect(table(1n).getTableRows().length).toBe(refs.length);
});
it('rejects copied parent IDs, changed commitments/epochs, reordered IDs and leaked fields atomically', async () => {
  for (const [id, changed] of [
    [10, metadata],
    [9, { ...metadata, privateContent: { ...reference, commitment: '00'.repeat(32) } }],
    [9, { ...metadata, privateContent: { ...reference, keyEpoch: '2' } }],
    [9, { ...metadata, options: [1, 0, 2] }],
    [9, { ...metadata, title: 'Private leak canary' }],
  ] as const) {
    await expect(open(id, changed)).rejects.toThrow();
    expect(row(decide, 'ballots', core.toBigInt(), BigInt(id))).toBeUndefined();
  }
});
it('refuses old plaintext writers in a confidential DAO unless public disclosure is explicit', async () => {
  const publicText = {
    schemaVersion: 3,
    semantics: 'proposal',
    title: 'Public question',
    description: 'Explicit public question',
    options: ['Reject', 'Approve'],
  };
  await expect(open(10, publicText, 2, 'open')).rejects.toThrow('PRIVATE_BALLOT_REQUIRED');
  await open(10, { ...publicText, publicDisclosure: true }, 2, 'open');
});

it('preserves legacy custom metadata4 and its frozen meaning during bounded private-reference backfill', async () => {
  const latest = wasmCodeHash('.artifacts/contracts/decide.wasm'),
    old = wasmCodeHash('.artifacts/private-content-legacy/decide.wasm');
  replaceContract(decide, '.artifacts/private-content-legacy/decide');
  await listFirstParty(core, 'decide', old);
  await send(
    core,
    'setmodule',
    [1, 'decide', 1, ['open', 'openpoll', 'votecommit'], ['govlock'], old],
    'alice@active',
  );
  const text = {
    schemaVersion: 4,
    title: 'Legacy custom public wording',
    options: ['Friday', 'Saturday', 'Sunday'],
  };
  await open(10, text);
  const before = DecideTableSchemas.ballotdefs.parse(
    row(decide, 'ballotdefs', core.toBigInt(), 10n),
  );
  expect(before.version).toBe(1);
  replaceContract(decide, '.artifacts/contracts/decide');
  await listFirstParty(core, 'decide', latest);
  await send(
    core,
    'setmodule',
    [1, 'decide', 1, ['open', 'openpoll', 'votecommit'], ['govlock'], latest],
    'alice@active',
  );
  await send(decide, 'backfillrefs', ['daclifycore', 1, 'ballotdefs', 1], 'daclifycore@active');
  expect(
    DecideTableSchemas.ballotdefs.parse(row(decide, 'ballotdefs', core.toBigInt(), 10n)),
  ).toEqual(before);
  expect(
    DecideTableSchemas.ballots.parse(row(decide, 'ballots', core.toBigInt(), 10n)).metadata,
  ).toBe(JSON.stringify(text));
  await send(
    decide,
    'votecommit',
    ['daclifycore', 1, 1, 10, before.commitment, 1],
    'daclifycore@active',
  );
});
