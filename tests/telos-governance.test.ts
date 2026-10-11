import { describe, expect, it } from 'vitest';
import { Serializer } from '@wharfkit/antelope';
import {
  TelosGovernanceClient,
  telosVoteActions,
  telosDecideAbi,
} from '../sdk/telos-governance.js';
import { TelosBallotSchema, TelosGovernanceSourceSchema } from '../protocol/telos-governance.js';
const chainId = 'ab'.repeat(32),
  codeHash = '12'.repeat(32),
  abiHash = '34'.repeat(32);
const source = {
  chainId,
  rpcUrl: 'https://rpc.example.test',
  contract: 'telos.decide' as const,
  environment: 'testnet' as const,
  codeHash,
  abiHash,
};
const ballot = {
  ballot_name: 'election1',
  category: 'election',
  publisher: 'publisher',
  status: 'voting',
  title: 'Council',
  description: '',
  content: 'https://example.test/candidates',
  treasury_symbol: '4,VOTE',
  voting_method: '1token1vote',
  min_options: 1,
  max_options: 2,
  options: [
    { key: 'alice', value: '0.0000 VOTE' },
    { key: 'bob', value: '0.0000 VOTE' },
  ],
  total_voters: 0,
  total_delegates: 0,
  total_raw_weight: '0.0000 VOTE',
  cleaned_count: 0,
  settings: [
    { key: 'lightballot', value: 0 },
    { key: 'revotable', value: 1 },
    { key: 'voteliquid', value: 0 },
    { key: 'votestake', value: 1 },
  ],
  begin_time: '2020-01-01T00:00:00',
  end_time: '2090-01-01T00:00:00',
};
function fixture(
  overrides: {
    chainId?: string;
    codeHash?: string;
    registered?: boolean;
    alreadyVoted?: boolean;
    otherTreasury?: boolean;
  } = {},
) {
  return new TelosGovernanceClient(source, async (path, body) => {
    if (path === 'get_info') return { chain_id: overrides.chainId ?? chainId };
    if (path === 'get_raw_abi')
      return {
        account_name: 'telos.decide',
        code_hash: overrides.codeHash ?? codeHash,
        abi_hash: abiHash,
      };
    if (body.table === 'ballots')
      return {
        rows: overrides.otherTreasury
          ? [ballot, { ...ballot, treasury_symbol: '4,TEST', total_raw_weight: '0.0000 TEST' }]
          : [ballot],
        more: body.lower_bound === undefined,
        next_key: '42',
      };
    if (body.table === 'voters')
      return {
        rows:
          overrides.registered === false
            ? []
            : [
                {
                  liquid: '999.0000 VOTE',
                  staked: '12.5000 VOTE',
                  staked_time: '2020-01-01T00:00:00',
                  delegated: '0.0000 VOTE',
                  delegated_to: '',
                  delegation_time: '2020-01-01T00:00:00',
                },
              ],
        more: false,
      };
    if (body.table === 'votes')
      return {
        rows: overrides.alreadyVoted ? [{ voter: 'voter', raw_votes: '12.5000 VOTE' }] : [],
        more: false,
      };
    throw new Error('Unexpected read');
  });
}
describe('external Telos governance', () => {
  it('retains Foundation leaderboard history without enabling its signing path', async () => {
    const foundation = {
      ...ballot,
      ballot_name: 'tfvt........2',
      category: 'leaderboard',
      publisher: 'tf',
      status: 'closed',
    };
    const reader = new TelosGovernanceClient(source, async (path) => {
      if (path === 'get_info') return { chain_id: chainId };
      if (path === 'get_raw_abi')
        return { account_name: source.contract, code_hash: codeHash, abi_hash: abiHash };
      return { rows: [foundation], more: false };
    });
    expect((await reader.ballots()).ballots[0]?.publisher).toBe('tf');
    expect((await reader.ballot('tfvt........2')).ballot.category).toBe('leaderboard');
    expect(() =>
      telosVoteActions(
        source,
        TelosBallotSchema.parse(foundation),
        { account: 'voter', registered: false, weight: null, alreadyVoted: false },
        ['alice'],
      ),
    ).toThrow('TELOS_BALLOT_UNSUPPORTED');
  });
  it('bounds empty election scans and preserves the first matching page continuation', async () => {
    let reads = 0;
    const reader = new TelosGovernanceClient(
      { ...source, codeHash: null, abiHash: null },
      async (path) => {
        if (path === 'get_info') return { chain_id: chainId };
        reads++;
        return {
          rows: [{ ...ballot, category: reads < 5 ? 'proposal' : 'leaderboard' }],
          more: true,
          next_key: String(reads + 1),
        };
      },
    );
    const empty = await reader.ballots(undefined, 'elections');
    expect(empty.ballots).toEqual([]);
    expect(empty.nextCursor).toBe('5');
    expect(reads).toBe(4);
    const found = await reader.ballots(empty.nextCursor ?? undefined, 'elections');
    expect(found.ballots[0]?.category).toBe('leaderboard');
    expect(found.nextCursor).toBe('6');
    expect(reads).toBe(5);
  });
  it('reads producer weight order and active schedule independently', async () => {
    const reader = new TelosGovernanceClient(source, async (path) => {
      if (path === 'get_info') return { chain_id: chainId };
      if (path === 'get_producers')
        return {
          rows: [
            {
              owner: 'alice',
              total_votes: '1200.50000000000000000',
              is_active: 1,
              url: 'javascript:alert(1)',
              location: 840,
            },
            {
              owner: 'bob',
              total_votes: '999.00000000000000000',
              is_active: 1,
              url: 'https://example.test',
              location: 826,
            },
          ],
          total_producer_vote_weight: '5000.00000000000000000',
          more: 'carol',
        };
      if (path === 'get_producer_schedule')
        return {
          active: { version: 42, producers: [{ producer_name: 'bob', authority: [] }] },
          pending: null,
          proposed: null,
        };
      throw Error('Unexpected RPC');
    });
    const page = await reader.producers();
    expect(page.source.contract).toBe('eosio');
    expect(page.producers.map((p) => p.owner)).toEqual(['alice', 'bob']);
    expect(page.activeSchedule).toEqual(['bob']);
    expect(page.nextCursor).toBe('carol');
    expect(page.producers[0]?.total_votes).toBe('1200.50000000000000000');
  });
  it('rejects producer chain mismatches, malformed weights and repeated cursors', async () => {
    const create = (chain: string, votes: string, cursor: string) =>
      new TelosGovernanceClient(source, async (path) => {
        if (path === 'get_info') return { chain_id: chain };
        if (path === 'get_producer_schedule') return { active: null };
        return {
          rows: [{ owner: 'alice', total_votes: votes, is_active: 1, url: '', location: 0 }],
          total_producer_vote_weight: '100.0',
          more: cursor,
        };
      });
    await expect(create('cd'.repeat(32), '1.0', '').producers()).rejects.toThrow(
      'TELOS_CHAIN_MISMATCH',
    );
    await expect(create(chainId, 'NaN', '').producers()).rejects.toThrow();
    await expect(create(chainId, '1.0', 'alice').producers('alice')).rejects.toThrow(
      'TELOS_CURSOR_INVALID',
    );
  });
  it('returns bounded retained records and an explicit continuation cursor', async () => {
    const page = await fixture().ballots();
    expect(page.ballots[0]?.ballot_name).toBe('election1');
    expect(page.nextCursor).toBe('42');
    expect(page.signingAvailable).toBe(true);
    await expect(fixture({ chainId: 'cd'.repeat(32) }).ballots()).rejects.toThrow(
      'TELOS_CHAIN_MISMATCH',
    );
    await expect(fixture().ballots('not-a-cursor')).rejects.toThrow();
  });
  it('reads contract-defined stake weight and refuses unsupported upgrades', async () => {
    const prepared = await fixture().prepareVote({
      ballot: 'election1',
      voter: 'voter',
      options: ['alice', 'bob'],
    });
    expect(prepared.voter.weight).toBe('12.5000 VOTE');
    expect(prepared.options).toEqual(['alice', 'bob']);
    await expect(
      fixture({ codeHash: '56'.repeat(32) }).prepareVote({
        ballot: 'election1',
        voter: 'voter',
        options: ['alice'],
      }),
    ).rejects.toThrow('TELOS_VOTE_UNAVAILABLE');
  });
  it('skips other treasuries while preserving the contract continuation cursor', async () => {
    const page = await fixture({ otherTreasury: true }).ballots();
    expect(page.ballots.map((b) => b.ballot_name)).toEqual(['election1']);
    expect(page.nextCursor).toBe('42');
  });
  it('encodes exact registration then casting without moving tokens', async () => {
    const prepared = await fixture({ registered: false }).prepareVote({
      ballot: 'election1',
      voter: 'voter',
      options: ['alice'],
    });
    const actions = telosVoteActions(
      prepared.source,
      prepared.ballot,
      prepared.voter,
      prepared.options,
    );
    expect(
      actions.map((a) => [a.account.toString(), a.name.toString(), a.authorization[0]?.toString()]),
    ).toEqual([
      ['telos.decide', 'regvoter', 'voter@active'],
      ['telos.decide', 'castvote', 'voter@active'],
    ]);
    const cast = actions[1];
    if (!cast) throw new Error('Casting action missing');
    expect(
      Serializer.objectify(
        Serializer.decode({ abi: telosDecideAbi, type: 'castvote', data: cast.data }),
      ),
    ).toEqual({ voter: 'voter', ballot_name: 'election1', options: ['alice'] });
  });
  it('rejects duplicate/unknown selections and expired or non-revotable ballots', async () => {
    const prepared = await fixture().prepareVote({
      ballot: 'election1',
      voter: 'voter',
      options: ['alice'],
    });
    for (const options of [['alice', 'alice'], ['intruder'], []])
      expect(() => telosVoteActions(source, prepared.ballot, prepared.voter, options)).toThrow();
    expect(() =>
      telosVoteActions(
        source,
        { ...prepared.ballot, end_time: '2020-01-02T00:00:00' },
        prepared.voter,
        ['alice'],
      ),
    ).toThrow('TELOS_BALLOT_CLOSED');
    expect(() =>
      telosVoteActions(source, prepared.ballot, { ...prepared.voter, weight: '0.0000 VOTE' }, [
        'alice',
      ]),
    ).toThrow('TELOS_NO_WEIGHT');
    expect(() =>
      telosVoteActions(source, { ...prepared.ballot, min_options: 2 }, prepared.voter, ['alice']),
    ).toThrow('TELOS_OPTIONS_INVALID');
    expect(() =>
      telosVoteActions(source, { ...prepared.ballot, max_options: 1 }, prepared.voter, [
        'alice',
        'bob',
      ]),
    ).toThrow('TELOS_OPTIONS_INVALID');
    const frozen = {
      ...prepared.ballot,
      settings: prepared.ballot.settings.map((s) =>
        s.key === 'revotable' ? { ...s, value: 0 as const } : s,
      ),
    };
    expect(() =>
      telosVoteActions(source, frozen, { ...prepared.voter, alreadyVoted: true }, ['alice']),
    ).toThrow('TELOS_ALREADY_VOTED');
  });
  it('rejects oversized or malformed records without inventing candidate metadata', () => {
    expect(TelosGovernanceSourceSchema.safeParse({ ...source, contract: 'rogue' }).success).toBe(
      false,
    );
    expect(TelosBallotSchema.safeParse({ ...ballot, title: 'x'.repeat(4097) }).success).toBe(false);
    expect(
      TelosBallotSchema.safeParse({ ...ballot, options: [{ key: 'alice', value: '-1.0000 VOTE' }] })
        .success,
    ).toBe(false);
  });
});

