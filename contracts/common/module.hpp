#pragma once
#define DACLIFY_MODULE_METERING
#include "records.hpp"
#include "governance.hpp"
#include "document_refs.hpp"
#define JSON_NOEXCEPTION
#define JSON_HAS_FILESYSTEM 0
#define JSON_HAS_EXPERIMENTAL_FILESYSTEM 0
#include "json.hpp"
namespace daclify {
inline void bind_ram_pool(name payer,name runtime){
 require_auth(payer);check(is_account(runtime),"RUNTIME_ACCOUNT");ram_payer_binding binding(payer,payer.value);
 if(binding.exists()){check(binding.get().runtime==runtime,"RAM_PAYER_RUNTIME");return;}
 ram_observer_settings observer(runtime,runtime.value);check(observer.exists()&&observer.get().runtime_hash==get_code_hash(runtime),"RAM_OBSERVER_REQUIRED");
 ram_sources sources(runtime,runtime.value);check(sources.get(payer.value,"RAM_SOURCE_UNKNOWN").code_hash==get_code_hash(payer),"RAM_SOURCE_CODE");
 const ram_payer_owner owner{runtime};binding.set(owner,payer);observe_ram(runtime,0,payer,"rampayer"_n,pack_size(owner)+224,0);
}
inline void pinned_module(name runtime,uint64_t dao_id,name account){
 modules rows(runtime,dao_id);const auto& installed=rows.get(account.value,"MODULE_DISABLED");
 check(!installed.actions.empty()&&installed.code_hash!=checksum256()&&get_code_hash(account)==installed.code_hash,"MODULE_CODE");
}
inline member_record module_actor(name runtime,uint64_t dao_id,uint64_t member_id,name module_account,name action_name,bool admin=false,bool reviewer=false) {
 check_ram_payer_runtime(module_account,runtime);
 gov_policies policies(runtime,runtime.value);if(policies.find(dao_id)!=policies.end())check(get_sender()==runtime,"ACTOR_SENDER");check_agent_authority(runtime,dao_id,member_id);
 if(get_sender().value){check(get_sender()==runtime,"ACTOR_SENDER");require_auth(permission_level{runtime,"execctx"_n});}else require_auth(runtime);check(is_account(runtime),"RUNTIME_ACCOUNT");daos communities(runtime,runtime.value);communities.get(dao_id,"DAO_UNKNOWN");modules installed(runtime,dao_id);const auto& grant=installed.get(module_account.value,"MODULE_DISABLED");check(grant.version==1&&std::find(grant.actions.begin(),grant.actions.end(),action_name)!=grant.actions.end(),"MODULE_ACTION");members people(runtime,dao_id);const auto& person=people.get(member_id,"MEMBER_UNKNOWN");check(person.active,"MEMBER_INACTIVE");check(!admin||person.admin,"ADMIN_REQUIRED");check(!reviewer||person.admin||person.reviewer,"REVIEWER_REQUIRED");return person;
}
inline void json_metadata(const std::string& metadata){check(metadata.size()>0&&metadata.size()<=4096,"METADATA_SIZE");check(nlohmann::json::accept(metadata),"METADATA_JSON");}
inline void core_action(name runtime,name module_account,name action_name,const std::vector<char>& bytes){action outgoing;outgoing.account=runtime;outgoing.name=action_name;outgoing.authorization={{module_account,"active"_n}};outgoing.data=bytes;outgoing.send();}
inline void register_document_source(name runtime,uint64_t dao_id,name source){
 std::vector<name> tables=DACLIFY_DOCUMENT_TABLES;std::sort(tables.begin(),tables.end(),[](name a,name b){return a.value<b.value;});core_action(runtime,source,"docsrc"_n,pack(std::make_tuple(dao_id,source,tables)));
}
inline void document_ref(name runtime,uint64_t dao_id,name source,name table,uint64_t id,uint8_t slot,uint64_t doc,uint32_t version){
 register_document_source(runtime,dao_id,source);core_action(runtime,source,"docref"_n,pack(std::make_tuple(dao_id,source,table,id,slot,doc,version)));
}
template<typename Table,typename Visit>void backfill_document_refs(name runtime,uint64_t dao_id,name source,name table,uint32_t limit,Visit visit){
 require_auth(runtime);pinned_module(runtime,dao_id,source);register_document_source(runtime,dao_id,source);check(limit>0&&limit<=25,"DOCUMENT_SCAN_BOUNDS");
 document_scans scans(runtime,dao_id);auto index=scans.get_index<"bysource"_n>();auto data=pack(std::make_tuple(source,table));auto found=index.find(sha256(data.data(),data.size()));
 const bool current=found!=index.end()&&found->code_hash==get_code_hash(source);if(current&&found->complete)return;const auto start=current?found->cursor:0;auto next=start;
 Table rows(source,runtime.value);auto it=rows.upper_bound(start);uint32_t count=0;
 for(;it!=rows.end()&&count<limit;++it,++count){next=it->primary_key();if(it->dao_id==dao_id)visit(*it);}
 core_action(runtime,source,"docscanstep"_n,pack(std::make_tuple(dao_id,source,table,start,next,it==rows.end(),count)));
}
}
