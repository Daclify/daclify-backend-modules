import { z } from 'zod';
import { ModuleManifestSchema, NativeAccountSchema } from '@daclify/core-protocol';
export const VERSION = '0.1.0-alpha.1';
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
    coreRange: '^0.1.0-alpha.1',
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['ballot.create', 'ballot.finalize'],
    helpTopic: 'decide',
  }),
  ModuleManifestSchema.parse({
    id: 'works',
    version: VERSION,
    coreRange: '^0.1.0-alpha.1',
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['obligation.create', 'obligation.execute'],
    helpTopic: 'works',
  }),
  ModuleManifestSchema.parse({
    id: 'payroll',
    version: VERSION,
    coreRange: '^0.1.0-alpha.1',
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
    actions: z.tuple([z.literal('open'), z.literal('vote')]),
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
    actions: z.tuple([z.literal('commit')]),
    grants: z.tuple([z.literal('reserve'), z.literal('approve')]),
  }),
]);
export type ModuleInstallation = z.infer<typeof ModuleInstallationSchema>;

export * from './api.js';
