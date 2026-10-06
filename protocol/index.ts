import { z } from 'zod';
import { ModuleManifestSchema, NativeAccountSchema } from '@daclify/core-protocol';
export const VERSION = '0.2.0-alpha.1';
export const ModulePermissions = Object.freeze({
  decide: { actions: ['open', 'vote', 'openwork'] as const, grants: ['govlock'] as const },
  works: {
    actions: ['propose', 'accept', 'submitwork', 'review', 'cancel'] as const,
    grants: ['reserve', 'approve', 'cancel'] as const,
  },
  payroll: { actions: ['commit', 'edit'] as const, grants: ['reserve', 'approve'] as const },
});
export const DecideConfigSchema = z.strictObject({
  configVersion: z.literal(1),
  weight: z.enum(['member', 'credit', 'native-stake']),
  duration: z.int().min(60).max(2592000),
  quorumBasisPoints: z.int().min(1).max(10000),
  approvalBasisPoints: z.int().min(5001).max(10000),
});
export const WorksConfigSchema = z.strictObject({
  configVersion: z.literal(1),
  maxMilestones: z.int().min(1).max(16),
  reviewPolicy: z.literal('independent-reviewer'),
});
export const PayrollConfigSchema = z.strictObject({
  configVersion: z.literal(1),
  maxPeriods: z.int().min(1).max(12),
  minIntervalSeconds: z.int().min(86400).max(2678400),
});
export const Catalog = Object.freeze([
  ModuleManifestSchema.parse({
    id: 'decide',
    version: VERSION,
    coreRange: '^0.2.0-alpha.1',
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['ballot.create', 'ballot.finalize', 'ballot.execute'],
    helpTopic: 'decide',
  }),
  ModuleManifestSchema.parse({
    id: 'works',
    version: VERSION,
    coreRange: '^0.2.0-alpha.1',
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['obligation.create', 'obligation.execute'],
    helpTopic: 'works',
  }),
  ModuleManifestSchema.parse({
    id: 'payroll',
    version: VERSION,
    coreRange: '^0.2.0-alpha.1',
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['obligation.create', 'obligation.execute'],
    helpTopic: 'payroll',
  }),
]);
export const ModuleInstallationSchema = z.discriminatedUnion('id', [
  z.strictObject({
    id: z.literal('decide'),
    account: NativeAccountSchema,
    version: z.literal(VERSION),
    config: DecideConfigSchema,
    actions: z.tuple([
      z.literal(ModulePermissions.decide.actions[0]),
      z.literal(ModulePermissions.decide.actions[1]),
      z.literal(ModulePermissions.decide.actions[2]),
    ]),
    grants: z.tuple([z.literal('govlock')]),
  }),
  z.strictObject({
    id: z.literal('works'),
    account: NativeAccountSchema,
    version: z.literal(VERSION),
    config: WorksConfigSchema,
    actions: z.tuple([
      z.literal('propose'),
      z.literal('accept'),
      z.literal('submitwork'),
      z.literal('review'),
      z.literal('cancel'),
    ]),
    grants: z.tuple([z.literal('reserve'), z.literal('approve'), z.literal('cancel')]),
  }),
  z.strictObject({
    id: z.literal('payroll'),
    account: NativeAccountSchema,
    version: z.literal(VERSION),
    config: PayrollConfigSchema,
    actions: z.tuple([
      z.literal(ModulePermissions.payroll.actions[0]),
      z.literal(ModulePermissions.payroll.actions[1]),
    ]),
    grants: z.tuple([z.literal('reserve'), z.literal('approve')]),
  }),
]);
export type ModuleInstallation = z.infer<typeof ModuleInstallationSchema>;

export * from './api.js';
