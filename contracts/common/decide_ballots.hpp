#pragma once
#include "module.hpp"
namespace daclify {
struct [[eosio::table("ballots"),eosio::contract("decide")]] ballot_record {
 uint64_t id;uint64_t dao_id;uint64_t creator;uint8_t kind;uint8_t choices;uint32_t closes;uint16_t quorum;uint16_t approval;uint64_t denominator;uint64_t max_member;uint64_t cast=0;std::vector<uint64_t> tallies;uint8_t status=0;int16_t winner=-1;std::string metadata;
 uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}
 EOSLIB_SERIALIZE(ballot_record,(id)(dao_id)(creator)(kind)(choices)(closes)(quorum)(approval)(denominator)(max_member)(cast)(tallies)(status)(winner)(metadata))
};
using ballots=ram_table<"ballots"_n,ballot_record,indexed_by<"bydao"_n,const_mem_fun<ballot_record,uint64_t,&ballot_record::by_dao>>>;
}
