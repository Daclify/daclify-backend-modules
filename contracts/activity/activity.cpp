#define DACLIFY_RAM_PAYER_CONTRACT "activity"
#define DACLIFY_DOCUMENT_TABLES {}
#include "activity_records.hpp"
#include "decide_ballots.hpp"
using namespace daclify;
CONTRACT activity:public contract {
public:
 using contract::contract;
 ACTION bindrampool(name runtime){bind_ram_pool(get_self(),runtime);}
 ACTION recordact(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t app_id,checksum256 source_id,checksum256 source_revision,checksum256 event_id,std::string evidence_cid,checksum256 evidence_hash,uint64_t key_epoch){
  record(runtime,dao_id,member_id,app_id,"recordact"_n,1,source_id,source_revision,event_id,evidence_cid,evidence_hash,key_epoch);
 }
 ACTION askreview(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t app_id,checksum256 source_id,checksum256 source_revision,checksum256 event_id,std::string evidence_cid,checksum256 evidence_hash,uint64_t key_epoch){
  record(runtime,dao_id,member_id,app_id,"askreview"_n,2,source_id,source_revision,event_id,evidence_cid,evidence_hash,key_epoch);
 }
 ACTION reviewact(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t app_id,uint64_t receipt_id,checksum256 source_revision,bool accepted,std::string evidence_cid,checksum256 evidence_hash,uint64_t key_epoch){
  actor(runtime,dao_id,member_id,app_id,"reviewact"_n,false,true);activities rows(get_self(),runtime.value);const auto r=rows.get(receipt_id,"ACTIVITY_UNKNOWN");
  check(r.dao_id==dao_id&&r.app_id==app_id,"ACTIVITY_SCOPE");check(r.kind==2&&r.status==1,"ACTIVITY_REVIEWED");check(r.actor!=member_id,"SELF_REVIEW");check(r.source_revision==source_revision,"ACTIVITY_REVISION");
  evidence(runtime,dao_id,app_id,evidence_cid,evidence_hash,key_epoch);
  activity_reviews reviews(get_self(),runtime.value);reviews.emplace(get_self(),[&](auto& out){out={receipt_id,dao_id,member_id,accepted,evidence_cid,evidence_hash,key_epoch,current_time_point().sec_since_epoch()};});
  rows.modify(rows.get(receipt_id),same_payer,[&](auto& out){out.status=accepted?2:3;});
 }
 ACTION newappkey(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t app_id,uint64_t key_epoch,uint64_t security_epoch,uint64_t app_revision,checksum256 key_commitment,std::string self_grant){
  const auto app=actor(runtime,dao_id,member_id,app_id,"newappkey"_n,true);
  check(app.security_epoch==security_epoch&&app.revision==app_revision,"APP_KEY_STALE");check(key_epoch>0,"APP_KEY_ID");check(key_commitment!=checksum256(),"APP_KEY_COMMITMENT");
  app_key_epochs rows(get_self(),runtime.value);check(rows.find(key_epoch)==rows.end(),"APP_KEY_EXISTS");
  auto count=capacity(runtime,dao_id,app_id);app_counts counts(get_self(),runtime.value);check(count.epochs<128,"APP_EPOCH_CAPACITY");counts.modify(counts.get(count.id),same_payer,[&](auto& r){++r.epochs;r.current_key_epoch=key_epoch;});
  const auto max_member=daos(runtime,runtime.value).get(dao_id).max_member;
  rows.emplace(get_self(),[&](auto& r){r={key_epoch,dao_id,app_id,security_epoch,app_revision,max_member,key_commitment,current_time_point().sec_since_epoch()};});
  // An epoch cannot survive without its creator's recoverable wrapped key.
  // Validation and the self grant commit or roll back in the same transaction.
  const auto person=members(runtime,dao_id).get(member_id,"MEMBER_UNKNOWN");
  grantappkey(runtime,dao_id,member_id,app_id,key_epoch,member_id,person.encryption_key,self_grant);
 }
 ACTION grantappkey(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t app_id,uint64_t key_epoch,uint64_t recipient,std::string encryption_key,std::string envelope){
  actor(runtime,dao_id,member_id,app_id,"grantappkey"_n,true);app_key_epochs epochs(get_self(),runtime.value);const auto& epoch=epochs.get(key_epoch,"APP_KEY_UNKNOWN");check(epoch.dao_id==dao_id&&epoch.app_id==app_id,"APP_KEY_SCOPE");
  members people(runtime,dao_id);const auto& person=people.get(recipient,"MEMBER_UNKNOWN");check(person.active,"MEMBER_INACTIVE");check_agent_authority(runtime,dao_id,recipient);
  check(!encryption_key.empty()&&encryption_key.size()<=1024&&person.encryption_key==encryption_key,"APP_RECIPIENT_KEY");
  // Full-history grants are explicit admin actions. Forward-only DAOs cannot
  // grant an app epoch created before this member's admission.
  daos communities(runtime,runtime.value);if(communities.get(dao_id).history_policy!=0)check(recipient<=epoch.max_member,"APP_KEY_HISTORY");
  check(!envelope.empty()&&envelope.size()<=8192,"APP_GRANT_SIZE");wrapped_grant(envelope);
  app_key_grants rows(get_self(),runtime.value);auto index=rows.get_index<"bymember"_n>();check(index.find((uint128_t(key_epoch)<<64)|recipient)==index.end(),"APP_GRANT_EXISTS");auto id=rows.available_primary_key();if(!id)id=1;
  rows.emplace(get_self(),[&](auto& r){r={id,dao_id,key_epoch,recipient,encryption_key,envelope};});
 }
 ACTION linkdecision(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t app_id,uint64_t receipt_id,name decide,uint64_t ballot_id){
  actor(runtime,dao_id,member_id,app_id,"linkdecision"_n,false,true);activities rows(get_self(),runtime.value);const auto& r=rows.get(receipt_id,"ACTIVITY_UNKNOWN");check(r.dao_id==dao_id&&r.app_id==app_id,"ACTIVITY_SCOPE");
  gov_policies policies(runtime,runtime.value);check(policies.get(dao_id,"GOV_POLICY").config.decide==decide,"DECISION_MODULE");pinned_module(runtime,dao_id,decide);
  const auto b=ballots(decide,runtime.value).get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"DECISION_SCOPE");auto m=nlohmann::json::parse(b.metadata,nullptr,false);check(m.is_object(),"DECISION_SOURCE");
  auto matches=[&](const char* key,const std::string& value){return m.contains(key)&&m[key].is_string()&&m[key].get<std::string>()==value;};
  check(matches("type","connected-activity-v1")&&matches("daoId",std::to_string(dao_id))&&matches("appId",std::to_string(app_id))&&matches("receiptId",std::to_string(receipt_id))&&matches("sourceId",hex(r.source_id))&&matches("sourceRevision",hex(r.source_revision)),"DECISION_SOURCE");
  activity_decisions links(get_self(),runtime.value);check(links.find(receipt_id)==links.end(),"DECISION_EXISTS");links.emplace(get_self(),[&](auto& out){out={receipt_id,dao_id,decide,ballot_id,sha256(b.metadata.data(),b.metadata.size())};});
 }
 ACTION checkquota(name runtime,uint64_t dao_id){require_auth(runtime);pinned_module(runtime,dao_id,get_self());check_ram_payer_runtime(get_self(),runtime);}
 ACTION scanclose(name runtime,uint64_t dao_id,uint32_t limit){
  check(limit>=1&&limit<=25,"CLOSURE_SCAN_BOUNDS");if(closure_stage(runtime,dao_id,get_self(),6)>=1)return;
  scan_closure<activities>(runtime,dao_id,get_self(),6,0,1,limit,[](const auto& r){return r.status!=1;});
 }
 ACTION clearclose(name runtime,uint64_t dao_id){clear_closure(runtime,dao_id,get_self());}
 ACTION checkmig(name runtime,uint8_t kind){require_auth(runtime);check(kind==6,"RAM_MIGRATION_SOURCE_KIND");}
 ACTION scanram(name runtime,name table,uint32_t limit){
  if(scan_ram_binding(runtime,get_self(),table,6,limit))return;
  if(table=="closechecks"_n){closure_checks(get_self(),runtime.value).backfill(limit);return;}
  if(table=="activities"_n){activities(get_self(),runtime.value).backfill(limit);return;}
  if(table=="actreviews"_n){activity_reviews(get_self(),runtime.value).backfill(limit);return;}
  if(table=="appcounts"_n){app_counts(get_self(),runtime.value).backfill(limit);return;}
  if(table=="appkeys"_n){app_key_epochs(get_self(),runtime.value).backfill(limit);return;}
  if(table=="appgrants"_n){app_key_grants(get_self(),runtime.value).backfill(limit);return;}
  if(table=="actdecisions"_n){activity_decisions(get_self(),runtime.value).backfill(limit);return;}
  check(false,"RAM_MIGRATION_TABLE");
 }
