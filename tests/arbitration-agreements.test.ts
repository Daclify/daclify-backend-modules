import {beforeEach,expect,it} from 'vitest';
import {Blockchain} from '@proton/vert';
import {TimePointSec} from '@greymass/eosio';
import {encodeAction,makeInstruction,instructionDigest} from '@daclify/core-protocol/sdk';
import {PrivateKey} from '@wharfkit/antelope';
import {z} from 'zod';
import {load,send,row,listFirstParty,sendBoundVote} from './helpers/vert.js';
import {wasmCodeHash} from './helpers/code-hash.js';
let memberKeys:PrivateKey[];
let core:ReturnType<typeof load>,works:ReturnType<typeof load>,decide:ReturnType<typeof load>,chain:Blockchain;
const hash=wasmCodeHash('.artifacts/contracts/works.wasm'),decideHash=wasmCodeHash('.artifacts/contracts/decide.wasm');
beforeEach(async()=>{
 chain=new Blockchain();chain.createAccounts('alice','bob','carol');core=load(chain,'daclifycore','.artifacts/core-release/runtime');works=load(chain,'works','.artifacts/contracts/works');decide=load(chain,'decide','.artifacts/contracts/decide');const token=load(chain,'eosio.token','.artifacts/core-release/testtoken');
 await send(core,'init',['ab'.repeat(32)],'daclifycore@active');await listFirstParty(core,'works',hash);await listFirstParty(core,'decide',decideHash);await send(core,'createdao',[1,'alice','{}',0,'eosio.token','4,TLOS'],'alice@active');
 memberKeys=Array.from({length:4},()=>PrivateKey.generate('K1'));for(let id=1;id<=4;id++){const key=memberKeys[id-1];if(!key)throw Error('Fixture key');await send(core,'enroll',[1,id,'',key.toPublic().toString(),'key',0],'alice@active');}
 await send(core,'setmodule',[1,'works',1,['propose','accept','offeragr','acceptagr','offerprot','acceptprot','submitwork','review','cancel'],['reserve','approve','cancel'],hash],'alice@active');
 await send(core,'setmodule',[1,'decide',1,['open','openarb','votecommit'],['govlock'],decideHash],'alice@active');
 await send(core,'putjson',['daclifycore',1,1,42,1,'{}',0,0],'daclifycore@active');await send(token,'create',['alice','1000.0000 TLOS'],'eosio.token@active');await send(token,'issue',['alice','100.0000 TLOS',''],'alice@active');await send(token,'transfer',['alice','daclifycore','10.0000 TLOS','dao:1'],'alice@active');
 await send(works,'propose',['daclifycore',1,1,1,2,42,1,['1.0000 TLOS'],[1000]],'daclifycore@active');await send(works,'offeragr',['daclifycore',1,1,1,0,2000],'daclifycore@active');
});
const offer=(backup=3,representative=1)=>['daclifycore',1,1,1,'decide',backup,representative,60,60,60,60];
const term=()=>z.object({commitment:z.string()}).parse(row(works,'arbterms',core.toBigInt(),1n));
it('requires consent to the exact protected terms before reserving any milestone',async()=>{
 await send(works,'offerprot',offer(),'daclifycore@active');await expect(send(works,'accept',['daclifycore',1,1,1],'daclifycore@active')).rejects.toThrow('ARBITRATION_CONSENT');
 await expect(send(works,'acceptagr',['daclifycore',1,2,1],'daclifycore@active')).rejects.toThrow('ARBITRATION_CONSENT');
 await expect(send(works,'acceptprot',['daclifycore',1,2,1,'ff'.repeat(32)],'daclifycore@active')).rejects.toThrow('ARBITRATION_CHANGED');
 await send(works,'acceptprot',['daclifycore',1,2,1,term().commitment],'daclifycore@active');await send(works,'accept',['daclifycore',1,1,1],'daclifycore@active');
 expect(row(core,'protected',1n,1n)).toMatchObject({source:'works',source_id:1,recipient:2,state:0});
});
it('rejects contributor/conflicting or missing backup authority before consent',async()=>{
 for(const args of [offer(2),offer(1),offer(999)])await expect(send(works,'offerprot',args,'daclifycore@active')).rejects.toThrow();
 expect(row(works,'arbterms',core.toBigInt(),1n)).toBeUndefined();
});
it('prevents the native owner and ordinary module actions from bypassing the protection',async()=>{
 await send(works,'offerprot',offer(),'daclifycore@active');await send(works,'acceptprot',['daclifycore',1,2,1,term().commitment],'daclifycore@active');await send(works,'accept',['daclifycore',1,1,1],'daclifycore@active');
 await expect(send(core,'cancelob',[1,'works',1],'alice@active')).rejects.toThrow('OBLIGATION_PROTECTED');
 await expect(send(works,'cancel',['daclifycore',1,1,1],'daclifycore@active')).rejects.toThrow('OBLIGATION_PROTECTED');
 expect(row(core,'daos',core.toBigInt(),1n)).toMatchObject({reserved:10000,available:90000});
});
it('makes an adopted protection policy apply to all future Works funding',async()=>{
 await send(core,'protectdao',['daclifycore',1,1,'works'],'daclifycore@active');await send(works,'acceptagr',['daclifycore',1,2,1],'daclifycore@active');
 await expect(send(works,'accept',['daclifycore',1,1,1],'daclifycore@active')).rejects.toThrow('ARBITRATION_REQUIRED');
 expect(row(core,'obligations',1n,1n)).toBeUndefined();
});
it('retains immediate legacy approval and payable claims for unprotected funded work',async()=>{
 await send(works,'acceptagr',['daclifycore',1,2,1],'daclifycore@active');await send(works,'accept',['daclifycore',1,1,1],'daclifycore@active');await send(works,'submitwork',['daclifycore',1,2,1,42,1],'daclifycore@active');await send(works,'review',['daclifycore',1,1,1,true,42,1],'daclifycore@active');
 await send(core,'protectdao',['daclifycore',1,1,'works'],'daclifycore@active');expect(row(core,'obligations',1n,1n)).toMatchObject({status:1});
});
async function fundProtected(){await send(works,'offerprot',offer(),'daclifycore@active');await send(works,'acceptprot',['daclifycore',1,2,1,term().commitment],'daclifycore@active');await send(works,'accept',['daclifycore',1,1,1],'daclifycore@active');}
it('keeps a protected review provisional, blocks premature payout and then finalizes once',async()=>{
 await fundProtected();await send(works,'submitwork',['daclifycore',1,2,1,42,1],'daclifycore@active');await send(works,'review',['daclifycore',1,1,1,true,42,1],'daclifycore@active');
 expect(row(core,'obligations',1n,1n)).toMatchObject({status:0});expect(row(core,'protected',1n,1n)).toMatchObject({state:2,reviewer:1});
 await expect(send(core,'arbtimeout',[1,1],'bob@active')).rejects.toThrow('ARBITRATION_DEADLINE');await expect(send(core,'payob',[1,'works',1],'bob@active')).rejects.toThrow('NOT_PAYABLE');
 chain.addTime(TimePointSec.from(60));await send(core,'arbtimeout',[1,1],'bob@active');await send(core,'arbtimeout',[1,1],'bob@active');expect(row(core,'obligations',1n,1n)).toMatchObject({status:1});
});
it('keeps nondelivery reserved through primary and backup expiry and permits only matching mutual consent',async()=>{
 await fundProtected();chain.addTime(TimePointSec.from(2000));await send(core,'arbtimeout',[1,1],'bob@active');expect(row(core,'protected',1n,1n)).toMatchObject({state:4});
 chain.addTime(TimePointSec.from(120));await send(core,'arbtimeout',[1,1],'bob@active');chain.addTime(TimePointSec.from(60));await send(core,'arbtimeout',[1,1],'bob@active');expect(row(core,'protected',1n,1n)).toMatchObject({state:6});
 await expect(send(core,'arbbackup',['daclifycore',1,3,1,term().commitment,false],'daclifycore@active')).rejects.toThrow('ARBITRATION_STATE');
 await send(core,'setactive',['daclifycore',1,1,2,false],'daclifycore@active');await send(core,'arbconsent',['daclifycore',1,2,1,term().commitment,1],'daclifycore@active');
 await expect(send(core,'arbconsent',['daclifycore',1,1,1,term().commitment,0],'daclifycore@active')).rejects.toThrow('ARBITRATION_CONSENT_MISMATCH');expect(row(core,'obligations',1n,1n)).toMatchObject({status:0});
 await send(core,'arbconsent',['daclifycore',1,1,1,term().commitment,1],'daclifycore@active');await send(core,'payob',[1,'works',1],'bob@active');await expect(send(core,'payob',[1,'works',1],'bob@active')).rejects.toThrow('NOT_PAYABLE');
 expect(row(core,'daos',core.toBigInt(),1n)).toMatchObject({reserved:0,claims:10000});
});

