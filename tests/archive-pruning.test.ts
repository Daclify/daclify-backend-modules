import { beforeEach, expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { ABI, Checksum256, Name, PrivateKey, Serializer } from '@wharfkit/antelope';
import { readFileSync } from 'node:fs';
import {
  encodeAction,
  instructionDigest,
  makeInstruction,
  RuntimeTableSchemas,
} from '@daclify/core-protocol/sdk';
import { load, row, send, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
import { buildArchiveTree } from '../archive/format.js';
import { ArchiveDomainSchema } from '../protocol/archive.js';
const runtimeName = 'daclifycore',
  chainId = 'ab'.repeat(32),
  cid = 'bafkreiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  hash = 'cd'.repeat(32),
  backup = 'ef'.repeat(32);
const key = PrivateKey.generate('K1'),
  codeHash = wasmCodeHash('.artifacts/contracts/decide.wasm');
const scope = Name.from(runtimeName).value.toString();
let chain: Blockchain, core: ReturnType<typeof load>, decide: ReturnType<typeof load>;
function manifest() {
  const voteAbi = ABI.from(readFileSync('.artifacts/contracts/decide.abi', 'utf8'));
  const records = [1, 2].map((id) => ({
    primaryKey: String(id),
    packed: Serializer.encode({
      abi: voteAbi,
      type: 'vote_record',
      object: row(decide, 'votes', BigInt(scope), BigInt(id)),
    }).hexString,
  }));
  const domain = ArchiveDomainSchema.parse({
    format_version: 1,
    chain_id: chainId,
    runtime: runtimeName,
    dao_id: '1',
    source: 'decide',
    code_hash: codeHash,
    abi_hash: 'ad'.repeat(32),
    schema_hash: 'be'.repeat(32),
    table: 'votes',
    scope,
    chunk_ordinal: 0,
    leaf_count: 2,
  });
  const tree = buildArchiveTree(domain, records);
  const value = {
    format_version: 1,
    chain_id: chainId,
    runtime: runtimeName,
    dao_id: '1',
    source: 'decide',
    code_hash: codeHash,
    abi_hash: domain.abi_hash,
    block_number: 1,
    block_id: '00000001' + 'ab'.repeat(28),
    timestamp: '2026-01-01T00:00:00.000Z',
    families: [
      {
        kind: 'ordinary-poll-votes',
        parent_id: '1',
        table: 'votes',
        scope,
        schema_hash: domain.schema_hash,
        records: '2',
        chunks: [
          {
            domain,
            root: tree.root,
            cid,
            bytes: 500,
            commitment: hash,
            first_key: '1',
            last_key: '2',
          },
        ],
      },
    ],
    files: [],
  };
  return { value, records, tree };
}
async function approve(
  value: ReturnType<typeof manifest>['value'],
  action: 'archapprove' | 'archrevoke' = 'archapprove',
) {
  const abi = ABI.from(readFileSync('.artifacts/core-release/runtime.abi', 'utf8'));
  const descriptor = Checksum256.hash(
    Serializer.encode({ abi, type: 'archive_manifest_descriptor', object: value }).array,
  ).toString();
  const member = RuntimeTableSchemas.members.parse(row(core, 'members', 1n, 1n));
  const instruction = makeInstruction(
    { chainId, contract: runtimeName, daoId: '1', interfaceVersion: 1 },
    '1',
    member.nonce,
    chain.timestamp.toMilliseconds() / 1000 + 120,
    runtimeName,
    action,
    encodeAction(action, {
      runtime: runtimeName,
      dao_id: '1',
      member_id: '1',
      manifest_commitment: hash,
      descriptor_commitment: descriptor,
      backup_commitment: backup,
      retention_seconds: 7776000,
    }),
  );
  await send(
    core,
    'submit',
    [instruction, key.signDigest(instructionDigest(instruction)).toString()],
    'relay@active',
  );
}
beforeEach(async () => {
  chain = new Blockchain();
  chain.createAccounts('alice', 'bob', 'relay', 'eosio.token');
  core = load(chain, runtimeName, '.artifacts/core-release/runtime');
  decide = load(chain, 'decide', '.artifacts/contracts/decide');
  await send(core, 'init', [chainId], runtimeName + '@active');
  await send(core, 'initramobs', [], runtimeName + '@active');
  await listFirstParty(core, 'decide', codeHash);
  await send(core, 'setramcode', ['decide', codeHash], runtimeName + '@active');
  await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  for (const id of [1, 2])
    await send(
      core,
      'enroll',
      [1, id, '', (id === 1 ? key : PrivateKey.generate('K1')).toPublic().toString(), 'key', 0],
      'alice@active',
    );
  await send(
    core,
    'setmodule',
    [1, 'decide', 1, ['open', 'vote'], ['govlock'], codeHash],
    'alice@active',
  );
  await send(core, 'setarchcfg', ['bob', 7776000, true], runtimeName + '@active');
  await send(
    decide,
    'open',
    [runtimeName, 1, 1, 1, 0, 2, 60, 5000, 5001, '{}'],
    runtimeName + '@active',
  );
  for (const member of [1, 2])
    await send(decide, 'vote', [runtimeName, 1, member, 1, 1], runtimeName + '@active');
  chain.addTime(TimePointSec.from(61));
  await send(decide, 'finalize', [runtimeName, 1, 1], 'bob@active');
});
async function attest(value: ReturnType<typeof manifest>['value']) {
  await send(core, 'archattest', [1, value, cid, 4096, hash, backup, 7776000], 'bob@active');
}
function batch(tree: ReturnType<typeof buildArchiveTree>, start = 0, count = 1) {
  return Array.from({ length: count }, (_, i) => ({
    primary_key: String(start + i + 1),
    siblings: tree.proof(start + i),
  }));
}
it('requires approved mature source rows, advances exact bounded progress and preserves permanent IDs', async () => {
  const { value, tree } = manifest();
  await attest(value);
  await approve(value);
  await expect(
    send(decide, 'prunevotes', [runtimeName, 1, 1, 0, 0, batch(tree)], 'bob@active'),
  ).rejects.toThrow('ARCHIVE_RETENTION');
  chain.addTime(TimePointSec.from(7776000));
  await attest(value);
  const original = row(decide, 'ballots', BigInt(scope), 1n);
  await send(decide, 'prunevotes', [runtimeName, 1, 1, 0, 0, batch(tree)], 'bob@active');
  expect(row(decide, 'votes', BigInt(scope), 1n)).toBeUndefined();
  expect(row(core, 'archpos', 1n, 32n)).toMatchObject({ pruned: 1 });
  await send(decide, 'prunevotes', [runtimeName, 1, 1, 0, 0, batch(tree)], 'bob@active');
  expect(row(core, 'archpos', 1n, 32n)).toMatchObject({ pruned: 1 });
  await send(decide, 'prunevotes', [runtimeName, 1, 1, 0, 1, batch(tree, 1)], 'bob@active');
  expect(row(decide, 'votes', BigInt(scope), 2n)).toBeUndefined();
  expect(row(decide, 'ballots', BigInt(scope), 1n)).toEqual(original);
  await send(
    decide,
    'open',
    [runtimeName, 1, 1, 2, 0, 2, 60, 5000, 5001, '{}'],
    runtimeName + '@active',
  );
  await send(decide, 'vote', [runtimeName, 1, 1, 2, 1], runtimeName + '@active');
  expect(row(decide, 'votes', BigInt(scope), 3n)).toMatchObject({ ballot: 2 });
  expect(row(decide, 'votes', BigInt(scope), 1n)).toBeUndefined();
});
it('rolls back an entire batch for a corrupt proof and rejects revoked approval and forged progress', async () => {
  const { value, tree } = manifest();
  chain.addTime(TimePointSec.from(7776000));
  await attest(value);
  await approve(value);
  const invalid = batch(tree, 0, 2);
  invalid[1] = { primary_key: '2', siblings: ['ff'.repeat(32)] };
  await expect(
    send(decide, 'prunevotes', [runtimeName, 1, 1, 0, 0, invalid], 'bob@active'),
  ).rejects.toThrow('ARCHIVE_PROOF');
  expect(row(decide, 'votes', BigInt(scope), 1n)).toBeDefined();
  expect(row(core, 'archpos', 1n, 32n)).toMatchObject({ pruned: 0 });
  await expect(send(core, 'archstep', [1, 'decide', 1, 0, 0, 1], 'decide@active')).rejects.toThrow(
    'ARCHIVE_SOURCE_SENDER',
  );
  await approve(value, 'archrevoke');
  await expect(
    send(decide, 'prunevotes', [runtimeName, 1, 1, 0, 0, batch(tree)], 'bob@active'),
  ).rejects.toThrow('ARCHIVE_APPROVAL');
});
