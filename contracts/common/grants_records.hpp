#pragma once
#include "works_records.hpp"
namespace daclify {
struct [[eosio::table("rounds"),eosio::contract("grants")]] grant_round {
 uint64_t id;uint64_t dao_id;uint64_t creator;uint64_t document_id;uint32_t document_version;uint64_t rules_revision=1;uint32_t applications_close;uint32_t review_close;uint32_t awards_close;asset maximum;int64_t awarded=0;bool allow_agents=false;name works;bool closed=false;
 uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}
 EOSLIB_SERIALIZE(grant_round,(id)(dao_id)(creator)(document_id)(document_version)(rules_revision)(applications_close)(review_close)(awards_close)(maximum)(awarded)(allow_agents)(works)(closed))
};
using grant_rounds=ram_table<"rounds"_n,grant_round,indexed_by<"bydao"_n,const_mem_fun<grant_round,uint64_t,&grant_round::by_dao>>>;
struct [[eosio::table("applications"),eosio::contract("grants")]] grant_application {
 uint64_t id;uint64_t dao_id;uint64_t round_id;uint64_t contributor;uint64_t revision=1;uint64_t document_id;uint32_t document_version;std::vector<asset> payments;std::vector<uint32_t> dues;uint32_t term_start;uint32_t term_end;uint8_t status=0;uint32_t consent_at=0;uint64_t decision_doc=0;uint32_t decision_version=0;uint64_t project_id=0;uint64_t funding_ballot=0;
 uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}uint64_t by_round()const{return round_id;}
 EOSLIB_SERIALIZE(grant_application,(id)(dao_id)(round_id)(contributor)(revision)(document_id)(document_version)(payments)(dues)(term_start)(term_end)(status)(consent_at)(decision_doc)(decision_version)(project_id)(funding_ballot))
};
using grant_applications=ram_table<"applications"_n,grant_application,indexed_by<"bydao"_n,const_mem_fun<grant_application,uint64_t,&grant_application::by_dao>>,indexed_by<"byround"_n,const_mem_fun<grant_application,uint64_t,&grant_application::by_round>>>;
struct [[eosio::table("grantplans"),eosio::contract("decide")]] grant_execution {
 uint64_t ballot_id;uint64_t dao_id;name grants;name works;uint64_t round_id;uint64_t application_id;uint64_t application_revision;uint64_t project_id;checksum256 commitment;checksum256 grants_hash;checksum256 works_hash;uint64_t policy_revision;uint32_t deadline;bool executed=false;
 uint64_t primary_key()const{return ballot_id;}
 EOSLIB_SERIALIZE(grant_execution,(ballot_id)(dao_id)(grants)(works)(round_id)(application_id)(application_revision)(project_id)(commitment)(grants_hash)(works_hash)(policy_revision)(deadline)(executed))
};
using grant_executions=ram_table<"grantplans"_n,grant_execution>;
inline bool grant_participant(name runtime,uint64_t dao_id,uint64_t member_id,bool allow_agents){
 members people(runtime,dao_id);const auto& person=people.get(member_id,"MEMBER_UNKNOWN");if(!person.active)return false;
 participants actors(runtime,dao_id);auto actor=actors.find(member_id);return actor==actors.end()||(!actor->revoked&&(allow_agents||actor->kind==0));
}
inline checksum256 grant_commitment(name runtime,uint64_t dao_id,name grants,uint64_t round_id,uint64_t application_id){
 grant_rounds rounds(grants,runtime.value);const auto& round=rounds.get(round_id,"ROUND_UNKNOWN");grant_applications apps(grants,runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");check(round.dao_id==dao_id&&app.dao_id==dao_id&&app.round_id==round_id,"GRANT_DOMAIN");check(!round.closed&&(app.status==2||app.status==4),"APPLICATION_NOT_ELIGIBLE");
 documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();const auto& rules=versions.get((uint128_t(round.document_id)<<32)|round.document_version,"DOCUMENT_UNKNOWN");const auto& body=versions.get((uint128_t(app.document_id)<<32)|app.document_version,"DOCUMENT_UNKNOWN");const auto& decision=versions.get((uint128_t(app.decision_doc)<<32)|app.decision_version,"DOCUMENT_UNKNOWN");
 auto bytes=pack(std::make_tuple(runtime,dao_id,grants,round.id,round.rules_revision,round.applications_close,round.review_close,round.awards_close,round.maximum,round.allow_agents,round.works,rules.commitment,app.id,app.contributor,app.revision,app.document_id,app.document_version,app.payments,app.dues,app.term_start,app.term_end,app.consent_at,app.decision_doc,app.decision_version,body.commitment,decision.commitment));return sha256(bytes.data(),bytes.size());
}
}
