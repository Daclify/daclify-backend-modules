import { expect, it } from 'vitest';
import { ballotCommitment } from '../sdk/ballot-commitment.js';
import { encodeBallotMetadata, readBallotMetadata } from '../sdk/ballots.js';

const zero = '00'.repeat(32);
const input = {
  chainId: 'ab'.repeat(32), runtime: 'daclifycore', decide: 'decide',
  ballot: { id:'1', dao_id:'1', creator:'1', kind:0, choices:2, closes:1300, quorum:5000, approval:5001, denominator:'3', max_member:'3', cast:'0', tallies:['0','0'], status:0, winner:-1, metadata:JSON.stringify({schemaVersion:3,semantics:'proposal',title:'Budget',description:'Approve the proposal.',options:['Reject','Approve']}) },
  definition: { ballot_id:'1',dao_id:'1',version:1,purpose:0,policy_revision:'0',policy_hash:zero,commitment:zero },
};

it('matches the independent fixed contract-definition vector', () => {
  expect(ballotCommitment(input)).toBe('ca36ecad3ca6cbdc8803b7ca7386d98782d98085c9d66f4edcb1510fa141356c');
});
it('excludes tallies and status but binds exact bytes, identity and policy', () => {
  const expected = ballotCommitment(input);
  expect(ballotCommitment({...input,ballot:{...input.ballot,cast:'2',tallies:['0','2'],status:1,winner:1}})).toBe(expected);
  for(const metadata of [input.ballot.metadata.replace('Budget','budget'), input.ballot.metadata+' '])
    expect(ballotCommitment({...input,ballot:{...input.ballot,metadata}})).not.toBe(expected);
  expect(ballotCommitment({...input,chainId:'cd'.repeat(32)})).not.toBe(expected);
  expect(ballotCommitment({...input,definition:{...input.definition,policy_revision:'1'}})).not.toBe(expected);
  expect(() => ballotCommitment({...input,definition:{...input.definition,dao_id:'2'}})).toThrow('BALLOT_DEFINITION_DOMAIN');
});
it('requires the exact subtype record instead of treating an election or execution as an ordinary poll', () => {
  for(const purpose of [2,3,4,5]) expect(() => ballotCommitment({...input,definition:{...input.definition,purpose}})).toThrow();
});
it('encodes an explicitly neutral binary poll while preserving schema-two proposal interpretation', () => {
  const neutral = {schemaVersion:3 as const,semantics:'poll' as const,title:'Meeting',description:'Choose a location.',options:['Garden','Hall']};
  const text = encodeBallotMetadata(neutral);
  expect(readBallotMetadata(text,2)).toMatchObject(neutral);
  expect(readBallotMetadata(JSON.stringify({...neutral,schemaVersion:2}),2)).toBeUndefined();
  expect(readBallotMetadata('{}',2)?.options).toEqual(['Reject','Approve']);
});
it('binds readable funding terms and requires them for version-two definitions',()=>{
 const execution={ballot_id:'1',dao_id:'1',works:'works',project_id:'7',commitment:zero,works_hash:zero,policy_revision:'0',deadline:2000,executed:false};
 const milestone={id:'9',dao_id:'1',project_id:'7',quantity:'3.0000 TLOS',due:1900,status:0,submission_doc:'0',submission_version:0,review_doc:'0',review_version:0,reviewer:'0'};
 const target={ballot_id:'1',dao_id:'1',version:1,work:{project:{id:'7',dao_id:'1',creator:'1',contributor:'2',document_id:'3',document_version:1,milestones:['9'],status:0},milestones:[milestone],agreement:undefined,protection:undefined,document_commitment:zero},grant:undefined,released:false};
 const funding={...input,definition:{...input.definition,version:2,purpose:3},execution,target};
 const hash=ballotCommitment(funding);
 expect(ballotCommitment({...funding,target:{...target,released:true}})).toBe(hash);
 expect(ballotCommitment({...funding,target:{...target,work:{...target.work,milestones:[{...milestone,quantity:'4.0000 TLOS'}]}}})).not.toBe(hash);
 expect(()=>ballotCommitment({...funding,target:undefined})).toThrow();
 expect(()=>ballotCommitment({...funding,target:{...target,dao_id:'2'}})).toThrow('BALLOT_DEFINITION_DOMAIN');
 expect(()=>ballotCommitment({...funding,target:{...target,work:{...target.work,project:{...target.work.project,id:'8'}}}})).toThrow('BALLOT_DEFINITION_DOMAIN');
});
