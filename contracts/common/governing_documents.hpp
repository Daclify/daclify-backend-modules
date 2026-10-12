#pragma once
#include "module.hpp"
namespace daclify {
struct [[eosio::table("docregs"),eosio::contract("decide")]] governing_document {
 uint64_t id,dao_id,document_id;uint8_t category=0,approval=0;bool track_acceptance=false;
 uint64_t revision=0,adopted_id=0,pending_id=0;
 uint64_t primary_key()const{return id;}uint128_t by_dao()const{return (uint128_t(dao_id)<<64)|id;}
 uint128_t by_document()const{return (uint128_t(dao_id)<<64)|document_id;}
 EOSLIB_SERIALIZE(governing_document,(id)(dao_id)(document_id)(category)(approval)(track_acceptance)(revision)(adopted_id)(pending_id))
};
using governing_documents=ram_table<"docregs"_n,governing_document,
 indexed_by<"bydao"_n,const_mem_fun<governing_document,uint128_t,&governing_document::by_dao>>,
 indexed_by<"bydoc"_n,const_mem_fun<governing_document,uint128_t,&governing_document::by_document>>>;
struct [[eosio::table("docchanges"),eosio::contract("decide")]] document_change {
 uint64_t id,dao_id,register_id,document_id;uint32_t document_version;
 checksum256 commitment,source_hash;uint64_t expected_revision,policy_revision=0,ballot_id=0,proposer;
 uint32_t proposed_at,deadline,adopted_at=0;uint64_t adopted_by=0;uint8_t status=0;
 uint64_t primary_key()const{return id;}uint128_t by_register()const{return (uint128_t(register_id)<<64)|id;}uint64_t by_ballot()const{return ballot_id;}
 EOSLIB_SERIALIZE(document_change,(id)(dao_id)(register_id)(document_id)(document_version)(commitment)(source_hash)(expected_revision)(policy_revision)(ballot_id)(proposer)(proposed_at)(deadline)(adopted_at)(adopted_by)(status))
};
using document_changes=ram_table<"docchanges"_n,document_change,
 indexed_by<"byregister"_n,const_mem_fun<document_change,uint128_t,&document_change::by_register>>,
 indexed_by<"byballot"_n,const_mem_fun<document_change,uint64_t,&document_change::by_ballot>>>;
struct [[eosio::table("docaccepts"),eosio::contract("decide")]] document_acceptance {
 uint64_t id,dao_id,adoption_id,member_id;uint32_t accepted_at;
 uint64_t primary_key()const{return id;}uint128_t by_member()const{return (uint128_t(adoption_id)<<64)|member_id;}
 EOSLIB_SERIALIZE(document_acceptance,(id)(dao_id)(adoption_id)(member_id)(accepted_at))
};
using document_acceptances=ram_table<"docaccepts"_n,document_acceptance,
 indexed_by<"bymember"_n,const_mem_fun<document_acceptance,uint128_t,&document_acceptance::by_member>>>;
}
