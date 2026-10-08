import { beforeEach, describe, it, expect } from 'vitest';
import { TimePointSec } from '@greymass/eosio';
import { Blockchain } from '@proton/vert';
import { PrivateKey } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row, listFirstParty, replaceContract } from './helpers/vert.js';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { wasmCodeHash } from './helpers/code-hash.js';
const decideHash = wasmCodeHash('.artifacts/contracts/decide.wasm');
let chain: Blockchain;
let core: ReturnType<typeof load>;
let decide: ReturnType<typeof load>;
beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'bob');
  chain.createAccounts('eosio.token');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await listFirstParty(core, 'decide', decideHash);
  for (const dao of [1, 2]) {
    await send(core, 'createdao', [dao, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
    for (const id of [1, 2, 3])
      await send(
        core,
        'enroll',
        [dao, id, '', PrivateKey.generate('K1').toPublic().toString(), 'key', 0],
        'alice@active',
      );
    await send(
      core,
      'setmodule',
      [dao, 'decide', 1, ['open', 'vote'], ['govlock'], decideHash],
      'alice@active',
    );
    await send(core, 'grantcredit', [dao, 1, 10], 'alice@active');
    await send(core, 'grantcredit', [dao, 2, 20], 'alice@active');
  }
});
const open = (id = 1, kind = 0, quorum = 5000, approval = 5001) => [
  'daclifycore',
  1,
  1,
  id,
  kind,
  2,
  300,
  quorum,
  approval,
  '{}',
];
const ballot = (id = 1) =>
  z
    .object({
      dao_id: z.number(),
      denominator: z.number(),
      status: z.number(),
      cast: z.number(),
      tallies: z.array(z.number()),
    })
    .parse(row(decide, 'ballots', core.toBigInt(), BigInt(id)));
