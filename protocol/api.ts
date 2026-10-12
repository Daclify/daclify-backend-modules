import { z } from 'zod';
import { ActivityTableSchemas } from '../sdk/generated/activity-schemas.js';
import {
  DaoRefSchema,
  IdSchema,
  ModuleManifestSchema,
  NativeAccountSchema,
  ChainIdSchema,
  Uint64Schema,
} from '@daclify/core-protocol';
import { EndorseTableSchemas } from '../sdk/generated/endorse-schemas.js';
import { GrantsTableSchemas } from '../sdk/generated/grants-schemas.js';
import { DecideTableSchemas } from '../sdk/generated/decide-schemas.js';
import { WorksTableSchemas } from '../sdk/generated/works-schemas.js';
import { PayrollTableSchemas } from '../sdk/generated/payroll-schemas.js';
export const ModuleDeploymentSchema = z.strictObject({
  id: z.enum(['decide', 'works', 'payroll', 'grants-rounds', 'endorsement-admission', 'activity']),
  account: NativeAccountSchema,
  version: z.string(),
  codeHash: ChainIdSchema,
});
export const ModuleStatusSchema = z.strictObject({
  deployment: ModuleDeploymentSchema,
  manifest: ModuleManifestSchema,
  enabled: z.boolean(),
  installed: z.boolean().default(false),
  compatible: z.boolean(),
  codeVerified: z.boolean(),
  actions: z.array(NativeAccountSchema),
  grants: z.array(NativeAccountSchema),
});
export const ModulePageQuerySchema = z.strictObject({
  activities: z.union([Uint64Schema, z.literal('done')]).optional(),
  ballots: z.union([Uint64Schema, z.literal('done')]).optional(),
  projects: z.union([Uint64Schema, z.literal('done')]).optional(),
  schedules: z.union([Uint64Schema, z.literal('done')]).optional(),
  elections: z.union([Uint64Schema, z.literal('done')]).optional(),
  terms: z.union([Uint64Schema, z.literal('done')]).optional(),
  joinApplications: z.union([Uint64Schema, z.literal('done')]).optional(),
  rounds: z.union([Uint64Schema, z.literal('done')]).optional(),
  applications: z.union([Uint64Schema, z.literal('done')]).optional(),
  memberId: IdSchema.optional(),
});
export type ModulePageQuery = z.infer<typeof ModulePageQuerySchema>;
export const ModuleStateSchema = z.strictObject({
  dao: DaoRefSchema,
  next: z
    .strictObject({
      activities: Uint64Schema.nullable().default(null),
      ballots: Uint64Schema.nullable(),
      projects: Uint64Schema.nullable(),
      schedules: Uint64Schema.nullable(),
      elections: Uint64Schema.nullable().default(null),
      terms: Uint64Schema.nullable().default(null),
      joinApplications: Uint64Schema.nullable().default(null),
      rounds: Uint64Schema.nullable().default(null),
      applications: Uint64Schema.nullable().default(null),
    })
    .default({
      ballots: null,
      projects: null,
      schedules: null,
      rounds: null,
      applications: null,
      joinApplications: null,
      elections: null,
      terms: null,
      activities: null,
    }),
  modules: z.array(ModuleStatusSchema),
  activities: z.array(ActivityTableSchemas.activities).default([]),
  activityReviews: z.array(ActivityTableSchemas.actreviews).default([]),
  activityDecisions: z.array(ActivityTableSchemas.actdecisions).default([]),
  appKeys: z.array(ActivityTableSchemas.appkeys).default([]),
  appKeyGrants: z.array(ActivityTableSchemas.appgrants).default([]),
  ballots: z.array(DecideTableSchemas.ballots),
  votes: z.array(DecideTableSchemas.votes),
  projects: z.array(WorksTableSchemas.projects),
  milestones: z.array(WorksTableSchemas.milestones),
  agreements: z.array(WorksTableSchemas.agreements).default([]),
  schedules: z.array(PayrollTableSchemas.schedules),
  entries: z.array(PayrollTableSchemas.entries),
  controls: z.array(PayrollTableSchemas.controls),
  elections: z.array(DecideTableSchemas.elections).default([]),
  nominations: z.array(DecideTableSchemas.nominations).default([]),
  terms: z.array(DecideTableSchemas.terms).default([]),
  joinApplications: z.array(EndorseTableSchemas.joinapps).default([]),
  rounds: z.array(GrantsTableSchemas.rounds).default([]),
  applications: z.array(GrantsTableSchemas.applications).default([]),
  grantPlans: z.array(DecideTableSchemas.grantplans).default([]),
  executions: z.array(DecideTableSchemas.executions).default([]),
});
export type ModuleDeployment = z.infer<typeof ModuleDeploymentSchema>;
export type ModuleState = z.infer<typeof ModuleStateSchema>;
export const GoverningDocumentCategories = Object.freeze([
  'Constitution',
  'Policy',
  'Agreement',
  'Legal document',
  'Other',
]);
export const GoverningDocumentStatuses = Object.freeze([
  'Awaiting approval',
  'Adopted',
  'Rejected',
  'Cancelled',
  'Expired',
]);
export const GoverningDocumentQuerySchema = z
  .strictObject({
    registerId: IdSchema.optional(),
    adoptionId: IdSchema.optional(),
    after: Uint64Schema.optional(),
    memberId: IdSchema.optional(),
  })
  .refine((query) => !(query.registerId && query.adoptionId), {
    message: 'Choose a registration or an adoption',
  });
