#define DACLIFY_MODULE_METERING
#define DACLIFY_RAM_PAYER_CONTRACT "quickvote"
#define DACLIFY_DOCUMENT_TABLES {"qballots"_n}
#include "quick_ballots.hpp"
#include "archive_state.hpp"
#include "private_content.hpp"
using namespace eosio;
using namespace daclify;
CONTRACT quickvote:public contract {
 void retention(const quick_ballot& ballot)const{
  const auto now=current_time_point().sec_since_epoch();check(ballot.closed_at&&uint64_t(ballot.closed_at)+30*86400<=now,"QUICK_RETENTION");check(ballot.prepared,"QUICK_SNAPSHOT");
 }
 archive_anchor archive_for(name runtime,const quick_ballot& ballot,uint64_t archive_id,name table)const{
  retention(ballot);const auto policy=archive_settings(runtime,runtime.value).get();check(policy.pruning_enabled,"ARCHIVE_PRUNING_DISABLED");
  const auto anchor=archive_anchors(runtime,ballot.dao_id).get(archive_id,"ARCHIVE_ANCHOR_UNKNOWN");const auto& manifest=anchor.manifest;
  check(!anchor.revoked,"ARCHIVE_APPROVAL");check(anchor.verifier==policy.verifier,"ARCHIVE_VERIFIER_CHANGED");
  const auto now=current_time_point().sec_since_epoch();check(anchor.attested_at<=now&&uint64_t(now)-anchor.attested_at<=archive_availability_lifetime,"ARCHIVE_AVAILABILITY_EXPIRED");
  check(anchor.backup_commitment!=checksum256{}&&anchor.manifest_commitment!=checksum256{}&&anchor.attestation_transaction!=checksum256{}&&anchor.retention_seconds>=policy.minimum_retention_seconds,"ARCHIVE_COMMITMENT");
  check(manifest.chain_id==runtime_settings_table(runtime,runtime.value).get().chain_id&&manifest.runtime==runtime&&manifest.dao_id==ballot.dao_id&&anchor.dao_id==ballot.dao_id&&manifest.source==get_self(),"ARCHIVE_DOMAIN");
  check(manifest.code_hash==get_code_hash(get_self())&&manifest.abi_hash!=checksum256{}&&archive_descriptor_hash(manifest)==anchor.descriptor_commitment,"ARCHIVE_SOURCE_CODE");
  const auto qualified=lifecycle_sources(runtime,runtime.value).get(get_self().value,"LIFECYCLE_SOURCE");check(qualified.kind==9&&qualified.code_hash==manifest.code_hash,"ARCHIVE_SOURCE_CODE");
  const auto observer=ram_observer_settings(runtime,runtime.value).get();check(observer.runtime_hash==get_code_hash(runtime),"RAM_OBSERVER_REQUIRED");check(ram_sources(runtime,runtime.value).get(get_self().value,"RAM_SOURCE_UNKNOWN").code_hash==manifest.code_hash,"RAM_SOURCE_CODE");
  check(manifest.families.size()==1&&manifest.files.empty(),"ARCHIVE_FAMILY_PROTECTED");const auto& family=manifest.families.front();
  const bool responses=table=="qresponses"_n;const std::string kind=responses?"quick-ballot-responses":"quick-ballot-grants";
  const std::string schema=responses?"daclify.quick-ballot.responses.row.v1":"daclify.quick-ballot.grants.row.v1";
  check(family.kind==kind&&family.table==table&&family.scope==runtime.value&&family.parent_id==ballot.id&&family.records==(responses?ballot.identities:1)&&family.schema_hash==sha256(schema.data(),schema.size()),"ARCHIVE_FAMILY_PROTECTED");
  // Opening preauthorizes only these encrypted rows after 30 days; generic archive approval is unchanged.
  return anchor;
 }
 void mark_pruned(name runtime,uint64_t id){
  quick_responses responses(get_self(),runtime.value);auto index=responses.get_index<"byballot"_n>();auto first=index.lower_bound(uint128_t(id)<<64);quick_grants grants(get_self(),runtime.value);
  if((first==index.end()||first->ballot_id!=id)&&grants.find(id)==grants.end()){quick_ballots rows(get_self(),runtime.value);const auto& ballot=rows.get(id);if(ballot.definition.protocol==2)document_ref(runtime,ballot.dao_id,get_self(),"qballots"_n,id,0,0,0);rows.modify(ballot,same_payer,[](auto& row){row.pruned=true;});}
 }
 void retain_question(name runtime,const quick_ballot& ballot,bool current_epoch){
  if(ballot.definition.protocol!=2||ballot.pruned)return;
  const auto& definition=ballot.definition;check(!definition.all_accounts&&definition.audience.size()==1&&definition.audience[0]==ballot.dao_id&&definition.explanation.empty(),"QUICK_QUESTION_AUDIENCE");
  const auto value=nlohmann::json::parse(definition.question,nullptr,false);const auto doc=private_content_document(runtime,ballot.dao_id,value,current_epoch);check(doc.document_id==ballot.id,"QUICK_QUESTION_PARENT");
  document_ref(runtime,ballot.dao_id,get_self(),"qballots"_n,ballot.id,0,doc.document_id,doc.version);
 }
 quick_clock configuration(name runtime)const{check_ram_payer_runtime(get_self(),runtime);return quick_clocks(get_self(),runtime.value).get(0,"QUICK_NOT_CONFIGURED");}
 quick_account account(const quick_actor_context& actor)const{
  const auto cfg=configuration(actor.runtime);
  check(actor.authority==cfg.authority&&get_sender()==cfg.authority,"QUICK_SENDER");require_auth(permission_level{cfg.authority,"execctx"_n});
  check(get_code_hash(cfg.authority)==cfg.authority_hash,"QUICK_AUTH_CODE");
  const auto upstream=quick_settings(cfg.authority,actor.runtime.value).get(0,"QUICK_NOT_CONFIGURED");check(upstream.source==get_self()&&upstream.code_hash==get_code_hash(get_self()),"QUICK_CODE");
  const auto value=quick_accounts(cfg.authority,actor.runtime.value).get(actor.account_id,"QUICK_ACCOUNT_UNKNOWN");check(value.active,"QUICK_ACCOUNT_INACTIVE");quick_anchor_valid(actor.credential);return value;
 }
public:
 using contract::contract;
 ACTION init(name runtime,name authority,checksum256 authority_hash){
  require_auth(runtime);require_auth(get_self());runtime_settings_table(runtime,runtime.value).get();
  check(is_account(authority)&&authority!=runtime&&authority!=get_self()&&authority_hash!=checksum256{}&&get_code_hash(authority)==authority_hash,"QUICK_AUTH_CODE");
  const auto upstream=quick_settings(authority,runtime.value).get(0,"QUICK_NOT_CONFIGURED");check(upstream.source==get_self()&&upstream.code_hash==get_code_hash(get_self()),"QUICK_CODE");
  check_ram_payer_runtime(authority,runtime);bind_ram_pool(get_self(),runtime);
  quick_clocks rows(get_self(),runtime.value);auto found=rows.find(0);
  if(found==rows.end())rows.emplace(get_self(),[&](auto& row){row.authority=authority;row.authority_hash=authority_hash;});
  else rows.modify(found,same_payer,[&](auto& row){row.authority=authority;row.authority_hash=authority_hash;});
 }
 ACTION bindrampool(name runtime){configuration(runtime);bind_ram_pool(get_self(),runtime);}
 ACTION backfillrefs(name runtime,uint64_t dao_id){configuration(runtime);backfill_document_refs<quick_ballots>(runtime,dao_id,get_self(),"qballots"_n,25,[&](const auto& ballot){retain_question(runtime,ballot,false);});}
 ACTION open(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,quick_definition definition,std::vector<char> key,std::vector<char> possession,std::vector<std::vector<char>> grants){
  configuration(runtime);module_actor(runtime,dao_id,member_id,get_self(),"open"_n);quick_executive(runtime,dao_id,member_id);
  check(ballot_id&&definition.protocol>=1&&definition.protocol<=3,"QUICK_DEFINITION");check(!definition.question.empty()&&definition.question.size()<=256&&definition.explanation.size()<=4096&&quick_utf8(definition.question)&&quick_utf8(definition.explanation),"QUICK_QUESTION");
  if(definition.protocol==1){const auto dao=daos(runtime,runtime.value).get(dao_id,"DAO_UNKNOWN");if(dao.privacy>0){const auto identity=nlohmann::json::parse(dao.metadata,nullptr,false);check(!identity.is_object()||!identity.contains("schemaVersion")||identity["schemaVersion"]!=4,"PRIVATE_QUICK_REQUIRED");}}
  check((definition.all_accounts&&definition.audience.empty())||(!definition.all_accounts&&!definition.audience.empty()&&definition.audience.size()<=20),"QUICK_AUDIENCE");
  uint64_t previous=0;for(auto id:definition.audience){check(id>previous,"QUICK_AUDIENCE");daos(runtime,runtime.value).get(id,"DAO_UNKNOWN");check(dao_lifecycle(runtime,id)==0,"QUICK_AUDIENCE");previous=id;}
  const auto now=current_time_point().sec_since_epoch();check(!definition.closes||definition.closes>now,"QUICK_DEADLINE");
  check(!definition.readers.empty()&&definition.readers.size()<=8&&grants.size()==definition.readers.size(),"QUICK_READERS");
  members people(runtime,dao_id);executives offices(runtime,dao_id);const auto policy=executive_policies(runtime,runtime.value).get(dao_id,"EXECUTIVE_REQUIRED");size_t at=0,visited=0;
  for(const auto& office:offices){check(++visited<=8,"QUICK_READERS");const auto person=people.get(office.member_id,"MEMBER_UNKNOWN");if(!person.active||!executive_active(office,policy))continue;
   check(at<definition.readers.size()&&definition.readers[at].member_id==person.id&&definition.readers[at].encryption_key==person.encryption_key&&!person.encryption_key.empty()&&person.encryption_key.size()<=256,"QUICK_READERS");
   check(!grants[at].empty()&&grants[at].size()<=768,"QUICK_GRANT");++at;
  }
  check(at==definition.readers.size(),"QUICK_READERS");
  quick_ballots ballots(get_self(),runtime.value);check(ballots.find(ballot_id)==ballots.end(),"QUICK_BALLOT_EXISTS");
  quick_ballot value;value.id=ballot_id;value.dao_id=dao_id;value.creator_id=member_id;value.opened_at=now;value.definition=definition;
  value.definition_hash=quick_definition_hash(runtime,get_self(),ballot_id,dao_id,member_id,definition);value.key=key;value.key_proof=possession;
  quick_ballot_proof::validkey(quick_proof_context(runtime,value,"key"),key,possession);
  retain_question(runtime,value,true);
  ballots.emplace(get_self(),[&](auto& row){row=value;});quick_grants(get_self(),runtime.value).emplace(get_self(),[&](auto& row){row={ballot_id,dao_id,grants};});
 }
 ACTION respond(quick_actor_context actor,uint64_t ballot_id,uint64_t expected_revision,std::vector<char> ciphertext,std::vector<char> proof,std::vector<char> receipt){
  const auto person=account(actor);const auto runtime=actor.runtime;quick_ballots ballots(get_self(),runtime.value);const auto ballot=ballots.get(ballot_id,"QUICK_BALLOT_UNKNOWN");quick_open(ballot,runtime,get_self());
  bool eligible=ballot.definition.all_accounts;for(auto dao:ballot.definition.audience)eligible|=quick_member(runtime,dao,actor.credential);check(eligible,"QUICK_AUDIENCE");check(receipt.size()<=1024,"QUICK_RECEIPT");
  quick_responses rows(get_self(),runtime.value);auto index=rows.get_index<"byidentity"_n>();const auto identity_data=pack(std::make_tuple(ballot_id,person.identity));auto existing=index.find(sha256(identity_data.data(),identity_data.size()));
  const auto previous=existing==index.end()?uint64_t(0):existing->revision;check(previous==expected_revision,"QUICK_REVISION");const auto revision=add64(previous,1);
  quick_ballot_proof::validvote(quick_proof_context(runtime,ballot,"response",pack(std::make_tuple(person.identity,revision))),ballot.key,ciphertext,proof);
  auto aggregate=ballot.aggregate;uint32_t count=ballot.count,identities=ballot.identities;
  if(existing!=index.end()&&existing->active){aggregate=quick_cipher_sum(aggregate,existing->ciphertext,true);check(count>0,"QUICK_ACCOUNTING");--count;}
  aggregate=quick_cipher_sum(aggregate,ciphertext);check(count<5000,"QUICK_CAPACITY");++count;
  auto update=[&](auto& row){row.revision=revision;row.active=true;row.ciphertext=ciphertext;row.proof=proof;row.receipt=receipt;row.updated_at=current_time_point().sec_since_epoch();};
  if(existing==index.end()){
   check(identities<5000,"QUICK_CAPACITY");++identities;quick_clocks clocks(get_self(),runtime.value);const auto clock=clocks.get(0);check(clock.next_response_id<std::numeric_limits<uint64_t>::max(),"QUICK_CAPACITY");
   rows.emplace(get_self(),[&](auto& row){row.id=clock.next_response_id;row.dao_id=ballot.dao_id;row.ballot_id=ballot_id;row.identity=person.identity;update(row);});clocks.modify(clocks.get(0),same_payer,[](auto& row){++row.next_response_id;});
  }else index.modify(existing,same_payer,update);
  ballots.modify(ballots.get(ballot_id),same_payer,[&](auto& row){row.aggregate=aggregate;row.count=count;row.identities=identities;});
 }
 ACTION remove(quick_actor_context actor,uint64_t ballot_id,uint64_t expected_revision){
  const auto person=account(actor);const auto runtime=actor.runtime;quick_ballots ballots(get_self(),runtime.value);const auto ballot=ballots.get(ballot_id,"QUICK_BALLOT_UNKNOWN");quick_open(ballot,runtime,get_self());
  quick_responses rows(get_self(),runtime.value);auto index=rows.get_index<"byidentity"_n>();const auto identity_data=pack(std::make_tuple(ballot_id,person.identity));auto existing=index.find(sha256(identity_data.data(),identity_data.size()));
  check(existing!=index.end()&&existing->revision==expected_revision,"QUICK_REVISION");check(existing->active,"QUICK_RESPONSE_REMOVED");check(ballot.count>0,"QUICK_ACCOUNTING");const auto aggregate=quick_cipher_sum(ballot.aggregate,existing->ciphertext,true);
  index.modify(existing,same_payer,[](auto& row){row.revision=add64(row.revision,1);row.active=false;row.ciphertext.clear();row.proof.clear();row.receipt.clear();row.updated_at=current_time_point().sec_since_epoch();});
  ballots.modify(ballots.get(ballot_id),same_payer,[&](auto& row){row.aggregate=aggregate;--row.count;});
 }
 ACTION close(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id){
  configuration(runtime);module_actor(runtime,dao_id,member_id,get_self(),"close"_n);quick_executive(runtime,dao_id,member_id);
  quick_ballots rows(get_self(),runtime.value);auto ballot=rows.get(ballot_id,"QUICK_BALLOT_UNKNOWN");check(ballot.dao_id==dao_id,"QUICK_ORIGIN");
  const auto now=current_time_point().sec_since_epoch();quick_freeze(runtime,get_self(),rows,ballot,ballot.definition.closes&&now>=ballot.definition.closes?ballot.definition.closes:now);
 }
 ACTION tick(name runtime,uint64_t ballot_id){configuration(runtime);quick_ballots rows(get_self(),runtime.value);auto ballot=rows.get(ballot_id,"QUICK_BALLOT_UNKNOWN");quick_freeze_due(runtime,get_self(),rows,ballot);}
 ACTION prepare(name runtime,uint64_t ballot_id,uint32_t limit){
  configuration(runtime);check(limit>0&&limit<=25,"QUICK_BATCH");quick_ballots ballots(get_self(),runtime.value);auto ballot=ballots.get(ballot_id,"QUICK_BALLOT_UNKNOWN");quick_freeze_due(runtime,get_self(),ballots,ballot);if(ballot.prepared)return;
  quick_responses responses(get_self(),runtime.value);auto index=responses.get_index<"byballot"_n>();auto it=index.upper_bound((uint128_t(ballot_id)<<64)|ballot.scan_cursor);uint32_t visited=0;
  for(;it!=index.end()&&it->ballot_id==ballot_id&&visited<limit;++it,++visited){
   check(it->dao_id==ballot.dao_id&&ballot.scan_rows<ballot.identities,"QUICK_ACCOUNTING");const auto bytes=pack(std::make_tuple(ballot.response_root,*it));ballot.response_root=sha256(bytes.data(),bytes.size());
   if(it->active){ballot.scan_aggregate=quick_cipher_sum(ballot.scan_aggregate,it->ciphertext);++ballot.scan_count;}++ballot.scan_rows;ballot.scan_cursor=it->id;
  }
  if(it==index.end()||it->ballot_id!=ballot_id){check(ballot.scan_rows==ballot.identities&&ballot.scan_count==ballot.count&&ballot.scan_aggregate==ballot.aggregate,"QUICK_ACCOUNTING");ballot.prepared=true;ballot.scan_aggregate.clear();}
  ballots.modify(ballots.get(ballot_id),same_payer,[&](auto& row){row=ballot;});
 }
 ACTION finalize(name runtime,uint64_t ballot_id,uint32_t up,std::vector<char> proof){
  configuration(runtime);quick_ballots rows(get_self(),runtime.value);const auto ballot=rows.get(ballot_id,"QUICK_BALLOT_UNKNOWN");check(ballot.closed_at&&ballot.prepared,"QUICK_SNAPSHOT");
  if(ballot.verified){check(ballot.up==up&&ballot.final_proof==proof,"QUICK_FINALIZED");return;}
  auto suffix=pack(std::make_tuple(ballot.response_root,uint64_t(ballot.count)));suffix.insert(suffix.end(),ballot.aggregate.begin(),ballot.aggregate.end());
  quick_ballot_proof::validtally(quick_proof_context(runtime,ballot,"tally",suffix),ballot.key,ballot.aggregate,ballot.count,up,proof);
  rows.modify(rows.get(ballot_id),same_payer,[&](auto& row){row.up=up;row.final_proof=proof;row.verified=true;});
 }
 ACTION prune(name runtime,uint64_t ballot_id,uint64_t archive_id,uint32_t chunk_ordinal,uint32_t start,std::vector<archive_prune_proof> proofs){
  configuration(runtime);const auto ballot=quick_ballots(get_self(),runtime.value).get(ballot_id,"QUICK_BALLOT_UNKNOWN");retention(ballot);if(ballot.pruned)return;
  check(action_data_size()<=16384&&!proofs.empty()&&proofs.size()<=25,"ARCHIVE_PRUNE_BOUNDS");const auto anchor=archive_for(runtime,ballot,archive_id,"qresponses"_n);const auto& chunks=anchor.manifest.families.front().chunks;
  check(chunk_ordinal<chunks.size(),"ARCHIVE_PRUNE_BOUNDS");const auto& chunk=chunks[chunk_ordinal];check(chunk.domain.chunk_ordinal==chunk_ordinal&&uint64_t(start)+proofs.size()<=chunk.domain.leaf_count,"ARCHIVE_PRUNE_BOUNDS");
  quick_responses rows(get_self(),runtime.value);uint64_t previous=0;
  for(size_t at=0;at<proofs.size();++at){const auto& proof=proofs[at];check(proof.primary_key>previous&&proof.primary_key>=chunk.first_key&&proof.primary_key<=chunk.last_key,"ARCHIVE_PRUNE_BOUNDS");previous=proof.primary_key;auto found=rows.find(proof.primary_key);if(found==rows.end())continue;
   check(found->dao_id==ballot.dao_id&&found->ballot_id==ballot_id,"ARCHIVE_ROW_DOMAIN");check(verify_archive_proof(chunk.domain,start+at,proof.primary_key,pack(*found),proof.siblings,chunk.root),"ARCHIVE_PROOF");rows.erase(found);
  }
  mark_pruned(runtime,ballot_id);
 }
 ACTION prunegrants(name runtime,uint64_t ballot_id,uint64_t archive_id,std::vector<checksum256> siblings){
  configuration(runtime);const auto ballot=quick_ballots(get_self(),runtime.value).get(ballot_id,"QUICK_BALLOT_UNKNOWN");retention(ballot);quick_grants rows(get_self(),runtime.value);auto found=rows.find(ballot_id);if(found==rows.end())return;
  const auto anchor=archive_for(runtime,ballot,archive_id,"qgrants"_n);const auto& chunks=anchor.manifest.families.front().chunks;check(chunks.size()==1&&chunks[0].domain.leaf_count==1&&chunks[0].first_key==ballot_id&&chunks[0].last_key==ballot_id,"ARCHIVE_COVERAGE_INCOMPLETE");
  check(found->dao_id==ballot.dao_id&&verify_archive_proof(chunks[0].domain,0,ballot_id,pack(*found),siblings,chunks[0].root),"ARCHIVE_PROOF");rows.erase(found);mark_pruned(runtime,ballot_id);
 }
 ACTION checkquota(name runtime,uint64_t dao_id){require_auth(runtime);configuration(runtime);pinned_module(runtime,dao_id,get_self());}
 ACTION scanclose(name runtime,uint64_t dao_id,uint32_t limit){
  configuration(runtime);check(limit>0&&limit<=25,"CLOSURE_SCAN_BOUNDS");const auto state=dao_lifecycles(runtime,runtime.value).get(dao_id,"DAO_NOT_CLOSING");check(state.state==1,"DAO_NOT_CLOSING");
  const auto code=get_code_hash(get_self());const auto qualified=lifecycle_sources(runtime,runtime.value).get(get_self().value,"DAO_MODULE_CLOSURE_REQUIRED");check(qualified.kind==9&&qualified.code_hash==code,"DAO_MODULE_CLOSURE_REQUIRED");
  const auto installed=modules(runtime,dao_id).get(get_self().value,"MODULE_DISABLED");check(installed.code_hash==code,"MODULE_CODE");
  closure_checks proofs(get_self(),runtime.value);auto old=proofs.find(dao_id);
  const bool current=old!=proofs.end()&&old->code_hash==code&&old->closing_at==state.transitioned_at;if(current&&old->complete)return;
  closure_check next{dao_id,code,state.transitioned_at,0,current?old->cursor:0,false};quick_ballots rows(get_self(),runtime.value);auto index=rows.get_index<"bydao"_n>();auto it=index.upper_bound((uint128_t(dao_id)<<64)|next.cursor);uint32_t visited=0;
  for(;it!=index.end()&&it->dao_id==dao_id&&visited<limit;++it,++visited){auto ballot=*it;quick_freeze_due(runtime,get_self(),rows,ballot);next.cursor=ballot.id;}
  if(it==index.end()||it->dao_id!=dao_id){next.complete=true;next.stage=1;}
  if(old==proofs.end())proofs.emplace(get_self(),[&](auto& row){row=next;});else proofs.modify(old,same_payer,[&](auto& row){row=next;});
 }
 ACTION clearclosed(name runtime,uint64_t dao_id){configuration(runtime);clear_closure(runtime,dao_id,get_self());}
 ACTION checkmig(name runtime,uint8_t kind){require_auth(runtime);configuration(runtime);check(kind==9,"RAM_MIGRATION_SOURCE_KIND");}
 ACTION scanram(name runtime,name table,uint32_t limit){
  configuration(runtime);if(scan_ram_binding(runtime,get_self(),table,9,limit))return;
  if(table=="qclock"_n){quick_clocks(get_self(),runtime.value).backfill(limit);return;}
  if(table=="qballots"_n){quick_ballots(get_self(),runtime.value).backfill(limit);return;}
  if(table=="qresponses"_n){quick_responses(get_self(),runtime.value).backfill(limit);return;}
  if(table=="qgrants"_n){quick_grants(get_self(),runtime.value).backfill(limit);return;}
  if(table=="closechecks"_n){closure_checks(get_self(),runtime.value).backfill(limit);return;}check(false,"RAM_MIGRATION_TABLE");
 }
};
EOSIO_DISPATCH(quickvote,(init)(bindrampool)(backfillrefs)(open)(respond)(remove)(close)(tick)(prepare)(finalize)(prune)(prunegrants)(checkquota)(scanclose)(clearclosed)(checkmig)(scanram))
