#pragma once
#include "grants_records.hpp"
namespace daclify {
struct work_ballot_target {
 project_record project;std::vector<milestone_record> milestones;std::optional<agreement_record> agreement;std::optional<arbitration_terms> protection;checksum256 document_commitment;
 EOSLIB_SERIALIZE(work_ballot_target,(project)(milestones)(agreement)(protection)(document_commitment))
};
struct grant_ballot_target {
 grant_round round;grant_application application;std::optional<arbitration_terms> protection;checksum256 rules_commitment,application_commitment,decision_commitment;
 EOSLIB_SERIALIZE(grant_ballot_target,(round)(application)(protection)(rules_commitment)(application_commitment)(decision_commitment))
};
// Immutable opening records preserve readable terms even when the source is later revised.
struct [[eosio::table("votetargets"),eosio::contract("decide")]] ballot_target {
 uint64_t ballot_id,dao_id;uint16_t version=1;std::optional<work_ballot_target> work;std::optional<grant_ballot_target> grant;bool released=false;
 uint64_t primary_key()const{return ballot_id;}
 EOSLIB_SERIALIZE(ballot_target,(ballot_id)(dao_id)(version)(work)(grant)(released))
};
using ballot_targets=ram_table<"votetargets"_n,ballot_target>;
inline checksum256 target_document_hash(name runtime,uint64_t dao_id,uint64_t document_id,uint32_t version){documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();return versions.get((uint128_t(document_id)<<32)|version,"DOCUMENT_UNKNOWN").commitment;}
}
