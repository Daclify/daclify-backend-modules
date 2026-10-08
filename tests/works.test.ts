import { beforeEach, describe, it, expect } from 'vitest';
import { Blockchain } from '@proton/vert';
import { PrivateKey } from '@wharfkit/antelope';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { z } from 'zod';
import { load, send, row, listFirstParty, replaceContract } from './helpers/vert.js';
import { ZERO_CODE_HASH, wasmCodeHash } from './helpers/code-hash.js';
const worksHash = wasmCodeHash('.artifacts/contracts/works.wasm');
let core: ReturnType<typeof load>;
let works: ReturnType<typeof load>;
let token: ReturnType<typeof load>;
beforeEach(async () => {
  const chain = new Blockchain();
  chain.createAccounts('alice', 'bob');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  works = load(chain, 'works', '.artifacts/contracts/works');
  token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await listFirstParty(core, 'works', worksHash);
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
    [
      1,
      'works',
      1,
      ['propose', 'accept', 'submitwork', 'review', 'cancel'],
      ['reserve', 'approve', 'cancel'],
      worksHash,
    ],
    'alice@active',
  );
  await send(token, 'create', ['alice', '1000.0000 TLOS'], 'eosio.token@active');
  await send(token, 'issue', ['alice', '100.0000 TLOS', ''], 'alice@active');
  await send(token, 'transfer', ['alice', 'daclifycore', '10.0000 TLOS', 'dao:1'], 'alice@active');
  const cid = CID.createV1(
    0x55,
    await sha256.digest(new TextEncoder().encode('deliverable')),
  ).toString();
  await send(
    core,
    'putdoc',
    ['daclifycore', 1, 1, 1, 1, cid, '{}', 'ab'.repeat(32), 8, 0, 0],
    'daclifycore@active',
  );
});
const propose = (amounts = ['1.0000 TLOS', '2.0000 TLOS']) => [
  'daclifycore',
  1,
  2,
  1,
  2,
  1,
  1,
  amounts,
  amounts.map(() => 0),
];
const project = () =>
  z
    .object({ status: z.number(), milestones: z.array(z.number()) })
    .parse(row(works, 'projects', core.toBigInt(), 1n));
const totals = () =>
  z
    .object({ available: z.number(), reserved: z.number(), claims: z.number() })
    .parse(row(core, 'daos', core.toBigInt(), 1n));
const submit = (member = 2, id = 1) => ['daclifycore', 1, member, id, 1, 1];
const review = (member = 1, id = 1, approved = true) => [
  'daclifycore',
  1,
  member,
  id,
  approved,
  1,
  1,
];
describe('Works obligations and independent review', () => {
  it('proposes without spending uncommitted funds', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    expect(project().status).toBe(0);
    expect(totals().available).toBe(100000);
  });
  it('reserves all milestone funds atomically on acceptance', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    expect(totals()).toMatchObject({ available: 70000, reserved: 30000, claims: 0 });
  });
  it('rejects an overcommitted project without partial reservations', async () => {
    await send(works, 'propose', propose(['6.0000 TLOS', '6.0000 TLOS']), 'daclifycore@active');
    await expect(
      send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active'),
    ).rejects.toThrow('INSUFFICIENT_AVAILABLE');
    expect(totals()).toMatchObject({ available: 100000, reserved: 0 });
    expect(project().status).toBe(0);
  });
  it('requires admin approval for commitment', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    await expect(
      send(works, 'accept', ['daclifycore', 1, 2, 1], 'daclifycore@active'),
    ).rejects.toThrow('ADMIN_REQUIRED');
  });
  it('requires an existing durable document reference', async () => {
    const data = propose();
    data[5] = 999;
    await expect(send(works, 'propose', data, 'daclifycore@active')).rejects.toThrow(
      'DOCUMENT_UNKNOWN',
    );
  });
  it('accepts work only from its contributor', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    await expect(send(works, 'submitwork', submit(1), 'daclifycore@active')).rejects.toThrow(
      'CONTRIBUTOR_REQUIRED',
    );
  });
  it('prevents contributor self-review even with a review role', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    await send(works, 'submitwork', submit(), 'daclifycore@active');
    await send(core, 'setroles', ['daclifycore', 1, 1, 2, false, true], 'daclifycore@active');
    await expect(send(works, 'review', review(2), 'daclifycore@active')).rejects.toThrow(
      'SELF_REVIEW',
    );
  });
  it('requests changes without releasing reserved funding', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    await send(works, 'submitwork', submit(), 'daclifycore@active');
    await send(works, 'review', review(1, 1, false), 'daclifycore@active');
    expect(totals().reserved).toBe(30000);
    await send(works, 'submitwork', submit(), 'daclifycore@active');
  });
  it('approves and settles an internal claim once', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    await send(works, 'submitwork', submit(), 'daclifycore@active');
    await send(works, 'review', review(), 'daclifycore@active');
    await send(works, 'settle', ['daclifycore', 1, 1], 'bob@active');
    expect(totals()).toMatchObject({ reserved: 20000, claims: 10000 });
    await expect(send(works, 'settle', ['daclifycore', 1, 1], 'bob@active')).rejects.toThrow();
    expect(totals().claims).toBe(10000);
  });
  it('retains approved liabilities when cancelling remaining work', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    await send(works, 'submitwork', submit(), 'daclifycore@active');
    await send(works, 'review', review(), 'daclifycore@active');
    await send(works, 'cancel', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    expect(totals()).toMatchObject({ available: 90000, reserved: 10000 });
    await send(works, 'settle', ['daclifycore', 1, 1], 'bob@active');
    expect(totals().claims).toBe(10000);
  });
  it('can settle approved liabilities after module removal', async () => {
    await send(works, 'propose', propose(), 'daclifycore@active');
    await send(works, 'accept', ['daclifycore', 1, 1, 1], 'daclifycore@active');
    await send(works, 'submitwork', submit(), 'daclifycore@active');
    await send(works, 'review', review(), 'daclifycore@active');
    await send(core, 'setmodule', [1, 'works', 1, [], [], ZERO_CODE_HASH], 'alice@active');
    await send(works, 'settle', ['daclifycore', 1, 1], 'bob@active');
    expect(totals().claims).toBe(10000);
  });
});

