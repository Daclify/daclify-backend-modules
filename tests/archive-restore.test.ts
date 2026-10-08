import { expect, it } from 'vitest';
import { ABI, Name, Serializer } from '@wharfkit/antelope';
import { decideAbi, DecideTableSchemas } from '../sdk/index.js';
import { runtimeAbi, RuntimeTableSchemas } from '@daclify/core-protocol/sdk';
import { ArchiveDomainSchema } from '../protocol/archive.js';
import { archiveSourceSchema, decodeReleasedArchiveRow } from '../archive/restore.js';
const row = DecideTableSchemas.votes.parse({
  id: '3',
  ballot: '7',
  member: '1',
  weight: '200',
  choice: 1,
});
function input() {
  const schema = archiveSourceSchema('ordinary-poll-votes');
  return {
    domain: ArchiveDomainSchema.parse({
      format_version: 1,
      chain_id: 'ab'.repeat(32),
      runtime: 'daclifycore',
      dao_id: '2',
      source: 'decide',
      code_hash: schema.codeHash,
      abi_hash: schema.rawAbiHash,
      schema_hash: schema.schemaHash,
      table: 'votes',
      scope: Name.from('daclifycore').value.toString(),
      chunk_ordinal: 0,
      leaf_count: 1,
    }),
    row: {
      primaryKey: '3',
      packed: Serializer.encode({ abi: ABI.from(decideAbi), type: 'vote_record', object: row })
        .hexString,
    },
  };
}
it('decodes a whitelisted released row and preserves exact original packed bytes', () => {
  const value = input();
  expect(decodeReleasedArchiveRow(value.domain, value.row, '7')).toEqual({
    kind: 'ordinary-poll-votes',
    value: row,
    original: value.row,
  });
});
it('rejects unknown code/ABI/schema/scope, another parent and altered primary identity', () => {
  const value = input();
  for (const change of [
    { code_hash: 'cd'.repeat(32) },
    { abi_hash: 'cd'.repeat(32) },
    { schema_hash: 'cd'.repeat(32) },
    { scope: '0' },
  ])
    expect(() => decodeReleasedArchiveRow({ ...value.domain, ...change }, value.row, '7')).toThrow(
      'ARCHIVE_SCHEMA_UNSUPPORTED',
    );
  expect(() => decodeReleasedArchiveRow(value.domain, value.row, '8')).toThrow(
    'ARCHIVE_ROW_DOMAIN',
  );
  expect(() =>
    decodeReleasedArchiveRow(value.domain, { ...value.row, primaryKey: '4' }, '7'),
  ).toThrow('ARCHIVE_ROW_DOMAIN');
  expect(() =>
    decodeReleasedArchiveRow(value.domain, { ...value.row, packed: value.row.packed + '00' }, '7'),
  ).toThrow();
});
it('preserves original document ciphertext and epoch metadata under its qualified DAO scope', () => {
  const schema = archiveSourceSchema('document-versions');
  const domain = ArchiveDomainSchema.parse({
    ...input().domain,
    source: 'daclifycore',
    table: 'documents',
    scope: '2',
    code_hash: schema.codeHash,
    abi_hash: schema.rawAbiHash,
    schema_hash: schema.schemaHash,
  });
  const document = RuntimeTableSchemas.documents.parse({
    id: '5',
    document_id: '6',
    version: 2,
    author: '1',
    cid: '',
    metadata: '{"encrypted":"opaque-test-ciphertext"}',
    commitment: 'ab'.repeat(32),
    bytes: 38,
    envelope_version: 1,
    key_epoch: '3',
  });
  const original = {
    primaryKey: '5',
    packed: Serializer.encode({ abi: ABI.from(runtimeAbi), type: schema.rowType, object: document })
      .hexString,
  };
  expect(decodeReleasedArchiveRow(domain, original, '6')).toEqual({
    kind: 'document-versions',
    value: document,
    original,
  });
  expect(() => decodeReleasedArchiveRow({ ...domain, scope: '3' }, original, '6')).toThrow(
    'ARCHIVE_SCHEMA_UNSUPPORTED',
  );
});

it('decodes the retained trusted pre-pruning schema after a contract update', async () => {
  const { previousPollRelease } = await import('../archive/releases/ordinary-polls-observer.js');
  const value = input(),
    old = previousPollRelease.identity;
  const domain = {
    ...value.domain,
    code_hash: old.codeHash,
    abi_hash: old.rawAbiHash,
    schema_hash: old.schemaHash,
  };
  const packed = Serializer.encode({
    abi: ABI.from(previousPollRelease.abi),
    type: 'vote_record',
    object: row,
  }).hexString;
  expect(decodeReleasedArchiveRow(domain, { primaryKey: '3', packed }, '7').value).toEqual(row);
  expect(() =>
    decodeReleasedArchiveRow(
      { ...domain, schema_hash: value.domain.schema_hash },
      { primaryKey: '3', packed },
      '7',
    ),
  ).toThrow('ARCHIVE_SCHEMA_UNSUPPORTED');
});
it('retains the pruning release decoder across a payer-binding code and ABI upgrade', async () => {
  const { pruningPollRelease } = await import('../archive/releases/ordinary-polls-pruning.js');
  const current = input(),
    old = pruningPollRelease.identity;
  const domain = {
    ...current.domain,
    code_hash: old.codeHash,
    abi_hash: old.rawAbiHash,
    schema_hash: old.schemaHash,
  };
  const packed = Serializer.encode({
    abi: ABI.from(pruningPollRelease.abi),
    type: 'vote_record',
    object: row,
  }).hexString;
  expect(decodeReleasedArchiveRow(domain, { primaryKey: '3', packed }, '7').value).toEqual(row);
});
it.each(['before-pools', 'pool-checkpoint'])(
  'reads original encrypted document records from retained %s core schema',
  async (checkpoint) => {
    const { previousDocumentRelease: release } =
      await import('../archive/releases/document-versions-before-pools.js');
    const { documentPoolsIdentity } =
      await import('../archive/releases/document-versions-pools.js');
    const old = checkpoint === 'before-pools' ? release.identity : documentPoolsIdentity,
      domain = {
        ...input().domain,
        source: 'daclifycore',
        table: 'documents',
        scope: '2',
        code_hash: old.codeHash,
        abi_hash: old.rawAbiHash,
        schema_hash: old.schemaHash,
      };
    const document = RuntimeTableSchemas.documents.parse({
      id: '5',
      document_id: '6',
      version: 2,
      author: '1',
      cid: '',
      metadata: '{"encrypted":"original"}',
      commitment: 'ab'.repeat(32),
      bytes: 24,
      envelope_version: 1,
      key_epoch: '3',
    });
    const packed = Serializer.encode({
      abi: ABI.from(release.abi),
      type: 'document_record',
      object: document,
    }).hexString;
    expect(decodeReleasedArchiveRow(domain, { primaryKey: '5', packed }, '6').value).toEqual(
      document,
    );
    expect(() =>
      decodeReleasedArchiveRow(
        { ...domain, code_hash: archiveSourceSchema('document-versions').codeHash },
        { primaryKey: '5', packed },
        '6',
      ),
    ).toThrow('ARCHIVE_SCHEMA_UNSUPPORTED');
  },
);
