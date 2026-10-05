#pragma once
#include "records.hpp"
#define JSON_NOEXCEPTION
#define JSON_HAS_FILESYSTEM 0
#define JSON_HAS_EXPERIMENTAL_FILESYSTEM 0
#include "json.hpp"
namespace daclify {
inline member_record module_actor(name runtime,uint64_t dao_id,uint64_t member_id,name module_account,name action_name,bool admin=false,bool reviewer=false) {
 if(get_sender().value){check(get_sender()==runtime,"ACTOR_SENDER");require_auth(permission_level{runtime,"execctx"_n});}else require_auth(runtime);check(is_account(runtime),"RUNTIME_ACCOUNT");daos communities(runtime,runtime.value);communities.get(dao_id,"DAO_UNKNOWN");modules installed(runtime,dao_id);const auto& grant=installed.get(module_account.value,"MODULE_DISABLED");check(grant.version==1&&std::find(grant.actions.begin(),grant.actions.end(),action_name)!=grant.actions.end(),"MODULE_ACTION");members people(runtime,dao_id);const auto& person=people.get(member_id,"MEMBER_UNKNOWN");check(person.active,"MEMBER_INACTIVE");check(!admin||person.admin,"ADMIN_REQUIRED");check(!reviewer||person.admin||person.reviewer,"REVIEWER_REQUIRED");return person;
}
inline void json_metadata(const std::string& metadata){check(metadata.size()>0&&metadata.size()<=4096,"METADATA_SIZE");check(nlohmann::json::accept(metadata),"METADATA_JSON");}
inline void core_action(name runtime,name module_account,name action_name,const std::vector<char>& bytes){action outgoing;outgoing.account=runtime;outgoing.name=action_name;outgoing.authorization={{module_account,"active"_n}};outgoing.data=bytes;outgoing.send();}
}
