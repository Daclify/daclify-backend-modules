import { ABI, Bytes, Checksum256, Name, Serializer, UInt32, UInt64 } from '@wharfkit/antelope';
import { z } from 'zod';
import { ChainIdSchema, NativeAccountSchema, Uint64Schema } from '@daclify/core-protocol';
import { quickvoteAbi, type QuickvoteActions } from './generated/quickvote.js';
import { QuickvoteActionSchemas } from './generated/quickvote-schemas.js';
import {
  QuickBallotDefinitionSchema,
  QuickBallotResultInputSchema,
  QuickBallotSnapshotSchema,
  quickQuestionReference,
} from '../protocol/quick-ballots.js';
import {
  addBallotCiphertexts,
  verifyBallotKey,
  verifyBallotChoice,
  verifyBallotTally,
} from './quick-ballot-proof.js';
export { quickvoteAbi } from './generated/quickvote.js';
export {
  QuickvoteActionSchemas as QuickBallotActionSchemas,
  QuickvoteTableSchemas as QuickBallotTableSchemas,
} from './generated/quickvote-schemas.js';
export type QuickBallotActions = QuickvoteActions;

const definitionInput = z.strictObject({
  chainId: ChainIdSchema,
  runtime: NativeAccountSchema,
  source: NativeAccountSchema,
  ballotId: Uint64Schema,
  daoId: Uint64Schema,
  creatorId: Uint64Schema,
  definition: QuickBallotDefinitionSchema,
});
const contextInput = z.strictObject({
  chainId: ChainIdSchema,
  runtime: NativeAccountSchema,
  ballotId: Uint64Schema,
  definitionHash: ChainIdSchema,
});
function hash(parts: Uint8Array[]): string {
  const bytes = new Uint8Array(parts.reduce((n, part) => n + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return Checksum256.hash(bytes).toString();
}
export function encodeQuickBallot<K extends keyof QuickvoteActions>(
  action: K,
  value: QuickvoteActions[K],
): Uint8Array {
  return Serializer.encode({
    abi: ABI.from(quickvoteAbi),
    type: action,
    object: QuickvoteActionSchemas[action].parse(value),
  }).array;
}
export function quickBallotDefinitionHash(value: unknown): string {
  const input = definitionInput.parse(value);
  const reference = quickQuestionReference(input.definition);
  if (reference && (reference.documentId !== input.ballotId || input.definition.audience[0] !== input.daoId)) throw Error('QUICK_QUESTION_PARENT');
  return hash([
    Serializer.encode({ object: 'daclify.quick-ballot.definition.v1', type: 'string' }).array,
    Checksum256.from(input.chainId).array,
    ...[input.runtime, input.source].map(
      (name) => Serializer.encode({ object: Name.from(name) }).array,
    ),
    ...[input.ballotId, input.daoId, input.creatorId].map(
      (id) => Serializer.encode({ object: UInt64.from(id) }).array,
    ),
    Serializer.encode({
      abi: ABI.from(quickvoteAbi),
      type: 'quick_definition',
      object: input.definition,
    }).array,
  ]);
}
function proofContext(
  kind: 'key' | 'response' | 'tally',
  value: z.infer<typeof contextInput>,
  suffix: Uint8Array[] = [],
): string {
  return hash([
    new TextEncoder().encode(`daclify.quick-ballot.context.${kind}.v1\0`),
    Checksum256.from(value.chainId).array,
    Serializer.encode({ object: Name.from(value.runtime) }).array,
    Serializer.encode({ object: UInt64.from(value.ballotId) }).array,
    Checksum256.from(value.definitionHash).array,
    Serializer.encode({ object: UInt32.from(1) }).array,
    ...suffix,
  ]);
}
export function quickKeyContext(value: unknown): string {
  return proofContext('key', contextInput.parse(value));
}
export function quickResponseContext(value: unknown): string {
  const { identity, revision, ...base } = contextInput
    .extend({ identity: ChainIdSchema, revision: Uint64Schema })
    .parse(value);
  return proofContext('response', base, [
    Checksum256.from(identity).array,
    Serializer.encode({ object: UInt64.from(revision) }).array,
  ]);
}
export function quickTallyContext(value: unknown): string {
  const { root, count, aggregate, ...base } = contextInput
    .extend({
      root: ChainIdSchema,
      count: Uint64Schema,
      aggregate: z.string().regex(/^[0-9a-f]{384}$/),
    })
    .parse(value);
  return proofContext('tally', base, [
    Checksum256.from(root).array,
    Serializer.encode({ object: UInt64.from(count) }).array,
    Bytes.from(aggregate).array,
  ]);
}

function verifiedDefinition(input: z.infer<typeof QuickBallotResultInputSchema>) {
  const { ballot } = input;
  if (
    quickBallotDefinitionHash({
      chainId: input.chainId,
      runtime: input.runtime,
      source: input.source,
      ballotId: ballot.id,
      daoId: ballot.dao_id,
      creatorId: ballot.creator_id,
      definition: ballot.definition,
    }) !== ballot.definition_hash
  )
    throw new Error('QUICK_DEFINITION');
  const context = {
    chainId: input.chainId,
    runtime: input.runtime,
    ballotId: ballot.id,
    definitionHash: ballot.definition_hash,
  };
  if (!verifyBallotKey(quickKeyContext(context), ballot.key, ballot.key_proof))
    throw new Error('QUICK_KEY_PROOF');
  if (
    ballot.count > ballot.identities ||
    ballot.id === '0' ||
    ballot.dao_id === '0' ||
    !ballot.opened_at
  )
    throw new Error('QUICK_ACCOUNTING');
  return context;
}
function verifiedResult(
  input: z.infer<typeof QuickBallotResultInputSchema>,
  context: ReturnType<typeof verifiedDefinition>,
) {
  const { ballot } = input;
  if (!ballot.verified) return null;
  if (
    !ballot.closed_at ||
    !ballot.prepared ||
    !verifyBallotTally(
      quickTallyContext({
        ...context,
        root: ballot.response_root,
        count: String(ballot.count),
        aggregate: ballot.aggregate,
      }),
      ballot.key,
      ballot.aggregate,
      BigInt(ballot.count),
      BigInt(ballot.up),
      ballot.final_proof,
    )
  )
    throw new Error('QUICK_TALLY_PROOF');
  return { up: ballot.up, down: ballot.count - ballot.up, count: ballot.count };
}
export function verifyQuickBallotResult(value: unknown) {
  const input = QuickBallotResultInputSchema.parse(value);
  return verifiedResult(input, verifiedDefinition(input));
}

// Verify archived or live original rows against the same immutable frozen source.
export function verifyQuickBallotSnapshot(value: unknown) {
  const input = QuickBallotSnapshotSchema.parse(value),
    { ballot, responses } = input;
  const context = verifiedDefinition(input);
  if (
    !ballot.closed_at ||
    !ballot.prepared ||
    ballot.identities !== responses.length ||
    ballot.scan_rows !== ballot.identities ||
    ballot.scan_count !== ballot.count ||
    ballot.scan_aggregate !== ''
  )
    throw new Error('QUICK_SNAPSHOT');
  let root = hash([
      Serializer.encode({ type: 'string', object: 'daclify.quick-ballot.responses.v1' }).array,
      Bytes.from(input.chainId).array,
      ...[input.runtime, input.source].map(
        (object) => Serializer.encode({ type: 'name', object }).array,
      ),
      Serializer.encode({ type: 'uint64', object: ballot.id }).array,
      Bytes.from(ballot.definition_hash).array,
      Serializer.encode({ type: 'uint64', object: String(ballot.count) }).array,
      Serializer.encode({ type: 'bytes', object: ballot.aggregate }).array,
      Serializer.encode({ type: 'uint64', object: String(ballot.identities) }).array,
    ]),
    aggregate = '00'.repeat(192),
    count = 0,
    previous = 0n;
  const identities = new Set<string>();
  for (const row of responses) {
    if (
      BigInt(row.id) <= previous ||
      identities.has(row.identity) ||
      row.ballot_id !== ballot.id ||
      row.dao_id !== ballot.dao_id ||
      row.updated_at < ballot.opened_at ||
      row.updated_at > ballot.closed_at
    )
      throw new Error('QUICK_RESPONSE_DOMAIN');
    previous = BigInt(row.id);
    identities.add(row.identity);
    if (row.active) {
      if (
        !verifyBallotChoice(
          quickResponseContext({ ...context, identity: row.identity, revision: row.revision }),
          ballot.key,
          row.ciphertext,
          row.proof,
        )
      )
        throw new Error('QUICK_RESPONSE_PROOF');
      aggregate = addBallotCiphertexts(aggregate, row.ciphertext);
      ++count;
    }
    root = hash([
      Bytes.from(root).array,
      Serializer.encode({ abi: ABI.from(quickvoteAbi), type: 'quick_response', object: row }).array,
    ]);
  }
  if (
    count !== ballot.count ||
    aggregate !== ballot.aggregate ||
    root !== ballot.response_root ||
    (responses.at(-1)?.id ?? '0') !== ballot.scan_cursor
  )
    throw new Error('QUICK_SNAPSHOT');
  return { ...input, result: verifiedResult(input, context) };
}
