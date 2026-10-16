import { expect, it } from 'vitest';
import { Catalog, ModuleInstallationSchema, ModulePermissions } from '../protocol/index.js';
import { QuickBallotRoutes, LegacyQuickBallotRoutes, QuickBallotDefinitionSchema } from '../protocol/quick-ballots.js';

it('installs only executive opening/closure and no treasury grants', () => {
  expect(Catalog.find((value) => value.id === 'quick-ballots')?.helpTopic).toBe('quick-ballots');
  expect(ModulePermissions['quick-ballots']).toEqual({ actions: ['open', 'close'], grants: [] });
  const value = {
    id: 'quick-ballots',
    account: 'quickvote',
    version: '0.10.0-alpha.9',
    config: { configVersion: 1 },
    actions: ['open', 'close'],
    grants: [],
  };
  expect(ModuleInstallationSchema.parse(value)).toEqual(value);
  expect(ModuleInstallationSchema.safeParse({ ...value, grants: ['approve'] }).success).toBe(false);
});

it('bounds question bytes, audiences and reader snapshots at the public boundary', () => {
  const definition = {
    protocol: 1,
    question: 'Question?',
    explanation: '',
    all_accounts: true,
    audience: [],
    closes: 0,
    readers: [{ member_id: '1', encryption_key: 'reader-key' }],
  };
  expect(QuickBallotDefinitionSchema.parse(definition)).toEqual(definition);
  for (const patch of [
    { question: '🌱'.repeat(65) },
    { all_accounts: false },
    { all_accounts: false, audience: ['2', '1'] },
    { audience: ['1'] },
    { readers: [...definition.readers, ...definition.readers] },
  ])
    expect(QuickBallotDefinitionSchema.safeParse({ ...definition, ...patch }).success).toBe(false);
});

it('accepts only a final public proof through the tally endpoint', () => {
  const value = {
    expectedDefinitionHash: '11'.repeat(32),
    expectedRoot: '22'.repeat(32),
    up: 1,
    proof: '33'.repeat(64),
  };
  expect(QuickBallotRoutes.quickFinalize.input.parse(value)).toEqual(value);
  for (const extra of [{ secret: 'private' }, { choices: [1] }, { action: 'approve' }])
    expect(QuickBallotRoutes.quickFinalize.input.safeParse({ ...value, ...extra }).success).toBe(
      false,
    );
  expect(QuickBallotRoutes.quickFinalize.input.safeParse({ ...value, proof: '' }).success).toBe(
    false,
  );
});

it('looks up one current response by its canonical account commitment', () => {
  expect(QuickBallotRoutes.quickOwnResponse.query.parse({ identity: '11'.repeat(32) })).toEqual({
    identity: '11'.repeat(32),
  });
  expect(
    QuickBallotRoutes.quickOwnResponse.query.safeParse({
      accountId: '00000000-0000-4000-8000-000000000001',
    }).success,
  ).toBe(false);
});
it('keeps legacy definition readers separate from the versioned private-question readers', () => {
  expect(QuickBallotRoutes.quickList.path).toBe('/v1/quick-ballots/definitions');
  expect(QuickBallotRoutes.quickDetail.path).toBe('/v1/quick-ballots/:ballotId/definition');
  expect(LegacyQuickBallotRoutes.quickList.path).toBe('/v1/quick-ballots');
  expect(LegacyQuickBallotRoutes.quickDetail.path).toBe('/v1/quick-ballots/:ballotId');
});

it('can verify any nonempty UTF-8 question accepted by the native protocol', () => {
  expect(
    QuickBallotDefinitionSchema.safeParse({
      protocol: 1,
      question: ' ',
      explanation: '',
      all_accounts: true,
      audience: [],
      closes: 0,
      readers: [{ member_id: '1', encryption_key: 'reader-key' }],
    }).success,
  ).toBe(true);
});
