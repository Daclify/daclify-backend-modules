#include "works_records.hpp"
using namespace daclify;
CONTRACT decide:public contract {
public:
 using contract::contract;
 TABLE ballot_record {
  uint64_t id;uint64_t dao_id;uint64_t creator;uint8_t kind;uint8_t choices;uint32_t closes;uint16_t quorum;uint16_t approval;uint64_t denominator;uint64_t max_member;uint64_t cast=0;std::vector<uint64_t> tallies;uint8_t status=0;int16_t winner=-1;std::string metadata;
  uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}
  EOSLIB_SERIALIZE(ballot_record,(id)(dao_id)(creator)(kind)(choices)(closes)(quorum)(approval)(denominator)(max_member)(cast)(tallies)(status)(winner)(metadata))
 };
 using ballots=multi_index<"ballots"_n,ballot_record,indexed_by<"bydao"_n,const_mem_fun<ballot_record,uint64_t,&ballot_record::by_dao>>>;
 TABLE vote_record {uint64_t id;uint64_t ballot;uint64_t member;uint64_t weight;uint8_t choice;uint64_t primary_key()const{return id;}uint128_t by_member()const{return (uint128_t(ballot)<<64)|member;}EOSLIB_SERIALIZE(vote_record,(id)(ballot)(member)(weight)(choice))};
 using votes=multi_index<"votes"_n,vote_record,indexed_by<"bymember"_n,const_mem_fun<vote_record,uint128_t,&vote_record::by_member>>>;
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
private:
 void start(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t kind,uint8_t choices,uint32_t duration,uint16_t quorum,uint16_t approval,const std::string& metadata,name action_name){
  module_actor(runtime,dao_id,member_id,get_self(),action_name);check(ballot_id>0,"BALLOT_ID");check(kind<=2&&choices>=2&&choices<=16,"BALLOT_PRESET");check(duration>=60&&duration<=2592000,"BALLOT_DURATION");check(quorum>0&&quorum<=10000&&approval>=5001&&approval<=10000,"BALLOT_THRESHOLD");json_metadata(metadata);
  gov_policies policies(runtime,runtime.value);auto policy=policies.find(dao_id);
  if(policy!=policies.end()){const auto& p=policy->config;check(p.decide==get_self()&&p.kind==kind&&p.duration==duration&&p.quorum==quorum&&p.approval==approval,"BALLOT_POLICY");}
  daos communities(runtime,runtime.value);const auto& d=communities.get(dao_id);uint64_t denominator=kind==0?d.member_count:kind==1?d.eligible_credits:uint64_t(d.eligible_stake);check(denominator>0,"NO_ELIGIBLE_WEIGHT");ballots rows(get_self(),runtime.value);check(rows.find(ballot_id)==rows.end(),"BALLOT_EXISTS");
  auto now=current_time_point().sec_since_epoch();check(uint64_t(now)+duration<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");uint32_t closes=now+duration;
  rows.emplace(get_self(),[&](auto& r){r.id=ballot_id;r.dao_id=dao_id;r.creator=member_id;r.kind=kind;r.choices=choices;r.closes=closes;r.quorum=quorum;r.approval=approval;r.denominator=denominator;r.max_member=d.max_member;r.tallies=std::vector<uint64_t>(choices,0);r.metadata=metadata;});
  core_action(runtime,get_self(),"govlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id,closes)));
 }
public:
 ACTION vote(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t choice){
  const auto person=module_actor(runtime,dao_id,member_id,get_self(),"vote"_n);ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status==0&&current_time_point().sec_since_epoch()<b.closes,"BALLOT_CLOSED");check(member_id<=b.max_member,"SNAPSHOT_MEMBER");check(choice<b.choices,"CHOICE");
  votes cast(get_self(),runtime.value);auto index=cast.get_index<"bymember"_n>();check(index.find((uint128_t(ballot_id)<<64)|member_id)==index.end(),"ALREADY_VOTED");uint64_t weight=b.kind==0?1:b.kind==1?person.credits:uint64_t(person.stake);check(weight>0,"NO_VOTING_WEIGHT");check(weight<=b.denominator-b.cast,"VOTE_WEIGHT_RANGE");auto id=cast.available_primary_key();if(!id)id=1;
  cast.emplace(get_self(),[&](auto& r){r.id=id;r.ballot=ballot_id;r.member=member_id;r.weight=weight;r.choice=choice;});rows.modify(b,same_payer,[&](auto& r){r.cast=add64(r.cast,weight);r.tallies[choice]=add64(r.tallies[choice],weight);});
 }
 ACTION finalize(name runtime,uint64_t dao_id,uint64_t ballot_id){
  ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status==0,"BALLOT_FINALIZED");check(current_time_point().sec_since_epoch()>=b.closes,"BALLOT_OPEN");
  bool quorum=(__uint128_t(b.cast)*10000)>=__uint128_t(b.denominator)*b.quorum;uint64_t maximum=0;int16_t winner=-1;bool tie=false;
  for(size_t i=0;i<b.tallies.size();i++){if(b.tallies[i]>maximum){maximum=b.tallies[i];winner=i;tie=false;}else if(b.tallies[i]==maximum)tie=true;}
  bool passed=quorum&&b.cast>0&&!tie&&winner>=0&&(b.choices!=2||winner==1)&&(__uint128_t(maximum)*10000)>=__uint128_t(b.cast)*b.approval;
  rows.modify(b,same_payer,[&](auto& r){r.status=passed?1:2;r.winner=passed?winner:-1;});
  // Expired lock cleanup can already have been called permissionlessly.
  governance_locks locks(runtime,dao_id);auto index=locks.get_index<"bysource"_n>();auto packed=pack(std::make_tuple(get_self(),ballot_id));const auto& lock=index.get(sha256(packed.data(),packed.size()),"LOCK_UNKNOWN");if(lock.active)core_action(runtime,get_self(),"govunlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id)));
 }
};
EOSIO_DISPATCH(decide,(open)(openwork)(vote)(finalize)(execute))