it('reports missing ballots and refuses non-advancing provider cursors', async () => {
  const client = new TelosGovernanceClient(source, async (path) =>
    path === 'get_info'
      ? { chain_id: chainId }
      : path === 'get_raw_abi'
        ? { account_name: source.contract, code_hash: codeHash, abi_hash: abiHash }
        : { rows: [], more: false },
  );
  await expect(client.ballot('absent')).rejects.toThrow('TELOS_BALLOT_UNKNOWN');
  const backwards = new TelosGovernanceClient(
    { ...source, codeHash: null, abiHash: null },
    async (path) =>
      path === 'get_info' ? { chain_id: chainId } : { rows: [], more: true, next_key: '1' },
  );
  await expect(backwards.ballots('2')).rejects.toThrow('TELOS_CURSOR_INVALID');
});
it('bounds UTF-8 metadata bytes and refuses light ballots that do not record votes', async () => {
  expect(TelosBallotSchema.safeParse({ ...ballot, title: 'é'.repeat(4096) }).success).toBe(false);
  const prepared = await fixture().prepareVote({
    ballot: 'election1',
    voter: 'voter',
    options: ['alice'],
  });
  const light = {
    ...prepared.ballot,
    settings: prepared.ballot.settings.map((s) =>
      s.key === 'lightballot' ? { ...s, value: 1 as const } : s,
    ),
  };
  expect(() => telosVoteActions(source, light, prepared.voter, ['alice'])).toThrow(
    'TELOS_BALLOT_UNSUPPORTED',
  );
});
it('accepts canonical ballot names with leading dots used by retained Telos records', async () => {
  const name = '..teloscrew1';
  const client = new TelosGovernanceClient(
    { ...source, codeHash: null, abiHash: null },
    async (path) =>
      path === 'get_info'
        ? { chain_id: chainId }
        : { rows: [{ ...ballot, ballot_name: name }], more: false },
  );
  expect((await client.ballots()).ballots[0]?.ballot_name).toBe(name);
  expect((await client.ballot(name)).ballot.ballot_name).toBe(name);
});
