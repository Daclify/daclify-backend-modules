import { readFileSync } from 'node:fs';
import { beforeEach, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { ABI, Checksum256, PrivateKey, Serializer } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
let chain: Blockchain, core: ReturnType<typeof load>, decide: ReturnType<typeof load>;
const keys = Array.from({ length: 17 }, () => PrivateKey.generate('K1'));
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
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  load(chain, 'works', '.artifacts/contracts/works');
  load(chain, 'grants', '.artifacts/contracts/grants');
  const token = load(chain, 'eosio.token', '.artifacts/core-release/testtoken');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await send(core, 'initramobs', [], 'daclifycore@active');
  for (const module of ['decide', 'works', 'grants'])
    await send(
      core,
      'setramcode',
      [module, wasmCodeHash('.artifacts/contracts/' + module + '.wasm')],
      'daclifycore@active',
    );
  for (const module of ['decide', 'works', 'grants'])
    await listFirstParty(core, module, wasmCodeHash('.artifacts/contracts/' + module + '.wasm'));
  await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  await send(core, 'initgov', [1, policy], 'alice@active');
  for (const [index, key] of keys.slice(0, 3).entries())
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
      ['open', 'vote', 'openwork', 'openaward', 'newelect', 'nominate', 'startelect', 'recall'],
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

async function election(seats = 1) {
  await act('decide', 'newelect', {
    election_id: 1,
    title: 'Community council',
    document_id: 1,
    document_version: 1,
    nomination_close: 100,
    term_start: 1000,
    term_end: 2000,
    seats,
  });
}
async function nominate(member: number) {
  await act('decide', 'nominate', { election_id: 1, active: true }, member);
}
async function start() {
  chain.addTime(TimePointSec.from(101));
  await act('decide', 'startelect', { election_id: 1 });
  await send(decide, 'checkquota', ['daclifycore', 1], 'daclifycore@active');
}
async function finish() {
  chain.addTime(TimePointSec.from(301));
  await send(decide, 'finalize', ['daclifycore', 1, 1], 'relay@active');
}
function terms() {
  return decide.tables.terms?.(core.toBigInt()).getTableRows() ?? [];
}
it('requires self-nomination, freezes candidates and counts one vote per member', async () => {
  await election();
  await nominate(1);
  await expect(nominate(1)).rejects.toThrow('ALREADY_IN_STATE');
  await nominate(2);
  await start();
  await expect(nominate(3)).rejects.toThrow('NOMINATIONS_CLOSED');
  await act('decide', 'vote', { ballot_id: 1, choice: 1 }, 1);
  await expect(act('decide', 'vote', { ballot_id: 1, choice: 2 }, 1)).rejects.toThrow(
    'ALREADY_VOTED',
  );
  await act('decide', 'vote', { ballot_id: 1, choice: 1 }, 2);
  await finish();
  expect(terms()).toHaveLength(1);
  expect(
    z.object({ member_id: z.number(), starts: z.number(), ends: z.number() }).parse(terms()[0]),
  ).toMatchObject({ member_id: 1, starts: 1000, ends: 2000 });
  expect(
    z.object({ admin: z.boolean(), credits: z.number() }).parse(row(core, 'members', 1n, 2n)),
  ).toMatchObject({ admin: false, credits: 0 });
  await expect(send(decide, 'execute', ['daclifycore', 1, 1], 'relay@active')).rejects.toThrow(
    'EXECUTION_UNKNOWN',
  );
});
it('leaves a boundary tie vacant but fills a tied group when every tied candidate fits', async () => {
  await election();
  await nominate(1);
  await nominate(2);
  await start();
  await act('decide', 'vote', { ballot_id: 1, choice: 1 }, 1);
  await act('decide', 'vote', { ballot_id: 1, choice: 2 }, 2);
  await finish();
  expect(terms()).toHaveLength(0);
});
it('fills two seats with a tied group without requiring a yes/no approval majority', async () => {
  await election(2);
  await nominate(1);
  await nominate(2);
  await start();
  await act('decide', 'vote', { ballot_id: 1, choice: 1 }, 1);
  await act('decide', 'vote', { ballot_id: 1, choice: 2 }, 2);
  await finish();
  expect(terms()).toHaveLength(2);
});
it('issues no terms on no quorum or abstention-only voting', async () => {
  await election();
  await nominate(1);
  await start();
  await act('decide', 'vote', { ballot_id: 1, choice: 0 }, 1);
  await finish();
  expect(terms()).toHaveLength(0);
});
it('preserves withdrawn slots, excludes ineligible winners and records an administrator recall', async () => {
  await election(2);
  await nominate(1);
  await nominate(2);
  await act('decide', 'nominate', { election_id: 1, active: false }, 2);
  await nominate(3);
  await start();
  await act('decide', 'vote', { ballot_id: 1, choice: 2 }, 1);
  await act('decide', 'vote', { ballot_id: 1, choice: 1 }, 2);
  await finish();
  expect(terms()).toHaveLength(2);
  await expect(
    act('decide', 'recall', { term_id: 1, document_id: 1, document_version: 1 }, 2),
  ).rejects.toThrow('ADMIN_REQUIRED');
  await act('decide', 'recall', { term_id: 1, document_id: 1, document_version: 1 });
  const refs = core.tables.docrefs;
  if (!refs) throw new Error('DOCUMENT_REFERENCE_LEDGER_MISSING');
  expect(refs(1n).getTableRows()).toEqual([
    expect.objectContaining({ table: 'elections', source: 'decide', document_id: 1, version: 1 }),
    expect.objectContaining({ table: 'terms', source_id: 1, document_id: 1, version: 1 }),
  ]);
  expect(
    z.object({ recalled: z.boolean() }).parse(row(decide, 'terms', core.toBigInt(), 1n)).recalled,
  ).toBe(true);
  await expect(
    act('decide', 'recall', { term_id: 1, document_id: 1, document_version: 1 }),
  ).rejects.toThrow('ALREADY_IN_STATE');
});
it('rechecks winning candidate eligibility without granting a runner-up or changing permanent roles', async () => {
  await election();
  await nominate(2);
  await nominate(3);
  await start();
  await act('decide', 'vote', { ballot_id: 1, choice: 1 }, 1);
  await act('decide', 'vote', { ballot_id: 1, choice: 1 }, 2);
  await act('daclifycore', 'setactive', { target: 2, active: false });
  await finish();
  expect(terms()).toHaveLength(0);
});
it('binds nomination/voting to current policy and DAO and bounds term duration', async () => {
  await expect(
    act('decide', 'newelect', {
      election_id: 1,
      title: 'Council',
      document_id: 1,
      document_version: 1,
      nomination_close: 100,
      term_start: 1000,
      term_end: 40000000,
      seats: 1,
    }),
  ).rejects.toThrow('ELECTION_TERM');
  await election();
  await nominate(1);
  await act('daclifycore', 'setdaogov', { settings: { ...policy, quorum: 6667 } });
  chain.addTime(TimePointSec.from(101));
  await expect(act('decide', 'startelect', { election_id: 1 })).rejects.toThrow('POLICY_CHANGED');
});
it('bounds candidates and frees withdrawn slots without multiplying the same member', async () => {
  await election();
  for (let member = 4; member <= 17; member++) {
    const key = keys[member - 1];
    if (!key) throw new Error('FIXTURE_MEMBER');
    await send(
      core,
      'enroll',
      [1, member, '', key.toPublic().toString(), 'key', 0],
      'alice@active',
    );
  }
  for (let member = 1; member <= 15; member++) await nominate(member);
  await expect(nominate(16)).rejects.toThrow('CANDIDATE_LIMIT');
  await act('decide', 'nominate', { election_id: 1, active: false }, 15);
  await nominate(16);
  await expect(nominate(16)).rejects.toThrow('ALREADY_IN_STATE');
});
it('counts explicit abstention toward quorum without inventing a representative', async () => {
  await election();
  await nominate(1);
  await start();
  for (const member of [1, 2]) await act('decide', 'vote', { ballot_id: 1, choice: 0 }, member);
  await finish();
  expect(terms()).toHaveLength(0);
});

it('physically allocates bounded term space when voting starts and consumes it during finalization', async () => {
  await election(1);
  await nominate(2);
  await start();
  expect(row(decide, 'termholds', core.toBigInt(), 1n)).toMatchObject({ dao_id: 1, id: 1 });
  expect(row(decide, 'terms', core.toBigInt(), 1n)).toBeUndefined();
  for (const member of [1, 2, 3]) await act('decide', 'vote', { ballot_id: 1, choice: 1 }, member);
  await finish();
  expect(row(decide, 'termholds', core.toBigInt(), 1n)).toBeUndefined();
  expect(row(decide, 'terms', core.toBigInt(), 1n)).toMatchObject({ member_id: 2, election_id: 1 });
});

it('excludes non-voting members from the denominator and rejects their ballots', async () => {
  await act('daclifycore', 'setvoter', { target: 3, can_vote: false });
  await election();
  await nominate(1);
  await start();
  expect(row(decide, 'ballots', core.toBigInt(), 1n)).toMatchObject({ denominator: 2 });
  await expect(act('decide', 'vote', { ballot_id: 1, choice: 1 }, 3)).rejects.toThrow(
    'VOTER_INELIGIBLE',
  );
  await expect(act('daclifycore', 'setvoter', { target: 2, can_vote: false })).rejects.toThrow(
    'GOVERNANCE_LOCKED',
  );
});
async function executiveElection() {
  await send(core, 'appoint', [1, [1], 60, 10000], 'alice@active');
  await send(
    core,
    'setmodule',
    [
      1,
      'decide',
      1,
      ['open', 'vote', 'openwork', 'openaward', 'newelect', 'nominate', 'startelect', 'recall'],
      ['govlock', 'electexec'],
      wasmCodeHash('.artifacts/contracts/decide.wasm'),
    ],
    'alice@active',
  );
  await act('decide', 'newelect', {
    election_id: 1,
    title: 'Executives',
    document_id: 1,
    document_version: 1,
    nomination_close: 100,
    term_start: 1000,
    term_end: 2000,
    seats: 1,
  });
}
it('schedules an explicit executive election and activates the elected roster at term start', async () => {
  await executiveElection();
  await nominate(2);
  await start();
  for (const member of [1, 2]) await act('decide', 'vote', { ballot_id: 1, choice: 1 }, member);
  await finish();
  expect(row(core, 'executives', 1n, 1n)).toMatchObject({ member_id: 1 });
  expect(row(core, 'execpending', core.toBigInt(), 1n)).toMatchObject({
    members: [2],
    starts: 1000,
  });
  chain.addTime(TimePointSec.from(599));
  await send(core, 'syncexec', [1], 'relay@active');
  expect(row(core, 'executives', 1n, 2n)).toMatchObject({ member_id: 2, election_id: 1 });
  expect(row(core, 'executives', 1n, 1n)).toBeUndefined();
  await expect(act('daclifycore', 'heartbeat', {})).rejects.toThrow('EXECUTIVE_REQUIRED');
  await send(core, 'syncexec', [1], 'relay@active');
  expect(row(core, 'execpending', core.toBigInt(), 1n)).toBeUndefined();
  await expect(
    act('decide', 'recall', { term_id: 1, document_id: 1, document_version: 1 }),
  ).rejects.toThrow('LAST_EXECUTIVE');
});
it('refuses executive elections without an appointed policy', async () => {
  await expect(
    act('decide', 'newelect', {
      election_id: 1,
      title: 'Executives',
      document_id: 1,
      document_version: 1,
      nomination_close: 100,
      term_start: 1000,
      term_end: 2000,
      seats: 1,
    }),
  ).rejects.toThrow('EXECUTIVE_POLICY_UNKNOWN');
});
it('refuses executive elections when the pinned module lacks the roster grant', async () => {
  await send(core, 'appoint', [1, [1], 60, 10000], 'alice@active');
  await expect(
    act('decide', 'newelect', {
      election_id: 1,
      title: 'Executives',
      document_id: 1,
      document_version: 1,
      nomination_close: 100,
      term_start: 1000,
      term_end: 2000,
      seats: 1,
    }),
  ).rejects.toThrow('MODULE_GRANT');
});
it('representative elections leave executive authority unchanged', async () => {
  await send(core, 'appoint', [1, [1], 60, 10000], 'alice@active');
  await election();
  await nominate(2);
  await start();
  for (const member of [1, 2]) await act('decide', 'vote', { ballot_id: 1, choice: 1 }, member);
  await finish();
  expect(row(core, 'execpending', core.toBigInt(), 1n)).toBeUndefined();
  expect(row(core, 'executives', 1n, 1n)).toMatchObject({ member_id: 1 });
  expect(row(core, 'executives', 1n, 2n)).toBeUndefined();
});

it('keeps the incumbent when a pending elected term expires before activation', async () => {
  await executiveElection();
  await nominate(2);
  await start();
  for (const member of [1, 2]) await act('decide', 'vote', { ballot_id: 1, choice: 1 }, member);
  await finish();
  chain.addTime(TimePointSec.from(1600));
  await send(core, 'syncexec', [1], 'relay@active');
  expect(row(core, 'execpending', core.toBigInt(), 1n)).toBeUndefined();
  expect(row(core, 'executives', 1n, 1n)).toMatchObject({ member_id: 1 });
  expect(row(core, 'executives', 1n, 2n)).toBeUndefined();
});
it('cancels a recalled pending roster without stripping the incumbent office', async () => {
  await executiveElection();
  await nominate(2);
  await start();
  for (const member of [1, 2]) await act('decide', 'vote', { ballot_id: 1, choice: 1 }, member);
  await finish();
  await act('decide', 'recall', { term_id: 1, document_id: 1, document_version: 1 });
  chain.addTime(TimePointSec.from(599));
  await send(core, 'syncexec', [1], 'relay@active');
  expect(row(core, 'execpending', core.toBigInt(), 1n)).toBeUndefined();
  expect(row(core, 'executives', 1n, 1n)).toMatchObject({ member_id: 1 });
  expect(row(decide, 'terms', core.toBigInt(), 1n)).toMatchObject({ recalled: true });
});
