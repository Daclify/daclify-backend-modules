#pragma once
#include "module.hpp"
#include "arbitration.hpp"
namespace daclify {
struct arbitration_voter {uint64_t member_id,weight;EOSLIB_SERIALIZE(arbitration_voter,(member_id)(weight))};
// The bounded electorate remains evidence for the retained ballot definition.
struct [[eosio::table("arbplans"),eosio::contract("decide")]] arbitration_plan {
 uint64_t ballot_id,dao_id;protected_obligation protection;asset quantity;uint32_t due;std::vector<arbitration_voter> voters;bool executed=false;uint16_t version=1;uint64_t cursor=0;uint32_t scanned=0;bool ready=false;
 uint64_t primary_key()const{return ballot_id;}
 EOSLIB_SERIALIZE(arbitration_plan,(ballot_id)(dao_id)(protection)(quantity)(due)(voters)(executed)(version)(cursor)(scanned)(ready))
};
using arbitration_plans=ram_table<"arbplans"_n,arbitration_plan>;
}