it('tracks project document references atomically and rejects a forged source callback', async () => {
  await send(
    works,
    'propose',
    ['daclifycore', 1, 1, 77, 2, 1, 1, ['1.0000 TLOS'], [2000]],
    'daclifycore@active',
  );
  const table = core.tables.docrefs;
  expect(table, 'compiled core must expose its authoritative reference ledger').toBeDefined();
  if (!table) throw new Error('DOCUMENT_REFERENCE_LEDGER_MISSING');
  expect(table(1n).getTableRows()).toEqual([
    expect.objectContaining({
      source: 'works',
      table: 'projects',
      source_id: 77,
      slot: 0,
      document_id: 1,
      version: 1,
    }),
  ]);
  await expect(
    send(core, 'docref', [1, 'works', 'projects', 77, 0, 1, 1], 'works@active'),
  ).rejects.toThrow('DOCUMENT_SOURCE_SENDER');
});

it('resumes a source-owned legacy scan without rewriting the project or duplicating references', async () => {
  replaceContract(works, '.artifacts/document-upgrade-old/works');
  const oldHash = wasmCodeHash('.artifacts/document-upgrade-old/works.wasm');
  await listFirstParty(core, 'works', oldHash);
  await send(core, 'setmodule', [1, 'works', 1, ['propose'], [], oldHash], 'alice@active');
  for (const id of [31, 32, 33])
    await send(
      works,
      'propose',
      ['daclifycore', 1, 1, id, 2, 1, 1, ['1.0000 TLOS'], [2000]],
      'daclifycore@active',
    );
  const original = row(works, 'projects', core.toBigInt(), 31n);
  replaceContract(works, '.artifacts/contracts/works');
  await listFirstParty(core, 'works', worksHash);
  await send(core, 'setmodule', [1, 'works', 1, ['propose'], [], worksHash], 'alice@active');
  await expect(
    send(works, 'backfillrefs', ['daclifycore', 1, 'projects', 26], 'daclifycore@active'),
  ).rejects.toThrow('DOCUMENT_SCAN_BOUNDS');
  await expect(
    send(works, 'backfillrefs', ['daclifycore', 1, 'projects', 1], 'alice@active'),
  ).rejects.toThrow();
  const refs = core.tables.docrefs,
    scans = core.tables.docscan;
  if (!refs || !scans) throw new Error('DOCUMENT_REFERENCE_LEDGER_MISSING');
  for (const id of [31, 32, 33]) {
    await send(works, 'backfillrefs', ['daclifycore', 1, 'projects', 1], 'daclifycore@active');
    expect(scans(1n).getTableRows()).toEqual([
      expect.objectContaining({ cursor: id, complete: id === 33, code_hash: worksHash }),
    ]);
  }
  expect(refs(1n).getTableRows()).toHaveLength(3);
  const before = refs(1n).getTableRows();
  await send(works, 'backfillrefs', ['daclifycore', 1, 'projects', 25], 'daclifycore@active');
  expect(refs(1n).getTableRows()).toEqual(before);
  expect(row(works, 'projects', core.toBigInt(), 31n)).toEqual(original);
  await expect(
    send(core, 'docscanstep', [1, 'works', 'projects', 33, 99, true, 1], 'works@active'),
  ).rejects.toThrow('DOCUMENT_SOURCE_SENDER');
});

it('upgrades real legacy document bytes and preserves authors, nonces and conservative migration clocks', async () => {
  const legacy = new Blockchain();
  legacy.createAccounts('alice');
  const oldCore = load(legacy, 'daclifycore', '.artifacts/document-upgrade-old/runtime');
  await send(oldCore, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await send(oldCore, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  await send(
    oldCore,
    'enroll',
    [1, 1, '', PrivateKey.generate('K1').toPublic().toString(), 'key', 0],
    'alice@active',
  );
  for (const version of [1, 2])
    await send(
      oldCore,
      'putjson',
      ['daclifycore', 1, 1, 19, version, JSON.stringify({ version }), 0, 0],
      'daclifycore@active',
    );
  const original = row(oldCore, 'documents', 1n, 1n),
    member = row(oldCore, 'members', 1n, 1n);
  replaceContract(oldCore, '.artifacts/core-release/runtime');
  await send(oldCore, 'backfilldocs', [1, 1], 'daclifycore@active');
  expect(row(oldCore, 'docstate', 1n, 0n)).toMatchObject({ cursor: 1, complete: false });
  await send(oldCore, 'backfilldocs', [1, 1], 'daclifycore@active');
  expect(row(oldCore, 'docclocks', 1n, 1n)).toMatchObject({
    document_id: 19,
    version: 1,
    legacy: true,
    created_at: legacy.timestamp.toMilliseconds() / 1000,
  });
  expect(row(oldCore, 'documents', 1n, 1n)).toEqual(original);
  expect(row(oldCore, 'members', 1n, 1n)).toEqual(member);
  await send(oldCore, 'putjson', ['daclifycore', 1, 1, 19, 3, '{}', 0, 0], 'daclifycore@active');
  expect(row(oldCore, 'documents', 1n, 3n)).toMatchObject({ document_id: 19, version: 3 });
  expect(row(oldCore, 'docheads', 1n, 19n)).toMatchObject({ version: 3, author: 1 });
});
