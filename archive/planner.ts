import { ABI, Name, Serializer } from '@wharfkit/antelope';
import { ramRowBytes } from '@daclify/core-protocol';
import { decideAbi } from '../sdk/generated/decide.js';
import {
  OrdinaryPollArchiveInputSchema,
  OrdinaryPollArchivePlanSchema,
  type OrdinaryPollArchivePlan,
} from '../protocol/archive.js';
import { archiveSourceSchema } from './restore.js';
import { buildArchiveTree } from './format.js';
export function planOrdinaryPollArchive(value: unknown): OrdinaryPollArchivePlan {
  const input = OrdinaryPollArchiveInputSchema.parse(value),
    schema = archiveSourceSchema('ordinary-poll-votes');
  const snapshotTime = Date.parse(input.snapshot.timestamp) / 1000;
  if (
    input.source.account === input.dao.contract ||
    input.source.codeHash !== schema.codeHash ||
    input.source.abiHash !== schema.rawAbiHash
  )
    throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  if (
    parseInt(input.snapshot.blockId.slice(0, 8), 16) !== input.snapshot.blockNumber ||
    Date.parse(input.sourceUpdatedAt) > Date.parse(input.snapshot.timestamp)
  )
    throw new RangeError('ARCHIVE_SNAPSHOT_UNQUALIFIED');
  const ballots = new Map(input.ballots.map((row) => [row.id, row])),
    terminals = new Map(input.terminals.map((row) => [row.ballot_id, row]));
  if (ballots.size !== input.ballots.length || terminals.size !== input.terminals.length)
    throw new RangeError('ARCHIVE_DUPLICATE_ROW');
  for (const row of [
    ...input.ballots,
    ...input.terminals,
    ...input.elections,
    ...input.executions,
    ...input.grantplans,
  ])
    if (row.dao_id !== input.dao.daoId) throw new RangeError('ARCHIVE_ROW_DOMAIN');
  for (const row of input.terminals)
    if (!ballots.has(row.ballot_id)) throw new RangeError('ARCHIVE_ROW_DOMAIN');
  const ids = new Set<string>(),
    members = new Set<string>();
  for (const row of input.votes) {
    const b = ballots.get(row.ballot),
      member = row.ballot + ':' + row.member;
    if (
      !b ||
      ids.has(row.id) ||
      members.has(member) ||
      row.id === '0' ||
      row.member === '0' ||
      BigInt(row.member) > BigInt(b.max_member) ||
      BigInt(row.weight) <= 0n ||
      row.choice >= b.choices ||
      (b.kind === 0 && row.weight !== '1')
    )
      throw new RangeError('ARCHIVE_ROW_DOMAIN');
    ids.add(row.id);
    members.add(member);
  }
  const protectedIds = new Set([
    ...input.elections.map((row) => row.id),
    ...input.executions.map((row) => row.ballot_id),
    ...input.grantplans.map((row) => row.ballot_id),
  ]);
  const plan: OrdinaryPollArchivePlan = {
    dao: input.dao,
    source: input.source,
    snapshot: input.snapshot,
    pruningAuthorized: false,
    grossRamBytes: '0',
    blocked: [],
    families: [],
  };
  const abi = ABI.from(decideAbi);
  for (const b of [...input.ballots].sort((a, c) => (BigInt(a.id) < BigInt(c.id) ? -1 : 1))) {
    const terminal = terminals.get(b.id);
    const reason = protectedIds.has(b.id)
      ? 'protected-family'
      : b.status === 0
        ? 'ballot-active'
        : !terminal?.completed_at
          ? 'terminal-marker-required'
          : terminal.completed_at > snapshotTime
            ? 'terminal-not-irreversible'
            : snapshotTime - terminal.completed_at < input.retentionSeconds
              ? 'retention'
              : undefined;
    if (reason) {
      plan.blocked.push({ parentId: b.id, reason });
      continue;
    }
    if (!terminal || terminal.completed_at < b.closes)
      throw new RangeError('ARCHIVE_TERMINAL_INVALID');
    if (
      (b.status !== 1 && b.status !== 2) ||
      b.kind > 2 ||
      b.choices < 2 ||
      b.choices > 16 ||
      b.tallies.length !== b.choices
    )
      throw new RangeError('ARCHIVE_BALLOT_INVALID');
    const votes = input.votes
      .filter((row) => row.ballot === b.id)
      .sort((a, c) => (BigInt(a.id) < BigInt(c.id) ? -1 : 1));
    const tallies = Array<bigint>(b.choices).fill(0n);
    let cast = 0n;
    for (const row of votes) {
      cast += BigInt(row.weight);
      tallies[row.choice] = (tallies[row.choice] ?? 0n) + BigInt(row.weight);
    }
    if (
      cast !== BigInt(b.cast) ||
      cast > BigInt(b.denominator) ||
      tallies.some((weight, i) => weight !== BigInt(b.tallies[i] ?? '0'))
    )
      throw new RangeError('ARCHIVE_COVERAGE_INCOMPLETE');
    const rows = votes.map((row) => ({
      primaryKey: row.id,
      packed: Serializer.encode({ abi, type: schema.rowType, object: row }).hexString,
    }));
    const gross = rows.reduce((sum, row) => sum + ramRowBytes(row.packed.length / 2, [16]), 0n);
    const family: OrdinaryPollArchivePlan['families'][number] = {
      kind: 'ordinary-poll-votes',
      parentId: b.id,
      grossRamBytes: gross.toString(),
      chunks: [],
    };
    if (rows.length) {
      const domain = {
        format_version: 1 as const,
        chain_id: input.dao.chainId,
        runtime: input.dao.contract,
        dao_id: input.dao.daoId,
        source: input.source.account,
        code_hash: schema.codeHash,
        abi_hash: schema.rawAbiHash,
        schema_hash: schema.schemaHash,
        table: 'votes',
        scope: Name.from(input.dao.contract).value.toString(),
        chunk_ordinal: 0,
        leaf_count: rows.length,
      };
      const tree = buildArchiveTree(domain, rows);
      family.chunks.push({ domain, rows, root: tree.root, bytes: tree.encodedBytes });
    }
    plan.families.push(family);
    plan.grossRamBytes = (BigInt(plan.grossRamBytes) + gross).toString();
  }
  return OrdinaryPollArchivePlanSchema.parse(plan);
}
