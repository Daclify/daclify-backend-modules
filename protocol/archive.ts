import { z } from 'zod';
import { ChainIdSchema, NativeAccountSchema, IdSchema, Uint64Schema } from '@daclify/core-protocol';
export const MAX_ARCHIVE_CHUNK_BYTES = 5 * 1024 * 1024;
export const MAX_ARCHIVE_LEAVES = 65536;
export const ArchiveDomainSchema = z.strictObject({
  format_version: z.literal(1),
  chain_id: ChainIdSchema,
  runtime: NativeAccountSchema,
  dao_id: IdSchema,
  source: NativeAccountSchema,
  code_hash: ChainIdSchema,
  abi_hash: ChainIdSchema,
  schema_hash: ChainIdSchema,
  table: NativeAccountSchema.refine((v) => v.length <= 12),
  scope: Uint64Schema,
  chunk_ordinal: z.int().min(0).max(4294967295),
  leaf_count: z.int().min(1).max(MAX_ARCHIVE_LEAVES),
});
export type ArchiveDomain = z.infer<typeof ArchiveDomainSchema>;
export const ArchiveRowSchema = z.strictObject({
  primaryKey: Uint64Schema,
  packed: z
    .string()
    .max(2 * MAX_ARCHIVE_CHUNK_BYTES)
    .regex(/^[0-9a-f]*$/)
    .refine((value) => value.length % 2 === 0),
});
export type ArchiveRow = z.infer<typeof ArchiveRowSchema>;
export const ArchiveProofSchema = z.array(ChainIdSchema).max(16);
