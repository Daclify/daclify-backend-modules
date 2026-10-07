import { z } from 'zod';
import {
  DaoRefSchema,
  IdSchema,
  ModuleManifestSchema,
  NativeAccountSchema,
  ChainIdSchema,
  Uint64Schema,
} from '@daclify/core-protocol';
import { DecideTableSchemas } from '../sdk/generated/decide-schemas.js';
import { WorksTableSchemas } from '../sdk/generated/works-schemas.js';
import { PayrollTableSchemas } from '../sdk/generated/payroll-schemas.js';
export const ModuleDeploymentSchema = z.strictObject({
  id: z.enum(['decide', 'works', 'payroll']),
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
  ballots: z.union([Uint64Schema, z.literal('done')]).optional(),
  projects: z.union([Uint64Schema, z.literal('done')]).optional(),
  schedules: z.union([Uint64Schema, z.literal('done')]).optional(),
  memberId: IdSchema.optional(),
});
export type ModulePageQuery = z.infer<typeof ModulePageQuerySchema>;
export const ModuleStateSchema = z.strictObject({
  dao: DaoRefSchema,
  next: z
    .strictObject({
      ballots: Uint64Schema.nullable(),
      projects: Uint64Schema.nullable(),
      schedules: Uint64Schema.nullable(),
    })
    .default({ ballots: null, projects: null, schedules: null }),
  modules: z.array(ModuleStatusSchema),
  ballots: z.array(DecideTableSchemas.ballots),
  votes: z.array(DecideTableSchemas.votes),
  projects: z.array(WorksTableSchemas.projects),
  milestones: z.array(WorksTableSchemas.milestones),
  schedules: z.array(PayrollTableSchemas.schedules),
  entries: z.array(PayrollTableSchemas.entries),
  controls: z.array(PayrollTableSchemas.controls),
  executions: z.array(DecideTableSchemas.executions).default([]),
});
export type ModuleDeployment = z.infer<typeof ModuleDeploymentSchema>;
export type ModuleState = z.infer<typeof ModuleStateSchema>;
export const ModuleApiRoutes = {
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
