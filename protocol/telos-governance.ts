import { z } from 'zod';
import { ChainIdSchema, NativeAccountSchema, Uint64Schema } from '@daclify/core-protocol';
const boundedText = (bytes: number) =>
  z
    .string()
    .max(bytes)
    .refine((value) => new TextEncoder().encode(value).byteLength <= bytes);
// Decide ballot/option identifiers are Antelope names, including canonical leading dots.
const name = z
  .string()
  .max(13)
  .regex(/^[a-z1-5.]*$/)
  .refine(
    (value) => !value.endsWith('.') && (value.length < 13 || /^[a-j1-5]$/.test(value.slice(-1))),
  );
export const TelosBallotNameSchema = name.min(1);
const hash = z.string().regex(/^[0-9a-f]{64}$/);
export const TelosGovernanceSourceSchema = z.strictObject({
  chainId: ChainIdSchema,
  rpcUrl: z.url().max(512),
  contract: z.literal('telos.decide'),
  environment: z.enum(['local', 'testnet', 'mainnet']),
  codeHash: hash.nullable(),
  abiHash: hash.nullable(),
});
export const TelosVoteWeightSchema = z
  .string()
  .max(32)
  .regex(/^(0|[1-9][0-9]*)\.[0-9]{4} VOTE$/)
  .refine((value) => BigInt(value.replace('.', '').split(' ')[0] ?? '') <= (1n << 62n) - 1n);
const time = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?$/)
  .refine((value) => Number.isFinite(Date.parse(value + 'Z')));
export const TelosBallotSchema = z
  .object({
    ballot_name: TelosBallotNameSchema,
    category: name.min(1),
    publisher: name.min(1),
    status: z.enum(['setup', 'voting', 'closed', 'cancelled', 'archived']),
    title: boundedText(4096),
    description: boundedText(4096),
    content: boundedText(8192),
    treasury_symbol: z.string().max(16),
    voting_method: name.min(1),
    min_options: z.int().min(1).max(255),
    max_options: z.int().min(1).max(255),
    options: z.array(z.strictObject({ key: name, value: TelosVoteWeightSchema })).max(256),
    total_voters: z.int().min(0).max(4294967295),
    total_delegates: z.int().min(0).max(4294967295),
    total_raw_weight: TelosVoteWeightSchema,
    cleaned_count: z.int().min(0).max(4294967295),
    settings: z
      .array(z.strictObject({ key: name, value: z.union([z.literal(0), z.literal(1)]) }))
      .max(32),
    begin_time: time,
    end_time: time,
  })
  .refine(
    (b) =>
      b.min_options <= b.max_options &&
      new Set(b.options.map((o) => o.key)).size === b.options.length &&
      new Set(b.settings.map((s) => s.key)).size === b.settings.length,
  );
export const TelosBallotPageSchema = z.strictObject({
  source: TelosGovernanceSourceSchema,
  ballots: z.array(TelosBallotSchema).max(25),
  nextCursor: Uint64Schema.nullable(),
  observedAt: z.iso.datetime(),
  signingAvailable: z.boolean(),
});
export const TelosBallotKindSchema = z.enum(['ballots', 'elections', 'foundation']);
const producerWeight = z
  .string()
  .max(128)
  .regex(/^(0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$/)
  .refine((value) => Number.isFinite(Number(value)));
export const TelosProducerSchema = z.object({
  owner: NativeAccountSchema,
  total_votes: producerWeight,
  is_active: z.boolean(),
  url: boundedText(2048),
  location: z.int().min(0).max(65535),
});
export const TelosProducerPageSchema = z.strictObject({
  source: TelosGovernanceSourceSchema.omit({
    contract: true,
    codeHash: true,
    abiHash: true,
  }).extend({ contract: z.literal('eosio') }),
  producers: z.array(TelosProducerSchema).max(25),
  activeSchedule: z
    .array(NativeAccountSchema)
    .max(125)
    .refine((names) => new Set(names).size === names.length),
  scheduleVersion: z.int().min(0).max(4294967295).nullable(),
  totalVoteWeight: producerWeight,
  nextCursor: NativeAccountSchema.nullable(),
  observedAt: z.iso.datetime(),
});
export const TelosVoterStateSchema = z.strictObject({
  account: NativeAccountSchema,
  registered: z.boolean(),
  weight: TelosVoteWeightSchema.nullable(),
  alreadyVoted: z.boolean(),
});
export const TelosVoteInputSchema = z.strictObject({
  ballot: TelosBallotNameSchema,
  voter: NativeAccountSchema,
  options: z
    .array(name)
    .min(1)
    .max(255)
    .refine((values) => new Set(values).size === values.length),
});
export const TelosBallotDetailSchema = z.strictObject({
  source: TelosGovernanceSourceSchema,
  ballot: TelosBallotSchema,
  signingAvailable: z.boolean(),
  observedAt: z.iso.datetime(),
});
export const TelosVotePreparationSchema = z.strictObject({
  source: TelosGovernanceSourceSchema,
  ballot: TelosBallotSchema,
  voter: TelosVoterStateSchema,
  options: TelosVoteInputSchema.shape.options,
  expires: z.iso.datetime(),
});
export const TelosGovernanceRoutes = Object.freeze({
  ballots: {
    method: 'GET' as const,
    path: '/v1/telos/ballots',
    query: z.strictObject({
      cursor: Uint64Schema.optional(),
      kind: TelosBallotKindSchema.optional(),
    }),
    response: TelosBallotPageSchema,
    helpTopic: 'telos-network-ballots',
  },
  producers: {
    method: 'GET' as const,
    path: '/v1/telos/producers',
    query: z.strictObject({ cursor: NativeAccountSchema.optional() }),
    response: TelosProducerPageSchema,
    helpTopic: 'telos-network-ballots',
  },
  ballot: {
    method: 'GET' as const,
    path: '/v1/telos/ballots/:ballot',
    response: TelosBallotDetailSchema,
    helpTopic: 'telos-network-ballots',
  },
  voter: {
    method: 'GET' as const,
    path: '/v1/telos/ballots/:ballot/voters/:voter',
    response: TelosVoterStateSchema,
    helpTopic: 'telos-network-ballots',
  },
  prepare: {
    method: 'POST' as const,
    path: '/v1/telos/votes/prepare',
    input: TelosVoteInputSchema,
    response: TelosVotePreparationSchema,
    helpTopic: 'telos-network-ballots',
  },
});
export type TelosGovernanceSource = z.infer<typeof TelosGovernanceSourceSchema>;
export type TelosBallotKind = z.infer<typeof TelosBallotKindSchema>;
export type TelosProducerPage = z.infer<typeof TelosProducerPageSchema>;
export type TelosBallot = z.infer<typeof TelosBallotSchema>;
export type TelosVoterState = z.infer<typeof TelosVoterStateSchema>;
export type TelosVoteInput = z.infer<typeof TelosVoteInputSchema>;
export type TelosVotePreparation = z.infer<typeof TelosVotePreparationSchema>;
