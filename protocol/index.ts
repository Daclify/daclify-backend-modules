import { z } from 'zod';
import { ModuleManifestSchema, NativeAccountSchema } from '@daclify/core-protocol';
export const VERSION = '0.10.0-alpha.52';
// SDK/help releases do not require redeploying unchanged contract binaries.
export const CONTRACT_VERSION = '0.10.0-alpha.9';
const CORE_RANGE = '0.15.0-alpha.43';
export const ModulePermissions = Object.freeze({
  'quick-ballots': { actions: ['open', 'close'] as const, grants: [] as const },
  activity: {
    actions: [
      'recordact',
      'askreview',
      'reviewact',
      'newappkey',
      'grantappkey',
      'linkdecision',
    ] as const,
    grants: [] as const,
  },
  decide: {
    actions: [
      'open',
      'vote',
      'votecommit',
      'openpoll',
      'openarb',
      'openwork',
      'openaward',
      'newelect',
      'nominate',
      'startelect',
      'recall',
      'regdoc',
      'proposedoc',
      'adoptdoc',
      'canceldoc',
      'ackdoc',
    ] as const,
    grants: ['govlock', 'electexec'] as const,
  },
  works: {
    actions: [
      'propose',
      'accept',
      'submitwork',
      'review',
      'cancel',
      'offeragr',
      'offerprot',
      'acceptprot',
      'acceptagr',
    ] as const,
    grants: ['reserve', 'approve', 'cancel'] as const,
  },
  'endorsement-admission': {
    actions: ['applyjoin', 'witness', 'unwitness', 'admit'] as const,
    grants: ['admit'] as const,
  },
  'grants-rounds': {
    actions: [
      'newround',
      'applygrant',
      'amend',
      'submitapp',
      'offerprot',
      'submitprot',
      'reviewapp',
      'closeapp',
      'closeround',
    ] as const,
    grants: ['awardwork'] as const,
  },
  payroll: {
    actions: ['commit', 'edit', 'commitdoc', 'commitpriv', 'editpriv'] as const,
    grants: ['reserve', 'approve'] as const,
  },
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
export const GrantsConfigSchema = z.strictObject({
  configVersion: z.literal(1),
  assetRail: z.literal('native'),
  maxMilestones: z.literal(16),
  matching: z.literal(false),
});
export const EndorsementConfigSchema = z.strictObject({
  configVersion: z.literal(1),
  witnessLimit: z.literal(64),
});
export const Catalog = Object.freeze([
  ModuleManifestSchema.parse({
    id: 'quick-ballots',
    version: CONTRACT_VERSION,
    coreRange: CORE_RANGE,
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['ballot.create', 'ballot.finalize'],
    helpTopic: 'quick-ballots',
  }),
  ModuleManifestSchema.parse({
    id: 'activity',
    version: CONTRACT_VERSION,
    coreRange: CORE_RANGE,
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['content.publish'],
    helpTopic: 'activity',
  }),
  ModuleManifestSchema.parse({
    id: 'decide',
    version: CONTRACT_VERSION,
    coreRange: CORE_RANGE,
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['ballot.create', 'ballot.finalize', 'ballot.execute'],
    helpTopic: 'decide',
  }),
  ModuleManifestSchema.parse({
    id: 'works',
    version: CONTRACT_VERSION,
    coreRange: CORE_RANGE,
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['obligation.create', 'obligation.execute'],
    helpTopic: 'works',
  }),
  ModuleManifestSchema.parse({
    id: 'payroll',
    version: CONTRACT_VERSION,
    coreRange: CORE_RANGE,
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['obligation.create', 'obligation.execute'],
    helpTopic: 'payroll',
  }),
  ModuleManifestSchema.parse({
    id: 'grants-rounds',
    version: CONTRACT_VERSION,
    coreRange: CORE_RANGE,
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['obligation.create'],
    helpTopic: 'grants-rounds',
  }),
  ModuleManifestSchema.parse({
    id: 'endorsement-admission',
    version: CONTRACT_VERSION,
    coreRange: CORE_RANGE,
    interfaceVersion: 1,
    configVersion: 1,
    capabilities: ['member.manage'],
    helpTopic: 'endorsement-admission',
  }),
]);
export const ModuleInstallationSchema = z.discriminatedUnion('id', [
  z.strictObject({
    id: z.literal('quick-ballots'),
    account: NativeAccountSchema,
    version: z.literal(CONTRACT_VERSION),
    config: z.strictObject({ configVersion: z.literal(1) }),
    actions: z.tuple([z.literal('open'), z.literal('close')]),
    grants: z.tuple([]),
  }),
  z.strictObject({
    id: z.literal('activity'),
    account: NativeAccountSchema,
    version: z.literal(CONTRACT_VERSION),
    config: z.strictObject({
      configVersion: z.literal(1),
      reviewPolicy: z.literal('independent-reviewer'),
    }),
    actions: z.tuple([
      z.literal('recordact'),
      z.literal('askreview'),
      z.literal('reviewact'),
      z.literal('newappkey'),
      z.literal('grantappkey'),
      z.literal('linkdecision'),
    ]),
    grants: z.tuple([]),
  }),
  z.strictObject({
    id: z.literal('decide'),
    account: NativeAccountSchema,
    version: z.literal(CONTRACT_VERSION),
    config: DecideConfigSchema,
    actions: z.tuple([
      z.literal(ModulePermissions.decide.actions[0]),
      z.literal(ModulePermissions.decide.actions[1]),
      z.literal(ModulePermissions.decide.actions[2]),
      z.literal(ModulePermissions.decide.actions[3]),
      z.literal(ModulePermissions.decide.actions[4]),
      z.literal(ModulePermissions.decide.actions[5]),
      z.literal(ModulePermissions.decide.actions[6]),
      z.literal(ModulePermissions.decide.actions[7]),
      z.literal(ModulePermissions.decide.actions[8]),
      z.literal(ModulePermissions.decide.actions[9]),
      z.literal(ModulePermissions.decide.actions[10]),
      z.literal(ModulePermissions.decide.actions[11]),
      z.literal(ModulePermissions.decide.actions[12]),
      z.literal(ModulePermissions.decide.actions[13]),
      z.literal(ModulePermissions.decide.actions[14]),
      z.literal(ModulePermissions.decide.actions[15]),
    ]),
    grants: z.tuple([z.literal('govlock'), z.literal('electexec')]),
  }),
  z.strictObject({
    id: z.literal('works'),
    account: NativeAccountSchema,
    version: z.literal(CONTRACT_VERSION),
    config: WorksConfigSchema,
    actions: z.tuple([
      z.literal('propose'),
      z.literal('accept'),
      z.literal('submitwork'),
      z.literal('review'),
      z.literal('cancel'),
      z.literal('offeragr'),
      z.literal('offerprot'),
      z.literal('acceptprot'),
      z.literal('acceptagr'),
    ]),
    grants: z.tuple([z.literal('reserve'), z.literal('approve'), z.literal('cancel')]),
  }),
  z.strictObject({
    id: z.literal('payroll'),
    account: NativeAccountSchema,
    version: z.literal(CONTRACT_VERSION),
    config: PayrollConfigSchema,
    actions: z.tuple([
      z.literal(ModulePermissions.payroll.actions[0]),
      z.literal(ModulePermissions.payroll.actions[1]),
      z.literal(ModulePermissions.payroll.actions[2]),
    ]),
    grants: z.tuple([z.literal('reserve'), z.literal('approve')]),
  }),
  z.strictObject({
    id: z.literal('grants-rounds'),
    account: NativeAccountSchema,
    version: z.literal(CONTRACT_VERSION),
    config: GrantsConfigSchema,
    actions: z.tuple([
      z.literal('newround'),
      z.literal('applygrant'),
      z.literal('amend'),
      z.literal('submitapp'),
      z.literal('offerprot'),
      z.literal('submitprot'),
      z.literal('reviewapp'),
      z.literal('closeapp'),
      z.literal('closeround'),
    ]),
    grants: z.tuple([z.literal('awardwork')]),
  }),
  z.strictObject({
    id: z.literal('endorsement-admission'),
    account: NativeAccountSchema,
    version: z.literal(CONTRACT_VERSION),
    config: EndorsementConfigSchema,
    actions: z.tuple([
      z.literal('applyjoin'),
      z.literal('witness'),
      z.literal('unwitness'),
      z.literal('admit'),
    ]),
    grants: z.tuple([z.literal('admit')]),
  }),
]);
export type ModuleInstallation = z.infer<typeof ModuleInstallationSchema>;

export * from './api.js';
export * from './agreements.js';
export * from './ballots.js';
export * from './quick-ballots.js';
export * from './telos-governance.js';
