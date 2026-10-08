import { expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { TimePointSec } from '@greymass/eosio';
import { ABI, Checksum256, PrivateKey, Serializer } from '@wharfkit/antelope';
import {
  runtimeAbi,
  RuntimeTableSchemas,
  encodeAction,
  makeInstruction,
  instructionDigest,
} from '@daclify/core-protocol/sdk';
import { load, row, send, listFirstParty } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
import { buildArchiveTree } from '../archive/format.js';
import { archiveSourceSchema } from '../archive/restore.js';
it('a Works agreement reference prevents root document pruning after full source backfill', async () => {
  const chain = new Blockchain();
  chain.createAccounts('alice', 'bob', 'relay', 'eosio.token');
  const core = load(chain, 'daclifycore', '.artifacts/core-release/runtime'),
    works = load(chain, 'works', '.artifacts/contracts/works'),
    key = PrivateKey.generate('K1'),
    worksHash = wasmCodeHash('.artifacts/contracts/works.wasm'),
    coreHash = wasmCodeHash('.artifacts/core-release/runtime.wasm'),
    cid = 'bafkreiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    hash = 'cd'.repeat(32),
    backup = 'ef'.repeat(32),
    abi = ABI.from(runtimeAbi);
  await send(core, 'init', ['ab'.repeat(32)], 'daclifycore@active');
  await send(core, 'initramobs', [], 'daclifycore@active');
  await listFirstParty(core, 'works', worksHash);
  await send(core, 'setramcode', ['works', worksHash], 'daclifycore@active');
  await send(core, 'createdao', [1, 'alice', '{}', 0, 'eosio.token', '4,TLOS'], 'alice@active');
  await send(core, 'enroll', [1, 1, '', key.toPublic().toString(), 'key', 0], 'alice@active');
  await send(core, 'setmodule', [1, 'works', 1, ['propose'], [], worksHash], 'alice@active');
  for (const version of [1, 2])
    await send(
      core,
      'putjson',
      ['daclifycore', 1, 1, 7, version, '{}', 0, 0],
      'daclifycore@active',
    );
  await send(
    works,
    'propose',
    ['daclifycore', 1, 1, 8, 1, 7, 1, ['1.0000 TLOS'], [2000]],
    'daclifycore@active',
  );
  await send(core, 'backfilldocs', [1, 25], 'daclifycore@active');
  for (const table of ['projects', 'milestones'])
    await send(works, 'backfillrefs', ['daclifycore', 1, table, 25], 'daclifycore@active');
  await send(core, 'setarchcfg', ['bob', 7776000, true], 'daclifycore@active');
  chain.addTime(TimePointSec.from(7776000));
  const original = row(core, 'documents', 1n, 1n),
    source = archiveSourceSchema('document-versions'),
    domain = {
      format_version: 1 as const,
      chain_id: 'ab'.repeat(32),
      runtime: 'daclifycore',
      dao_id: '1',
      source: 'daclifycore',
      code_hash: coreHash,
      abi_hash: source.rawAbiHash,
      schema_hash: source.schemaHash,
      table: 'documents',
      scope: '1',
      chunk_ordinal: 0,
      leaf_count: 1,
    },
    tree = buildArchiveTree(domain, [
      {
        primaryKey: '1',
        packed: Serializer.encode({ abi, type: 'document_record', object: original }).hexString,
      },
    ]);
  const manifest = {
    format_version: 1,
    chain_id: domain.chain_id,
    runtime: 'daclifycore',
    dao_id: '1',
    source: 'daclifycore',
    code_hash: coreHash,
    abi_hash: source.rawAbiHash,
    block_number: 1,
    block_id: '00000001' + 'ab'.repeat(28),
    timestamp: '2026-01-01T00:00:00Z',
    families: [
      {
        kind: 'document-versions',
        parent_id: '7',
        table: 'documents',
        scope: '1',
        schema_hash: source.schemaHash,
        records: '1',
        chunks: [
          {
            domain,
            root: tree.root,
            cid,
            bytes: 500,
            commitment: hash,
            first_key: '1',
            last_key: '1',
          },
        ],
      },
    ],
    files: [],
  };
  await send(core, 'archattest', [1, manifest, cid, 4096, hash, backup, 7776000], 'bob@active');
  const member = RuntimeTableSchemas.members.parse(row(core, 'members', 1n, 1n)),
    request = makeInstruction(
      { chainId: domain.chain_id, contract: 'daclifycore', daoId: '1', interfaceVersion: 1 },
      '1',
      member.nonce,
      chain.timestamp.toMilliseconds() / 1000 + 120,
      'daclifycore',
      'archapprove',
      encodeAction('archapprove', {
        runtime: 'daclifycore',
        dao_id: '1',
        member_id: '1',
        manifest_commitment: hash,
        descriptor_commitment: Checksum256.hash(
          Serializer.encode({ abi, type: 'archive_manifest_descriptor', object: manifest }).array,
        ).toString(),
        backup_commitment: backup,
        retention_seconds: 7776000,
      }),
    );
  await send(
    core,
    'submit',
    [request, key.signDigest(instructionDigest(request)).toString()],
    'relay@active',
  );
  await expect(
    send(core, 'prunedocs', [1, 1, 0, 0, [{ primary_key: '1', siblings: [] }]], 'bob@active'),
  ).rejects.toThrow('DOCUMENT_REFERENCED');
  expect(row(core, 'documents', 1n, 1n)).toEqual(original);
  expect(row(core, 'archpos', 1n, 32n)).toMatchObject({ pruned: 0 });
});
