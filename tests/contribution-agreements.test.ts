import { expect, it } from 'vitest';
import { AgreementDocumentSchema, ServiceOfferDocumentSchema } from '../protocol/agreements.js';
const dao = { chainId: 'ab'.repeat(32), contract: 'daclifycore', daoId: '1', interfaceVersion: 1 };
const agreement = {
  schemaVersion: 1,
  type: 'contribution-agreement',
  dao,
  contributor: '2',
  title: 'Treasury reporting',
  scope: 'Prepare a monthly native spending report.',
  deliverables: ['Reconciled report'],
  roleTitle: 'Treasurer',
  term: { start: 0, end: 100 },
  asset: { chainId: dao.chainId, contract: 'eosio.token', symbol: 'TLOS', precision: 4 },
  milestones: [{ amount: '10000', due: 50 }],
  reviewPolicy: 'dao-review-team',
  cancellationPolicy: 'preserve-approved-liabilities',
};
it('freezes versioned native terms and treats a role title as narrative, never authority', () => {
  expect(AgreementDocumentSchema.parse(agreement)).toEqual(agreement);
  for (const bad of [
    { schemaVersion: 2 },
    { milestones: [{ amount: '-1', due: 50 }] },
    { milestones: [{ amount: '1', due: 101 }] },
    { term: { start: 100, end: 0 } },
    { asset: { ...agreement.asset, chainId: 'cd'.repeat(32) } },
    { reviewPolicy: 'named-reviewer' },
    { permissions: ['admin'] },
  ])
    expect(AgreementDocumentSchema.safeParse({ ...agreement, ...bad }).success).toBe(false);
  expect(
    ServiceOfferDocumentSchema.parse({
      schemaVersion: 1,
      type: 'service-offer',
      dao,
      memberId: '2',
      title: 'Reporting',
      summary: 'Native treasury reconciliation',
      skills: ['accounting'],
    }),
  ).toMatchObject({ memberId: '2' });
});
