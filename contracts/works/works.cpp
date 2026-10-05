#include "module.hpp"
using namespace daclify;
CONTRACT works:public contract {
public:
 using contract::contract;
 TABLE project_record {uint64_t id;uint64_t dao_id;uint64_t creator;uint64_t contributor;uint64_t document_id;uint32_t document_version;std::vector<uint64_t> milestones;uint8_t status=0;uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}EOSLIB_SERIALIZE(project_record,(id)(dao_id)(creator)(contributor)(document_id)(document_version)(milestones)(status))};
 using projects=multi_index<"projects"_n,project_record,indexed_by<"bydao"_n,const_mem_fun<project_record,uint64_t,&project_record::by_dao>>>;
 TABLE milestone_record {uint64_t id;uint64_t dao_id;uint64_t project_id;asset quantity;uint32_t due;uint8_t status=0;uint64_t submission_doc=0;uint32_t submission_version=0;uint64_t review_doc=0;uint32_t review_version=0;uint64_t reviewer=0;uint64_t primary_key()const{return id;}uint64_t by_project()const{return project_id;}EOSLIB_SERIALIZE(milestone_record,(id)(dao_id)(project_id)(quantity)(due)(status)(submission_doc)(submission_version)(review_doc)(review_version)(reviewer))};
 using milestones=multi_index<"milestones"_n,milestone_record,indexed_by<"byproject"_n,const_mem_fun<milestone_record,uint64_t,&milestone_record::by_project>>>;
 ACTION propose(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t project_id,uint64_t contributor,uint64_t document_id,uint32_t document_version,std::vector<asset> payments,std::vector<uint32_t> dues){
  module_actor(runtime,dao_id,member_id,get_self(),"propose"_n);check(project_id>0,"PROJECT_ID");check(payments.size()>0&&payments.size()<=16&&dues.size()==payments.size(),"MILESTONE_LIMIT");check_document(runtime,dao_id,document_id,document_version);members people(runtime,dao_id);check(people.get(contributor,"MEMBER_UNKNOWN").active,"MEMBER_INACTIVE");daos communities(runtime,runtime.value);const auto& d=communities.get(dao_id);int64_t total=0;
  for(const auto& payment:payments){check(payment.is_valid()&&payment.amount>0&&payment.symbol==d.token_symbol,"ASSET_QUANTITY");total=add_amount(total,payment.amount);}projects rows(get_self(),runtime.value);check(rows.find(project_id)==rows.end(),"PROJECT_EXISTS");milestones items(get_self(),runtime.value);std::vector<uint64_t> ids;
  for(size_t i=0;i<payments.size();i++){auto id=items.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"MILESTONE_LIMIT");ids.push_back(id);items.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.project_id=project_id;r.quantity=payments[i];r.due=dues[i];});}
  rows.emplace(get_self(),[&](auto& r){r.id=project_id;r.dao_id=dao_id;r.creator=member_id;r.contributor=contributor;r.document_id=document_id;r.document_version=document_version;r.milestones=ids;});
 }
 ACTION accept(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t project_id){
  module_actor(runtime,dao_id,member_id,get_self(),"accept"_n,true);projects rows(get_self(),runtime.value);const auto& p=rows.get(project_id,"PROJECT_UNKNOWN");check(p.dao_id==dao_id,"PROJECT_DOMAIN");check(p.status==0,"PROJECT_NOT_PROPOSED");members people(runtime,dao_id);check(people.get(p.contributor).active,"MEMBER_INACTIVE");milestones items(get_self(),runtime.value);
  for(auto id:p.milestones){const auto& m=items.get(id);check(m.status==0,"MILESTONE_STATE");core_action(runtime,get_self(),"reserve"_n,pack(std::make_tuple(dao_id,get_self(),id,p.contributor,m.quantity,m.due)));items.modify(m,same_payer,[](auto& r){r.status=1;});}rows.modify(p,same_payer,[](auto& r){r.status=1;});
 }
 ACTION submitwork(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t milestone_id,uint64_t document_id,uint32_t document_version){
  module_actor(runtime,dao_id,member_id,get_self(),"submitwork"_n);milestones items(get_self(),runtime.value);const auto& m=items.get(milestone_id,"MILESTONE_UNKNOWN");check(m.dao_id==dao_id,"MILESTONE_DOMAIN");projects rows(get_self(),runtime.value);const auto& p=rows.get(m.project_id);check(p.contributor==member_id,"CONTRIBUTOR_REQUIRED");check(p.status==1&&(m.status==1||m.status==3),"MILESTONE_STATE");check_document(runtime,dao_id,document_id,document_version);items.modify(m,same_payer,[&](auto& r){r.status=2;r.submission_doc=document_id;r.submission_version=document_version;});
 }
 ACTION review(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t milestone_id,bool approve,uint64_t document_id,uint32_t document_version){
  module_actor(runtime,dao_id,member_id,get_self(),"review"_n,false,true);milestones items(get_self(),runtime.value);const auto& m=items.get(milestone_id,"MILESTONE_UNKNOWN");check(m.dao_id==dao_id,"MILESTONE_DOMAIN");projects rows(get_self(),runtime.value);const auto& p=rows.get(m.project_id);check(member_id!=p.contributor,"SELF_REVIEW");check(p.status==1&&m.status==2,"MILESTONE_STATE");check_document(runtime,dao_id,document_id,document_version);
  items.modify(m,same_payer,[&](auto& r){r.status=approve?4:3;r.review_doc=document_id;r.review_version=document_version;r.reviewer=member_id;});if(approve)core_action(runtime,get_self(),"approveob"_n,pack(std::make_tuple(dao_id,get_self(),milestone_id)));
 }
 ACTION cancel(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t project_id){
  module_actor(runtime,dao_id,member_id,get_self(),"cancel"_n,true);projects rows(get_self(),runtime.value);const auto& p=rows.get(project_id,"PROJECT_UNKNOWN");check(p.dao_id==dao_id,"PROJECT_DOMAIN");check(p.status<=1,"PROJECT_CLOSED");milestones items(get_self(),runtime.value);
  for(auto id:p.milestones){const auto& m=items.get(id);if(m.status<4){if(m.status>0)core_action(runtime,get_self(),"cancelob"_n,pack(std::make_tuple(dao_id,get_self(),id)));items.modify(m,same_payer,[](auto& r){r.status=5;});}}rows.modify(p,same_payer,[](auto& r){r.status=2;});
 }
 ACTION settle(name runtime,uint64_t dao_id,uint64_t milestone_id){
  milestones items(get_self(),runtime.value);const auto& m=items.get(milestone_id,"MILESTONE_UNKNOWN");check(m.dao_id==dao_id,"MILESTONE_DOMAIN");check(m.status==4,"MILESTONE_NOT_APPROVED");core_action(runtime,get_self(),"payob"_n,pack(std::make_tuple(dao_id,get_self(),milestone_id)));
 }
private:
 void check_document(name runtime,uint64_t dao_id,uint64_t id,uint32_t version){documents rows(runtime,dao_id);auto index=rows.get_index<"byversion"_n>();index.get((uint128_t(id)<<32)|version,"DOCUMENT_UNKNOWN");}
};
EOSIO_DISPATCH(works,(propose)(accept)(submitwork)(review)(cancel)(settle))