describe('Decide snapshots and finalization', () => {
  it('gives old finalized ballots a new migration timestamp without guessing from closes', async () => {
    if (
      !existsSync('.artifacts/archive-upgrade-old/decide.wasm') ||
      !existsSync('.artifacts/archive-upgrade-old/decide.abi')
    )
      execFileSync('npm', ['exec', '--', 'tsx', 'tools/build-upgrade.ts'], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    const oldHash = wasmCodeHash('.artifacts/archive-upgrade-old/decide.wasm');
    replaceContract(decide, '.artifacts/archive-upgrade-old/decide');
    await listFirstParty(core, 'decide', oldHash);
    await send(
      core,
      'setmodule',
      [1, 'decide', 1, ['open', 'vote'], ['govlock'], oldHash],
      'alice@active',
    );
    await send(decide, 'open', open(), 'daclifycore@active');
    chain.addTime(TimePointSec.from(301));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
    const original = ballot();
    chain.addTime(TimePointSec.from(100 * 86400));
    replaceContract(decide, '.artifacts/contracts/decide');
    await listFirstParty(core, 'decide', decideHash);
    await send(
      core,
      'setmodule',
      [1, 'decide', 1, ['open', 'vote'], ['govlock'], decideHash],
      'alice@active',
    );
    await send(decide, 'markpoll', ['daclifycore', 1, 1], 'decide@active');
    expect(row(decide, 'pollends', core.toBigInt(), 1n)).toMatchObject({
      completed_at: Math.floor(chain.timestamp.toMilliseconds() / 1000),
      legacy: true,
    });
    expect(ballot()).toEqual(original);
  }, 60000);
  it('records actual finalization time, preserving ballot bytes and the original deadline on retries', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    const terminal = () =>
      z
        .object({
          dao_id: z.number(),
          ballot_id: z.number(),
          completed_at: z.number(),
          legacy: z.boolean(),
        })
        .parse(row(decide, 'pollends', core.toBigInt(), 1n));
    expect(terminal()).toMatchObject({ dao_id: 1, ballot_id: 1, completed_at: 0, legacy: false });
    await expect(send(decide, 'markpoll', ['daclifycore', 1, 1], 'decide@active')).rejects.toThrow(
      'BALLOT_OPEN',
    );
    chain.addTime(TimePointSec.from(301 + 10 * 86400));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
    const completed = terminal(),
      old = ballot();
    expect(completed.completed_at).toBe(Math.floor(chain.timestamp.toMilliseconds() / 1000));
    chain.addTime(TimePointSec.from(86400));
    await send(decide, 'markpoll', ['daclifycore', 1, 1], 'decide@active');
    expect(terminal()).toEqual(completed);
    expect(ballot()).toEqual(old);
    await expect(send(decide, 'markpoll', ['daclifycore', 2, 1], 'decide@active')).rejects.toThrow(
      'BALLOT_DOMAIN',
    );
    await expect(send(decide, 'markpoll', ['daclifycore', 1, 1], 'alice@active')).rejects.toThrow();
  });
  it('does not approve a binary proposal when Reject has the qualifying majority', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    for (const member of [1, 2])
      await send(decide, 'vote', ['daclifycore', 1, member, 1, 0], 'daclifycore@active');
    chain.addTime(TimePointSec.from(301));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
    expect(ballot().status).toBe(2);
  });
  it('rejects a tied binary result even when quorum is met', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    await send(decide, 'vote', ['daclifycore', 1, 1, 1, 0], 'daclifycore@active');
    await send(decide, 'vote', ['daclifycore', 1, 2, 1, 1], 'daclifycore@active');
    chain.addTime(TimePointSec.from(301));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
    expect(ballot().status).toBe(2);
  });

  it('opens a member ballot with a fixed eligible denominator', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    expect(ballot()).toMatchObject({ denominator: 3, status: 0 });
  });
  it('rejects an untrusted callback', async () => {
    await expect(send(decide, 'open', open(), 'bob@active')).rejects.toThrow();
  });
  it('freezes credit supply while a credit ballot is active', async () => {
    await send(decide, 'open', open(1, 1), 'daclifycore@active');
    expect(ballot().denominator).toBe(30);
    await expect(send(core, 'grantcredit', [1, 2, 1], 'alice@active')).rejects.toThrow(
      'GOVERNANCE_LOCKED',
    );
  });
  it('counts one vote per member', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    await send(decide, 'vote', ['daclifycore', 1, 2, 1, 1], 'daclifycore@active');
    await expect(
      send(decide, 'vote', ['daclifycore', 1, 2, 1, 1], 'daclifycore@active'),
    ).rejects.toThrow('ALREADY_VOTED');
    expect(ballot().cast).toBe(1);
  });
  it('weights credits in integer units', async () => {
    await send(decide, 'open', open(1, 1), 'daclifycore@active');
    await send(decide, 'vote', ['daclifycore', 1, 2, 1, 1], 'daclifycore@active');
    expect(ballot().tallies).toEqual([0, 20]);
  });
  it('rejects cross-DAO ballot substitution', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    await expect(
      send(decide, 'vote', ['daclifycore', 2, 2, 1, 1], 'daclifycore@active'),
    ).rejects.toThrow('BALLOT_DOMAIN');
  });
  it('rejects a member admitted after opening', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    await send(
      core,
      'enroll',
      [1, 4, '', PrivateKey.generate('K1').toPublic().toString(), 'key', 0],
      'alice@active',
    );
    await expect(
      send(decide, 'vote', ['daclifycore', 1, 4, 1, 1], 'daclifycore@active'),
    ).rejects.toThrow('SNAPSHOT_MEMBER');
  });
  it('rejects invalid choices', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    await expect(
      send(decide, 'vote', ['daclifycore', 1, 2, 1, 2], 'daclifycore@active'),
    ).rejects.toThrow('CHOICE');
  });
  it('cannot finalize before closing', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    await expect(send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active')).rejects.toThrow(
      'BALLOT_OPEN',
    );
  });
  it('fails quorum rather than assuming missing voters consent', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    await send(decide, 'vote', ['daclifycore', 1, 2, 1, 1], 'daclifycore@active');
    chain.addTime(TimePointSec.from(301));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
    expect(ballot().status).toBe(2);
  });
  it('passes a qualifying majority and unlocks the denominator', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    for (const member of [1, 2])
      await send(decide, 'vote', ['daclifycore', 1, member, 1, 1], 'daclifycore@active');
    chain.addTime(TimePointSec.from(301));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
    expect(ballot().status).toBe(1);
    await send(core, 'grantcredit', [1, 2, 1], 'alice@active');
  });
  it('rejects a ballot outside the preset bounds', async () => {
    const badKind = open();
    badKind[4] = 3;
    await expect(send(decide, 'open', badKind, 'daclifycore@active')).rejects.toThrow(
      'BALLOT_PRESET',
    );
    const oneChoice = open();
    oneChoice[5] = 1;
    await expect(send(decide, 'open', oneChoice, 'daclifycore@active')).rejects.toThrow(
      'BALLOT_PRESET',
    );
    const short = open();
    short[6] = 59;
    await expect(send(decide, 'open', short, 'daclifycore@active')).rejects.toThrow(
      'BALLOT_DURATION',
    );
    const long = open();
    long[6] = 2592001;
    await expect(send(decide, 'open', long, 'daclifycore@active')).rejects.toThrow(
      'BALLOT_DURATION',
    );
    await expect(send(decide, 'open', open(1, 0, 0, 5001), 'daclifycore@active')).rejects.toThrow(
      'BALLOT_THRESHOLD',
    );
    await expect(
      send(decide, 'open', open(1, 0, 5000, 5000), 'daclifycore@active'),
    ).rejects.toThrow('BALLOT_THRESHOLD');
  });
  it('refuses stake weight when none is eligible and a credit vote with no credits', async () => {
    await expect(send(decide, 'open', open(1, 2), 'daclifycore@active')).rejects.toThrow(
      'NO_ELIGIBLE_WEIGHT',
    );
    await send(decide, 'open', open(1, 1), 'daclifycore@active');
    await expect(
      send(decide, 'vote', ['daclifycore', 1, 3, 1, 1], 'daclifycore@active'),
    ).rejects.toThrow('NO_VOTING_WEIGHT');
  });
  it('finalizes once', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    chain.addTime(TimePointSec.from(301));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
    await expect(send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active')).rejects.toThrow(
      'BALLOT_FINALIZED',
    );
  });
});
