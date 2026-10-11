import { expect, it, vi } from 'vitest';
import { AppClaimsSchema, AppActivityPageSchema } from '@daclify/core-protocol';
import { CommunityActivityClient } from '../sdk/community-activity.js';
const member = AppClaimsSchema.parse({
  sub: '550e8400-e29b-41d4-a716-446655440001',
  dao: { chainId: 'ab'.repeat(32), contract: 'daclifycore', daoId: '1', interfaceVersion: 1 },
  memberId: '3',
  admin: false,
  reviewer: false,
  nonce: '0',
  appId: '1',
  appRevision: '1',
  sessionId: '2',
  sessionExpires: 2000000000,
});
const intent = {
  action: 'recordact' as const,
  sourceId: 'aa'.repeat(32),
  sourceRevision: 'bb'.repeat(32),
  eventId: 'cc'.repeat(32),
};
const receipt = AppActivityPageSchema.shape.receipts.element.parse({
  receiptId: '1',
  appId: '1',
  memberId: '3',
  eventId: intent.eventId,
  sourceId: intent.sourceId,
  sourceRevision: intent.sourceRevision,
  kind: 'completed',
  status: 'recorded',
  createdAt: 1,
  evidenceCid: '',
  evidenceHash: '00'.repeat(32),
  keyEpoch: '0',
});
it('reconciles a lost broadcast reply and never replaces the event on retry', async () => {
  let saved = false;
  const submit = vi.fn(async () => {
    saved = true;
    throw new Error('network lost');
  });
  const client = {
    membership: async () => member,
    activities: async () => ({ receipts: saved ? [receipt] : [], next: null }),
    submit,
  };
  const activity = new CommunityActivityClient(client, 'activity');
  expect((await activity.deliver(intent)).status).toBe('confirmed');
  expect((await activity.deliver(intent)).status).toBe('confirmed');
  expect(submit).toHaveBeenCalledTimes(1);
});
it('retains pending status when the chain cannot confirm and rejects conflicting events', async () => {
  const client = {
    membership: async () => member,
    activities: async () => ({ receipts: [], next: null }),
    submit: async () => {
      throw new Error('timeout');
    },
  };
  expect((await new CommunityActivityClient(client, 'activity').deliver(intent)).status).toBe(
    'pending',
  );
  const conflicting = {
    ...client,
    activities: async () => ({
      receipts: [{ ...receipt, sourceRevision: 'dd'.repeat(32) }],
      next: null,
    }),
  };
  await expect(
    new CommunityActivityClient(conflicting, 'activity').deliver(intent),
  ).rejects.toThrow('APP_EVENT_CONFLICT');
});
