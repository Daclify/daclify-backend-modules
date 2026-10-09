#define DACLIFY_DOCUMENT_TABLES {"elections"_n,"terms"_n}
#define DACLIFY_RAM_PAYER_CONTRACT "decide"
#include "grants_records.hpp"
#include "admission.hpp"
#include "executives.hpp"
#include "archive_state.hpp"
using namespace daclify;
CONTRACT decide:public contract {
public:
 using contract::contract;
 ACTION bindrampool(name runtime){bind_ram_pool(get_self(),runtime);}
 TABLE ballot_record {
  uint64_t id;uint64_t dao_id;uint64_t creator;uint8_t kind;uint8_t choices;uint32_t closes;uint16_t quorum;uint16_t approval;uint64_t denominator;uint64_t max_member;uint64_t cast=0;std::vector<uint64_t> tallies;uint8_t status=0;int16_t winner=-1;std::string metadata;
  uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}
  EOSLIB_SERIALIZE(ballot_record,(id)(dao_id)(creator)(kind)(choices)(closes)(quorum)(approval)(denominator)(max_member)(cast)(tallies)(status)(winner)(metadata))
 };
 using ballots=ram_table<"ballots"_n,ballot_record,indexed_by<"bydao"_n,const_mem_fun<ballot_record,uint64_t,&ballot_record::by_dao>>>;
 TABLE vote_record {uint64_t id;uint64_t ballot;uint64_t member;uint64_t weight;uint8_t choice;uint64_t ram_owner(name code,uint64_t scope)const{return ballots(code,scope).get(ballot,"BALLOT_UNKNOWN").dao_id;}uint64_t primary_key()const{return id;}uint128_t by_member()const{return (uint128_t(ballot)<<64)|member;}EOSLIB_SERIALIZE(vote_record,(id)(ballot)(member)(weight)(choice))};
 using votes=ram_table<"votes"_n,vote_record,indexed_by<"bymember"_n,const_mem_fun<vote_record,uint128_t,&vote_record::by_member>>>;
 TABLE poll_end {
  uint64_t ballot_id,dao_id;uint32_t completed_at=0;bool legacy=false;
  uint64_t primary_key()const{return ballot_id;}
  EOSLIB_SERIALIZE(poll_end,(ballot_id)(dao_id)(completed_at)(legacy))
 };
 using poll_ends=ram_table<"pollends"_n,poll_end>;
 TABLE vote_identity {
  uint64_t id=0,dao_id=0,high_water=0;
  uint64_t primary_key()const{return id;}
  EOSLIB_SERIALIZE(vote_identity,(id)(dao_id)(high_water))
 };
 using vote_identities=ram_table<"voteids"_n,vote_identity>;
 TABLE election_record {
  uint64_t id;uint64_t dao_id;uint64_t creator;std::string title;uint64_t document_id;uint32_t document_version;checksum256 document_commitment;uint64_t policy_revision;uint32_t nomination_close;uint32_t term_start;uint32_t term_end;uint8_t seats;uint8_t status=0;std::vector<uint64_t> candidates;
  uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}
  EOSLIB_SERIALIZE(election_record,(id)(dao_id)(creator)(title)(document_id)(document_version)(document_commitment)(policy_revision)(nomination_close)(term_start)(term_end)(seats)(status)(candidates))
 };
 using elections=ram_table<"elections"_n,election_record,indexed_by<"bydao"_n,const_mem_fun<election_record,uint64_t,&election_record::by_dao>>>;
 TABLE nomination_record {
  uint64_t id;uint64_t dao_id;uint64_t election_id;uint64_t member_id;
  uint64_t primary_key()const{return id;}uint64_t by_election()const{return election_id;}uint128_t by_member()const{return(uint128_t(election_id)<<64)|member_id;}
  EOSLIB_SERIALIZE(nomination_record,(id)(dao_id)(election_id)(member_id))
 };
 using nominations=ram_table<"nominations"_n,nomination_record,indexed_by<"bymember"_n,const_mem_fun<nomination_record,uint128_t,&nomination_record::by_member>>,indexed_by<"byelection"_n,const_mem_fun<nomination_record,uint64_t,&nomination_record::by_election>>>;
 TABLE term_record {
  uint64_t id;uint64_t dao_id;uint64_t election_id;uint64_t member_id;std::string title;uint32_t starts;uint32_t ends;bool recalled=false;uint32_t recalled_at=0;uint64_t recall_doc=0;uint32_t recall_version=0;
  uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}
  EOSLIB_SERIALIZE(term_record,(id)(dao_id)(election_id)(member_id)(title)(starts)(ends)(recalled)(recalled_at)(recall_doc)(recall_version))
 };
 using term_index=indexed_by<"bydao"_n,const_mem_fun<term_record,uint64_t,&term_record::by_dao>>;
 using terms=ram_table<"terms"_n,term_record,term_index>;
 TABLE term_hold {
  uint64_t id,dao_id;std::vector<char> padding;
  uint64_t primary_key()const{return id;}
  EOSLIB_SERIALIZE(term_hold,(id)(dao_id)(padding))
 };
 using term_holds=ram_table<"termholds"_n,term_hold>;
 ACTION backfillrefs(name runtime,uint64_t dao_id,name table,uint32_t limit){
  if(table=="elections"_n)backfill_document_refs<elections>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_election(runtime,r);});
  else if(table=="terms"_n)backfill_document_refs<terms>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_term(runtime,r);});else check(false,"DOCUMENT_SOURCE_TABLE");
 }
 ACTION newelect(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t election_id,std::string title,uint64_t document_id,uint32_t document_version,uint32_t nomination_close,uint32_t term_start,uint32_t term_end,uint8_t seats){
  module_actor(runtime,dao_id,member_id,get_self(),"newelect"_n,true);check(election_id>0&&!title.empty()&&title.size()<=80,"ELECTION_TITLE");for(unsigned char c:title)check(c>=0x20,"ELECTION_TITLE");check(seats>=1&&seats<=8,"ELECTION_SEATS");
  if(title=="Executives"){executive_policies policy(runtime,runtime.value);check(policy.find(dao_id)!=policy.end(),"EXECUTIVE_POLICY_UNKNOWN");modules installed(runtime,dao_id);const auto& grant=installed.get(get_self().value);check(std::find(grant.grants.begin(),grant.grants.end(),"electexec"_n)!=grant.grants.end(),"MODULE_GRANT");}
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.decide==get_self(),"POLICY_DECIDE");const auto now=current_time_point().sec_since_epoch();check(nomination_close>now&&uint64_t(nomination_close)<=uint64_t(now)+2592000&&uint64_t(term_start)>uint64_t(nomination_close)+policy.config.duration&&term_end>term_start&&uint64_t(term_end)-term_start<=31536000,"ELECTION_TERM");
  documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();const auto& document=versions.get((uint128_t(document_id)<<32)|document_version,"DOCUMENT_UNKNOWN");elections rows(get_self(),runtime.value);ballots existing(get_self(),runtime.value);check(rows.find(election_id)==rows.end()&&existing.find(election_id)==existing.end(),"BALLOT_EXISTS");rows.emplace(get_self(),[&](auto& r){r.id=election_id;r.dao_id=dao_id;r.creator=member_id;r.title=title;r.document_id=document_id;r.document_version=document_version;r.document_commitment=document.commitment;r.policy_revision=policy.revision;r.nomination_close=nomination_close;r.term_start=term_start;r.term_end=term_end;r.seats=seats;});sync_election(runtime,rows.get(election_id));
 }
 ACTION nominate(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t election_id,bool active){
  module_actor(runtime,dao_id,member_id,get_self(),"nominate"_n);elections rows(get_self(),runtime.value);const auto& election=rows.get(election_id,"ELECTION_UNKNOWN");check(election.dao_id==dao_id,"ELECTION_DOMAIN");check(election.status==0&&current_time_point().sec_since_epoch()<election.nomination_close,"NOMINATIONS_CLOSED");nominations nominees(get_self(),runtime.value);auto index=nominees.get_index<"bymember"_n>();auto found=index.find((uint128_t(election_id)<<64)|member_id);
  if(!active){check(found!=index.end(),"NOMINATION_UNKNOWN");index.erase(found);return;}check(found==index.end(),"ALREADY_IN_STATE");check(eligible_witness(runtime,dao_id,member_id,true),"PARTICIPANT_INELIGIBLE");
  auto group=nominees.get_index<"byelection"_n>();uint32_t count=0;for(auto it=group.lower_bound(election_id);it!=group.end()&&it->election_id==election_id;){if(!eligible_witness(runtime,dao_id,it->member_id,true))it=group.erase(it);else{++count;++it;}}check(count<15,"CANDIDATE_LIMIT");auto id=nominees.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"CANDIDATE_LIMIT");nominees.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.election_id=election_id;r.member_id=member_id;});
 }
 ACTION startelect(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t election_id){
  module_actor(runtime,dao_id,member_id,get_self(),"startelect"_n);elections rows(get_self(),runtime.value);const auto& election=rows.get(election_id,"ELECTION_UNKNOWN");check(election.dao_id==dao_id,"ELECTION_DOMAIN");check(election.status==0&&current_time_point().sec_since_epoch()>=election.nomination_close,"NOMINATIONS_OPEN");gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.revision==election.policy_revision&&policy.config.decide==get_self(),"POLICY_CHANGED");check(uint64_t(current_time_point().sec_since_epoch())+policy.config.duration<=election.term_start,"ELECTION_TERM");nominations nominees(get_self(),runtime.value);auto group=nominees.get_index<"byelection"_n>();std::vector<uint64_t> candidates;for(auto it=group.lower_bound(election_id);it!=group.end()&&it->election_id==election_id;++it)if(eligible_witness(runtime,dao_id,it->member_id,true))candidates.push_back(it->member_id);check(!candidates.empty()&&candidates.size()<=15,"CANDIDATE_LIMIT");std::sort(candidates.begin(),candidates.end());
  start(runtime,dao_id,member_id,election_id,policy.config.kind,candidates.size()+1,policy.config.duration,policy.config.quorum,policy.config.approval,"{}","startelect"_n);rows.modify(election,same_payer,[&](auto& r){r.status=1;r.candidates=candidates;});
 }
 ACTION recall(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t term_id,uint64_t document_id,uint32_t document_version){
  module_actor(runtime,dao_id,member_id,get_self(),"recall"_n,true);terms rows(get_self(),runtime.value);const auto& term=rows.get(term_id,"TERM_UNKNOWN");check(term.dao_id==dao_id,"ELECTION_DOMAIN");check(!term.recalled,"ALREADY_IN_STATE");documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();versions.get((uint128_t(document_id)<<32)|document_version,"DOCUMENT_UNKNOWN");rows.modify(term,same_payer,[&](auto& r){r.recalled=true;r.recalled_at=current_time_point().sec_since_epoch();r.recall_doc=document_id;r.recall_version=document_version;});sync_term(runtime,rows.get(term_id));if(term.title=="Executives"){executive_policies policies(runtime,runtime.value);if(policies.find(dao_id)!=policies.end())core_action(runtime,get_self(),"recallexec"_n,pack(std::make_tuple(get_self(),dao_id,term.election_id,term.member_id)));}
 }
 ACTION open(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t kind,uint8_t choices,uint32_t duration,uint16_t quorum,uint16_t approval,std::string metadata){
  start(runtime,dao_id,member_id,ballot_id,kind,choices,duration,quorum,approval,metadata,"open"_n);
 }
 ACTION openwork(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,name works,uint64_t project_id,uint32_t duration,uint16_t quorum,uint16_t approval,std::string metadata){
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.governed_works,"GOVERNANCE_REQUIRED");
  pinned_module(runtime,dao_id,works);modules installed(runtime,dao_id);const auto& grant=installed.get(works.value);
  const auto commitment=work_commitment(runtime,dao_id,works,project_id);
  start(runtime,dao_id,member_id,ballot_id,policy.config.kind,2,duration,quorum,approval,metadata,"openwork"_n);
  auto deadline=uint64_t(current_time_point().sec_since_epoch())+duration+604800;check(deadline<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");
  work_executions plans(get_self(),runtime.value);check(plans.find(ballot_id)==plans.end(),"EXECUTION_EXISTS");
  plans.emplace(get_self(),[&](auto& r){r.ballot_id=ballot_id;r.dao_id=dao_id;r.works=works;r.project_id=project_id;r.commitment=commitment;r.works_hash=grant.code_hash;r.policy_revision=policy.revision;r.deadline=deadline;});
 }
 ACTION execute(name runtime,uint64_t dao_id,uint64_t ballot_id){
  ballots rows(get_self(),runtime.value);const auto& ballot=rows.get(ballot_id,"BALLOT_UNKNOWN");check(ballot.dao_id==dao_id,"BALLOT_DOMAIN");check(ballot.status==1,"BALLOT_NOT_PASSED");
  work_executions plans(get_self(),runtime.value);const auto& plan=plans.get(ballot_id,"EXECUTION_UNKNOWN");check(plan.dao_id==dao_id,"EXECUTION_DOMAIN");check(!plan.executed,"ALREADY_EXECUTED");check(plan.deadline>=current_time_point().sec_since_epoch(),"EXECUTION_EXPIRED");
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.decide==get_self()&&policy.config.governed_works&&policy.revision==plan.policy_revision,"POLICY_CHANGED");
  check(!dao_paused(runtime,dao_id),"DAO_PAUSED");pinned_module(runtime,dao_id,get_self());pinned_module(runtime,dao_id,plan.works);check(plan.works_hash==get_code_hash(plan.works),"MODULE_CODE");
  check(plan.commitment==work_commitment(runtime,dao_id,plan.works,plan.project_id),"PROJECT_CHANGED");
  plans.modify(plan,same_payer,[](auto& r){r.executed=true;});
  action(permission_level{get_self(),"active"_n},plan.works,"govaccept"_n,std::make_tuple(runtime,dao_id,plan.project_id,ballot_id)).send();
 }
 ACTION openaward(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,name grants,uint64_t round_id,uint64_t application_id,uint64_t project_id,uint32_t duration,uint16_t quorum,uint16_t approval,std::string metadata){
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.decide==get_self(),"POLICY_DECIDE");check(project_id>0,"PROJECT_ID");pinned_module(runtime,dao_id,grants);
  grant_rounds rounds(grants,runtime.value);const auto& round=rounds.get(round_id,"ROUND_UNKNOWN");grant_applications apps(grants,runtime.value);const auto& app=apps.get(application_id,"APPLICATION_UNKNOWN");check(round.dao_id==dao_id&&app.dao_id==dao_id&&app.round_id==round_id,"GRANT_DOMAIN");check(app.status==2,"APPLICATION_NOT_ELIGIBLE");check(grant_participant(runtime,dao_id,app.contributor,round.allow_agents),"PARTICIPANT_INELIGIBLE");
  pinned_module(runtime,dao_id,round.works);const auto commitment=grant_commitment(runtime,dao_id,grants,round_id,application_id);check(uint64_t(current_time_point().sec_since_epoch())+duration<round.awards_close,"AWARDS_CLOSED");
  start(runtime,dao_id,member_id,ballot_id,policy.config.kind,2,duration,quorum,approval,metadata,"openaward"_n);
  grant_executions plans(get_self(),runtime.value);check(plans.find(ballot_id)==plans.end(),"EXECUTION_EXISTS");plans.emplace(get_self(),[&](auto& r){r.ballot_id=ballot_id;r.dao_id=dao_id;r.grants=grants;r.works=round.works;r.round_id=round_id;r.application_id=application_id;r.application_revision=app.revision;r.project_id=project_id;r.commitment=commitment;r.grants_hash=get_code_hash(grants);r.works_hash=get_code_hash(round.works);r.policy_revision=policy.revision;r.deadline=round.awards_close;});
 }
 ACTION executeaward(name runtime,uint64_t dao_id,uint64_t ballot_id){
  ballots rows(get_self(),runtime.value);const auto& ballot=rows.get(ballot_id,"BALLOT_UNKNOWN");check(ballot.dao_id==dao_id,"BALLOT_DOMAIN");check(ballot.status==1,"BALLOT_NOT_PASSED");grant_executions plans(get_self(),runtime.value);const auto& plan=plans.get(ballot_id,"EXECUTION_UNKNOWN");check(plan.dao_id==dao_id,"EXECUTION_DOMAIN");check(!plan.executed,"ALREADY_EXECUTED");check(current_time_point().sec_since_epoch()<plan.deadline,"AWARDS_CLOSED");
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.decide==get_self()&&policy.revision==plan.policy_revision,"POLICY_CHANGED");check(!dao_paused(runtime,dao_id),"DAO_PAUSED");pinned_module(runtime,dao_id,get_self());pinned_module(runtime,dao_id,plan.grants);pinned_module(runtime,dao_id,plan.works);check(plan.grants_hash==get_code_hash(plan.grants)&&plan.works_hash==get_code_hash(plan.works),"MODULE_CODE");
  grant_applications apps(plan.grants,runtime.value);check(apps.get(plan.application_id).status==2,"APPLICATION_NOT_ELIGIBLE");check(plan.commitment==grant_commitment(runtime,dao_id,plan.grants,plan.round_id,plan.application_id),"APPLICATION_CHANGED");plans.modify(plan,same_payer,[](auto& r){r.executed=true;});action(permission_level{get_self(),"active"_n},plan.grants,"govaward"_n,std::make_tuple(runtime,dao_id,plan.round_id,plan.application_id,ballot_id)).send();
 }
 ACTION checkquota(name runtime,uint64_t dao_id){
  require_auth(runtime);pinned_module(runtime,dao_id,get_self());check_ram_payer_runtime(get_self(),runtime);
  elections rows(get_self(),runtime.value);auto owned=rows.get_index<"bydao"_n>();term_holds holds(get_self(),runtime.value);uint32_t count=0;
  for(auto it=owned.lower_bound(dao_id);it!=owned.end()&&it->dao_id==dao_id;++it){check(++count<=5000,"RAM_COMPLETION_SCAN_LIMIT");if(it->status!=1)continue;
   term_record sample{};sample.title=it->title;const auto bytes=ram_row_bytes<term_record,term_index>(sample)*it->seats+ram_scope_bytes<term_index>();auto held=holds.find(it->id);
   check(held!=holds.end()&&held->dao_id==dao_id&&held->padding.size()>=bytes,"RAM_ELECTION_HOLD_REQUIRED");}
  ballots polls(get_self(),runtime.value);auto ballots_by_dao=polls.get_index<"bydao"_n>();poll_ends ends(get_self(),runtime.value);count=0;
  for(auto it=ballots_by_dao.lower_bound(dao_id);it!=ballots_by_dao.end()&&it->dao_id==dao_id;++it){check(++count<=5000,"RAM_COMPLETION_SCAN_LIMIT");if(it->status==0&&ordinary(runtime,it->id)){auto end=ends.find(it->id);check(end!=ends.end()&&end->dao_id==dao_id,"RAM_POLL_END_REQUIRED");}}
 }
 ACTION checkmig(name runtime,uint8_t kind){require_auth(runtime);check(kind==1,"RAM_MIGRATION_SOURCE_KIND");
  ballots polls(get_self(),runtime.value);auto pending=[&](uint64_t id,uint64_t dao_id){const auto& poll=polls.get(id,"BALLOT_UNKNOWN");check(poll.dao_id==dao_id,"BALLOT_DOMAIN");return poll.status!=2;};
  uint32_t count=0;const auto now=current_time_point().sec_since_epoch();work_executions work(get_self(),runtime.value);
  for(const auto& plan:work){check(++count<=5000,"RAM_POOL_SCAN_LIMIT");if(!plan.executed&&plan.deadline>=now&&pending(plan.ballot_id,plan.dao_id))check(plan.works_hash==get_code_hash(plan.works),"RAM_MIGRATION_PENDING_WORK");}
  count=0;grant_executions grants(get_self(),runtime.value);
  for(const auto& plan:grants){check(++count<=5000,"RAM_POOL_SCAN_LIMIT");if(!plan.executed&&plan.deadline>=now&&pending(plan.ballot_id,plan.dao_id))check(plan.works_hash==get_code_hash(plan.works)&&plan.grants_hash==get_code_hash(plan.grants),"RAM_MIGRATION_PENDING_WORK");}
 }
 ACTION scanram(name runtime,name table,uint32_t limit){
  if(scan_ram_binding(runtime,get_self(),table,1,limit))return;
  if(table=="adoptelect"_n||table=="adoptpolls"_n){
    auto progress=migration_cursor(runtime,get_self(),runtime.value,table,false,0,0);if(progress.complete)return;uint32_t count=0;bool complete=false;
    if(table=="adoptelect"_n){elections rows(get_self(),runtime.value);auto it=progress.advanced?rows.upper_bound(progress.cursor):rows.begin();
      for(;it!=rows.end()&&count<limit;++it,++count){if(it->status==1){check_completion_adoption(runtime,it->dao_id);pinned_module(runtime,it->dao_id,get_self());reserve_term_hold(runtime,*it);}progress.cursor=it->id;progress.advanced=true;}complete=it==rows.end();
    }else{ballots rows(get_self(),runtime.value);auto it=progress.advanced?rows.upper_bound(progress.cursor):rows.begin();poll_ends ends(get_self(),runtime.value);
      for(;it!=rows.end()&&count<limit;++it,++count){if(ordinary(runtime,it->id)&&ends.find(it->id)==ends.end()){check_completion_adoption(runtime,it->dao_id);pinned_module(runtime,it->dao_id,get_self());ends.emplace(get_self(),[&](auto& r){r.ballot_id=it->id;r.dao_id=it->dao_id;if(it->status){r.completed_at=current_time_point().sec_since_epoch();r.legacy=true;}});}progress.cursor=it->id;progress.advanced=true;}complete=it==rows.end();
    }
    progress.complete=complete;ram_migration_cursors cursors(get_self(),runtime.value);cursors.modify(cursors.get(table.value),same_payer,[&](auto& r){r=progress;});return;
  }
  if(table=="ballots"_n){ballots(get_self(),runtime.value).backfill(limit);return;}
  if(table=="votes"_n){votes(get_self(),runtime.value).backfill(limit);return;}
  if(table=="pollends"_n){poll_ends(get_self(),runtime.value).backfill(limit);return;}
  if(table=="voteids"_n){vote_identities(get_self(),runtime.value).backfill(limit);return;}
  if(table=="elections"_n){elections(get_self(),runtime.value).backfill(limit);return;}
  if(table=="nominations"_n){nominations(get_self(),runtime.value).backfill(limit);return;}
  if(table=="terms"_n){terms(get_self(),runtime.value).backfill(limit);return;}
  if(table=="termholds"_n){term_holds(get_self(),runtime.value).backfill(limit);return;}
  if(table=="executions"_n){work_executions(get_self(),runtime.value).backfill(limit);return;}
  if(table=="grantplans"_n){grant_executions(get_self(),runtime.value).backfill(limit);return;}
  check(false,"RAM_MIGRATION_TABLE");
 }

