#include "grants_records.hpp"
#include "admission.hpp"
using namespace daclify;
CONTRACT decide:public contract {
public:
 using contract::contract;
 TABLE ballot_record {
  uint64_t id;uint64_t dao_id;uint64_t creator;uint8_t kind;uint8_t choices;uint32_t closes;uint16_t quorum;uint16_t approval;uint64_t denominator;uint64_t max_member;uint64_t cast=0;std::vector<uint64_t> tallies;uint8_t status=0;int16_t winner=-1;std::string metadata;
  uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}
  EOSLIB_SERIALIZE(ballot_record,(id)(dao_id)(creator)(kind)(choices)(closes)(quorum)(approval)(denominator)(max_member)(cast)(tallies)(status)(winner)(metadata))
 };
 using ballots=ram_table<"ballots"_n,ballot_record,indexed_by<"bydao"_n,const_mem_fun<ballot_record,uint64_t,&ballot_record::by_dao>>>;
 TABLE vote_record {uint64_t id;uint64_t ballot;uint64_t member;uint64_t weight;uint8_t choice;uint64_t ram_owner(name code,uint64_t scope)const{return ballots(code,scope).get(ballot,"BALLOT_UNKNOWN").dao_id;}uint64_t primary_key()const{return id;}uint128_t by_member()const{return (uint128_t(ballot)<<64)|member;}EOSLIB_SERIALIZE(vote_record,(id)(ballot)(member)(weight)(choice))};
 using votes=ram_table<"votes"_n,vote_record,indexed_by<"bymember"_n,const_mem_fun<vote_record,uint128_t,&vote_record::by_member>>>;
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
 using terms=ram_table<"terms"_n,term_record,indexed_by<"bydao"_n,const_mem_fun<term_record,uint64_t,&term_record::by_dao>>>;
 ACTION newelect(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t election_id,std::string title,uint64_t document_id,uint32_t document_version,uint32_t nomination_close,uint32_t term_start,uint32_t term_end,uint8_t seats){
  module_actor(runtime,dao_id,member_id,get_self(),"newelect"_n,true);check(election_id>0&&!title.empty()&&title.size()<=80,"ELECTION_TITLE");for(unsigned char c:title)check(c>=0x20,"ELECTION_TITLE");check(seats>=1&&seats<=8,"ELECTION_SEATS");
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.decide==get_self(),"POLICY_DECIDE");const auto now=current_time_point().sec_since_epoch();check(nomination_close>now&&uint64_t(nomination_close)<=uint64_t(now)+2592000&&uint64_t(term_start)>uint64_t(nomination_close)+policy.config.duration&&term_end>term_start&&uint64_t(term_end)-term_start<=31536000,"ELECTION_TERM");
  documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();const auto& document=versions.get((uint128_t(document_id)<<32)|document_version,"DOCUMENT_UNKNOWN");elections rows(get_self(),runtime.value);ballots existing(get_self(),runtime.value);check(rows.find(election_id)==rows.end()&&existing.find(election_id)==existing.end(),"BALLOT_EXISTS");rows.emplace(get_self(),[&](auto& r){r.id=election_id;r.dao_id=dao_id;r.creator=member_id;r.title=title;r.document_id=document_id;r.document_version=document_version;r.document_commitment=document.commitment;r.policy_revision=policy.revision;r.nomination_close=nomination_close;r.term_start=term_start;r.term_end=term_end;r.seats=seats;});
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
  module_actor(runtime,dao_id,member_id,get_self(),"recall"_n,true);terms rows(get_self(),runtime.value);const auto& term=rows.get(term_id,"TERM_UNKNOWN");check(term.dao_id==dao_id,"ELECTION_DOMAIN");check(!term.recalled,"ALREADY_IN_STATE");documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();versions.get((uint128_t(document_id)<<32)|document_version,"DOCUMENT_UNKNOWN");rows.modify(term,same_payer,[&](auto& r){r.recalled=true;r.recalled_at=current_time_point().sec_since_epoch();r.recall_doc=document_id;r.recall_version=document_version;});
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
private:
 void start(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t kind,uint8_t choices,uint32_t duration,uint16_t quorum,uint16_t approval,const std::string& metadata,name action_name){
  elections elections_table(get_self(),runtime.value);if(action_name!="startelect"_n)check(elections_table.find(ballot_id)==elections_table.end(),"BALLOT_EXISTS");
  module_actor(runtime,dao_id,member_id,get_self(),action_name);check(ballot_id>0,"BALLOT_ID");check(kind<=2&&choices>=2&&choices<=16,"BALLOT_PRESET");check(duration>=60&&duration<=2592000,"BALLOT_DURATION");check(quorum>0&&quorum<=10000&&approval>=5001&&approval<=10000,"BALLOT_THRESHOLD");json_metadata(metadata);
  gov_policies policies(runtime,runtime.value);auto policy=policies.find(dao_id);
  if(policy!=policies.end()){const auto& p=policy->config;check(p.decide==get_self()&&p.kind==kind&&p.duration==duration&&p.quorum==quorum&&p.approval==approval,"BALLOT_POLICY");}
  daos communities(runtime,runtime.value);const auto& d=communities.get(dao_id);uint64_t denominator=kind==0?d.member_count:kind==1?d.eligible_credits:uint64_t(d.eligible_stake);check(denominator>0,"NO_ELIGIBLE_WEIGHT");ballots rows(get_self(),runtime.value);check(rows.find(ballot_id)==rows.end(),"BALLOT_EXISTS");
  auto now=current_time_point().sec_since_epoch();check(uint64_t(now)+duration<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");uint32_t closes=now+duration;
  rows.emplace(get_self(),[&](auto& r){r.id=ballot_id;r.dao_id=dao_id;r.creator=member_id;r.kind=kind;r.choices=choices;r.closes=closes;r.quorum=quorum;r.approval=approval;r.denominator=denominator;r.max_member=d.max_member;r.tallies=std::vector<uint64_t>(choices,0);r.metadata=metadata;});
  core_action(runtime,get_self(),"govlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id,closes)));
 }
 void finish_election(name runtime,uint64_t dao_id,const election_record& election,const ballot_record& ballot){
  check(election.dao_id==dao_id&&election.status==1&&election.candidates.size()+1==ballot.tallies.size(),"ELECTION_DOMAIN");bool quorum=__uint128_t(ballot.cast)*10000>=__uint128_t(ballot.denominator)*ballot.quorum;
  std::vector<std::pair<uint64_t,uint64_t>> ranking;for(size_t i=0;i<election.candidates.size();i++)ranking.push_back({ballot.tallies[i+1],election.candidates[i]});std::sort(ranking.begin(),ranking.end(),[](const auto& a,const auto& b){return a.first!=b.first?a.first>b.first:a.second<b.second;});
  terms seats(get_self(),runtime.value);uint32_t occupied=0,issued=0;const auto now=current_time_point().sec_since_epoch();if(quorum&&now<election.term_end)for(size_t i=0;i<ranking.size();){size_t end=i+1;while(end<ranking.size()&&ranking[end].first==ranking[i].first)++end;if(!ranking[i].first||occupied+end-i>election.seats)break;occupied+=end-i;for(size_t j=i;j<end;j++)if(eligible_witness(runtime,dao_id,ranking[j].second,true)){auto id=seats.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"TERM_LIMIT");seats.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.election_id=election.id;r.member_id=ranking[j].second;r.title=election.title;r.starts=election.term_start;r.ends=election.term_end;});++issued;}i=end;}
  elections rows(get_self(),runtime.value);rows.modify(rows.get(election.id),same_payer,[](auto& r){r.status=2;});ballots votes_table(get_self(),runtime.value);votes_table.modify(votes_table.get(ballot.id),same_payer,[&](auto& r){r.status=issued?1:2;r.winner=-1;});
 }
