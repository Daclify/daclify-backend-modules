import { BallotExportSchema,type BallotExport } from '../protocol/api.js';
import { prepareBallotVote } from './ballot-vote.js';

type Input=Omit<BallotExport,'schemaVersion'|'verification'|'coverage'|'archiveNotice'>;
export function makeBallotExport(value:Input):BallotExport {
 const input=BallotExportSchema.parse({...value,schemaVersion:1,verification:'legacy-unbound',coverage:'partial-live',archiveNotice:'Archived vote rows are not included; partial-live is not a complete history.'});
 const prepared=prepareBallotVote({dao:input.dao,decide:input.decide,memberId:input.ballot.creator,ballot:input.ballot,definitions:input.definition?[input.definition]:[],choice:0,election:input.election,execution:input.execution,grantPlan:input.grantPlan,documentChange:input.documentChange,dispute:input.dispute,target:input.target});
 const members=new Set<string>(),ids=new Set<string>(),tallies=Array<bigint>(input.ballot.choices).fill(0n);
 let cast=0n;
 for(const vote of input.votes){
  if(vote.ballot!==input.ballot.id||members.has(vote.member)||ids.has(vote.id)||vote.choice>=tallies.length||BigInt(vote.weight)<=0n)throw new Error('BALLOT_EXPORT_VOTES');
  members.add(vote.member);ids.add(vote.id);cast+=BigInt(vote.weight);tallies[vote.choice]=(tallies[vote.choice]??0n)+BigInt(vote.weight);
 }
 if(cast>BigInt(input.ballot.cast)||tallies.some((total,index)=>total>BigInt(input.ballot.tallies[index]??'0')))throw new Error('BALLOT_EXPORT_TALLIES');
 const complete=cast===BigInt(input.ballot.cast)&&tallies.every((total,index)=>total===BigInt(input.ballot.tallies[index]??'0'));
 return {...input,verification:prepared.action==='votecommit'?'verified':'legacy-unbound',coverage:complete?'complete-live':'partial-live'};
}