private:
 void reserve_term_hold(name runtime,const election_record& election){
  term_record sample{};sample.title=election.title;const auto bytes=ram_row_bytes<term_record,term_index>(sample)*election.seats+ram_scope_bytes<term_index>();
  term_holds holds(get_self(),runtime.value);auto found=holds.find(election.id);if(found!=holds.end()){check(found->dao_id==election.dao_id&&found->padding.size()>=bytes,"ELECTION_DOMAIN");return;}
  holds.emplace(get_self(),[&](auto& r){r.id=election.id;r.dao_id=election.dao_id;r.padding.resize(bytes);});
 }
 void sync_election(name runtime,const election_record& r){document_ref(runtime,r.dao_id,get_self(),"elections"_n,r.id,0,r.document_id,r.document_version);}
 void sync_term(name runtime,const term_record& r){document_ref(runtime,r.dao_id,get_self(),"terms"_n,r.id,0,r.recall_doc,r.recall_version);}

 void start(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t kind,uint8_t choices,uint32_t duration,uint16_t quorum,uint16_t approval,const std::string& metadata,name action_name){
  elections elections_table(get_self(),runtime.value);if(action_name!="startelect"_n)check(elections_table.find(ballot_id)==elections_table.end(),"BALLOT_EXISTS");
  module_actor(runtime,dao_id,member_id,get_self(),action_name);check(ballot_id>0,"BALLOT_ID");check(kind<=2&&choices>=2&&choices<=16,"BALLOT_PRESET");check(duration>=60&&duration<=2592000,"BALLOT_DURATION");check(quorum>0&&quorum<=10000&&approval>=5001&&approval<=10000,"BALLOT_THRESHOLD");json_metadata(metadata);
  gov_policies policies(runtime,runtime.value);auto policy=policies.find(dao_id);
  if(policy!=policies.end()){const auto& p=policy->config;check(p.decide==get_self()&&p.kind==kind&&p.duration==duration&&p.quorum==quorum&&p.approval==approval,"BALLOT_POLICY");}
  daos communities(runtime,runtime.value);const auto& d=communities.get(dao_id);uint64_t denominator=voting_denominator(runtime,dao_id,kind);check(denominator>0,"NO_ELIGIBLE_WEIGHT");ballots rows(get_self(),runtime.value);check(rows.find(ballot_id)==rows.end(),"BALLOT_EXISTS");
  auto now=current_time_point().sec_since_epoch();check(uint64_t(now)+duration<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");uint32_t closes=now+duration;
  rows.emplace(get_self(),[&](auto& r){r.id=ballot_id;r.dao_id=dao_id;r.creator=member_id;r.kind=kind;r.choices=choices;r.closes=closes;r.quorum=quorum;r.approval=approval;r.denominator=denominator;r.max_member=d.max_member;r.tallies=std::vector<uint64_t>(choices,0);r.metadata=metadata;});
  if(action_name=="open"_n){poll_ends ends(get_self(),runtime.value);check(ends.find(ballot_id)==ends.end(),"POLL_END_EXISTS");ends.emplace(get_self(),[&](auto& r){r.ballot_id=ballot_id;r.dao_id=dao_id;});}
  if(action_name=="startelect"_n&&ram_observer_settings(runtime,runtime.value).exists())reserve_term_hold(runtime,elections_table.get(ballot_id));
  core_action(runtime,get_self(),"govlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id,closes)));
 }
 void finish_election(name runtime,uint64_t dao_id,const election_record& election,const ballot_record& ballot){
  check(election.dao_id==dao_id&&election.status==1&&election.candidates.size()+1==ballot.tallies.size(),"ELECTION_DOMAIN");bool quorum=__uint128_t(ballot.cast)*10000>=__uint128_t(ballot.denominator)*ballot.quorum;
  std::vector<std::pair<uint64_t,uint64_t>> ranking;for(size_t i=0;i<election.candidates.size();i++)ranking.push_back({ballot.tallies[i+1],election.candidates[i]});std::sort(ranking.begin(),ranking.end(),[](const auto& a,const auto& b){return a.first!=b.first?a.first>b.first:a.second<b.second;});
  term_holds holds(get_self(),runtime.value);auto held=holds.find(election.id);if(held!=holds.end()){check(held->dao_id==dao_id,"ELECTION_DOMAIN");holds.erase(held);}
  terms seats(get_self(),runtime.value);uint32_t occupied=0,issued=0;std::vector<uint64_t> elected;const auto now=current_time_point().sec_since_epoch();if(quorum&&now<election.term_end)for(size_t i=0;i<ranking.size();){size_t end=i+1;while(end<ranking.size()&&ranking[end].first==ranking[i].first)++end;if(!ranking[i].first||occupied+end-i>election.seats)break;occupied+=end-i;for(size_t j=i;j<end;j++)if(eligible_witness(runtime,dao_id,ranking[j].second,true)){auto id=seats.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"TERM_LIMIT");seats.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.election_id=election.id;r.member_id=ranking[j].second;r.title=election.title;r.starts=election.term_start;r.ends=election.term_end;});elected.push_back(ranking[j].second);++issued;}i=end;}
  if(issued&&election.title=="Executives")core_action(runtime,get_self(),"electexec"_n,pack(std::make_tuple(get_self(),dao_id,election.id,elected,election.term_start,election.term_end)));
  elections rows(get_self(),runtime.value);rows.modify(rows.get(election.id),same_payer,[](auto& r){r.status=2;});ballots votes_table(get_self(),runtime.value);votes_table.modify(votes_table.get(ballot.id),same_payer,[&](auto& r){r.status=issued?1:2;r.winner=-1;});
 }
