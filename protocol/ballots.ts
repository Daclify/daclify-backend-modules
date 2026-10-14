import { z } from 'zod';
import { ChainIdSchema, IdSchema } from '@daclify/core-protocol';

const choices = z
  .array(z.string().trim().min(1).max(80))
  .min(2)
  .max(16)
  .refine(
    (values) =>
      new Set(values.map((value) => value.normalize('NFC').toLowerCase())).size === values.length,
    'Each choice must have a different label.',
  )
  .refine(
    (values) => values.length !== 2 || (values[0] === 'Reject' && values[1] === 'Approve'),
    'Two-choice ballots must use Reject and Approve; custom polls need at least three choices.',
  );

export const BallotContentSchema = z.object({
  title: z.string().trim().max(160).optional(),
  description: z.string().trim().max(2000).optional(),
  options: choices,
  document: z
    .strictObject({
      documentId: IdSchema,
      version: z.int().min(1).max(4294967295),
      commitment: ChainIdSchema,
    })
    .optional(),
});

export const BallotMetadataSchema = BallotContentSchema.extend({
  schemaVersion: z.literal(2),
  title: z.string().trim().min(1, 'Give the ballot a title.').max(160),
  description: z.string().trim().min(1, 'Explain what members are deciding.').max(2000),
}).strict();

export type BallotMetadata = z.infer<typeof BallotMetadataSchema>;
export type BallotContent = z.infer<typeof BallotContentSchema>;
