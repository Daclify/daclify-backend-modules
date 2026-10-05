import { beforeEach, describe, it, expect } from 'vitest';
import { TimePointSec } from '@greymass/eosio';
import { Blockchain } from '@proton/vert';
import { PrivateKey } from '@wharfkit/antelope';
import { z } from 'zod';
import { load, send, row } from './helpers/vert.js';
let chain: Blockchain;
let core: ReturnType<typeof load>;
let decide: ReturnType<typeof load>;
beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'bob');
  core = load(chain, 'daclifycore', '.artifacts/core-release/runtime');
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
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
      [dao, 'decide', 1, ['open', 'vote'], ['govlock']],
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
  it('finalizes once', async () => {
    await send(decide, 'open', open(), 'daclifycore@active');
    chain.addTime(TimePointSec.from(301));
    await send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active');
    await expect(send(decide, 'finalize', ['daclifycore', 1, 1], 'bob@active')).rejects.toThrow(
      'BALLOT_FINALIZED',
    );
  });
});
