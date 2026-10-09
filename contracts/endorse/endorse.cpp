#define DACLIFY_DOCUMENT_TABLES {"joinapps"_n}
#define DACLIFY_RAM_PAYER_CONTRACT "endorse"
#include "module.hpp"
#include "admission.hpp"
using namespace daclify;
CONTRACT endorse:public contract {
public:
 using contract::contract;
 ACTION backfillrefs(name runtime,uint64_t dao_id,name table,uint32_t limit){
  check(table=="joinapps"_n,"DOCUMENT_SOURCE_TABLE");backfill_document_refs<admission_applications>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_app(runtime,r);});
 }
 ACTION bindrampool(name runtime){bind_ram_pool(get_self(),runtime);}
 ACTION applyjoin(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t application_id,public_key signing_key,std::string encryption_key,uint8_t custody,uint8_t kind,std::string operator_label,uint64_t document_id,uint32_t document_version,uint32_t expires){
  module_actor(runtime,dao_id,member_id,get_self(),"applyjoin"_n);const auto policy=current_policy(runtime,dao_id);check(application_id>0,"APPLICATION_ID");check(kind<=1&&custody<=1,"PARTICIPANT_MODE");check(!encryption_key.empty()&&encryption_key.size()<=1024,"ENCRYPTION_KEY");check(operator_label.size()<=64,"AGENT_OPERATOR");if(kind==1){check(!operator_label.empty(),"AGENT_OPERATOR");for(unsigned char c:operator_label)check(c>=0x20&&c<=0x7e,"AGENT_OPERATOR");}
  const auto now=current_time_point().sec_since_epoch();check(expires>now&&uint64_t(expires)<=uint64_t(now)+2592000,"APPLICATION_EXPIRED");documents docs(runtime,dao_id);const auto index=docs.get_index<"byversion"_n>();const auto& document=index.get((uint128_t(document_id)<<32)|document_version,"DOCUMENT_UNKNOWN");
  admission_applications apps(get_self(),runtime.value);auto found=apps.find(application_id);
  if(found!=apps.end()){check(found->dao_id==dao_id&&found->sponsor==member_id,"APPLICATION_OWNER");check(!found->admitted,"APPLICATION_FROZEN");}
  auto update=[&](auto& r){r.dao_id=dao_id;r.sponsor=member_id;r.policy_revision=policy.revision;r.signing_key=signing_key;r.encryption_key=encryption_key;r.custody=custody;r.kind=kind;r.operator_label=operator_label;r.document_id=document_id;r.document_version=document_version;r.document_commitment=document.commitment;r.expires=expires;r.witnesses.clear();};
  if(found==apps.end())apps.emplace(get_self(),[&](auto& r){r.id=application_id;update(r);});else apps.modify(found,same_payer,[&](auto& r){r.revision=add64(r.revision,1);update(r);});sync_app(runtime,apps.get(application_id));
 }
 ACTION witness(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t application_id,uint64_t revision){
  const auto person=module_actor(runtime,dao_id,member_id,get_self(),"witness"_n);const auto policy=current_policy(runtime,dao_id);admission_applications apps(get_self(),runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");validate(app,dao_id,revision,policy);check(eligible_witness(runtime,dao_id,member_id,policy.allow_agents),"PARTICIPANT_INELIGIBLE");check(person.signing_key!=app.signing_key,"SELF_ENDORSEMENT");check(std::find(app.witnesses.begin(),app.witnesses.end(),member_id)==app.witnesses.end(),"ENDORSEMENT_EXISTS");check(app.witnesses.size()<64,"ENDORSEMENT_LIMIT");apps.modify(app,same_payer,[&](auto& r){r.witnesses.push_back(member_id);});
 }
 ACTION unwitness(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t application_id,uint64_t revision){
  module_actor(runtime,dao_id,member_id,get_self(),"unwitness"_n);const auto policy=current_policy(runtime,dao_id);admission_applications apps(get_self(),runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");validate(app,dao_id,revision,policy);check(std::find(app.witnesses.begin(),app.witnesses.end(),member_id)!=app.witnesses.end(),"ENDORSEMENT_UNKNOWN");apps.modify(app,same_payer,[&](auto& r){r.witnesses.erase(std::remove(r.witnesses.begin(),r.witnesses.end(),member_id),r.witnesses.end());});
 }
 ACTION admit(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t application_id,uint64_t revision){
  module_actor(runtime,dao_id,member_id,get_self(),"admit"_n);const auto policy=current_policy(runtime,dao_id);admission_applications apps(get_self(),runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");validate(app,dao_id,revision,policy);members people(runtime,dao_id);uint32_t count=0;
  for(auto witness:app.witnesses)if(eligible_witness(runtime,dao_id,witness,policy.allow_agents)&&people.get(witness).signing_key!=app.signing_key)++count;
  check(count>=policy.threshold,"ENDORSEMENT_THRESHOLD");daos communities(runtime,runtime.value);const auto& dao=communities.get(dao_id);check(dao.max_member<std::numeric_limits<uint64_t>::max(),"MEMBER_LIMIT");apps.modify(app,same_payer,[&](auto& r){r.admitted=true;r.member_id=dao.max_member+1;});core_action(runtime,get_self(),"admitfrom"_n,pack(std::make_tuple(dao_id,get_self(),application_id,revision)));
 }
 ACTION checkmig(name runtime,uint8_t kind){require_auth(runtime);check(kind==5,"RAM_MIGRATION_SOURCE_KIND");}
 ACTION scanram(name runtime,name table,uint32_t limit){
  if(scan_ram_binding(runtime,get_self(),table,5,limit))return;
  if(table=="joinapps"_n){admission_applications(get_self(),runtime.value).backfill(limit);return;}
  check(false,"RAM_MIGRATION_TABLE");
 }

private:
 void sync_app(name runtime,const admission_application& r){document_ref(runtime,r.dao_id,get_self(),"joinapps"_n,r.id,0,r.document_id,r.document_version);}

 admission_policy current_policy(name runtime,uint64_t dao_id){admission_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"ADMISSION_POLICY_UNKNOWN");check(policy.mode==1&&policy.source==get_self(),"ADMISSION_POLICY_CHANGED");pinned_module(runtime,dao_id,get_self());return policy;}
 void validate(const admission_application& app,uint64_t dao_id,uint64_t revision,const admission_policy& policy){check(app.dao_id==dao_id,"APPLICATION_DOMAIN");check(!app.admitted,"APPLICATION_FROZEN");check(app.revision==revision,"APPLICATION_REVISION");check(app.policy_revision==policy.revision,"ADMISSION_POLICY_CHANGED");check(current_time_point().sec_since_epoch()<app.expires,"APPLICATION_EXPIRED");}
};
EOSIO_DISPATCH(endorse,(checkmig)(scanram)(backfillrefs)(bindrampool)(applyjoin)(witness)(unwitness)(admit))