public:
 ACTION vote(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t choice){
  const auto person=module_actor(runtime,dao_id,member_id,get_self(),"vote"_n);ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status==0&&current_time_point().sec_since_epoch()<b.closes,"BALLOT_CLOSED");check(member_id<=b.max_member,"SNAPSHOT_MEMBER");check(choice<b.choices,"CHOICE");
  votes cast(get_self(),runtime.value);auto index=cast.get_index<"bymember"_n>();check(index.find((uint128_t(ballot_id)<<64)|member_id)==index.end(),"ALREADY_VOTED");uint64_t weight=b.kind==0?1:b.kind==1?person.credits:uint64_t(person.stake);check(weight>0,"NO_VOTING_WEIGHT");check(weight<=b.denominator-b.cast,"VOTE_WEIGHT_RANGE");auto id=cast.available_primary_key();if(!id)id=1;
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
  // Expired lock cleanup can already have been called permissionlessly.
  governance_locks locks(runtime,dao_id);auto index=locks.get_index<"bysource"_n>();auto packed=pack(std::make_tuple(get_self(),ballot_id));const auto& lock=index.get(sha256(packed.data(),packed.size()),"LOCK_UNKNOWN");if(lock.active)core_action(runtime,get_self(),"govunlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id)));
 }
};
EOSIO_DISPATCH(decide,(open)(openwork)(vote)(finalize)(execute)(openaward)(executeaward)(newelect)(nominate)(startelect)(recall))
