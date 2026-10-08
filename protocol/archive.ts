import { z } from 'zod';
import {
  ChainIdSchema,
  NativeAccountSchema,
  IdSchema,
  Uint64Schema,
  DaoRefSchema,
  CidSchema,
  StorageInstantSchema,
  HostedBytesSchema,
} from '@daclify/core-protocol';
import { RuntimeTableSchemas } from '@daclify/core-protocol/sdk';
import { DecideTableSchemas } from '../sdk/generated/decide-schemas.js';
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
export const ArchiveChunkDescriptorSchema = z
  .strictObject({
    domain: ArchiveDomainSchema,
    root: ChainIdSchema,
    cid: CidSchema,
    bytes: z.int().min(188).max(MAX_ARCHIVE_CHUNK_BYTES),
    commitment: ChainIdSchema,
    firstKey: Uint64Schema,
    lastKey: Uint64Schema,
  })
  .refine((value) => BigInt(value.firstKey) <= BigInt(value.lastKey));
export type ArchiveChunkDescriptor = z.infer<typeof ArchiveChunkDescriptorSchema>;
export const ArchiveFamilySchema = z.strictObject({
  kind: z.enum(['ordinary-poll-votes', 'document-versions', 'protected-export']),
  parentId: Uint64Schema,
  table: ArchiveDomainSchema.shape.table,
  scope: Uint64Schema,
  schemaHash: ChainIdSchema,
  records: Uint64Schema,
  chunks: z.array(ArchiveChunkDescriptorSchema).max(1024),
});
export const ArchiveFileReferenceSchema = RuntimeTableSchemas.documents
  .pick({
    document_id: true,
    version: true,
    cid: true,
    bytes: true,
    commitment: true,
    envelope_version: true,
    key_epoch: true,
  })
  .extend({
    document_id: IdSchema,
    version: z.int().min(1).max(4294967295),
    cid: CidSchema,
    bytes: Uint64Schema.refine((v) => v !== '0'),
    envelope_version: z.union([z.literal(0), z.literal(1)]),
  });
