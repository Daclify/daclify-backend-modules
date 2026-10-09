#define DACLIFY_DOCUMENT_TABLES {"rounds"_n,"applications"_n}
#define DACLIFY_RAM_PAYER_CONTRACT "grants"
#include "grants_records.hpp"
using namespace daclify;
CONTRACT grants:public contract {
public:
 using contract::contract;
 ACTION backfillrefs(name runtime,uint64_t dao_id,name table,uint32_t limit){
  if(table=="rounds"_n)backfill_document_refs<grant_rounds>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_round(runtime,r);});
  else if(table=="applications"_n)backfill_document_refs<grant_applications>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_app(runtime,r);});else check(false,"DOCUMENT_SOURCE_TABLE");
 }
 ACTION bindrampool(name runtime){bind_ram_pool(get_self(),runtime);}
 ACTION newround(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t round_id,uint64_t document_id,uint32_t document_version,uint32_t applications_close,uint32_t review_close,uint32_t awards_close,asset maximum,bool allow_agents,name works){
  module_actor(runtime,dao_id,member_id,get_self(),"newround"_n,true);check(round_id>0,"ROUND_ID");check_doc(runtime,dao_id,document_id,document_version);const auto now=current_time_point().sec_since_epoch();check(now<applications_close&&applications_close<review_close&&review_close<awards_close&&uint64_t(awards_close)-now<=31536000,"ROUND_DEADLINES");
  daos communities(runtime,runtime.value);const auto& dao=communities.get(dao_id);check(maximum.is_valid()&&maximum.amount>0&&maximum.symbol==dao.token_symbol,"ASSET_QUANTITY");pinned_module(runtime,dao_id,works);grant_rounds rounds(get_self(),runtime.value);check(rounds.find(round_id)==rounds.end(),"ROUND_EXISTS");
  rounds.emplace(get_self(),[&](auto& r){r.id=round_id;r.dao_id=dao_id;r.creator=member_id;r.document_id=document_id;r.document_version=document_version;r.applications_close=applications_close;r.review_close=review_close;r.awards_close=awards_close;r.maximum=maximum;r.allow_agents=allow_agents;r.works=works;});sync_round(runtime,rounds.get(round_id));
 }
 ACTION applygrant(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t round_id,uint64_t application_id,uint64_t document_id,uint32_t document_version,std::vector<asset> payments,std::vector<uint32_t> dues,uint32_t term_start,uint32_t term_end){
  module_actor(runtime,dao_id,member_id,get_self(),"applygrant"_n);grant_rounds rounds(get_self(),runtime.value);const auto& round=rounds.get(round_id,"ROUND_UNKNOWN");open_application(runtime,dao_id,round,member_id);check(application_id>0,"APPLICATION_ID");validate_terms(runtime,dao_id,document_id,document_version,payments,dues,term_start,term_end,round);
  grant_applications apps(get_self(),runtime.value);check(apps.find(application_id)==apps.end(),"APPLICATION_EXISTS");apps.emplace(get_self(),[&](auto& r){r.id=application_id;r.dao_id=dao_id;r.round_id=round_id;r.contributor=member_id;r.document_id=document_id;r.document_version=document_version;r.payments=payments;r.dues=dues;r.term_start=term_start;r.term_end=term_end;});sync_app(runtime,apps.get(application_id));
 }
 ACTION amend(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t application_id,uint64_t document_id,uint32_t document_version,std::vector<asset> payments,std::vector<uint32_t> dues,uint32_t term_start,uint32_t term_end){
  module_actor(runtime,dao_id,member_id,get_self(),"amend"_n);grant_applications apps(get_self(),runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");check(app.dao_id==dao_id&&app.contributor==member_id,"APPLICATION_OWNER");check(app.status<4,"APPLICATION_FROZEN");grant_rounds rounds(get_self(),runtime.value);const auto& round=rounds.get(app.round_id);open_application(runtime,dao_id,round,member_id);validate_terms(runtime,dao_id,document_id,document_version,payments,dues,term_start,term_end,round);
  apps.modify(app,same_payer,[&](auto& r){r.revision=add64(r.revision,1);r.document_id=document_id;r.document_version=document_version;r.payments=payments;r.dues=dues;r.term_start=term_start;r.term_end=term_end;r.status=0;r.consent_at=0;r.decision_doc=0;r.decision_version=0;});sync_app(runtime,apps.get(application_id));
 }
 ACTION submitapp(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t application_id){
  module_actor(runtime,dao_id,member_id,get_self(),"submitapp"_n);grant_applications apps(get_self(),runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");check(app.dao_id==dao_id&&app.contributor==member_id,"APPLICATION_OWNER");check(app.status==0,"APPLICATION_STATE");grant_rounds rounds(get_self(),runtime.value);open_application(runtime,dao_id,rounds.get(app.round_id),member_id);apps.modify(app,same_payer,[](auto& r){r.status=1;r.consent_at=current_time_point().sec_since_epoch();});
 }
 ACTION reviewapp(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t application_id,bool eligible,uint64_t document_id,uint32_t document_version){
  module_actor(runtime,dao_id,member_id,get_self(),"reviewapp"_n,true);grant_applications apps(get_self(),runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");check(app.dao_id==dao_id,"GRANT_DOMAIN");check(app.status==1||app.status==2||app.status==3,"APPLICATION_STATE");grant_rounds rounds(get_self(),runtime.value);const auto& round=rounds.get(app.round_id);check(!round.closed&&current_time_point().sec_since_epoch()<round.review_close,"REVIEW_CLOSED");check_doc(runtime,dao_id,document_id,document_version);if(eligible)check(grant_participant(runtime,dao_id,app.contributor,round.allow_agents),"PARTICIPANT_INELIGIBLE");apps.modify(app,same_payer,[&](auto& r){r.status=eligible?2:3;r.decision_doc=document_id;r.decision_version=document_version;});sync_app(runtime,apps.get(application_id));
 }
 ACTION closeapp(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t application_id){
  const auto actor=module_actor(runtime,dao_id,member_id,get_self(),"closeapp"_n);grant_applications apps(get_self(),runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");check(app.dao_id==dao_id&&(app.contributor==member_id||actor.admin),"APPLICATION_OWNER");check(app.status<4,"APPLICATION_FROZEN");apps.modify(app,same_payer,[](auto& r){r.status=5;});
 }
 ACTION closeround(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t round_id){
  module_actor(runtime,dao_id,member_id,get_self(),"closeround"_n,true);grant_rounds rounds(get_self(),runtime.value);const auto& round=rounds.get(round_id,"ROUND_UNKNOWN");check(round.dao_id==dao_id,"GRANT_DOMAIN");check(!round.closed,"ROUND_CLOSED");rounds.modify(round,same_payer,[](auto& r){r.closed=true;});
 }
 ACTION govaward(name runtime,uint64_t dao_id,uint64_t round_id,uint64_t application_id,uint64_t ballot_id){
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(get_sender()==policy.config.decide,"EXECUTOR_SENDER");require_auth(policy.config.decide);check(!dao_paused(runtime,dao_id),"DAO_PAUSED");pinned_module(runtime,dao_id,get_self());pinned_module(runtime,dao_id,policy.config.decide);
  grant_executions plans(policy.config.decide,runtime.value);const auto& plan=plans.get(ballot_id,"EXECUTION_UNKNOWN");check(plan.executed&&plan.dao_id==dao_id&&plan.grants==get_self()&&plan.round_id==round_id&&plan.application_id==application_id,"EXECUTION_DOMAIN");check(plan.policy_revision==policy.revision&&plan.grants_hash==get_code_hash(get_self()),"POLICY_CHANGED");check(plan.deadline>=current_time_point().sec_since_epoch(),"EXECUTION_EXPIRED");check(plan.commitment==grant_commitment(runtime,dao_id,get_self(),round_id,application_id),"APPLICATION_CHANGED");
  grant_rounds rounds(get_self(),runtime.value);const auto& round=rounds.get(round_id);grant_applications apps(get_self(),runtime.value);const auto& app=apps.get(application_id);check(current_time_point().sec_since_epoch()<round.awards_close&&current_time_point().sec_since_epoch()<app.term_end,"AWARDS_CLOSED");check(plan.works==round.works&&plan.application_revision==app.revision,"EXECUTION_DOMAIN");check(grant_participant(runtime,dao_id,app.contributor,round.allow_agents),"PARTICIPANT_INELIGIBLE");pinned_module(runtime,dao_id,round.works);check(plan.works_hash==get_code_hash(round.works),"MODULE_CODE");
  int64_t total=0;for(const auto& payment:app.payments)total=add_amount(total,payment.amount);const auto awarded=add_amount(round.awarded,total);check(awarded<=round.maximum.amount,"ROUND_CAP");rounds.modify(round,same_payer,[&](auto& r){r.awarded=awarded;});apps.modify(app,same_payer,[&](auto& r){r.status=4;r.project_id=plan.project_id;r.funding_ballot=ballot_id;});
  action(permission_level{get_self(),"active"_n},round.works,"grantwork"_n,std::make_tuple(runtime,dao_id,get_self(),round_id,application_id,ballot_id)).send();
 }
 ACTION checkmig(name runtime,uint8_t kind){require_auth(runtime);check(kind==4,"RAM_MIGRATION_SOURCE_KIND");}
 ACTION scanram(name runtime,name table,uint32_t limit){
  if(scan_ram_binding(runtime,get_self(),table,4,limit))return;
  if(table=="rounds"_n){grant_rounds(get_self(),runtime.value).backfill(limit);return;}
  if(table=="applications"_n){grant_applications(get_self(),runtime.value).backfill(limit);return;}
  check(false,"RAM_MIGRATION_TABLE");
 }

private:
 void sync_round(name runtime,const grant_round& r){document_ref(runtime,r.dao_id,get_self(),"rounds"_n,r.id,0,r.document_id,r.document_version);}
 void sync_app(name runtime,const grant_application& r){document_ref(runtime,r.dao_id,get_self(),"applications"_n,r.id,0,r.document_id,r.document_version);document_ref(runtime,r.dao_id,get_self(),"applications"_n,r.id,1,r.decision_doc,r.decision_version);}

 void check_doc(name runtime,uint64_t dao_id,uint64_t id,uint32_t version){check(id>0&&version>0,"DOCUMENT_ID");documents docs(runtime,dao_id);auto index=docs.get_index<"byversion"_n>();index.get((uint128_t(id)<<32)|version,"DOCUMENT_UNKNOWN");}
 void open_application(name runtime,uint64_t dao_id,const grant_round& round,uint64_t member){check(round.dao_id==dao_id,"GRANT_DOMAIN");check(!round.closed&&current_time_point().sec_since_epoch()<round.applications_close,"APPLICATIONS_CLOSED");check(grant_participant(runtime,dao_id,member,round.allow_agents),"PARTICIPANT_INELIGIBLE");}
 void validate_terms(name runtime,uint64_t dao_id,uint64_t doc,uint32_t version,const std::vector<asset>& payments,const std::vector<uint32_t>& dues,uint32_t start,uint32_t end,const grant_round& round){
  check_doc(runtime,dao_id,doc,version);check(!payments.empty()&&payments.size()<=16&&payments.size()==dues.size(),"MILESTONE_LIMIT");check(end>start&&uint64_t(end)-start<=31536000&&end>current_time_point().sec_since_epoch(),"AGREEMENT_TERM");int64_t total=0;for(size_t i=0;i<payments.size();i++){const auto& payment=payments[i];check(payment.is_valid()&&payment.amount>0&&payment.symbol==round.maximum.symbol,"ASSET_QUANTITY");check(dues[i]>=start&&dues[i]<=end,"AGREEMENT_DUE");total=add_amount(total,payment.amount);}check(total<=round.maximum.amount,"ROUND_CAP");
 }
};
EOSIO_DISPATCH(grants,(checkmig)(scanram)(backfillrefs)(bindrampool)(newround)(applygrant)(amend)(submitapp)(reviewapp)(closeapp)(closeround)(govaward))