export const GoverningDocumentPageSchema = z.strictObject({
  dao: DaoRefSchema,
  available: z.boolean(),
  module: ModuleStatusSchema.nullable(),
  policyRevision: Uint64Schema.nullable().default(null),
  registrations: z.array(DecideTableSchemas.docregs).max(25),
  changes: z.array(DecideTableSchemas.docchanges).max(50),
  acceptances: z.array(DecideTableSchemas.docaccepts).max(25),
  acceptedAdoptionIds: z.array(IdSchema).max(25),
  ballots: z.array(DecideTableSchemas.ballots).max(50),
  votes: z.array(DecideTableSchemas.votes).max(50),
  next: Uint64Schema.nullable(),
});
export type GoverningDocumentQuery = z.infer<typeof GoverningDocumentQuerySchema>;
export type GoverningDocumentPage = z.infer<typeof GoverningDocumentPageSchema>;
export const ModuleApiRoutes = {
  clearDocuments: {
    method: 'POST',
    path: '/v1/decide/clear-documents',
    input: z.strictObject({ dao: DaoRefSchema, proposalIds: z.array(IdSchema).min(1).max(25) }),
    response: z.strictObject({ transactionId: ChainIdSchema }),
    helpTopic: 'governing-documents',
  },
  documents: {
    method: 'GET',
    path: '/v1/daos/:id/governing-documents',
    query: GoverningDocumentQuerySchema,
    response: GoverningDocumentPageSchema,
    helpTopic: 'governing-documents',
  },
  appKeys: {
    method: 'GET',
    path: '/v1/daos/:id/apps/:appId/keys',
    response: z.strictObject({
      dao: DaoRefSchema,
      appId: IdSchema,
      currentEpoch: Uint64Schema.default('0'),
      keys: z.array(ActivityTableSchemas.appkeys).max(128),
      grants: z.array(ActivityTableSchemas.appgrants).max(128),
    }),
    helpTopic: 'activity',
  },
  state: {
    method: 'GET',
    path: '/v1/daos/:id/modules',
    query: ModulePageQuerySchema,
    response: ModuleStateSchema,
    helpTopic: 'module-reference',
  },
  finalize: {
    method: 'POST',
    path: '/v1/decide/finalize',
    input: z.strictObject({ dao: DaoRefSchema, ballotId: IdSchema }),
    response: z.discriminatedUnion('state', [
      z.strictObject({ state: z.literal('finalized'), transactionId: ChainIdSchema }),
      z.strictObject({ state: z.literal('already-finalized') }),
    ]),
    helpTopic: 'decide',
  },
  execute: {
    method: 'POST',
    path: '/v1/decide/execute',
    input: z.strictObject({ dao: DaoRefSchema, ballotId: IdSchema }),
    response: z.discriminatedUnion('state', [
      z.strictObject({ state: z.literal('executed'), transactionId: ChainIdSchema }),
      z.strictObject({ state: z.literal('already-executed') }),
    ]),
    helpTopic: 'governed-funding',
  },
} satisfies Record<
  string,
  {
    method: 'GET' | 'POST';
    path: string;
    input?: z.ZodType;
    query?: z.ZodType;
    response: z.ZodType;
    helpTopic: string;
  }
>;
export type FinalizationRequest = z.infer<typeof ModuleApiRoutes.finalize.input>;
export type FinalizationResult = z.infer<typeof ModuleApiRoutes.finalize.response>;
export type ExecutionRequest = z.infer<typeof ModuleApiRoutes.execute.input>;
export type ExecutionResult = z.infer<typeof ModuleApiRoutes.execute.response>;
