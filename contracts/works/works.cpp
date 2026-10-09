#define DACLIFY_DOCUMENT_TABLES {"projects"_n,"milestones"_n}
#define DACLIFY_RAM_PAYER_CONTRACT "works"
#include "grants_records.hpp"
using namespace daclify;
CONTRACT works:public contract {
public:
 using contract::contract;
 ACTION backfillrefs(name runtime,uint64_t dao_id,name table,uint32_t limit){
  if(table=="projects"_n)backfill_document_refs<projects>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_project(runtime,r);});
  else if(table=="milestones"_n)backfill_document_refs<milestones>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_milestone(runtime,r);});else check(false,"DOCUMENT_SOURCE_TABLE");
 }
 ACTION bindrampool(name runtime){bind_ram_pool(get_self(),runtime);}
 using projects=works_projects;
 using milestones=works_milestones;
 ACTION propose(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t project_id,uint64_t contributor,uint64_t document_id,uint32_t document_version,std::vector<asset> payments,std::vector<uint32_t> dues){
  module_actor(runtime,dao_id,member_id,get_self(),"propose"_n);create_project(runtime,dao_id,member_id,project_id,contributor,document_id,document_version,payments,dues);
 }
 ACTION checkmig(name runtime,uint8_t kind){require_auth(runtime);check(kind==2,"RAM_MIGRATION_SOURCE_KIND");}
 ACTION checkquota(name runtime,uint64_t dao_id){
  require_auth(runtime);pinned_module(runtime,dao_id,get_self());check_ram_payer_runtime(get_self(),runtime);
  projects owned(get_self(),runtime.value);auto communities=owned.get_index<"bydao"_n>();milestones rows(get_self(),runtime.value);document_references refs(runtime,dao_id);auto index=refs.get_index<"bysource"_n>();uint32_t count=0;
  for(auto project=communities.lower_bound(dao_id);project!=communities.end()&&project->dao_id==dao_id;++project){check(!project->milestones.empty()&&project->milestones.size()<=16,"MILESTONE_LIMIT");for(auto id:project->milestones){const auto it=rows.find(id);check(it!=rows.end()&&it->dao_id==dao_id&&it->project_id==project->id,"MILESTONE_DOMAIN");check(++count<=5000,"RAM_COMPLETION_SCAN_LIMIT");if(it->status<1||it->status>3)continue;
   for(uint8_t slot=0;slot<2;slot++){document_reference key{};key.source=get_self();key.table="milestones"_n;key.source_id=it->id;key.slot=slot;auto ref=index.find(key.by_source());
    check(ref!=index.end()&&ref->source==get_self()&&ref->table=="milestones"_n&&ref->source_id==it->id&&ref->slot==slot&&ref->document_id==(slot?it->review_doc:it->submission_doc)&&ref->version==(slot?it->review_version:it->submission_version),"RAM_WORK_REFS_REQUIRED");}
  }}
 }
 ACTION scanram(name runtime,name table,uint32_t limit){
  if(scan_ram_binding(runtime,get_self(),table,2,limit))return;
  if(table=="adoptwork"_n){
    auto progress=migration_cursor(runtime,get_self(),runtime.value,table,false,0,0);if(progress.complete)return;
    milestones rows(get_self(),runtime.value);auto it=progress.advanced?rows.upper_bound(progress.cursor):rows.begin();uint32_t count=0;
    for(;it!=rows.end()&&count<limit;++it,++count){if(it->status>=1&&it->status<=3){check_completion_adoption(runtime,it->dao_id);pinned_module(runtime,it->dao_id,get_self());sync_milestone(runtime,*it);}progress.cursor=it->id;progress.advanced=true;}
    progress.complete=it==rows.end();ram_migration_cursors cursors(get_self(),runtime.value);cursors.modify(cursors.get(table.value),same_payer,[&](auto& r){r=progress;});return;
  }
  if(table=="projects"_n){works_projects(get_self(),runtime.value).backfill(limit);return;}
  if(table=="milestones"_n){works_milestones(get_self(),runtime.value).backfill(limit);return;}
  if(table=="agreements"_n){works_agreements(get_self(),runtime.value).backfill(limit);return;}
  check(false,"RAM_MIGRATION_TABLE");
 }

