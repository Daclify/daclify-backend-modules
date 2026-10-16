import { expect, it } from 'vitest';
import { archiveSourceSchema } from '../archive/index.js';
it('recognizes the actual pre-privacy document and ordinary ballot archive identities after upgrading', () => {
  expect(
    archiveSourceSchema('document-versions', {
      codeHash: 'afa80071de5578e915c5b4c37d02f294c612a713299fa264116e7f338d65ca2d',
      abiHash: '3855a7b8e283d33744ad126b3e1762fa15bf7fe8b4c0534b4e8a8104f4d0c5b4',
    }).rowType,
  ).toBe('document_record');
  expect(
    archiveSourceSchema('ordinary-poll-votes', {
      codeHash: '1dbbd528e111c750e1b33eeef21db2252243de134fede3dea02ebb4341f1b95c',
      abiHash: '2268cd779edfda686b5b5533ea1a9f8b771952b43c2628cdda28ac5e30e44511',
    }).rowType,
  ).toBe('vote_record');
});

import { ABI, Name, Serializer } from '@wharfkit/antelope';
import { ArchiveDomainSchema } from '../protocol/archive.js';
import { contentPrivacyArchiveReleases } from '../archive/releases/content-privacy-previous.js';
import { previousContactArchiveReleases } from '../archive/releases/trusted-contact-previous.js';
import { decodeReleasedArchiveRow } from '../archive/index.js';
import { snapshotFixture } from './helpers/quick-ballot.js';
const quick = snapshotFixture().responses[0];
if (!quick) throw Error('QUICK_FIXTURE_REQUIRED');
const cases = [
  {
    kind: 'document-versions',
    table: 'documents',
    source: 'daclifycore',
    row: {
      id: '1',
      document_id: '9',
      version: 1,
      author: '1',
      cid: '',
      metadata: '{}',
      bytes: 2,
      commitment: 'ab'.repeat(32),
      envelope_version: 0,
      key_epoch: '0',
    },
  },
  {
    kind: 'ordinary-poll-votes',
    table: 'votes',
    source: 'decide',
    row: { id: '1', ballot: '9', member: '1', weight: '1', choice: 1 },
  },
  {
    kind: 'quick-ballot-responses',
    table: 'qresponses',
    source: 'quickvote',
    row: { ...quick, id: '1', dao_id: '7', ballot_id: '9' },
  },
  {
    kind: 'quick-ballot-grants',
    table: 'qgrants',
    source: 'quickvote',
    row: { id: '9', dao_id: '7', grants: ['aa'.repeat(48)] },
  },
] as const;
it.each(cases)(
  'restores exact historical $kind rows while refusing unknown code, schema, scope and trailing bytes',
  (test) => {
    for (const release of contentPrivacyArchiveReleases[test.kind]) {
      const schema = archiveSourceSchema(test.kind, {
        codeHash: release.codeHash,
        abiHash: release.rawAbiHash,
      });
      expect(schema).toMatchObject(release);
      const abi = ABI.from(previousContactArchiveReleases[test.kind].abi);
      const row = {
        primaryKey: test.row.id,
        packed: Serializer.encode({ abi, type: release.rowType, object: test.row }).hexString,
      };
      const domain = ArchiveDomainSchema.parse({
        format_version: 1,
        chain_id: 'ab'.repeat(32),
        runtime: 'daclifycore',
        dao_id: '7',
        source: test.source,
        code_hash: release.codeHash,
        abi_hash: release.rawAbiHash,
        schema_hash: release.schemaHash,
        table: test.table,
        scope: test.kind === 'document-versions' ? '7' : Name.from('daclifycore').value.toString(),
        chunk_ordinal: 0,
        leaf_count: 1,
      });
      expect(decodeReleasedArchiveRow(domain, row, '9')).toMatchObject({
        kind: test.kind,
        value: test.row,
        original: row,
      });
      for (const field of ['code_hash', 'abi_hash', 'schema_hash'] as const)
        expect(() =>
          decodeReleasedArchiveRow({ ...domain, [field]: '00'.repeat(32) }, row, '9'),
        ).toThrow('ARCHIVE_SCHEMA_UNSUPPORTED');
      expect(() => decodeReleasedArchiveRow({ ...domain, scope: '1' }, row, '9')).toThrow(
        'ARCHIVE_SCHEMA_UNSUPPORTED',
      );
      expect(() =>
        decodeReleasedArchiveRow(domain, { ...row, packed: row.packed + '00' }, '9'),
      ).toThrow('ARCHIVE_ROW_TRAILING');
    }
  },
);

it('retains the immediately preceding private-question response and grant archives after RAM accounting upgrades', () => {
  const identity = {
    codeHash: '963a7b2b7cd558c3726f00a68a67b404a0b94aa6c3b8f8b66149269ba6ce94bc',
    abiHash: '9ee160f982b079960465db760a222a0bb4059dc0b7a37f7c48206e27f504ad05',
  };
  expect(archiveSourceSchema('quick-ballot-responses', identity).rowType).toBe('quick_response');
  expect(archiveSourceSchema('quick-ballot-grants', identity).rowType).toBe('quick_grant');
});
