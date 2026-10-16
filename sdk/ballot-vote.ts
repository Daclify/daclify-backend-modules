import {
  PrivateRecordPayloadSchema,
  PrivateRecordReferenceSchema,
  type DaoRef,
} from '@daclify/core-protocol';
import { z } from 'zod';
import { readBallotMetadata } from './ballots.js';
import type { ModuleState } from '../protocol/api.js';
import { ballotCommitment, type BallotCommitmentInput } from './ballot-commitment.js';
import type { DecideActions } from './generated/decide.js';

type Input = {
  dao: DaoRef;
  decide: string;
  memberId: string;
  ballot: ModuleState['ballots'][number];
  definitions: ModuleState['ballotDefinitions'];
  choice: number;
  privateContent?: unknown;
} & Pick<
  BallotCommitmentInput,
  'election' | 'execution' | 'grantPlan' | 'documentChange' | 'dispute' | 'target'
>;

export function verifyBallotDefinition(
  input: Omit<Input, 'memberId' | 'choice' | 'privateContent'>,
) {
  const { dao, ballot } = input;
  if (ballot.dao_id !== dao.daoId) throw Error('DAO_REFERENCE');
  const definition = input.definitions.find((row) => row.ballot_id === ballot.id);
  if (!definition) {
    let metadata: unknown;
    try {
      metadata = JSON.parse(ballot.metadata);
    } catch {
      throw Error('BALLOT_DEFINITION_REQUIRED');
    }
    if (
      typeof metadata === 'object' &&
      metadata !== null &&
      'schemaVersion' in metadata &&
      (metadata.schemaVersion === 3 || metadata.schemaVersion === 4)
    )
      throw Error('BALLOT_DEFINITION_REQUIRED');
    return;
  }
  const expected = ballotCommitment({
    chainId: dao.chainId,
    runtime: dao.contract,
    decide: input.decide,
    ballot,
    definition,
    election: input.election,
    execution: input.execution,
    grantPlan: input.grantPlan,
    documentChange: input.documentChange,
    dispute: input.dispute,
    target: input.target,
  });
  if (expected !== definition.commitment) throw Error('BALLOT_DEFINITION_CHANGED');
  return definition;
}
export function prepareBallotVote(
  input: Input,
):
  | { action: 'vote'; fields: DecideActions['vote'] }
  | { action: 'votecommit'; fields: DecideActions['votecommit'] } {
  const { dao, ballot, choice } = input,
    definition = verifyBallotDefinition(input);
  if (!Number.isInteger(choice) || choice < 0 || choice >= ballot.choices) throw Error('CHOICE');
  const metadata = readBallotMetadata(ballot.metadata, ballot.choices);
  const raw: unknown = JSON.parse(ballot.metadata);
  if (
    typeof raw === 'object' &&
    raw !== null &&
    'schemaVersion' in raw &&
    raw.schemaVersion === 4 &&
    !metadata?.privateContent
  )
    throw Error('BALLOT_OPTIONS');
  if (metadata?.privateContent) {
    if (!input.privateContent) throw Error('PRIVATE_BALLOT_REVIEW_REQUIRED');
    const reviewed = z
      .strictObject({
        reference: PrivateRecordReferenceSchema,
        payload: PrivateRecordPayloadSchema,
      })
      .parse(input.privateContent);
    const payload = reviewed.payload;
    if (
      JSON.stringify(reviewed.reference) !== JSON.stringify(metadata.privateContent) ||
      payload.kind !== 'ballot-content' ||
      payload.source !== input.decide ||
      payload.recordId !== ballot.id ||
      payload.body.options.length !== ballot.choices ||
      payload.body.semantics !== metadata.semantics ||
      JSON.stringify(payload.body.document) !== JSON.stringify(metadata.document)
    )
      throw Error('PRIVATE_BALLOT_CONTEXT');
  }
  const actor = {
    runtime: dao.contract,
    dao_id: dao.daoId,
    member_id: input.memberId,
    ballot_id: ballot.id,
    choice,
  };
  return definition
    ? { action: 'votecommit', fields: { ...actor, expected: definition.commitment } }
    : { action: 'vote', fields: actor };
}