public:
 ACTION prunevotes(name runtime,uint64_t dao_id,uint64_t archive_id,uint32_t chunk_ordinal,uint32_t start,std::vector<archive_prune_proof> proofs){
  check(action_data_size()<=16384&&proofs.size()>0&&proofs.size()<=25,"ARCHIVE_PRUNE_BOUNDS");pinned_module(runtime,dao_id,get_self());check(!dao_paused(runtime,dao_id),"DAO_PAUSED");
  const auto anchor=approved_archive(runtime,dao_id,archive_id,get_self());check(anchor.manifest.families.size()==1&&anchor.manifest.files.empty(),"ARCHIVE_FAMILY_PROTECTED");const auto& family=anchor.manifest.families.front();
  check(family.kind=="ordinary-poll-votes"&&family.table=="votes"_n&&family.scope==runtime.value&&chunk_ordinal<family.chunks.size(),"ARCHIVE_FAMILY_PROTECTED");
  const auto& chunk=family.chunks[chunk_ordinal];check(chunk.domain.runtime==runtime&&chunk.domain.dao_id==dao_id&&chunk.domain.source==get_self()&&chunk.domain.table=="votes"_n&&chunk.domain.scope==runtime.value&&chunk.domain.chunk_ordinal==chunk_ordinal,"ARCHIVE_DOMAIN");
  archive_positions positions(runtime,dao_id);const auto& progress=positions.get(archive_id*archive_anchor_max_chunks+chunk_ordinal,"ARCHIVE_PROGRESS_UNKNOWN");
  check(uint64_t(start)+proofs.size()<=chunk.domain.leaf_count,"ARCHIVE_PRUNE_BOUNDS");if(uint64_t(start)+proofs.size()<=progress.pruned)return;check(start==progress.pruned,"ARCHIVE_PROGRESS");
  ballots polls(get_self(),runtime.value);const auto& poll=polls.get(family.parent_id,"BALLOT_UNKNOWN");check(poll.dao_id==dao_id&&poll.status!=0&&ordinary(runtime,poll.id),"ARCHIVE_FAMILY_PROTECTED");
  poll_ends ends(get_self(),runtime.value);const auto& end=ends.get(poll.id,"POLL_END_UNKNOWN");check(end.dao_id==dao_id&&end.completed_at&&uint64_t(end.completed_at)+anchor.retention_seconds<=current_time_point().sec_since_epoch(),"ARCHIVE_RETENTION");
  preserve_vote_ids(runtime);votes cast(get_self(),runtime.value);uint64_t previous=0;
  for(uint32_t i=0;i<proofs.size();i++){const auto& proof=proofs[i];check(proof.primary_key>=chunk.first_key&&proof.primary_key<=chunk.last_key&&(!i||proof.primary_key>previous),"ARCHIVE_ROW_ORDER");
    auto found=cast.find(proof.primary_key);check(found!=cast.end()&&found->ballot==poll.id,"ARCHIVE_ROW_DOMAIN");check(verify_archive_proof(chunk.domain,start+i,proof.primary_key,pack(*found),proof.siblings,chunk.root),"ARCHIVE_PROOF");previous=proof.primary_key;cast.erase(found);
  }
  core_action(runtime,get_self(),"archstep"_n,pack(std::make_tuple(dao_id,get_self(),archive_id,chunk_ordinal,start,uint32_t(proofs.size()))));
 }
 ACTION markpoll(name runtime,uint64_t dao_id,uint64_t ballot_id){
  require_auth(get_self());pinned_module(runtime,dao_id,get_self());ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status!=0,"BALLOT_OPEN");check(ordinary(runtime,ballot_id),"ARCHIVE_FAMILY_PROTECTED");record_end(runtime,dao_id,ballot_id,true);
 }
 ACTION vote(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t choice){
  const auto person=module_actor(runtime,dao_id,member_id,get_self(),"vote"_n);check(can_vote(runtime,dao_id,member_id),"VOTER_INELIGIBLE");ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status==0&&current_time_point().sec_since_epoch()<b.closes,"BALLOT_CLOSED");check(member_id<=b.max_member,"SNAPSHOT_MEMBER");check(choice<b.choices,"CHOICE");
  votes cast(get_self(),runtime.value);auto index=cast.get_index<"bymember"_n>();check(index.find((uint128_t(ballot_id)<<64)|member_id)==index.end(),"ALREADY_VOTED");uint64_t weight=b.kind==0?1:b.kind==1?person.credits:uint64_t(person.stake);check(weight>0,"NO_VOTING_WEIGHT");check(weight<=b.denominator-b.cast,"VOTE_WEIGHT_RANGE");auto id=next_vote_id(runtime);
  cast.emplace(get_self(),[&](auto& r){r.id=id;r.ballot=ballot_id;r.member=member_id;r.weight=weight;r.choice=choice;});rows.modify(b,same_payer,[&](auto& r){r.cast=add64(r.cast,weight);r.tallies[choice]=add64(r.tallies[choice],weight);});
 }
 ACTION finalize(name runtime,uint64_t dao_id,uint64_t ballot_id){
  ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status==0,"BALLOT_FINALIZED");check(current_time_point().sec_since_epoch()>=b.closes,"BALLOT_OPEN");
  elections election_rows(get_self(),runtime.value);auto election=election_rows.find(ballot_id);if(election!=election_rows.end())finish_election(runtime,dao_id,*election,b);else{
  bool quorum=(__uint128_t(b.cast)*10000)>=__uint128_t(b.denominator)*b.quorum;uint64_t maximum=0;int16_t winner=-1;bool tie=false;
  for(size_t i=0;i<b.tallies.size();i++){if(b.tallies[i]>maximum){maximum=b.tallies[i];winner=i;tie=false;}else if(b.tallies[i]==maximum)tie=true;}
  bool passed=quorum&&b.cast>0&&!tie&&winner>=0&&(b.choices!=2||winner==1)&&(__uint128_t(maximum)*10000)>=__uint128_t(b.cast)*b.approval;
  rows.modify(b,same_payer,[&](auto& r){r.status=passed?1:2;r.winner=passed?winner:-1;});
  }
  if(ordinary(runtime,ballot_id))record_end(runtime,dao_id,ballot_id,false);
  // Expired lock cleanup can already have been called permissionlessly.
  governance_locks locks(runtime,dao_id);auto index=locks.get_index<"bysource"_n>();auto packed=pack(std::make_tuple(get_self(),ballot_id));const auto& lock=index.get(sha256(packed.data(),packed.size()),"LOCK_UNKNOWN");if(lock.active)core_action(runtime,get_self(),"govunlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id)));
 }