async function challengeRevision(){await fundProtected();await send(works,'submitwork',['daclifycore',1,2,1,42,1],'daclifycore@active');await send(works,'review',['daclifycore',1,1,1,false,42,1],'daclifycore@active');await send(core,'arbchallenge',['daclifycore',1,2,1,term().commitment,42,1],'daclifycore@active');}
it('binds an explicit member-court cancellation and excludes contributor and reviewer',async()=>{
 await challengeRevision();await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');
 expect(row(decide,'ballots',core.toBigInt(),10n)).toMatchObject({denominator:2,choices:2});
 for(const member of [1,2])await expect(sendBoundVote(decide,['daclifycore',1,member,10,0],'daclifycore@active')).rejects.toThrow('ARBITRATION_VOTER');
 await sendBoundVote(decide,['daclifycore',1,3,10,0],'daclifycore@active');chain.addTime(TimePointSec.from(60));await send(decide,'finalize',['daclifycore',1,10],'bob@active');await send(decide,'execarb',['daclifycore',1,10],'bob@active');
 expect(row(core,'obligations',1n,1n)).toMatchObject({status:3});expect(row(core,'daos',core.toBigInt(),1n)).toMatchObject({available:100000,reserved:0});await send(decide,'execarb',['daclifycore',1,10],'bob@active');
});
it('keeps invalid votes reserved and hands authority to the agreed backup only after timeout',async()=>{
 await challengeRevision();await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');chain.addTime(TimePointSec.from(60));await send(decide,'finalize',['daclifycore',1,10],'bob@active');await expect(send(decide,'execarb',['daclifycore',1,10],'bob@active')).rejects.toThrow('BALLOT_NOT_PASSED');
 await expect(send(core,'arbbackup',['daclifycore',1,3,1,term().commitment,true],'daclifycore@active')).rejects.toThrow('ARBITRATION_STATE');chain.addTime(TimePointSec.from(60));await send(core,'arbtimeout',[1,1],'bob@active');await expect(send(decide,'execarb',['daclifycore',1,10],'bob@active')).rejects.toThrow();await send(core,'arbbackup',['daclifycore',1,3,1,term().commitment,true],'daclifycore@active');expect(row(core,'obligations',1n,1n)).toMatchObject({status:1});
});
it('records unavailable primary voters without trapping timeout escalation behind ballot creation',async()=>{
 await challengeRevision();for(const member of [3,4])await send(core,'setactive',['daclifycore',1,1,member,false],'daclifycore@active');await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');expect(row(decide,'ballots',core.toBigInt(),10n)).toMatchObject({status:2,denominator:0});expect(row(core,'protected',1n,1n)).toMatchObject({state:4,ballot_id:10});chain.addTime(TimePointSec.from(120));await send(core,'arbtimeout',[1,1],'bob@active');expect(row(core,'protected',1n,1n)).toMatchObject({state:5});
});
it('excludes every reviewer who participated before the dispute, including a replaced reviewer',async()=>{
 await fundProtected();await send(works,'submitwork',['daclifycore',1,2,1,42,1],'daclifycore@active');await send(works,'review',['daclifycore',1,1,1,false,42,1],'daclifycore@active');await send(core,'setroles',['daclifycore',1,1,4,false,true],'daclifycore@active');await send(works,'submitwork',['daclifycore',1,2,1,42,1],'daclifycore@active');await send(works,'review',['daclifycore',1,4,1,false,42,1],'daclifycore@active');await send(core,'arbchallenge',['daclifycore',1,2,1,term().commitment,42,1],'daclifycore@active');await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');
 for(const member of [1,2,4])await expect(sendBoundVote(decide,['daclifycore',1,member,10,0],'daclifycore@active')).rejects.toThrow('ARBITRATION_VOTER');
});
it('requires registered private-evidence access for the frozen backup before offering protection',async()=>{
 await send(core,'createdao',[2,'alice','{}',2,'eosio.token','4,TLOS'],'alice@active');for(let id=1;id<=4;id++)await send(core,'enroll',[2,id,'',PrivateKey.generate('K1').toPublic().toString(),'key',0],'alice@active');
 await send(core,'setmodule',[2,'works',1,['propose','offeragr','offerprot'],['reserve'],hash],'alice@active');await send(core,'setmodule',[2,'decide',1,['open','votecommit'],['govlock'],decideHash],'alice@active');await send(core,'commitepoch',['daclifycore',2,1,1,'ab'.repeat(32),'{}'],'daclifycore@active');
 const envelope=JSON.stringify({version:1,algorithm:'AES-256-GCM',iv:'A'.repeat(16),ciphertext:'A'.repeat(24)});
 await send(core,'putjson',['daclifycore',2,1,42,1,envelope,1,1],'daclifycore@active');await send(works,'propose',['daclifycore',2,1,2,2,42,1,['1.0000 TLOS'],[1000]],'daclifycore@active');await send(works,'offeragr',['daclifycore',2,1,2,0,2000],'daclifycore@active');
 const terms=offer();terms[1]=2;terms[3]=2;await expect(send(works,'offerprot',terms,'daclifycore@active')).rejects.toThrow('ARBITRATION_EVIDENCE_ACCESS');
 await send(core,'grantkey',['daclifycore',2,1,3,1,'{}'],'daclifycore@active');await send(works,'offerprot',terms,'daclifycore@active');
});
it('allows closure scanning after a core dispute cancellation even when Works retains the review state',async()=>{
 await challengeRevision();await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');await sendBoundVote(decide,['daclifycore',1,3,10,0],'daclifycore@active');chain.addTime(TimePointSec.from(60));await send(decide,'finalize',['daclifycore',1,10],'bob@active');await send(decide,'execarb',['daclifycore',1,10],'bob@active');
 await send(core,'setlifecode',['works',hash,2],'daclifycore@active');const key=memberKeys[0];if(!key)throw Error('Fixture key');const request=makeInstruction({chainId:'ab'.repeat(32),contract:'daclifycore',daoId:'1',interfaceVersion:1},'1','0',Math.floor(chain.timestamp.toMilliseconds()/1000)+300,'daclifycore','startclose',encodeAction('startclose',{runtime:'daclifycore',dao_id:'1',member_id:'1'}));await send(core,'submit',[request,key.signDigest(instructionDigest(request)).toString()],'bob@active');await send(works,'scanclose',['daclifycore',1,25],'bob@active');expect(row(works,'closechecks',core.toBigInt(),1n)).toMatchObject({complete:true});
});