private:
 void sync_project(name runtime,const project_record& r){document_ref(runtime,r.dao_id,get_self(),"projects"_n,r.id,0,r.document_id,r.document_version);}
 void sync_milestone(name runtime,const milestone_record& r){document_ref(runtime,r.dao_id,get_self(),"milestones"_n,r.id,0,r.submission_doc,r.submission_version);document_ref(runtime,r.dao_id,get_self(),"milestones"_n,r.id,1,r.review_doc,r.review_version);}

 void create_project(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t project_id,uint64_t contributor,uint64_t document_id,uint32_t document_version,const std::vector<asset>& payments,const std::vector<uint32_t>& dues){
  check(project_id>0,"PROJECT_ID");check(payments.size()>0&&payments.size()<=16&&dues.size()==payments.size(),"MILESTONE_LIMIT");check_document(runtime,dao_id,document_id,document_version);members people(runtime,dao_id);check(people.get(contributor,"MEMBER_UNKNOWN").active,"MEMBER_INACTIVE");daos communities(runtime,runtime.value);const auto& d=communities.get(dao_id);int64_t total=0;
  for(const auto& payment:payments){check(payment.is_valid()&&payment.amount>0&&payment.symbol==d.token_symbol,"ASSET_QUANTITY");total=add_amount(total,payment.amount);}projects rows(get_self(),runtime.value);check(rows.find(project_id)==rows.end(),"PROJECT_EXISTS");milestones items(get_self(),runtime.value);std::vector<uint64_t> ids;
  for(size_t i=0;i<payments.size();i++){auto id=items.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"MILESTONE_LIMIT");ids.push_back(id);items.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.project_id=project_id;r.quantity=payments[i];r.due=dues[i];});}
  rows.emplace(get_self(),[&](auto& r){r.id=project_id;r.dao_id=dao_id;r.creator=member_id;r.contributor=contributor;r.document_id=document_id;r.document_version=document_version;r.milestones=ids;});sync_project(runtime,rows.get(project_id));
 }
