#pragma once
#include "module.hpp"
namespace daclify {
struct [[eosio::table("projects"), eosio::contract("works")]] project_record {
 uint64_t id;uint64_t dao_id;uint64_t creator;uint64_t contributor;uint64_t document_id;uint32_t document_version;std::vector<uint64_t> milestones;uint8_t status=0;
 uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}
 EOSLIB_SERIALIZE(project_record,(id)(dao_id)(creator)(contributor)(document_id)(document_version)(milestones)(status))
};
using works_projects=ram_table<"projects"_n,project_record,indexed_by<"bydao"_n,const_mem_fun<project_record,uint64_t,&project_record::by_dao>>>;
struct [[eosio::table("milestones"), eosio::contract("works")]] milestone_record {
 uint64_t id;uint64_t dao_id;uint64_t project_id;asset quantity;uint32_t due;uint8_t status=0;uint64_t submission_doc=0;uint32_t submission_version=0;uint64_t review_doc=0;uint32_t review_version=0;uint64_t reviewer=0;
 uint64_t primary_key()const{return id;}uint64_t by_project()const{return project_id;}
 EOSLIB_SERIALIZE(milestone_record,(id)(dao_id)(project_id)(quantity)(due)(status)(submission_doc)(submission_version)(review_doc)(review_version)(reviewer))
};
using works_milestones=ram_table<"milestones"_n,milestone_record,indexed_by<"byproject"_n,const_mem_fun<milestone_record,uint64_t,&milestone_record::by_project>>>;
struct [[eosio::table("agreements"), eosio::contract("works")]] agreement_record {
 uint64_t project_id;uint64_t dao_id;uint16_t schema_version=1;uint32_t term_start;uint32_t term_end;checksum256 terms;bool accepted=false;uint32_t accepted_at=0;
 uint64_t primary_key()const{return project_id;}
 EOSLIB_SERIALIZE(agreement_record,(project_id)(dao_id)(schema_version)(term_start)(term_end)(terms)(accepted)(accepted_at))
};
using works_agreements=ram_table<"agreements"_n,agreement_record>;
struct [[eosio::table("executions"), eosio::contract("decide")]] work_execution_record {
 uint64_t ballot_id;uint64_t dao_id;name works;uint64_t project_id;checksum256 commitment;checksum256 works_hash;uint64_t policy_revision;uint32_t deadline;bool executed=false;
 uint64_t primary_key()const{return ballot_id;}
 EOSLIB_SERIALIZE(work_execution_record,(ballot_id)(dao_id)(works)(project_id)(commitment)(works_hash)(policy_revision)(deadline)(executed))
};
using work_executions=ram_table<"executions"_n,work_execution_record>;
inline checksum256 project_commitment(name runtime,uint64_t dao_id,name works,uint64_t project_id){
 works_projects projects(works,runtime.value);const auto& p=projects.get(project_id,"PROJECT_UNKNOWN");
 check(p.dao_id==dao_id,"PROJECT_DOMAIN");check(p.status==0,"PROJECT_NOT_PROPOSED");
 works_milestones milestones(works,runtime.value);std::vector<milestone_record> items;
 for(auto id:p.milestones){const auto& item=milestones.get(id,"MILESTONE_UNKNOWN");check(item.dao_id==dao_id&&item.project_id==project_id&&item.status==0,"MILESTONE_STATE");items.push_back(item);}
 auto bytes=pack(std::make_tuple(runtime,dao_id,works,p,items));return sha256(bytes.data(),bytes.size());
}
inline checksum256 agreement_commitment(name runtime,uint64_t dao_id,name works,uint64_t project_id,uint32_t start,uint32_t end){
 const auto base=project_commitment(runtime,dao_id,works,project_id);works_projects projects(works,runtime.value);const auto& project=projects.get(project_id);
 documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();const auto& doc=versions.get((uint128_t(project.document_id)<<32)|project.document_version,"DOCUMENT_UNKNOWN");
 auto bytes=pack(std::make_tuple(base,doc.commitment,uint16_t(1),start,end));return sha256(bytes.data(),bytes.size());
}
inline checksum256 work_commitment(name runtime,uint64_t dao_id,name works,uint64_t project_id){
 const auto base=project_commitment(runtime,dao_id,works,project_id);works_agreements agreements(works,runtime.value);auto found=agreements.find(project_id);
 // Ordinary pre-extension projects keep their exact pending-ballot commitment bytes.
 if(found==agreements.end())return base;
 check(found->dao_id==dao_id&&found->accepted,"AGREEMENT_CONSENT");check(found->terms==agreement_commitment(runtime,dao_id,works,project_id,found->term_start,found->term_end),"AGREEMENT_CHANGED");
 auto bytes=pack(std::make_tuple(base,*found));return sha256(bytes.data(),bytes.size());
}

}
