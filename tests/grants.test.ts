import { readFileSync } from 'node:fs';
import { beforeEach, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { ABI, Checksum256, PrivateKey, Serializer } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
let chain: Blockchain,
  core: ReturnType<typeof load>,
  decide: ReturnType<typeof load>,
  works: ReturnType<typeof load>,
  grants: ReturnType<typeof load>;
const keys = [PrivateKey.generate('K1'), PrivateKey.generate('K1'), PrivateKey.generate('K1')];
const policy = {
  participant_mode: 0,
  decide: 'decide',
  guardian: 'guardian',
  kind: 0,
  duration: 300,
  quorum: 5000,
  approval: 5001,
  governed_works: true,
  max_commitment: 100000,
  daily_commitment: 300000,
};
async function act(target: string, action: string, fields: object, member = 1) {
  const memberKey = keys[member - 1];
  if (!memberKey) throw new Error('Fixture member');
  const person = z.object({ nonce: z.number() }).parse(row(core, 'members', 1n, BigInt(member)));
  const abi = ABI.from(
    readFileSync(
      target === 'daclifycore'
        ? '.artifacts/core-release/runtime.abi'
        : '.artifacts/contracts/' + target + '.abi',
      'utf8',
    ),
  );
  const data = Serializer.encode({
    abi,
    type: action,
    object: { runtime: 'daclifycore', dao_id: 1, member_id: member, ...fields },
  }).hexString;
  const request = {
    version: 1,
    chain_id: 'ab'.repeat(32),
    deployment: 'daclifycore',
    dao_id: 1,
    member_id: member,
    nonce: person.nonce,
    expires: chain.timestamp.toMilliseconds() / 1000 + 300,
    target,
    action,
    data,
  };
  const coreAbi = ABI.from(readFileSync('.artifacts/core-release/runtime.abi', 'utf8'));
  const digest = Checksum256.hash(
    Serializer.encode({ abi: coreAbi, type: 'instruction', object: request }),
  );
  await send(core, 'submit', [request, memberKey.signDigest(digest).toString()], 'relay@active');
}
const totals = () =>
  z
    .object({ available: z.number(), reserved: z.number() })
    .parse(row(core, 'daos', core.toBigInt(), 1n));
beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'guardian', 'relay');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  works = load(chain, 'works', '.artifacts/contracts/works');
  grants = load(chain, 'grants', '.artifacts/contracts/grants');
  const token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  for (const module of ['decide', 'works', 'grants'])
    await listFirstParty(core, module, wasmCodeHash('.artifacts/contracts/' + module + '.wasm'));
  await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  await send(core, 'initgov', [1, policy], 'alice@active');
  for (const [index, key] of keys.entries())
    await send(
      core,
      'enroll',
      [1, index + 1, '', key.toPublic().toString(), 'key', 0],
      'alice@active',
    );
  await send(
    core,
    'setmodule',
    [
      1,
      'decide',
      1,
      ['open', 'vote', 'openwork', 'openaward'],
      ['govlock'],
      wasmCodeHash('.artifacts/contracts/decide.wasm'),
    ],
    'alice@active',
  );
  await send(
    core,
    'setmodule',
    [
      1,
      'works',
      1,
      ['propose', 'accept', 'submitwork', 'review', 'cancel', 'offeragr', 'acceptagr'],
      ['reserve', 'approve', 'cancel'],
      wasmCodeHash('.artifacts/contracts/works.wasm'),
    ],
    'alice@active',
  );
  await send(
    core,
    'setmodule',
    [
      1,
      'grants',
      1,
      ['newround', 'applygrant', 'amend', 'submitapp', 'reviewapp', 'closeapp', 'closeround'],
      ['awardwork'],
      wasmCodeHash('.artifacts/contracts/grants.wasm'),
    ],
    'alice@active',
  );
  await send(token, 'create', ['alice', '1000.0000 TLOS'], 'eosio.token@active');
  await send(token, 'issue', ['alice', '100.0000 TLOS', ''], 'alice@active');
  await send(token, 'transfer', ['alice', 'daclifycore', '20.0000 TLOS', 'dao:1'], 'alice@active');
  await act('daclifycore', 'putjson', {
    document_id: 1,
    version: 1,
    value: '{"project":"test"}',
    envelope_version: 0,
    key_epoch: 0,
  });
});

