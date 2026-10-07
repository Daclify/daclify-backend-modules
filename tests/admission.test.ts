import { readFileSync } from 'node:fs';
import { beforeEach, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { ABI, Checksum256, PrivateKey, Serializer } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
let chain: Blockchain, core: ReturnType<typeof load>;
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

beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'guardian', 'relay');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  load(chain, 'decide', '.artifacts/contracts/decide');
  load(chain, 'works', '.artifacts/contracts/works');
  load(chain, 'grants', '.artifacts/contracts/grants');
  load(chain, 'endorse', '.artifacts/contracts/endorse');
  const token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  for (const module of ['decide', 'works', 'grants', 'endorse'])
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
  await send(
    core,
    'setmodule',
    [
      1,
      'endorse',
      1,
      ['applyjoin', 'witness', 'unwitness', 'admit'],
      ['admit'],
      wasmCodeHash('.artifacts/contracts/endorse.wasm'),
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

const applicant = PrivateKey.generate('K1');
async function admissionPolicy(enabled = true, override = false) {
  await act('daclifycore', 'setadmit', {
    enabled,
    source: 'endorse',
    threshold: 2,
    allow_agents: false,
    admin_override: override,
  });
}
async function apply(id = 1) {
  await act('endorse', 'applyjoin', {
    application_id: id,
    signing_key: applicant.toPublic().toString(),
    encryption_key: 'key',
    custody: 0,
    kind: 0,
    operator_label: '',
    document_id: 1,
    document_version: 1,
    expires: 1000,
  });
}
it('preserves default administrator admission but enforces opt-in policy on owner and signed admission paths', async () => {
  await admissionPolicy();
  await expect(
    send(core, 'enroll', [1, 4, '', applicant.toPublic().toString(), 'key', 0], 'alice@active'),
  ).rejects.toThrow('ADMISSION_REQUIRED');
  await expect(
    act('daclifycore', 'addmember', {
      signing_key: applicant.toPublic().toString(),
      encryption_key: 'key',
      custody: 0,
      kind: 0,
      operator_label: '',
    }),
  ).rejects.toThrow('ADMISSION_REQUIRED');
  await admissionPolicy(true, true);
  await send(core, 'enroll', [1, 4, '', applicant.toPublic().toString(), 'key', 0], 'alice@active');
});
it('requires distinct current endorsements and adds an ordinary member once without powers or credits', async () => {
  await admissionPolicy();
  await apply();
  await act('endorse', 'witness', { application_id: 1, revision: 1 }, 2);
  await expect(act('endorse', 'witness', { application_id: 1, revision: 1 }, 2)).rejects.toThrow(
    'ENDORSEMENT_EXISTS',
  );
  await expect(act('endorse', 'admit', { application_id: 1, revision: 1 })).rejects.toThrow(
    'ENDORSEMENT_THRESHOLD',
  );
  await act('endorse', 'witness', { application_id: 1, revision: 1 }, 3);
  await act('endorse', 'admit', { application_id: 1, revision: 1 });
  expect(
    z
      .object({ admin: z.boolean(), reviewer: z.boolean(), credits: z.number() })
      .parse(row(core, 'members', 1n, 4n)),
  ).toMatchObject({ admin: false, reviewer: false, credits: 0 });
  await expect(act('endorse', 'admit', { application_id: 1, revision: 1 })).rejects.toThrow(
    'APPLICATION_FROZEN',
  );
  await expect(send(core, 'admitfrom', [1, 'endorse', 1, 1], 'endorse@active')).rejects.toThrow(
    'SOURCE_SENDER',
  );
});
it('withdraws endorsements and rejects stale revisions, policy changes and deadlines', async () => {
  await admissionPolicy();
  await apply();
  await act('endorse', 'witness', { application_id: 1, revision: 1 }, 2);
  await act('endorse', 'witness', { application_id: 1, revision: 1 }, 3);
  await act('endorse', 'unwitness', { application_id: 1, revision: 1 }, 3);
  await expect(act('endorse', 'admit', { application_id: 1, revision: 1 })).rejects.toThrow(
    'ENDORSEMENT_THRESHOLD',
  );
  await apply();
  await expect(act('endorse', 'witness', { application_id: 1, revision: 1 }, 3)).rejects.toThrow(
    'APPLICATION_REVISION',
  );
  await admissionPolicy();
  await expect(act('endorse', 'admit', { application_id: 1, revision: 2 })).rejects.toThrow(
    'ADMISSION_POLICY_CHANGED',
  );
  await apply();
  chain.addTime(TimePointSec.from(1001));
  await expect(act('endorse', 'admit', { application_id: 1, revision: 3 })).rejects.toThrow(
    'APPLICATION_EXPIRED',
  );
});
it('rechecks offboarded witnesses and rejects an existing member endorsing their own join key', async () => {
  await admissionPolicy();
  await apply();
  await act('endorse', 'witness', { application_id: 1, revision: 1 }, 2);
  await act('endorse', 'witness', { application_id: 1, revision: 1 }, 3);
  await act('daclifycore', 'setactive', { target: 3, active: false });
  await expect(act('endorse', 'admit', { application_id: 1, revision: 1 })).rejects.toThrow(
    'ENDORSEMENT_THRESHOLD',
  );
  await act('endorse', 'applyjoin', {
    application_id: 2,
    signing_key: keys[1]?.toPublic().toString(),
    encryption_key: 'key',
    custody: 0,
    kind: 0,
    operator_label: '',
    document_id: 1,
    document_version: 1,
    expires: 1000,
  });
  await expect(act('endorse', 'witness', { application_id: 2, revision: 1 }, 2)).rejects.toThrow(
    'SELF_ENDORSEMENT',
  );
});
