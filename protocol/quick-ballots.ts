import { RuntimeTableSchemas } from '@daclify/core-protocol/sdk';
import { ArchiveBundleSchema } from './archive.js';
import { z } from 'zod';
import {
  ChainIdSchema,
  DaoRefSchema,
  IdSchema,
  NativeAccountSchema,
  Uint64Schema,
  PrivateRecordReferenceSchema,
} from '@daclify/core-protocol';
import {
  QuickvoteActionSchemas,
  QuickvoteTableSchemas,
} from '../sdk/generated/quickvote-schemas.js';

export const QuickBallotDomainSchema = z.strictObject({
  chainId: ChainIdSchema,
  runtime: NativeAccountSchema,
  source: NativeAccountSchema,
});
const text = (maximum: number) =>
  z
    .string()
    .max(maximum)
    .refine(
      (value) => new TextEncoder().encode(value).length <= maximum,
      'The UTF-8 text exceeds the byte limit.',
    );
const hex = (bytes: number) => z.string().regex(new RegExp(`^[0-9a-f]{${bytes * 2}}$`));
export function quickQuestionReference(definition: { protocol: number; question: string }) {
  if (definition.protocol !== 2) return;
  return PrivateRecordReferenceSchema.parse(JSON.parse(definition.question));
}
export const QuickBallotDefinitionSchema = QuickvoteActionSchemas.open.shape.definition
  .extend({
    protocol: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    question: text(256).refine((value) => value.length > 0),
    explanation: text(4096),
    audience: z.array(IdSchema).max(20),
    readers: z
      .array(
        z.strictObject({
          member_id: IdSchema,
          encryption_key: text(256).refine((value) => value.length > 0),
        }),
      )
      .min(1)
      .max(8),
  })
  .superRefine((value, ctx) => {
    const ordered = (ids: string[]) =>
      ids.every((id, index) => index === 0 || BigInt(id) > BigInt(ids[index - 1] ?? '0'));
    if (
      (value.all_accounts ? value.audience.length !== 0 : value.audience.length === 0) ||
      !ordered(value.audience)
    )
      ctx.addIssue({ code: 'custom', message: 'QUICK_AUDIENCE' });
    if (!ordered(value.readers.map((reader) => reader.member_id)))
      ctx.addIssue({ code: 'custom', message: 'QUICK_READERS' });
    if (value.protocol === 2) {
      if (value.all_accounts || value.audience.length !== 1 || value.explanation !== '')
        ctx.addIssue({ code: 'custom', message: 'QUICK_QUESTION_AUDIENCE' });
      try { quickQuestionReference(value); }
      catch { ctx.addIssue({ code: 'custom', message: 'QUICK_QUESTION_REFERENCE' }); }
    }
  });
export const QuickBallotRowSchema = QuickvoteTableSchemas.qballots.extend({
  definition: QuickBallotDefinitionSchema,
  key: hex(96),
  key_proof: hex(64),
  aggregate: hex(192),
  count: z.int().min(0).max(5000),
  identities: z.int().min(0).max(5000),
  final_proof: hex(64),
});
export const QuickBallotResponseSchema = QuickvoteTableSchemas.qresponses.superRefine(
  (value, ctx) => {
    if (
      value.id === '0' ||
      value.revision === '0' ||
      (value.active
        ? value.ciphertext.length !== 384 ||
          value.proof.length !== 256 ||
          value.receipt.length > 2048
        : value.ciphertext !== '' || value.proof !== '' || value.receipt !== '')
    )
      ctx.addIssue({ code: 'custom', message: 'QUICK_RESPONSE_SHAPE' });
  },
);
export const QuickBallotResultInputSchema = QuickBallotDomainSchema.extend({
  ballot: QuickBallotRowSchema,
});
export const QuickBallotSnapshotSchema = QuickBallotResultInputSchema.extend({
  responses: z.array(QuickBallotResponseSchema).max(5000),
});
export type QuickBallot = z.infer<typeof QuickBallotRowSchema>;
export type QuickBallotResponse = z.infer<typeof QuickBallotResponseSchema>;
export type QuickBallotSnapshot = z.infer<typeof QuickBallotSnapshotSchema>;

