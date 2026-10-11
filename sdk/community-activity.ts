import { z } from 'zod';
import { ChainIdSchema, Uint64Schema, type AppClaimsSchema } from '@daclify/core-protocol';
import type { ConnectedAppClient } from '@daclify/core-protocol/connected-apps';
import { encodeActivity } from './index.js';
export const ActivityIntentSchema = z.strictObject({
  action: z.enum(['recordact', 'askreview']),
  sourceId: ChainIdSchema,
  sourceRevision: ChainIdSchema,
  eventId: ChainIdSchema,
  evidenceCid: z.string().max(128).default(''),
  evidenceHash: ChainIdSchema.default('00'.repeat(32)),
  keyEpoch: Uint64Schema.default('0'),
});
export type ActivityIntent = z.input<typeof ActivityIntentSchema>;
type Client = Pick<ConnectedAppClient, 'membership' | 'activities' | 'submit'>;
// Persist the intent in the project's outbox before calling deliver; retries reuse these exact bytes.
export class CommunityActivityClient {
  constructor(
    private readonly client: Client,
    private readonly target: string,
  ) {}
  async deliver(input: ActivityIntent) {
    const intent = ActivityIntentSchema.parse(input),
      member = await this.client.membership();
    const reconcile = async () => {
      const receipt = (await this.client.activities({ eventId: intent.eventId })).receipts[0];
      if (!receipt) return null;
      if (
        receipt.memberId !== member.memberId ||
        receipt.appId !== member.appId ||
        receipt.sourceId !== intent.sourceId ||
        receipt.sourceRevision !== intent.sourceRevision ||
        receipt.kind !== (intent.action === 'recordact' ? 'completed' : 'review-requested') ||
        receipt.evidenceCid !== intent.evidenceCid ||
        receipt.evidenceHash !== intent.evidenceHash ||
        receipt.keyEpoch !== intent.keyEpoch
      )
        throw new Error('APP_EVENT_CONFLICT');
      return receipt;
    };
    const existing = await reconcile();
    if (existing) return { status: 'confirmed' as const, receipt: existing };
    const send = async (actor: z.infer<typeof AppClaimsSchema>) =>
      this.client.submit(
        intent.action,
        this.target,
        encodeActivity(intent.action, {
          runtime: actor.dao.contract,
          dao_id: actor.dao.daoId,
          member_id: actor.memberId,
          app_id: actor.appId,
          source_id: intent.sourceId,
          source_revision: intent.sourceRevision,
          event_id: intent.eventId,
          evidence_cid: intent.evidenceCid,
          evidence_hash: intent.evidenceHash,
          key_epoch: intent.keyEpoch,
        }),
      );
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await send(member);
      } catch (error) {
        const found = await reconcile();
        if (found) return { status: 'confirmed' as const, receipt: found };
        if (error instanceof Error && error.message === 'APP_NONCE_CHANGED' && attempt === 0)
          continue;
        if (error instanceof Error && /^(APP_|MEMBER_|MODULE_)/.test(error.message)) throw error;
        return { status: 'pending' as const, eventId: intent.eventId };
      }
      const found = await reconcile();
      if (found) return { status: 'confirmed' as const, receipt: found };
      return { status: 'pending' as const, eventId: intent.eventId };
    }
    return { status: 'pending' as const, eventId: intent.eventId };
  }
}
