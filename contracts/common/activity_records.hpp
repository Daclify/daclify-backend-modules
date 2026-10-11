#pragma once
#include "module.hpp"
#include "connected_apps.hpp"
namespace daclify {
// Selected events only. Two indexes provide once-only DAO/app/event delivery and
// bounded app pagination. No source text, photos, credentials or external URLs.
struct [[eosio::table("activities"),eosio::contract("activity")]] activity_record {
 uint64_t id,dao_id,app_id,actor;uint8_t kind;checksum256 source_id,source_revision,event_id;
 std::string evidence_cid;checksum256 evidence_hash;uint64_t key_epoch;uint32_t created_at;uint8_t status;
 uint64_t primary_key()const{return id;}
 uint128_t by_app()const{return (uint128_t(dao_id)<<64)|app_id;}
 checksum256 by_event()const{auto data=pack(std::make_tuple(dao_id,app_id,event_id));return sha256(data.data(),data.size());}
 EOSLIB_SERIALIZE(activity_record,(id)(dao_id)(app_id)(actor)(kind)(source_id)(source_revision)(event_id)(evidence_cid)(evidence_hash)(key_epoch)(created_at)(status))
};
using activities=ram_table<"activities"_n,activity_record,indexed_by<"byapp"_n,const_mem_fun<activity_record,uint128_t,&activity_record::by_app>>,indexed_by<"byevent"_n,const_mem_fun<activity_record,checksum256,&activity_record::by_event>>>;
// Review is allocated only when one is submitted; its primary key is the receipt.
struct [[eosio::table("actreviews"),eosio::contract("activity")]] activity_review {
 uint64_t id,dao_id,reviewer;bool accepted;std::string evidence_cid;checksum256 evidence_hash;uint64_t key_epoch;uint32_t reviewed_at;
 uint64_t primary_key()const{return id;}
 EOSLIB_SERIALIZE(activity_review,(id)(dao_id)(reviewer)(accepted)(evidence_cid)(evidence_hash)(key_epoch)(reviewed_at))
};
using activity_reviews=ram_table<"actreviews"_n,activity_review>;
// Fixed counters make capacity checks constant work. One domain index; at most
// 10,000 permanent receipts and 128 epochs per registered app. Native RAM quotas
// provide the tighter actual funded limit. Historical receipts/keys are retained.
struct [[eosio::table("appcounts"),eosio::contract("activity")]] app_count {
 uint64_t id,dao_id,app_id,receipts=0;uint16_t epochs=0;uint64_t current_key_epoch=0;
 uint64_t primary_key()const{return id;}uint128_t by_app()const{return (uint128_t(dao_id)<<64)|app_id;}
 EOSLIB_SERIALIZE(app_count,(id)(dao_id)(app_id)(receipts)(epochs)(current_key_epoch))
};
using app_counts=ram_table<"appcounts"_n,app_count,indexed_by<"byapp"_n,const_mem_fun<app_count,uint128_t,&app_count::by_app>>>;
struct [[eosio::table("appkeys"),eosio::contract("activity")]] app_key_epoch {
 uint64_t id,dao_id,app_id,security_epoch,app_revision,max_member;checksum256 key_commitment;uint32_t created_at;
 uint64_t primary_key()const{return id;}
 uint128_t by_app()const{return (uint128_t(dao_id)<<64)|app_id;}
 EOSLIB_SERIALIZE(app_key_epoch,(id)(dao_id)(app_id)(security_epoch)(app_revision)(max_member)(key_commitment)(created_at))
};
using app_key_epochs=ram_table<"appkeys"_n,app_key_epoch,indexed_by<"byapp"_n,const_mem_fun<app_key_epoch,uint128_t,&app_key_epoch::by_app>>>;
struct [[eosio::table("appgrants"),eosio::contract("activity")]] app_key_grant {
 uint64_t id,dao_id,key_epoch,recipient;std::string encryption_key,envelope;
 uint64_t primary_key()const{return id;}uint128_t by_member()const{return (uint128_t(key_epoch)<<64)|recipient;}
 EOSLIB_SERIALIZE(app_key_grant,(id)(dao_id)(key_epoch)(recipient)(encryption_key)(envelope))
};
using app_key_grants=ram_table<"appgrants"_n,app_key_grant,indexed_by<"bymember"_n,const_mem_fun<app_key_grant,uint128_t,&app_key_grant::by_member>>>;
struct [[eosio::table("actdecisions"),eosio::contract("activity")]] activity_decision {
 uint64_t id,dao_id;name decide;uint64_t ballot_id;checksum256 metadata_hash;
 uint64_t primary_key()const{return id;}
 EOSLIB_SERIALIZE(activity_decision,(id)(dao_id)(decide)(ballot_id)(metadata_hash))
};
using activity_decisions=ram_table<"actdecisions"_n,activity_decision>;
}
