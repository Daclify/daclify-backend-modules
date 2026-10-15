#pragma once
#include "module.hpp"
#include "quick_accounts.hpp"
#include "quick_ballot_proof.hpp"
#include "executives.hpp"
#include "runtime_settings.hpp"
namespace daclify {
struct quick_reader {
 uint64_t member_id;std::string encryption_key;
 EOSLIB_SERIALIZE(quick_reader,(member_id)(encryption_key))
};
struct quick_definition {
 uint16_t protocol=1;std::string question,explanation;bool all_accounts;std::vector<uint64_t> audience;uint32_t closes;std::vector<quick_reader> readers;
 EOSLIB_SERIALIZE(quick_definition,(protocol)(question)(explanation)(all_accounts)(audience)(closes)(readers))
};
struct [[eosio::table("qclock"),eosio::contract("quickvote")]] quick_clock {
 uint64_t id=0;name authority;checksum256 authority_hash;uint64_t next_response_id=1;
 uint64_t primary_key()const{return id;}uint64_t ram_owner(name,uint64_t)const{return 0;}
 EOSLIB_SERIALIZE(quick_clock,(id)(authority)(authority_hash)(next_response_id))
};
using quick_clocks=ram_table<"qclock"_n,quick_clock>;
struct [[eosio::table("qballots"),eosio::contract("quickvote")]] quick_ballot {
 uint64_t id,dao_id,creator_id;uint32_t opened_at;quick_definition definition;checksum256 definition_hash;
 std::vector<char> key,key_proof,aggregate=std::vector<char>(192,0);
 uint32_t count=0,identities=0,closed_at=0;
 uint64_t scan_cursor=0;uint32_t scan_rows=0,scan_count=0;
 std::vector<char> scan_aggregate=std::vector<char>(192,0);checksum256 response_root;bool prepared=false;
 uint32_t up=0;std::vector<char> final_proof=std::vector<char>(64,0);bool verified=false,pruned=false;
 uint64_t primary_key()const{return id;}
 uint128_t by_dao()const{return (uint128_t(dao_id)<<64)|id;}
 uint64_t by_due()const{return !closed_at&&definition.closes?definition.closes:std::numeric_limits<uint64_t>::max();}
 EOSLIB_SERIALIZE(quick_ballot,(id)(dao_id)(creator_id)(opened_at)(definition)(definition_hash)(key)(key_proof)(aggregate)(count)(identities)(closed_at)(scan_cursor)(scan_rows)(scan_count)(scan_aggregate)(response_root)(prepared)(up)(final_proof)(verified)(pruned))
};
// Origin discovery and due jobs avoid scans of other DAOs or permanently closed ballots.
using quick_ballots=ram_table<"qballots"_n,quick_ballot,indexed_by<"bydao"_n,const_mem_fun<quick_ballot,uint128_t,&quick_ballot::by_dao>>,indexed_by<"bydue"_n,const_mem_fun<quick_ballot,uint64_t,&quick_ballot::by_due>>>;
struct [[eosio::table("qresponses"),eosio::contract("quickvote")]] quick_response {
 uint64_t id,dao_id,ballot_id;checksum256 identity;uint64_t revision;bool active=true;std::vector<char> ciphertext,proof,receipt;uint32_t updated_at;
 uint64_t primary_key()const{return id;}
 checksum256 by_identity()const{const auto data=pack(std::make_tuple(ballot_id,identity));return sha256(data.data(),data.size());}
 uint128_t by_ballot()const{return (uint128_t(ballot_id)<<64)|id;}
 EOSLIB_SERIALIZE(quick_response,(id)(dao_id)(ballot_id)(identity)(revision)(active)(ciphertext)(proof)(receipt)(updated_at))
};
// One row per canonical account; ballot/ID order supports bounded complete snapshots and pruning.
using quick_responses=ram_table<"qresponses"_n,quick_response,indexed_by<"byidentity"_n,const_mem_fun<quick_response,checksum256,&quick_response::by_identity>>,indexed_by<"byballot"_n,const_mem_fun<quick_response,uint128_t,&quick_response::by_ballot>>>;
struct [[eosio::table("qgrants"),eosio::contract("quickvote")]] quick_grant {
 uint64_t id,dao_id;std::vector<std::vector<char>> grants;
 uint64_t primary_key()const{return id;}
 EOSLIB_SERIALIZE(quick_grant,(id)(dao_id)(grants))
};
using quick_grants=ram_table<"qgrants"_n,quick_grant>;

inline bool quick_utf8(const std::string& value){
 for(size_t at=0;at<value.size();){
  const auto first=uint8_t(value[at++]);if(first<128)continue;
  uint32_t code=0,minimum=0;size_t count=0;
  if(first>=0xc2&&first<=0xdf){code=first&31;count=1;minimum=0x80;}
  else if(first>=0xe0&&first<=0xef){code=first&15;count=2;minimum=0x800;}
  else if(first>=0xf0&&first<=0xf4){code=first&7;count=3;minimum=0x10000;}
  else return false;
  if(count>value.size()-at)return false;
  for(size_t i=0;i<count;++i){const auto byte=uint8_t(value[at++]);if((byte&0xc0)!=0x80)return false;code=(code<<6)|(byte&63);}
  if(code<minimum||code>0x10ffff||(code>=0xd800&&code<=0xdfff))return false;
 }
 return true;
}
inline checksum256 quick_definition_hash(name runtime,name source,uint64_t id,uint64_t dao_id,uint64_t creator,const quick_definition& value){
 const auto chain=runtime_settings_table(runtime,runtime.value).get().chain_id;
 const auto bytes=pack(std::make_tuple(std::string("daclify.quick-ballot.definition.v1"),chain,runtime,source,id,dao_id,creator,value));return sha256(bytes.data(),bytes.size());
}
inline std::vector<char> quick_proof_context(name runtime,const quick_ballot& ballot,const char* kind,const std::vector<char>& suffix={}){
 const std::string tag=std::string("daclify.quick-ballot.context.")+kind+".v1";
 std::vector<char> bytes(tag.begin(),tag.end());bytes.push_back(0);
 auto base=pack(std::make_tuple(runtime_settings_table(runtime,runtime.value).get().chain_id,runtime,ballot.id,ballot.definition_hash,uint32_t(1)));
 bytes.insert(bytes.end(),base.begin(),base.end());bytes.insert(bytes.end(),suffix.begin(),suffix.end());const auto digest=sha256(bytes.data(),bytes.size()).extract_as_byte_array();return {digest.begin(),digest.end()};
}
inline std::vector<char> quick_cipher_sum(const std::vector<char>& left,const std::vector<char>& right,bool subtract=false){
 using proof=quick_ballot_proof;
 const auto a=proof::read_cipher(left,false),b=proof::read_cipher(right,false);
 const auto one=proof::scalar_u64(1),coefficient=subtract?proof::scalar_negative(one):one;
 auto r=proof::point_bytes(proof::linear(a.first,one,b.first,coefficient));
 auto s=proof::point_bytes(proof::linear(a.second,one,b.second,coefficient));r.insert(r.end(),s.begin(),s.end());return r;
}
inline bool quick_member(name runtime,uint64_t dao_id,const quick_anchor& credential){
 if(dao_lifecycle(runtime,dao_id)!=0)return false;
 members people(runtime,dao_id);
 if(credential.kind==0){auto index=people.get_index<"bykey"_n>();auto found=index.find(sha256(credential.credential.data(),credential.credential.size()));return found!=index.end()&&found->active;}
 if(credential.kind==1){auto index=people.get_index<"bynative"_n>();auto found=index.find(unpack<permission_level>(credential.credential).actor.value);return found!=index.end()&&found->active;}
 const auto wallet=unpack<std::tuple<uint64_t,checksum160>>(credential.credential);const auto data=pack(wallet);
 evm_bindings bindings(runtime,dao_id);auto index=bindings.get_index<"bywallet"_n>();auto found=index.find(sha256(data.data(),data.size()));
 if(found==index.end()||!found->active)return false;auto person=people.find(found->member_id);return person!=people.end()&&person->active;
}
inline void quick_executive(name runtime,uint64_t dao_id,uint64_t member_id){
 const auto policy=executive_policies(runtime,runtime.value).get(dao_id,"EXECUTIVE_REQUIRED");
 const auto office=executives(runtime,dao_id).get(member_id,"EXECUTIVE_REQUIRED");check(executive_active(office,policy),"EXECUTIVE_REQUIRED");
}
inline void quick_open(const quick_ballot& ballot,name runtime,name source){
 const auto now=current_time_point().sec_since_epoch();check(!ballot.closed_at&&(!ballot.definition.closes||now<ballot.definition.closes)&&dao_lifecycle(runtime,ballot.dao_id)==0,"QUICK_CLOSED");
 pinned_module(runtime,ballot.dao_id,source);
}
inline checksum256 quick_snapshot_seed(name runtime,name source,const quick_ballot& ballot){
 const auto data=pack(std::make_tuple(std::string("daclify.quick-ballot.responses.v1"),runtime_settings_table(runtime,runtime.value).get().chain_id,runtime,source,ballot.id,ballot.definition_hash,uint64_t(ballot.count),ballot.aggregate,uint64_t(ballot.identities)));
 return sha256(data.data(),data.size());
}
inline void quick_freeze(name runtime,name source,quick_ballots& rows,quick_ballot& ballot,uint32_t closed_at){
 if(ballot.closed_at)return;ballot.closed_at=closed_at;ballot.response_root=quick_snapshot_seed(runtime,source,ballot);rows.modify(rows.get(ballot.id),same_payer,[&](auto& value){value=ballot;});
}
inline void quick_freeze_due(name runtime,name source,quick_ballots& rows,quick_ballot& ballot){
 if(ballot.closed_at)return;const auto now=current_time_point().sec_since_epoch();uint32_t closed_at=0;
 if(ballot.definition.closes&&now>=ballot.definition.closes)closed_at=ballot.definition.closes;
 dao_lifecycles lifecycle(runtime,runtime.value);auto state=lifecycle.find(ballot.dao_id);if(state!=lifecycle.end()&&state->state!=0&&(!closed_at||state->transitioned_at<closed_at))closed_at=state->transitioned_at;
 modules installed(runtime,ballot.dao_id);auto grant=installed.find(source.value);if((grant==installed.end()||grant->actions.empty())&&!closed_at)closed_at=now;
 check(closed_at,"QUICK_NOT_CLOSED");quick_freeze(runtime,source,rows,ballot,closed_at);
}
}
