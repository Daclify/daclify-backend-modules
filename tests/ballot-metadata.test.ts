import { describe, expect, it } from 'vitest';
import { BallotMetadataSchema } from '../protocol/index.js';
import { encodeBallotMetadata, readBallotMetadata } from '../sdk/index.js';

const proposal = {
  schemaVersion: 2 as const,
  title: 'Repair the garden gate',
  description: 'Replace the broken hinges before the community event.',
  options: ['Reject', 'Approve'],
};

describe('ballot metadata', () => {
  it('encodes a bounded proposal and preserves its exact document version and commitment', () => {
    const value = {
      ...proposal,
      document: { documentId: '9', version: 2, commitment: 'ab'.repeat(32) },
    };
    expect(JSON.parse(encodeBallotMetadata(value))).toEqual(value);
    expect(readBallotMetadata(encodeBallotMetadata(value), 2)).toMatchObject(value);
  });
  it('requires an explanation and distinct, nonblank ordered choices', () => {
    for (const changed of [
      { title: ' ' },
      { description: ' ' },
      { options: ['', 'Approve'] },
      { options: ['Option A', 'option a', 'Option C'] },
      { options: ['A', 'B'] },
      { options: Array.from({ length: 17 }, (_, i) => `Option ${i}`) },
    ])
      expect(BallotMetadataSchema.safeParse({ ...proposal, ...changed }).success).toBe(false);
    expect(
      BallotMetadataSchema.safeParse({ ...proposal, options: ['Repair', 'Replace', 'Leave as is'] })
        .success,
    ).toBe(true);
  });
  it('checks serialized UTF-8 bytes including escaped characters before submission', () => {
    expect(() => encodeBallotMetadata({ ...proposal, description: '🪴'.repeat(1000) })).toThrow(
      'BALLOT_METADATA_SIZE',
    );
    expect(() => encodeBallotMetadata({ ...proposal, description: '\\'.repeat(2000) })).toThrow(
      'BALLOT_METADATA_SIZE',
    );
  });
  it('preserves legacy binary semantics with and without metadata labels', () => {
    expect(readBallotMetadata('{}', 2)?.options).toEqual(['Reject', 'Approve']);
    expect(
      readBallotMetadata(
        JSON.stringify({
          schemaVersion: 1,
          title: 'Original',
          options: ['Reject', 'Approve'],
          source: { app: 'garden' },
        }),
        2,
      ),
    ).toMatchObject({ title: 'Original', options: ['Reject', 'Approve'] });
  });
  it('reads all legacy poll labels in their recorded order', () => {
    expect(
      readBallotMetadata(
        JSON.stringify({ title: 'Event day', options: ['Friday', 'Saturday', 'Sunday'] }),
        3,
      )?.options,
    ).toEqual(['Friday', 'Saturday', 'Sunday']);
  });
  it('refuses mismatched, unlabeled, unsupported and misleading ballot definitions', () => {
    for (const [metadata, choices] of [
      ['{}', 3],
      ['broken JSON', 2],
      ['null', 2],
      [JSON.stringify({ ...proposal, schemaVersion: 99 }), 2],
      [JSON.stringify({ ...proposal, options: ['Repair', 'Replace', 'Leave'] }), 2],
      [JSON.stringify({ options: ['Approve', 'Reject'] }), 2],
      [JSON.stringify({ options: ['Friday', 'Saturday'] }), 2],
    ] as const)
      expect(readBallotMetadata(metadata, choices)).toBeUndefined();
  });
});