private:
 void wrapped_grant(const std::string& value){
  check(nlohmann::json::accept(value),"APP_GRANT_JSON");const auto grant=nlohmann::json::parse(value);
  auto text=[](const nlohmann::json& object,const char* field,size_t size){return object.contains(field)&&object[field].is_string()&&object[field].get<std::string>().size()==size;};
  check(grant.is_object()&&grant.size()==4&&grant.contains("version")&&grant["version"]==1&&grant.contains("ephemeralKey")&&grant.contains("envelope")&&text(grant,"salt",44),"APP_GRANT_JSON");
  const auto& key=grant["ephemeralKey"];const auto& body=grant["envelope"];
  check(key.is_object()&&key.size()==4&&key.contains("kty")&&key["kty"]=="EC"&&key.contains("crv")&&key["crv"]=="P-256"&&text(key,"x",43)&&text(key,"y",43)&&body.is_object()&&body.size()==4&&body.contains("version")&&body["version"]==1&&body.contains("algorithm")&&body["algorithm"]=="AES-256-GCM"&&text(body,"iv",16)&&text(body,"ciphertext",64),"APP_GRANT_JSON");
 }
 std::string hex(checksum256 value){const auto bytes=value.extract_as_byte_array();std::string out;out.reserve(64);for(auto byte:bytes){out.push_back("0123456789abcdef"[byte>>4]);out.push_back("0123456789abcdef"[byte&15]);}return out;}
 connected_app_record registration(name runtime,uint64_t dao,uint64_t app){connected_apps rows(runtime,dao);const auto value=rows.get(app,"APP_UNKNOWN");check(value.enabled||dao_lifecycle(runtime,dao)==1,"APP_DISABLED");check(value.target==get_self(),"APP_SCOPE");return value;}
 connected_app_record actor(name runtime,uint64_t dao,uint64_t member,uint64_t app,name action_name,bool admin=false,bool reviewer=false){check(get_sender()==runtime,"ACTOR_SENDER");module_actor(runtime,dao,member,get_self(),action_name,admin,reviewer);return registration(runtime,dao,app);}
 app_count capacity(name runtime,uint64_t dao,uint64_t app){app_counts rows(get_self(),runtime.value);auto index=rows.get_index<"byapp"_n>();auto found=index.find((uint128_t(dao)<<64)|app);if(found!=index.end())return *found;auto id=rows.available_primary_key();if(!id)id=1;return *rows.emplace(get_self(),[&](auto& r){r={id,dao,app,0,0};});}
 void evidence(name runtime,uint64_t dao,uint64_t app,const std::string& cid,checksum256 hash,uint64_t epoch){
  check(cid.size()<=128,"EVIDENCE_CID");if(cid.empty()){check(hash==checksum256()&&epoch==0,"EVIDENCE_HASH");return;}
  check(hash!=checksum256(),"EVIDENCE_HASH");check(epoch>0,"APP_KEY_REQUIRED");const auto key=app_key_epochs(get_self(),runtime.value).get(epoch,"APP_KEY_UNKNOWN");check(key.dao_id==dao&&key.app_id==app,"APP_KEY_SCOPE");const auto app_registration=registration(runtime,dao,app);app_counts counts(get_self(),runtime.value);auto domains=counts.get_index<"byapp"_n>();const auto current=domains.find((uint128_t(dao)<<64)|app);check(current!=domains.end()&&current->current_key_epoch==epoch&&key.security_epoch==app_registration.security_epoch&&key.app_revision==app_registration.revision,"APP_KEY_STALE");
 }
 void record(name runtime,uint64_t dao,uint64_t member,uint64_t app,name action_name,uint8_t kind,checksum256 source,checksum256 revision,checksum256 event,const std::string& cid,checksum256 hash,uint64_t epoch){
  actor(runtime,dao,member,app,action_name);check(source!=checksum256()&&revision!=checksum256()&&event!=checksum256(),"ACTIVITY_REFERENCE");
  activities rows(get_self(),runtime.value);activity_record value{0,dao,app,member,kind,source,revision,event,cid,hash,epoch,current_time_point().sec_since_epoch(),uint8_t(kind==2?1:0)};
  auto index=rows.get_index<"byevent"_n>();auto found=index.find(value.by_event());if(found!=index.end()){check(found->dao_id==dao&&found->app_id==app&&found->actor==member&&found->kind==kind&&found->source_id==source&&found->source_revision==revision&&found->event_id==event&&found->evidence_cid==cid&&found->evidence_hash==hash&&found->key_epoch==epoch,"ACTIVITY_CONFLICT");return;}
  evidence(runtime,dao,app,cid,hash,epoch);auto count=capacity(runtime,dao,app);check(count.receipts<10000,"APP_ACTIVITY_CAPACITY");app_counts counts(get_self(),runtime.value);counts.modify(counts.get(count.id),same_payer,[](auto& r){++r.receipts;});value.id=rows.available_primary_key();if(!value.id)value.id=1;rows.emplace(get_self(),[&](auto& r){r=value;});
 }
};
EOSIO_DISPATCH(activity,(scanclose)(clearclose)(bindrampool)(recordact)(askreview)(reviewact)(newappkey)(grantappkey)(linkdecision)(checkquota)(checkmig)(scanram))