public:
 ACTION accept(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t project_id){
  module_actor(runtime,dao_id,member_id,get_self(),"accept"_n,true);gov_policies policies(runtime,runtime.value);auto policy=policies.find(dao_id);check(policy==policies.end()||!policy->config.governed_works,"GOVERNANCE_REQUIRED");accept_project(runtime,dao_id,project_id);
 }
 ACTION offeragr(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t project_id,uint32_t term_start,uint32_t term_end){
  const auto actor=module_actor(runtime,dao_id,member_id,get_self(),"offeragr"_n);projects rows(get_self(),runtime.value);const auto& project=rows.get(project_id,"PROJECT_UNKNOWN");check(project.dao_id==dao_id,"PROJECT_DOMAIN");check(project.status==0,"PROJECT_NOT_PROPOSED");check(actor.admin||project.creator==member_id,"PROJECT_PERMISSION");
  works_agreements agreements(get_self(),runtime.value);check(agreements.find(project_id)==agreements.end(),"AGREEMENT_EXISTS");check(term_end>term_start&&uint64_t(term_end)-term_start<=31536000&&term_end>current_time_point().sec_since_epoch(),"AGREEMENT_TERM");
  milestones items(get_self(),runtime.value);for(auto id:project.milestones){const auto& item=items.get(id);check(item.due>=term_start&&item.due<=term_end,"AGREEMENT_DUE");}
  const auto terms=agreement_commitment(runtime,dao_id,get_self(),project_id,term_start,term_end);agreements.emplace(get_self(),[&](auto& r){r.project_id=project_id;r.dao_id=dao_id;r.term_start=term_start;r.term_end=term_end;r.terms=terms;});
 }
 ACTION acceptagr(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t project_id){
  module_actor(runtime,dao_id,member_id,get_self(),"acceptagr"_n);projects rows(get_self(),runtime.value);const auto& project=rows.get(project_id,"PROJECT_UNKNOWN");check(project.dao_id==dao_id,"PROJECT_DOMAIN");check(project.status==0,"PROJECT_NOT_PROPOSED");check(project.contributor==member_id,"CONTRIBUTOR_REQUIRED");works_agreements agreements(get_self(),runtime.value);const auto& agreement=agreements.get(project_id,"AGREEMENT_UNKNOWN");check(agreement.dao_id==dao_id,"PROJECT_DOMAIN");check(!agreement.accepted,"AGREEMENT_ACCEPTED");check(current_time_point().sec_since_epoch()<agreement.term_end,"AGREEMENT_EXPIRED");check(agreement.terms==agreement_commitment(runtime,dao_id,get_self(),project_id,agreement.term_start,agreement.term_end),"AGREEMENT_CHANGED");
  agreements.modify(agreement,same_payer,[](auto& r){r.accepted=true;r.accepted_at=current_time_point().sec_since_epoch();});
 }
 ACTION govaccept(name runtime,uint64_t dao_id,uint64_t project_id,uint64_t ballot_id){
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.governed_works,"GOVERNANCE_REQUIRED");
  check(get_sender()==policy.config.decide,"EXECUTOR_SENDER");require_auth(policy.config.decide);pinned_module(runtime,dao_id,policy.config.decide);pinned_module(runtime,dao_id,get_self());
  work_executions plans(policy.config.decide,runtime.value);const auto& plan=plans.get(ballot_id,"EXECUTION_UNKNOWN");
  check(plan.dao_id==dao_id&&plan.works==get_self()&&plan.project_id==project_id&&plan.executed,"EXECUTION_DOMAIN");check(plan.policy_revision==policy.revision,"POLICY_CHANGED");
  check(plan.deadline>=current_time_point().sec_since_epoch(),"EXECUTION_EXPIRED");check(plan.works_hash==get_code_hash(get_self()),"MODULE_CODE");check(plan.commitment==work_commitment(runtime,dao_id,get_self(),project_id),"PROJECT_CHANGED");
  accept_project(runtime,dao_id,project_id);
 }
 ACTION grantwork(name runtime,uint64_t dao_id,name grants,uint64_t round_id,uint64_t application_id,uint64_t ballot_id){
  check(get_sender()==grants,"EXECUTOR_SENDER");require_auth(grants);pinned_module(runtime,dao_id,grants);pinned_module(runtime,dao_id,get_self());modules installed(runtime,dao_id);const auto& grant=installed.get(grants.value);check(std::find(grant.grants.begin(),grant.grants.end(),"awardwork"_n)!=grant.grants.end(),"MODULE_GRANT");
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");pinned_module(runtime,dao_id,policy.config.decide);grant_executions plans(policy.config.decide,runtime.value);const auto& plan=plans.get(ballot_id,"EXECUTION_UNKNOWN");check(plan.executed&&plan.dao_id==dao_id&&plan.grants==grants&&plan.works==get_self()&&plan.round_id==round_id&&plan.application_id==application_id,"EXECUTION_DOMAIN");check(plan.policy_revision==policy.revision,"POLICY_CHANGED");check(plan.grants_hash==get_code_hash(grants)&&plan.works_hash==get_code_hash(get_self()),"MODULE_CODE");check(current_time_point().sec_since_epoch()<plan.deadline,"AWARDS_CLOSED");
  grant_rounds rounds(grants,runtime.value);const auto& round=rounds.get(round_id);grant_applications apps(grants,runtime.value);const auto& app=apps.get(application_id);check(round.dao_id==dao_id&&round.works==get_self()&&app.dao_id==dao_id&&app.round_id==round_id&&app.status==4&&app.project_id==plan.project_id&&app.funding_ballot==ballot_id&&app.revision==plan.application_revision,"EXECUTION_DOMAIN");check(grant_participant(runtime,dao_id,app.contributor,round.allow_agents),"PARTICIPANT_INELIGIBLE");check(plan.commitment==grant_commitment(runtime,dao_id,grants,round_id,application_id),"APPLICATION_CHANGED");
  create_project(runtime,dao_id,app.contributor,plan.project_id,app.contributor,app.document_id,app.document_version,app.payments,app.dues);works_agreements agreements(get_self(),runtime.value);const auto terms=agreement_commitment(runtime,dao_id,get_self(),plan.project_id,app.term_start,app.term_end);agreements.emplace(get_self(),[&](auto& r){r.project_id=plan.project_id;r.dao_id=dao_id;r.term_start=app.term_start;r.term_end=app.term_end;r.terms=terms;r.accepted=true;r.accepted_at=app.consent_at;});accept_project(runtime,dao_id,plan.project_id);
 }
