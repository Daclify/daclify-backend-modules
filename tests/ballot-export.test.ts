import { expect,it } from 'vitest';
import { ballotCommitment } from '../sdk/ballot-commitment.js';
import { makeBallotExport } from '../sdk/ballot-export.js';
const dao={chainId:'ab'.repeat(32),contract:'daclifycore',daoId:'1',interfaceVersion:1 as const};
const ballot={id:'1',dao_id:'1',creator:'1',kind:0,choices:2,closes:1300,quorum:5000,approval:5001,denominator:'3',max_member:'3',cast:'2',tallies:['0','2'],status:1,winner:1,metadata:JSON.stringify({schemaVersion:3,semantics:'proposal',title:'Budget',description:'Approve it',options:['Reject','Approve']})};
const definition={ballot_id:'1',dao_id:'1',version:1,purpose:0,policy_revision:'0',policy_hash:'00'.repeat(32),commitment:'00'.repeat(32)};
definition.commitment=ballotCommitment({chainId:dao.chainId,runtime:dao.contract,decide:'decide',ballot,definition});
const votes=[{id:'1',ballot:'1',member:'2',weight:'2',choice:1}];
const input={dao,decide:'decide',ballot,definition,votes};
it('exports the full frozen definition and reports exact live vote coverage',()=>{
 const result=makeBallotExport(input);expect(result).toMatchObject({schemaVersion:1,dao,decide:'decide',ballot,definition,votes,verification:'verified',coverage:'complete-live'});
 expect(makeBallotExport({...input,votes:[]})).toMatchObject({coverage:'partial-live'});
});
it('rejects forged definitions, duplicate/foreign votes and tally contradictions',()=>{
 expect(()=>makeBallotExport({...input,ballot:{...ballot,metadata:'{}'}})).toThrow('BALLOT_DEFINITION_CHANGED');
 expect(()=>makeBallotExport({...input,votes:[...votes,...votes]})).toThrow('BALLOT_EXPORT_VOTES');
 expect(()=>makeBallotExport({...input,votes:[{...votes[0],id:'2',ballot:'2',member:'2',weight:'2',choice:1}]})).toThrow();
 expect(()=>makeBallotExport({...input,votes:[{id:'1',ballot:'1',member:'2',weight:'2',choice:0}]})).toThrow('BALLOT_EXPORT_TALLIES');
});