private:
 void preserve_vote_ids(name runtime){
  vote_identities ids(get_self(),runtime.value);if(ids.find(0)!=ids.end())return;votes cast(get_self(),runtime.value);uint64_t maximum=0;if(cast.begin()!=cast.end()){auto last=cast.end();--last;maximum=last->id;}
  ids.emplace(get_self(),[&](auto& r){r.high_water=maximum;});
 }
 uint64_t next_vote_id(name runtime){
  preserve_vote_ids(runtime);vote_identities ids(get_self(),runtime.value);const auto& current=ids.get(0);check(current.high_water<std::numeric_limits<uint64_t>::max(),"VOTE_ID_LIMIT");const auto id=current.high_water+1;ids.modify(current,same_payer,[&](auto& r){r.high_water=id;});return id;
 }
 bool ordinary(name runtime,uint64_t ballot_id){
  elections election_rows(get_self(),runtime.value);work_executions works(get_self(),runtime.value);grant_executions grants(get_self(),runtime.value);return election_rows.find(ballot_id)==election_rows.end()&&works.find(ballot_id)==works.end()&&grants.find(ballot_id)==grants.end();
 }
 void record_end(name runtime,uint64_t dao_id,uint64_t ballot_id,bool legacy){
  poll_ends ends(get_self(),runtime.value);auto found=ends.find(ballot_id);
  if(found!=ends.end()){check(found->dao_id==dao_id,"BALLOT_DOMAIN");if(found->completed_at)return;ends.modify(found,same_payer,[&](auto& r){r.completed_at=current_time_point().sec_since_epoch();r.legacy=legacy;});}
  else ends.emplace(get_self(),[&](auto& r){r.dao_id=dao_id;r.ballot_id=ballot_id;r.completed_at=current_time_point().sec_since_epoch();r.legacy=legacy;});
 }
};
EOSIO_DISPATCH(decide,(checkquota)(checkmig)(scanram)(backfillrefs)(bindrampool)(open)(openwork)(vote)(finalize)(markpoll)(prunevotes)(execute)(openaward)(executeaward)(newelect)(nominate)(startelect)(recall))
