import { expect, it } from 'vitest';
import { mergeArchiveVotes } from '../archive/recovery.js';
import { DecideTableSchemas } from '../sdk/index.js';
const vote = (id: string) =>
  DecideTableSchemas.votes.parse({ id, ballot: '7', member: id, weight: '1', choice: 1 });
it('merges live/archive vote identities in numeric order without duplicates and rejects changed historical rows', () => {
  expect(mergeArchiveVotes([vote('10'), vote('2')], [vote('2'), vote('1')], '7')).toEqual([
    vote('1'),
    vote('2'),
    vote('10'),
  ]);
  expect(() => mergeArchiveVotes([vote('2')], [{ ...vote('2'), weight: '2' }], '7')).toThrow(
    'ARCHIVE_HISTORY_CONFLICT',
  );
  expect(() => mergeArchiveVotes([{ ...vote('2'), ballot: '8' }], [], '7')).toThrow(
    'ARCHIVE_ROW_DOMAIN',
  );
});
