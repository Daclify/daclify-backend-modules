import { z } from 'zod';
import {
  AssetRefSchema,
  DaoRefSchema,
  IdSchema,
  Uint64Schema,
  MAX_ASSET_UNITS,
} from '@daclify/core-protocol';
const TimeSchema = z.int().min(0).max(4294967295);
export const AgreementDocumentSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    type: z.literal('contribution-agreement'),
    dao: DaoRefSchema,
    contributor: IdSchema,
    title: z.string().min(1).max(160),
    scope: z.string().min(1).max(2000),
    deliverables: z.array(z.string().min(1).max(240)).min(1).max(16),
    roleTitle: z.string().max(80).optional(),
    term: z.strictObject({ start: TimeSchema, end: TimeSchema }),
    asset: AssetRefSchema,
    milestones: z
      .array(
        z.strictObject({
          amount: Uint64Schema.refine(
            (value) => BigInt(value) > 0n && BigInt(value) <= MAX_ASSET_UNITS,
          ),
          due: TimeSchema,
        }),
      )
      .min(1)
      .max(16),
    reviewPolicy: z.literal('dao-review-team'),
    cancellationPolicy: z.literal('preserve-approved-liabilities'),
    successorOf: IdSchema.optional(),
  })
  .refine(
    (value) =>
      value.term.end > value.term.start &&
      value.term.end - value.term.start <= 31536000 &&
      value.asset.chainId === value.dao.chainId &&
      value.milestones.every((m) => m.due >= value.term.start && m.due <= value.term.end) &&
      value.milestones.reduce((sum, m) => sum + BigInt(m.amount), 0n) <= MAX_ASSET_UNITS,
    'Invalid agreement term, asset or milestone limits',
  );
export const ServiceOfferDocumentSchema = z.strictObject({
  schemaVersion: z.literal(1),
  type: z.literal('service-offer'),
  dao: DaoRefSchema,
  memberId: IdSchema,
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(1000),
  skills: z.array(z.string().min(1).max(48)).max(16),
});
export type AgreementDocument = z.infer<typeof AgreementDocumentSchema>;
