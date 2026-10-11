import { Action, Name } from '@wharfkit/antelope';
import { z } from 'zod';
import { NativeAccountSchema, Uint64Schema } from '@daclify/core-protocol';
import {
  TelosBallotSchema,
  TelosBallotNameSchema,
  TelosGovernanceSourceSchema,
  TelosVoteInputSchema,
  TelosVoterStateSchema,
  TelosBallotPageSchema,
  TelosBallotDetailSchema,
  TelosVotePreparationSchema,
  TelosVoteWeightSchema,
  type TelosGovernanceSource,
  type TelosBallot,
  type TelosVoterState,
  type TelosVoteInput,
} from '../protocol/telos-governance.js';
import { telosDecideAbi } from './telos-decide-abi.js';
export { telosDecideAbi };
export type TelosGovernanceRpc = (
  path: 'get_info' | 'get_raw_abi' | 'get_table_rows',
  body: Record<string, unknown>,
) => Promise<unknown>;
const rowsSchema = z.object({
  rows: z.array(z.unknown()).max(25),
  more: z.boolean(),
  next_key: z.string().max(20).optional(),
});
const flag = (ballot: TelosBallot, key: string) =>
  ballot.settings.find((s) => s.key === key)?.value === 1;
export function telosBallotSupportsVoting(ballot: TelosBallot): boolean {
  return (
    ballot.treasury_symbol === '4,VOTE' &&
    ['proposal', 'election'].includes(ballot.category) &&
    !flag(ballot, 'lightballot') &&
    ['1token1vote', '1tokennvote', '1acct1vote'].includes(ballot.voting_method)
  );
}
export function telosVoteActions(
  source: TelosGovernanceSource,
  ballot: TelosBallot,
  voter: TelosVoterState,
  options: string[],
  now = Date.now(),
): Action[] {
  TelosGovernanceSourceSchema.parse(source);
  TelosBallotSchema.parse(ballot);
  TelosVoterStateSchema.parse(voter);
  const selected = TelosVoteInputSchema.shape.options.parse(options);
  if (!telosBallotSupportsVoting(ballot)) throw new Error('TELOS_BALLOT_UNSUPPORTED');
  if (
    ballot.status !== 'voting' ||
    now < Date.parse(ballot.begin_time + 'Z') ||
    now >= Date.parse(ballot.end_time + 'Z')
  )
    throw new Error('TELOS_BALLOT_CLOSED');
  if (
    selected.length < ballot.min_options ||
    selected.length > ballot.max_options ||
    selected.some((o) => !ballot.options.some((row) => row.key === o))
  )
    throw new Error('TELOS_OPTIONS_INVALID');
  if (voter.alreadyVoted && !flag(ballot, 'revotable')) throw new Error('TELOS_ALREADY_VOTED');
  if (
    voter.registered &&
    (!voter.weight || BigInt(voter.weight.replace('.', '').split(' ')[0] ?? '') === 0n)
  )
    throw new Error('TELOS_NO_WEIGHT');
  const authorization = [{ actor: voter.account, permission: 'active' }];
  const actions: Action[] = [];
  if (!voter.registered)
    actions.push(
      Action.from(
        {
          account: source.contract,
          name: 'regvoter',
          authorization,
          data: { voter: voter.account, treasury_symbol: '4,VOTE', referrer: null },
        },
        telosDecideAbi,
      ),
    );
  actions.push(
    Action.from(
      {
        account: source.contract,
        name: 'castvote',
        authorization,
        data: { voter: voter.account, ballot_name: ballot.ballot_name, options: selected },
      },
      telosDecideAbi,
    ),
  );
  return actions;
}
export class TelosGovernanceClient {
  readonly source: TelosGovernanceSource;
  constructor(
    source: TelosGovernanceSource,
    private readonly rpc: TelosGovernanceRpc,
  ) {
    this.source = TelosGovernanceSourceSchema.parse(source);
  }
  private async checkSource(): Promise<boolean> {
    const info = z.object({ chain_id: z.string() }).parse(await this.rpc('get_info', {}));
    if (info.chain_id !== this.source.chainId) throw new Error('TELOS_CHAIN_MISMATCH');
    if (!this.source.codeHash || !this.source.abiHash) return false;
    const pins = z
      .object({ account_name: z.string(), code_hash: z.string(), abi_hash: z.string() })
      .parse(await this.rpc('get_raw_abi', { account_name: this.source.contract }));
    return (
      pins.account_name === this.source.contract &&
      pins.code_hash === this.source.codeHash &&
      pins.abi_hash === this.source.abiHash
    );
  }
  private async rows(table: string, scope: string, bounds: Record<string, unknown> = {}) {
    return rowsSchema.parse(
      await this.rpc('get_table_rows', {
        json: true,
        code: this.source.contract,
        scope,
        table,
        limit: 25,
        ...bounds,
      }),
    );
  }
  async ballots(cursor?: string) {
    if (cursor !== undefined) Uint64Schema.parse(cursor);
    const signingAvailable = await this.checkSource();
    const page = await this.rows(
      'ballots',
      this.source.contract,
      cursor === undefined ? {} : { lower_bound: cursor },
    );
    if (
      page.more &&
      (!page.next_key ||
        !Uint64Schema.safeParse(page.next_key).success ||
        (cursor !== undefined && BigInt(page.next_key) <= BigInt(cursor)))
    )
      throw new Error('TELOS_CURSOR_INVALID');
    const ballots = page.rows
      .filter((row) => {
        const header = z
          .object({ treasury_symbol: z.string().max(16), category: NativeAccountSchema })
          .parse(row);
        return (
          header.treasury_symbol === '4,VOTE' && ['proposal', 'election'].includes(header.category)
        );
      })
      .map((row) => TelosBallotSchema.parse(row));
    return TelosBallotPageSchema.parse({
      source: this.source,
      ballots,
      nextCursor: page.more ? page.next_key : null,
      observedAt: new Date().toISOString(),
      signingAvailable,
    });
  }
  async ballot(name: string) {
    const key = Name.from(TelosBallotNameSchema.parse(name)).value.toString();
    const signingAvailable = await this.checkSource();
    const rows = await this.rows('ballots', this.source.contract, {
      lower_bound: key,
      upper_bound: key,
      limit: 1,
    });
    if (rows.rows[0] === undefined) throw new Error('TELOS_BALLOT_UNKNOWN');
    const header = z
      .object({
        ballot_name: TelosBallotNameSchema,
        treasury_symbol: z.string().max(16),
        category: NativeAccountSchema,
      })
      .parse(rows.rows[0]);
    if (
      header.ballot_name !== name ||
      header.treasury_symbol !== '4,VOTE' ||
      !['proposal', 'election'].includes(header.category)
    )
      throw new Error('TELOS_BALLOT_UNKNOWN');
    const ballot = TelosBallotSchema.parse(rows.rows[0]);
    return TelosBallotDetailSchema.parse({
      source: this.source,
      ballot,
      signingAvailable,
      observedAt: new Date().toISOString(),
    });
  }
  async voter(name: string, ballot: TelosBallot) {
    NativeAccountSchema.parse(name);
    const key = Name.from(name).value.toString();
    const [voters, votes] = await Promise.all([
      this.rows('voters', name, { lower_bound: '1163153238', upper_bound: '1163153238', limit: 1 }),
      this.rows('votes', ballot.ballot_name, { lower_bound: key, upper_bound: key, limit: 1 }),
    ]);
    const row = voters.rows[0];
    const voter =
      row === undefined
        ? null
        : z.object({ liquid: TelosVoteWeightSchema, staked: TelosVoteWeightSchema }).parse(row);
    const receipt =
      votes.rows[0] === undefined
        ? null
        : z.object({ voter: NativeAccountSchema }).parse(votes.rows[0]);
    if (receipt && receipt.voter !== name) throw new Error('TELOS_VOTER_INVALID');
    return TelosVoterStateSchema.parse({
      account: name,
      registered: voter !== null,
      weight: voter ? (flag(ballot, 'votestake') ? voter.staked : voter.liquid) : null,
      alreadyVoted: receipt !== null,
    });
  }
  async prepareVote(input: TelosVoteInput) {
    const value = TelosVoteInputSchema.parse(input),
      detail = await this.ballot(value.ballot);
    if (!detail.signingAvailable) throw new Error('TELOS_VOTE_UNAVAILABLE');
    const voter = await this.voter(value.voter, detail.ballot);
    telosVoteActions(this.source, detail.ballot, voter, value.options);
    return TelosVotePreparationSchema.parse({
      source: this.source,
      ballot: detail.ballot,
      voter,
      options: value.options,
      expires: new Date(Date.now() + 60000).toISOString(),
    });
  }
}