private:
 void accept_project(name runtime,uint64_t dao_id,uint64_t project_id){
  check(!dao_paused(runtime,dao_id),"DAO_PAUSED");projects rows(get_self(),runtime.value);const auto& p=rows.get(project_id,"PROJECT_UNKNOWN");check(p.dao_id==dao_id,"PROJECT_DOMAIN");check(p.status==0,"PROJECT_NOT_PROPOSED");members people(runtime,dao_id);check(people.get(p.contributor).active,"MEMBER_INACTIVE");milestones items(get_self(),runtime.value);
  works_agreements agreements(get_self(),runtime.value);auto agreement=agreements.find(project_id);if(agreement!=agreements.end()){check(current_time_point().sec_since_epoch()<agreement->term_end,"AGREEMENT_EXPIRED");work_commitment(runtime,dao_id,get_self(),project_id);}
  for(auto id:p.milestones){const auto& m=items.get(id);check(m.status==0,"MILESTONE_STATE");sync_milestone(runtime,m);core_action(runtime,get_self(),"reserve"_n,pack(std::make_tuple(dao_id,get_self(),id,p.contributor,m.quantity,m.due)));items.modify(m,same_payer,[](auto& r){r.status=1;});}rows.modify(p,same_payer,[](auto& r){r.status=1;});
 }
public:
 ACTION submitwork(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t milestone_id,uint64_t document_id,uint32_t document_version){
  module_actor(runtime,dao_id,member_id,get_self(),"submitwork"_n);milestones items(get_self(),runtime.value);const auto& m=items.get(milestone_id,"MILESTONE_UNKNOWN");check(m.dao_id==dao_id,"MILESTONE_DOMAIN");projects rows(get_self(),runtime.value);const auto& p=rows.get(m.project_id);check(p.contributor==member_id,"CONTRIBUTOR_REQUIRED");check(p.status==1&&(m.status==1||m.status==3),"MILESTONE_STATE");check_document(runtime,dao_id,document_id,document_version);items.modify(m,same_payer,[&](auto& r){r.status=2;r.submission_doc=document_id;r.submission_version=document_version;});sync_milestone(runtime,items.get(milestone_id));
 }
 ACTION review(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t milestone_id,bool approve,uint64_t document_id,uint32_t document_version){
  module_actor(runtime,dao_id,member_id,get_self(),"review"_n,false,true);milestones items(get_self(),runtime.value);const auto& m=items.get(milestone_id,"MILESTONE_UNKNOWN");check(m.dao_id==dao_id,"MILESTONE_DOMAIN");projects rows(get_self(),runtime.value);const auto& p=rows.get(m.project_id);check(member_id!=p.contributor,"SELF_REVIEW");check(p.status==1&&m.status==2,"MILESTONE_STATE");check_document(runtime,dao_id,document_id,document_version);
  items.modify(m,same_payer,[&](auto& r){r.status=approve?4:3;r.review_doc=document_id;r.review_version=document_version;r.reviewer=member_id;});sync_milestone(runtime,items.get(milestone_id));if(approve)core_action(runtime,get_self(),"approveob"_n,pack(std::make_tuple(dao_id,get_self(),milestone_id)));
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
EOSIO_DISPATCH(works,(checkquota)(checkmig)(scanram)(backfillrefs)(bindrampool)(propose)(accept)(govaccept)(offeragr)(acceptagr)(submitwork)(review)(cancel)(settle)(grantwork))
