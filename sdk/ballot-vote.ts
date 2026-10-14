import type { DaoRef } from '@daclify/core-protocol';
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
} & Pick<BallotCommitmentInput, 'election' | 'execution' | 'grantPlan' | 'documentChange' | 'dispute' | 'target'>;

export function prepareBallotVote(input: Input): { action: 'vote'; fields: DecideActions['vote'] } | { action: 'votecommit'; fields: DecideActions['votecommit'] } {
  const { dao, ballot, choice } = input;
  if (ballot.dao_id !== dao.daoId) throw new Error('DAO_REFERENCE');
  if (!Number.isInteger(choice) || choice < 0 || choice >= ballot.choices) throw new Error('CHOICE');
  const definition = input.definitions.find(row => row.ballot_id === ballot.id);
  const actor = {runtime:dao.contract,dao_id:dao.daoId,member_id:input.memberId,ballot_id:ballot.id,choice};
  if (!definition) {
    let metadata: unknown;
    try { metadata = JSON.parse(ballot.metadata); } catch { throw new Error('BALLOT_DEFINITION_REQUIRED'); }
    if (typeof metadata === 'object' && metadata !== null && 'schemaVersion' in metadata && metadata.schemaVersion === 3) throw new Error('BALLOT_DEFINITION_REQUIRED');
    return {action:'vote',fields:actor};
  }
  const expected = ballotCommitment({chainId:dao.chainId,runtime:dao.contract,decide:input.decide,ballot,definition,election:input.election,execution:input.execution,grantPlan:input.grantPlan,documentChange:input.documentChange,dispute:input.dispute,target:input.target});
  if (expected !== definition.commitment) throw new Error('BALLOT_DEFINITION_CHANGED');
  return {action:'votecommit',fields:{...actor,expected}};
}
