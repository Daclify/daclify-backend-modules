#pragma once
#include "decide_ballots.hpp"
#include "runtime_domain.hpp"
namespace daclify {
// Retained with its ballot; erasing a marker would re-enable the legacy vote path.
struct [[eosio::table("ballotdefs"),eosio::contract("decide")]] ballot_definition_record {
 uint64_t ballot_id,dao_id;uint16_t version=1;uint8_t purpose;
 uint64_t policy_revision=0;checksum256 policy_hash,commitment;
 uint64_t primary_key()const{return ballot_id;}
 EOSLIB_SERIALIZE(ballot_definition_record,(ballot_id)(dao_id)(version)(purpose)(policy_revision)(policy_hash)(commitment))
};
using ballot_definitions=ram_table<"ballotdefs"_n,ballot_definition_record>;
inline checksum256 definition_commitment(checksum256 chain_id,name runtime,name decide,const ballot_record& b,const ballot_definition_record& d,checksum256 subtype){
 const auto bytes=pack(std::make_tuple(d.version,chain_id,runtime,decide,b.dao_id,b.id,d.purpose,b.creator,b.kind,b.choices,b.closes,b.quorum,b.approval,b.denominator,b.max_member,b.metadata,d.policy_revision,d.policy_hash,subtype));
 return sha256(bytes.data(),bytes.size());
}
}