export const QuickBallotArchiveSchema = z.strictObject({
  anchor: RuntimeTableSchemas.archives,
  bundle: ArchiveBundleSchema,
});

const maintenance = z.strictObject({
  transactionId: ChainIdSchema.nullable(),
  prepared: z.boolean(),
});
export const QuickBallotRoutes = {
  quickList: {
    method: 'GET',
    path: '/v1/quick-ballots/definitions',
    query: z.strictObject({ after: Uint64Schema.optional(), daoId: IdSchema.optional() }),
    response: z.strictObject({
      available: z.boolean(),
      experimental: z.literal(true),
      domain: QuickBallotDomainSchema.nullable(),
      ballots: z.array(QuickBallotRowSchema).max(25),
      next: Uint64Schema.nullable(),
    }),
    helpTopic: 'quick-ballots',
  },
  quickDetail: {
    method: 'GET',
    path: '/v1/quick-ballots/:ballotId/definition',
    response: QuickBallotResultInputSchema.extend({
      grants: QuickvoteTableSchemas.qgrants.nullable(),
    }),
    helpTopic: 'quick-ballots',
  },
  quickResponses: {
    method: 'GET',
    path: '/v1/quick-ballots/:ballotId/responses',
    query: z.strictObject({ after: Uint64Schema.optional() }),
    response: z.strictObject({
      responses: z.array(QuickBallotResponseSchema).max(25),
      next: Uint64Schema.nullable(),
      pruned: z.boolean(),
      root: ChainIdSchema,
    }),
    helpTopic: 'quick-ballots',
  },
  quickArchive: {
    method: 'GET',
    path: '/v1/quick-ballots/:ballotId/archive',
    response: z.strictObject({
      archives: z.array(QuickBallotArchiveSchema).max(2),
      complete: z.boolean(),
    }),
    helpTopic: 'quick-ballots',
  },
  quickOwnResponse: {
    method: 'GET',
    path: '/v1/quick-ballots/:ballotId/response',
    query: z.strictObject({ identity: ChainIdSchema }),
    response: z.strictObject({ response: QuickBallotResponseSchema.nullable() }),
    helpTopic: 'quick-ballots',
  },
  quickReaders: {
    method: 'GET',
    path: '/v1/daos/:id/quick-ballots/readers',
    response: z.strictObject({
      dao: DaoRefSchema,
      readers: QuickvoteActionSchemas.open.shape.definition.shape.readers.max(8),
    }),
    helpTopic: 'quick-ballots',
  },
  quickAdvance: {
    method: 'POST',
    path: '/v1/quick-ballots/:ballotId/advance',
    input: z.strictObject({}),
    response: maintenance,
    helpTopic: 'quick-ballots',
  },
  quickFinalize: {
    method: 'POST',
    path: '/v1/quick-ballots/:ballotId/finalize',
    input: z.strictObject({
      expectedDefinitionHash: ChainIdSchema,
      expectedRoot: ChainIdSchema,
      up: z.int().min(0).max(5000),
      proof: hex(64),
    }),
    response: maintenance,
    helpTopic: 'quick-ballots',
  },
} as const;
const LegacyQuickBallotRowSchema = QuickBallotRowSchema.extend({
  definition: QuickBallotDefinitionSchema.safeExtend({ protocol: z.literal(1) }),
});
export const LegacyQuickBallotRoutes = {
  quickList: { ...QuickBallotRoutes.quickList, path: '/v1/quick-ballots', response: QuickBallotRoutes.quickList.response.extend({ ballots: z.array(LegacyQuickBallotRowSchema).max(25) }) },
  quickDetail: { ...QuickBallotRoutes.quickDetail, path: '/v1/quick-ballots/:ballotId', response: QuickBallotRoutes.quickDetail.response.extend({ ballot: LegacyQuickBallotRowSchema }) },
} as const;