async function application(id = 1, payment = '3.0000 TLOS') {
  await act(
    'grants',
    'applygrant',
    {
      round_id: 1,
      application_id: id,
      document_id: 1,
      document_version: 1,
      payments: [payment],
      dues: [2000],
      term_start: 0,
      term_end: 4000,
    },
    3,
  );
  await act('grants', 'submitapp', { application_id: id }, 3);
  await act('grants', 'reviewapp', {
    application_id: id,
    eligible: true,
    document_id: 1,
    document_version: 1,
  });
}
async function award(ballot = 1, applicationId = 1, project = 10) {
  await act('decide', 'openaward', {
    ballot_id: ballot,
    grants: 'grants',
    round_id: 1,
    application_id: applicationId,
    project_id: project,
    duration: 300,
    quorum: 5000,
    approval: 5001,
    metadata: '{}',
  });
  for (const member of [1, 2])
    await act('decide', 'vote', { ballot_id: ballot, choice: 1 }, member);
  chain.addTime(TimePointSec.from(301));
  await send(decide, 'finalize', ['daclifycore', 1, ballot], 'relay@active');
}
beforeEach(async () => {
  await act('grants', 'newround', {
    round_id: 1,
    document_id: 1,
    document_version: 1,
    applications_close: 900,
    review_close: 1200,
    awards_close: 5000,
    maximum: '5.0000 TLOS',
    allow_agents: false,
    works: 'works',
  });
});
it('requires contributor consent and review; direct callback authorization is insufficient', async () => {
  await act(
    'grants',
    'applygrant',
    {
      round_id: 1,
      application_id: 1,
      document_id: 1,
      document_version: 1,
      payments: ['1.0000 TLOS'],
      dues: [2000],
      term_start: 0,
      term_end: 4000,
    },
    3,
  );
  await expect(act('grants', 'submitapp', { application_id: 1 }, 2)).rejects.toThrow(
    'APPLICATION_OWNER',
  );
  await expect(
    act('decide', 'openaward', {
      ballot_id: 1,
      grants: 'grants',
      round_id: 1,
      application_id: 1,
      project_id: 10,
      duration: 300,
      quorum: 5000,
      approval: 5001,
      metadata: '{}',
    }),
  ).rejects.toThrow('APPLICATION_NOT_ELIGIBLE');
  await expect(
    send(grants, 'govaward', ['daclifycore', 1, 1, 1, 1], 'decide@active'),
  ).rejects.toThrow('EXECUTOR_SENDER');
  await expect(
    send(works, 'grantwork', ['daclifycore', 1, 'grants', 1, 1, 1], 'grants@active'),
  ).rejects.toThrow('EXECUTOR_SENDER');
});
it('atomically turns an approved application into a backed Works agreement and settles once', async () => {
  await application();
  await award();
  await send(decide, 'executeaward', ['daclifycore', 1, 1], 'relay@active');
  expect(totals()).toMatchObject({ available: 170000, reserved: 30000 });
  expect(
    z
      .object({ status: z.number(), project_id: z.number() })
      .parse(row(grants, 'applications', core.toBigInt(), 1n)),
  ).toMatchObject({ status: 4, project_id: 10 });
  expect(
    z.object({ accepted: z.boolean() }).parse(row(works, 'agreements', core.toBigInt(), 10n))
      .accepted,
  ).toBe(true);
  await expect(send(decide, 'executeaward', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
    'ALREADY_EXECUTED',
  );
  await expect(
    act(
      'grants',
      'amend',
      {
        application_id: 1,
        document_id: 1,
        document_version: 1,
        payments: ['1.0000 TLOS'],
        dues: [2000],
        term_start: 0,
        term_end: 4000,
      },
      3,
    ),
  ).rejects.toThrow('APPLICATION_FROZEN');
  await act('works', 'submitwork', { milestone_id: 1, document_id: 1, document_version: 1 }, 3);
  await act('works', 'review', {
    milestone_id: 1,
    approve: true,
    document_id: 1,
    document_version: 1,
  });
  chain.addTime(TimePointSec.from(1700));
  await send(works, 'settle', ['daclifycore', 1, 1], 'relay@active');
  await expect(send(works, 'settle', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow();
  expect(totals().reserved).toBe(0);
});
it('invalidates a vote when the application is revised and needs fresh consent', async () => {
  await application();
  await award();
  await act(
    'grants',
    'amend',
    {
      application_id: 1,
      document_id: 1,
      document_version: 1,
      payments: ['2.0000 TLOS'],
      dues: [2000],
      term_start: 0,
      term_end: 4000,
    },
    3,
  );
  await expect(send(decide, 'executeaward', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
    'APPLICATION_NOT_ELIGIBLE',
  );
  await act('grants', 'submitapp', { application_id: 1 }, 3);
  await act('grants', 'reviewapp', {
    application_id: 1,
    eligible: true,
    document_id: 1,
    document_version: 1,
  });
  await expect(send(decide, 'executeaward', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
    'APPLICATION_CHANGED',
  );
  expect(totals().reserved).toBe(0);
});
it('rolls back the cap, application and execution when a DAO commitment cap rejects reservation', async () => {
  await act('daclifycore', 'setdaogov', { settings: { ...policy, max_commitment: 10000 } });
  await application();
  await award();
  await expect(send(decide, 'executeaward', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
    'COMMITMENT_LIMIT',
  );
  expect(totals().reserved).toBe(0);
  expect(
    z.object({ awarded: z.number() }).parse(row(grants, 'rounds', core.toBigInt(), 1n)).awarded,
  ).toBe(0);
  expect(
    z.object({ status: z.number() }).parse(row(grants, 'applications', core.toBigInt(), 1n)).status,
  ).toBe(2);
  expect(
    z.object({ executed: z.boolean() }).parse(row(decide, 'grantplans', core.toBigInt(), 1n))
      .executed,
  ).toBe(false);
  expect(row(works, 'projects', core.toBigInt(), 10n)).toBeUndefined();
});
it('enforces the round cap across separately approved awards and rolls back the later award', async () => {
  await application(1);
  await application(2);
  await award(1, 1, 10);
  await award(2, 2, 11);
  await send(decide, 'executeaward', ['daclifycore', 1, 1], 'relay@active');
  await expect(send(decide, 'executeaward', ['daclifycore', 1, 2], 'relay@active')).rejects.toThrow(
    'ROUND_CAP',
  );
  expect(
    z.object({ awarded: z.number() }).parse(row(grants, 'rounds', core.toBigInt(), 1n)).awarded,
  ).toBe(30000);
  expect(
    z.object({ executed: z.boolean() }).parse(row(decide, 'grantplans', core.toBigInt(), 2n))
      .executed,
  ).toBe(false);
  expect(row(works, 'projects', core.toBigInt(), 11n)).toBeUndefined();
});
it('checks cross-DAO execution, current member eligibility and award deadlines', async () => {
  await application();
  await award();
  await expect(send(decide, 'executeaward', ['daclifycore', 2, 1], 'relay@active')).rejects.toThrow(
    'BALLOT_DOMAIN',
  );
  await act('daclifycore', 'setactive', { target: 3, active: false });
  await expect(send(decide, 'executeaward', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
    'PARTICIPANT_INELIGIBLE',
  );
  chain.addTime(TimePointSec.from(5000));
  await expect(send(decide, 'executeaward', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
    'AWARDS_CLOSED',
  );
});

it('replaces application references and clears decision references after an amendment', async () => {
  await application();
  const refs = core.tables.docrefs;
  if (!refs) throw new Error('DOCUMENT_REFERENCE_LEDGER_MISSING');
  expect(refs(1n).getTableRows()).toHaveLength(3);
  await act('daclifycore', 'putjson', {
    document_id: 1,
    version: 2,
    value: '{}',
    envelope_version: 0,
    key_epoch: 0,
  });
  await act(
    'grants',
    'amend',
    {
      application_id: 1,
      document_id: 1,
      document_version: 2,
      payments: ['2.0000 TLOS'],
      dues: [2000],
      term_start: 0,
      term_end: 4000,
    },
    3,
  );
  expect(refs(1n).getTableRows()).toEqual([
    expect.objectContaining({ table: 'rounds', version: 1 }),
    expect.objectContaining({ table: 'applications', slot: 0, version: 2 }),
  ]);
});