const ManifestBody = z.strictObject({
  schemaVersion: z.literal(1),
  dao: DaoRefSchema,
  snapshot: z.strictObject({
    blockNumber: z.int().min(1).max(4294967295),
    blockId: ChainIdSchema,
    timestamp: StorageInstantSchema,
  }),
  source: z.strictObject({
    account: NativeAccountSchema,
    codeHash: ChainIdSchema,
    abiHash: ChainIdSchema,
  }),
  families: z.array(ArchiveFamilySchema).min(1).max(64),
  files: z.array(ArchiveFileReferenceSchema).max(65536),
});
function checkManifest(value: z.infer<typeof ManifestBody>, context: z.RefinementCtx) {
  const invalid = (message: string) => context.addIssue({ code: 'custom', message });
  if (parseInt(value.snapshot.blockId.slice(0, 8), 16) !== value.snapshot.blockNumber)
    invalid('ARCHIVE_SNAPSHOT_BLOCK');
  let previousFamily: { kind: string; parent: bigint; table: string; scope: bigint } | undefined,
    totalChunks = 0;
  const cids = new Set<string>();
  for (const family of value.families) {
    const parent = BigInt(family.parentId);
    if (
      previousFamily &&
      (family.kind < previousFamily.kind ||
        (family.kind === previousFamily.kind &&
          (parent < previousFamily.parent ||
            (parent === previousFamily.parent &&
              (family.table < previousFamily.table ||
                (family.table === previousFamily.table &&
                  BigInt(family.scope) <= previousFamily.scope))))))
    )
      invalid('ARCHIVE_FAMILY_ORDER');
    previousFamily = {
      kind: family.kind,
      parent,
      table: family.table,
      scope: BigInt(family.scope),
    };
    if (family.kind === 'ordinary-poll-votes' && (family.table !== 'votes' || parent === 0n))
      invalid('ARCHIVE_FAMILY_TABLE');
    if (family.kind === 'document-versions' && (family.table !== 'documents' || parent === 0n))
      invalid('ARCHIVE_FAMILY_TABLE');
    let count = 0n,
      previousKey = -1n;
    totalChunks += family.chunks.length;
    for (const [ordinal, chunk] of family.chunks.entries()) {
      const d = chunk.domain;
      if (
        d.chain_id !== value.dao.chainId ||
        d.runtime !== value.dao.contract ||
        d.dao_id !== value.dao.daoId ||
        d.source !== value.source.account ||
        d.code_hash !== value.source.codeHash ||
        d.abi_hash !== value.source.abiHash ||
        d.schema_hash !== family.schemaHash ||
        d.table !== family.table ||
        d.scope !== family.scope ||
        d.chunk_ordinal !== ordinal
      )
        invalid('ARCHIVE_DESCRIPTOR_DOMAIN');
      if (BigInt(chunk.firstKey) <= previousKey) invalid('ARCHIVE_CHUNK_ORDER');
      previousKey = BigInt(chunk.lastKey);
      if (cids.has(chunk.cid)) invalid('ARCHIVE_DUPLICATE_CHUNK');
      cids.add(chunk.cid);
      count += BigInt(d.leaf_count);
    }
    if (count !== BigInt(family.records)) invalid('ARCHIVE_COVERAGE_COUNT');
  }
  if (totalChunks > 1024) invalid('ARCHIVE_CHUNK_COUNT');
  let previousFile: { id: bigint; version: number } | undefined;
  for (const file of value.files) {
    const id = BigInt(file.document_id);
    if (
      previousFile &&
      (id < previousFile.id || (id === previousFile.id && file.version <= previousFile.version))
    )
      invalid('ARCHIVE_FILE_ORDER');
    previousFile = { id, version: file.version };
    if (
      (file.envelope_version === 0 && file.key_epoch !== '0') ||
      (file.envelope_version === 1 && file.key_epoch === '0')
    )
      invalid('ARCHIVE_FILE_ENVELOPE');
  }
}
export const ArchiveManifestBodySchema = ManifestBody.superRefine(checkManifest);
export const ArchiveManifestSchema = ManifestBody.extend({
  descriptorCommitment: ChainIdSchema,
}).superRefine(checkManifest);
export type ArchiveManifest = z.infer<typeof ArchiveManifestSchema>;
export const MIN_ARCHIVE_RETENTION_SECONDS = 90 * 86400;
export const OrdinaryPollArchiveInputSchema = z.strictObject({
  dao: DaoRefSchema,
  source: ManifestBody.shape.source,
  snapshot: ManifestBody.shape.snapshot,
  sourceUpdatedAt: StorageInstantSchema,
  retentionSeconds: z
    .int()
    .min(MIN_ARCHIVE_RETENTION_SECONDS)
    .max(10 * 365 * 86400),
  ballots: z.array(DecideTableSchemas.ballots).max(64),
  votes: z.array(DecideTableSchemas.votes).max(MAX_ARCHIVE_LEAVES),
  terminals: z.array(DecideTableSchemas.pollends).max(64),
  elections: z.array(DecideTableSchemas.elections.pick({ id: true, dao_id: true })).max(64),
  executions: z
    .array(DecideTableSchemas.executions.pick({ ballot_id: true, dao_id: true }))
    .max(64),
  grantplans: z
    .array(DecideTableSchemas.grantplans.pick({ ballot_id: true, dao_id: true }))
    .max(64),
});
export const OrdinaryPollArchivePlanSchema = z.strictObject({
  dao: DaoRefSchema,
  source: ManifestBody.shape.source,
  snapshot: ManifestBody.shape.snapshot,
  pruningAuthorized: z.literal(false),
  grossRamBytes: Uint64Schema,
  blocked: z
    .array(
      z.strictObject({
        parentId: IdSchema,
        reason: z.enum([
          'protected-family',
          'ballot-active',
          'terminal-marker-required',
          'terminal-not-irreversible',
          'retention',
        ]),
      }),
    )
    .max(64),
  families: z
    .array(
      z.strictObject({
        kind: z.literal('ordinary-poll-votes'),
        parentId: IdSchema,
        grossRamBytes: Uint64Schema,
        chunks: z
          .array(
            z.strictObject({
              domain: ArchiveDomainSchema,
              root: ChainIdSchema,
              bytes: z.int().min(188).max(MAX_ARCHIVE_CHUNK_BYTES),
              rows: z.array(ArchiveRowSchema).min(1).max(MAX_ARCHIVE_LEAVES),
            }),
          )
          .max(1),
      }),
    )
    .max(64),
});
export type OrdinaryPollArchivePlan = z.infer<typeof OrdinaryPollArchivePlanSchema>;
export const ArchivePreviewRequestSchema = z.strictObject({
  dao: DaoRefSchema,
  ballotIds: z
    .array(IdSchema)
    .min(1)
    .max(64)
    .refine((ids) => new Set(ids).size === ids.length),
  retentionSeconds: OrdinaryPollArchiveInputSchema.shape.retentionSeconds,
});
export type ArchivePreviewRequest = z.infer<typeof ArchivePreviewRequestSchema>;
export const ArchiveExportRequestSchema = z.strictObject({
  requestId: z.uuid(),
  selection: ArchivePreviewRequestSchema,
  selectionCommitment: ChainIdSchema,
  maximumStoredBytes: Uint64Schema.refine((v) => BigInt(v) > 0n && BigInt(v) <= (1n << 63n) - 1n),
});
export type ArchiveExportRequest = z.infer<typeof ArchiveExportRequestSchema>;
export const ArchiveBackupReceiptSchema = z.strictObject({
  formatVersion: z.literal(1),
  storeId: z.string().regex(/^[A-Za-z0-9_.:-]{1,128}$/),
  keyId: z.string().regex(/^[A-Za-z0-9_.:-]{1,128}$/),
  commitment: ChainIdSchema,
  manifestCommitment: ChainIdSchema,
  bytes: Uint64Schema.refine((v) => BigInt(v) > 0n && BigInt(v) <= 128n * 1024n * 1024n),
  verifiedAt: StorageInstantSchema,
});
export type ArchiveBackupReceipt = z.infer<typeof ArchiveBackupReceiptSchema>;
export const ArchiveExportStatusSchema = z.strictObject({
  id: z.uuid(),
  dao: DaoRefSchema,
  state: z.enum([
    'planned',
    'exporting',
    'pinned',
    'verified',
    'approved',
    'pruning',
    'completed',
    'failed',
    'review',
  ]),
  maximumStoredBytes: ArchiveExportRequestSchema.shape.maximumStoredBytes,
  heldBytes: Uint64Schema,
  verifiedChunks: z.int().min(0).max(1024),
  totalChunks: z.int().min(0).max(1024),
  manifest: z
    .strictObject({
      cid: CidSchema,
      bytes: z.int().min(1).max(MAX_ARCHIVE_CHUNK_BYTES),
      commitment: ChainIdSchema,
    })
    .nullable(),
  retentionSeconds: ArchivePreviewRequestSchema.shape.retentionSeconds.default(
    MIN_ARCHIVE_RETENTION_SECONDS,
  ),
  anchor: RuntimeTableSchemas.archives.nullable().default(null),
  backup: ArchiveBackupReceiptSchema.nullable().default(null),
  backupSupported: z.boolean().default(false),
  pruningAuthorized: z.boolean().default(false),
});
export const ArchiveBundleSchema = z.strictObject({
  id: z.uuid(),
  manifest: ArchiveManifestSchema,
  manifestFile: z.strictObject({
    cid: CidSchema,
    bytes: z.int().min(1).max(MAX_ARCHIVE_CHUNK_BYTES),
    commitment: ChainIdSchema,
    content: HostedBytesSchema,
  }),
  chunks: z.array(z.strictObject({ cid: CidSchema, content: HostedBytesSchema })).max(1024),
});
export const ArchiveExportListRequestSchema = z.strictObject({
  dao: DaoRefSchema,
  cursor: z.uuid().optional(),
});
export const ArchiveExportListSchema = z.strictObject({
  dao: DaoRefSchema,
  exports: z.array(ArchiveExportStatusSchema).max(20),
  next: z.uuid().nullable(),
});
export const ArchiveHistoryRequestSchema = z.strictObject({
  dao: DaoRefSchema,
  cursor: IdSchema.optional(),
});
export const ArchiveHistoryListSchema = z.strictObject({
  dao: DaoRefSchema,
  anchors: z.array(RuntimeTableSchemas.archives).max(20),
  next: IdSchema.nullable(),
});
export const ArchiveHistoryBundleRequestSchema = z.strictObject({
  dao: DaoRefSchema,
  manifestCommitment: ChainIdSchema,
});
export const ArchiveHistoryPageRequestSchema = z.strictObject({
  dao: DaoRefSchema,
  manifestCommitment: ChainIdSchema,
  cursor: Uint64Schema.optional(),
});
export const ArchiveHistoryPageSchema = z.strictObject({
  dao: DaoRefSchema,
  manifestCommitment: ChainIdSchema,
  parentId: IdSchema,
  records: z.array(DecideTableSchemas.votes).max(25),
  next: Uint64Schema.nullable(),
  coverage: z.literal('verified-archive'),
  liveRowsIncluded: z.literal(false),
});
export const ArchiveRoutes = {
  history: {
    method: 'GET',
    path: '/v1/archive/history',
    input: ArchiveHistoryRequestSchema,
    response: ArchiveHistoryListSchema,
    helpTopic: 'archive',
  },
  recover: {
    method: 'POST',
    path: '/v1/archive/history/recover',
    input: ArchiveHistoryBundleRequestSchema,
    response: ArchiveBundleSchema,
    helpTopic: 'archive',
  },
  historyPage: {
    method: 'POST',
    path: '/v1/archive/history/page',
    input: ArchiveHistoryPageRequestSchema,
    response: ArchiveHistoryPageSchema,
    helpTopic: 'archive',
  },
  preview: {
    method: 'POST',
    path: '/v1/archive/preview',
    input: ArchivePreviewRequestSchema,
    response: OrdinaryPollArchivePlanSchema,
    helpTopic: 'archive',
  },
  export: {
    method: 'POST',
    path: '/v1/archive/exports',
    input: ArchiveExportRequestSchema,
    response: ArchiveExportStatusSchema,
    helpTopic: 'archive',
  },
  status: {
    method: 'GET',
    path: '/v1/archive/exports/:id',
    response: ArchiveExportStatusSchema,
    helpTopic: 'archive',
  },
  reconcile: {
    method: 'POST',
    path: '/v1/archive/exports/:id/reconcile',
    input: z.strictObject({}),
    response: ArchiveExportStatusSchema,
    helpTopic: 'archive',
  },
  attest: {
    method: 'POST',
    path: '/v1/archive/exports/:id/attest',
    input: z.strictObject({
      manifestCommitment: ChainIdSchema,
      descriptorCommitment: ChainIdSchema,
      backupCommitment: ChainIdSchema,
      retentionSeconds: ArchivePreviewRequestSchema.shape.retentionSeconds,
    }),
    response: ArchiveExportStatusSchema,
    helpTopic: 'archive',
  },
  backup: {
    method: 'POST',
    path: '/v1/archive/exports/:id/backup',
    input: z.strictObject({ expectedManifestCommitment: ChainIdSchema }),
    response: ArchiveExportStatusSchema,
    helpTopic: 'archive',
  },
  bundle: {
    method: 'GET',
    path: '/v1/archive/exports/:id/bundle',
    response: ArchiveBundleSchema,
    helpTopic: 'archive',
  },
  prune: {
    method: 'POST',
    path: '/v1/archive/exports/:id/prune',
    input: z.strictObject({ expectedManifestCommitment: ChainIdSchema }),
    response: ArchiveExportStatusSchema,
    helpTopic: 'archive',
  },
  list: {
    method: 'GET',
    path: '/v1/archive/exports',
    input: ArchiveExportListRequestSchema,
    response: ArchiveExportListSchema,
    helpTopic: 'archive',
  },
} as const;