it('keeps staged court voting locked, resumes its exact cursor without duplicating voters',async()=>{
 await challengeRevision();for(let id=5;id<=260;id++)await send(core,'enroll',[1,id,'',PrivateKey.generate('K1').toPublic().toString(),'key',0],'alice@active');
 await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');expect(row(decide,'ballots',core.toBigInt(),10n)).toMatchObject({status:3});expect(row(decide,'arbplans',core.toBigInt(),10n)).toMatchObject({ready:false,cursor:256,scanned:256});expect(row(decide,'ballotdefs',core.toBigInt(),10n)).toBeUndefined();
 await expect(sendBoundVote(decide,['daclifycore',1,3,10,1],'daclifycore@active')).rejects.toThrow();
 await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');expect(row(decide,'ballots',core.toBigInt(),10n)).toMatchObject({status:0,denominator:258});expect(row(decide,'arbplans',core.toBigInt(),10n)).toMatchObject({ready:true,cursor:260,scanned:260});
 await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');expect(row(decide,'ballots',core.toBigInt(),10n)).toMatchObject({denominator:258});
});
it('closes expired preparation without producing a payout or stranding its governance lock',async()=>{
 await challengeRevision();for(let id=5;id<=260;id++)await send(core,'enroll',[1,id,'',PrivateKey.generate('K1').toPublic().toString(),'key',0],'alice@active');await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');chain.addTime(TimePointSec.from(120));await send(core,'arbtimeout',[1,1],'bob@active');await send(decide,'openarb',['daclifycore',1,1,10],'bob@active');
 expect(row(decide,'ballots',core.toBigInt(),10n)).toMatchObject({status:2});expect(row(decide,'arbplans',core.toBigInt(),10n)).toMatchObject({ready:false});expect(row(core,'obligations',1n,1n)).toMatchObject({status:0});expect(row(core,'daos',core.toBigInt(),1n)).toMatchObject({active_ballots:0,reserved:10000});
});
