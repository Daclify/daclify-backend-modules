#define DACLIFY_DOCUMENT_TABLES {"elections"_n,"terms"_n,"docchanges"_n,"votetargets"_n,"ballotdefs"_n}
#define DACLIFY_RAM_PAYER_CONTRACT "decide"
#include "grants_records.hpp"
#include "admission.hpp"
#include "executives.hpp"
#include "archive_state.hpp"
#include "decide_ballots.hpp"
#include "governing_documents.hpp"
#include "ballot_commitments.hpp"
#include "arbitration_plans.hpp"
#include "ballot_targets.hpp"
#include "private_content.hpp"
using namespace daclify;
CONTRACT decide:public contract {
public:
 using contract::contract;
 ACTION bindrampool(name runtime){bind_ram_pool(get_self(),runtime);}
 ACTION regdoc(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t document_id,uint8_t category,uint8_t approval,bool track_acceptance){
  module_actor(runtime,dao_id,member_id,get_self(),"regdoc"_n,true);pinned_module(runtime,dao_id,get_self());
  check(category<=4&&approval<=1,"DOCUMENT_SETTINGS");check(document_id>0,"DOCUMENT_UNKNOWN");
  documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();auto first=versions.lower_bound(uint128_t(document_id)<<32);
  check(first!=versions.end()&&first->document_id==document_id,"DOCUMENT_UNKNOWN");
  governing_documents rows(get_self(),runtime.value);auto bydoc=rows.get_index<"bydoc"_n>();check(bydoc.find((uint128_t(dao_id)<<64)|document_id)==bydoc.end(),"DOCUMENT_REGISTERED");
  auto owned=rows.get_index<"bydao"_n>();uint32_t count=0;
  for(auto it=owned.lower_bound(uint128_t(dao_id)<<64);it!=owned.end()&&it->dao_id==dao_id;++it){check(++count<64,"DOCUMENT_REGISTER_LIMIT");check(category!=0||it->category!=0,"CONSTITUTION_REGISTERED");}
  auto id=rows.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"DOCUMENT_REGISTER_LIMIT");
  rows.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.document_id=document_id;r.category=category;r.approval=approval;r.track_acceptance=track_acceptance;});
 }
 ACTION proposedoc(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t register_id,uint32_t document_version,uint64_t expected_revision,uint64_t ballot_id){
  module_actor(runtime,dao_id,member_id,get_self(),"proposedoc"_n,true);pinned_module(runtime,dao_id,get_self());check(!dao_paused(runtime,dao_id),"DAO_PAUSED");
  governing_documents rows(get_self(),runtime.value);const auto& registered=rows.get(register_id,"DOCUMENT_REGISTER_UNKNOWN");check(registered.dao_id==dao_id,"DOCUMENT_DOMAIN");
  check(!registered.pending_id,"DOCUMENT_PROPOSAL_PENDING");check(registered.revision==expected_revision,"DOCUMENT_REVISION_CHANGED");
  documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();const auto& doc=versions.get((uint128_t(registered.document_id)<<32)|document_version,"DOCUMENT_UNKNOWN");
  document_changes changes(get_self(),runtime.value);if(registered.adopted_id)check(document_version>changes.get(registered.adopted_id).document_version,"DOCUMENT_VERSION_NOT_NEWER");
  uint64_t policy_revision=0;const auto now=current_time_point().sec_since_epoch();uint64_t deadline=uint64_t(now)+604800;
  if(registered.approval){
   check(ballot_id>0,"BALLOT_ID");gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");policy_revision=policy.revision;
   const auto metadata=nlohmann::json{{"schemaVersion",1},{"type","document-adoption"},{"documentId",std::to_string(doc.document_id)},{"version",document_version},{"options",{"Reject","Approve"}}}.dump();
   start(runtime,dao_id,member_id,ballot_id,policy.config.kind,2,policy.config.duration,policy.config.quorum,policy.config.approval,metadata,"proposedoc"_n);
   deadline+=policy.config.duration;
  }else check(!ballot_id,"DOCUMENT_APPROVAL_METHOD");
  check(deadline<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");auto id=changes.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"DOCUMENT_CHANGE_LIMIT");
  changes.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.register_id=register_id;r.document_id=doc.document_id;r.document_version=document_version;r.commitment=doc.commitment;r.source_hash=get_code_hash(get_self());r.expected_revision=expected_revision;r.policy_revision=policy_revision;r.ballot_id=ballot_id;r.proposer=member_id;r.proposed_at=now;r.deadline=deadline;});
  rows.modify(registered,same_payer,[&](auto& r){r.pending_id=id;});sync_docchange(runtime,changes.get(id));
  if(ballot_id)freeze_definition(runtime,ballot_id,5);
 }
 ACTION adoptdoc(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t proposal_id){
  document_changes changes(get_self(),runtime.value);const auto& proposal=changes.get(proposal_id,"DOCUMENT_PROPOSAL_UNKNOWN");check(proposal.dao_id==dao_id,"DOCUMENT_DOMAIN");check(!proposal.status,"DOCUMENT_PROPOSAL_CLOSED");
  governing_documents rows(get_self(),runtime.value);const auto& registered=rows.get(proposal.register_id,"DOCUMENT_REGISTER_UNKNOWN");
  module_actor(runtime,dao_id,member_id,get_self(),"adoptdoc"_n,!registered.approval);pinned_module(runtime,dao_id,get_self());check(!dao_paused(runtime,dao_id),"DAO_PAUSED");
  check(registered.pending_id==proposal_id&&registered.revision==proposal.expected_revision,"DOCUMENT_REVISION_CHANGED");check(current_time_point().sec_since_epoch()<=proposal.deadline,"DOCUMENT_PROPOSAL_EXPIRED");check(proposal.source_hash==get_code_hash(get_self()),"DOCUMENT_SOURCE_CHANGED");
  if(registered.approval){gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.decide==get_self()&&policy.revision==proposal.policy_revision,"POLICY_CHANGED");ballots polls(get_self(),runtime.value);const auto& poll=polls.get(proposal.ballot_id,"BALLOT_UNKNOWN");check(poll.dao_id==dao_id&&poll.status==1&&poll.winner==1,"BALLOT_NOT_PASSED");}
  documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();check(versions.get((uint128_t(proposal.document_id)<<32)|proposal.document_version,"DOCUMENT_UNKNOWN").commitment==proposal.commitment,"DOCUMENT_CHANGED");
  changes.modify(proposal,same_payer,[&](auto& r){r.status=1;r.adopted_at=current_time_point().sec_since_epoch();r.adopted_by=member_id;});
  rows.modify(registered,same_payer,[&](auto& r){r.adopted_id=proposal_id;r.pending_id=0;r.revision=add64(r.revision,1);});
 }
 ACTION canceldoc(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t proposal_id){
  module_actor(runtime,dao_id,member_id,get_self(),"canceldoc"_n,true);pinned_module(runtime,dao_id,get_self());
  document_changes changes(get_self(),runtime.value);const auto& proposal=changes.get(proposal_id,"DOCUMENT_PROPOSAL_UNKNOWN");check(proposal.dao_id==dao_id,"DOCUMENT_DOMAIN");check(!proposal.status,"DOCUMENT_PROPOSAL_CLOSED");
  if(proposal.ballot_id){ballots polls(get_self(),runtime.value);const auto& poll=polls.get(proposal.ballot_id,"BALLOT_UNKNOWN");gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(poll.status!=1||current_time_point().sec_since_epoch()>proposal.deadline||policy.revision!=proposal.policy_revision||proposal.source_hash!=get_code_hash(get_self()),"DOCUMENT_APPROVAL_READY");}
  close_docchange(runtime,proposal,3);
 }
 ACTION ackdoc(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t adoption_id){
  module_actor(runtime,dao_id,member_id,get_self(),"ackdoc"_n);pinned_module(runtime,dao_id,get_self());
  document_changes changes(get_self(),runtime.value);const auto& adopted=changes.get(adoption_id,"DOCUMENT_PROPOSAL_UNKNOWN");check(adopted.dao_id==dao_id,"DOCUMENT_DOMAIN");check(adopted.status==1,"DOCUMENT_NOT_ADOPTED");
  governing_documents rows(get_self(),runtime.value);const auto& registered=rows.get(adopted.register_id);check(registered.adopted_id==adoption_id,"DOCUMENT_ADOPTION_CHANGED");check(registered.track_acceptance,"DOCUMENT_ACCEPTANCE_DISABLED");
  document_acceptances accepted(get_self(),runtime.value);auto index=accepted.get_index<"bymember"_n>();check(index.find((uint128_t(adoption_id)<<64)|member_id)==index.end(),"DOCUMENT_ALREADY_ACCEPTED");auto id=accepted.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"DOCUMENT_ACCEPTANCE_LIMIT");
  accepted.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.adoption_id=adoption_id;r.member_id=member_id;r.accepted_at=current_time_point().sec_since_epoch();});
 }
 ACTION cleardocs(name runtime,uint64_t dao_id,std::vector<uint64_t> proposal_ids){
  pinned_module(runtime,dao_id,get_self());check(!proposal_ids.empty()&&proposal_ids.size()<=25,"DOCUMENT_CLEANUP_BOUNDS");document_changes changes(get_self(),runtime.value);
  for(auto id:proposal_ids){const auto& proposal=changes.get(id,"DOCUMENT_PROPOSAL_UNKNOWN");check(proposal.dao_id==dao_id,"DOCUMENT_DOMAIN");if(proposal.status)continue;
   if(current_time_point().sec_since_epoch()>proposal.deadline)close_docchange(runtime,proposal,4);
   else if(proposal.ballot_id){ballots polls(get_self(),runtime.value);if(polls.get(proposal.ballot_id,"BALLOT_UNKNOWN").status==2)close_docchange(runtime,proposal,2);}
  }
 }
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
  else if(table=="terms"_n)backfill_document_refs<terms>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_term(runtime,r);});
  else if(table=="votetargets"_n)backfill_document_refs<ballot_targets>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_target(runtime,r);});
  else if(table=="ballotdefs"_n)backfill_document_refs<ballot_definitions>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){if(r.version>=3)retain_private_ballot(runtime,ballots(get_self(),runtime.value).get(r.ballot_id),r.purpose,false);});
  else if(table=="docchanges"_n)backfill_document_refs<document_changes>(runtime,dao_id,get_self(),table,limit,[&](const auto& r){sync_docchange(runtime,r);});else check(false,"DOCUMENT_SOURCE_TABLE");
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
  freeze_definition(runtime,election_id,2);
 }
 ACTION recall(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t term_id,uint64_t document_id,uint32_t document_version){
  module_actor(runtime,dao_id,member_id,get_self(),"recall"_n,true);terms rows(get_self(),runtime.value);const auto& term=rows.get(term_id,"TERM_UNKNOWN");check(term.dao_id==dao_id,"ELECTION_DOMAIN");check(!term.recalled,"ALREADY_IN_STATE");documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();versions.get((uint128_t(document_id)<<32)|document_version,"DOCUMENT_UNKNOWN");rows.modify(term,same_payer,[&](auto& r){r.recalled=true;r.recalled_at=current_time_point().sec_since_epoch();r.recall_doc=document_id;r.recall_version=document_version;});sync_term(runtime,rows.get(term_id));if(term.title=="Executives"){executive_policies policies(runtime,runtime.value);if(policies.find(dao_id)!=policies.end())core_action(runtime,get_self(),"recallexec"_n,pack(std::make_tuple(get_self(),dao_id,term.election_id,term.member_id)));}
 }
 ACTION open(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t kind,uint8_t choices,uint32_t duration,uint16_t quorum,uint16_t approval,std::string metadata){
  start(runtime,dao_id,member_id,ballot_id,kind,choices,duration,quorum,approval,metadata,"open"_n);
  freeze_definition(runtime,ballot_id,choices==2?0:1);
 }
 ACTION openpoll(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t kind,uint8_t choices,uint32_t duration,uint16_t quorum,uint16_t approval,std::string metadata){
  validate_poll(metadata,choices);
  start(runtime,dao_id,member_id,ballot_id,kind,choices,duration,quorum,approval,metadata,"openpoll"_n);
  freeze_definition(runtime,ballot_id,1);
 }
 ACTION openwork(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,name works,uint64_t project_id,uint32_t duration,uint16_t quorum,uint16_t approval,std::string metadata){
  gov_policies policies(runtime,runtime.value);const auto& policy=policies.get(dao_id,"POLICY_UNKNOWN");check(policy.config.governed_works,"GOVERNANCE_REQUIRED");
  pinned_module(runtime,dao_id,works);modules installed(runtime,dao_id);const auto& grant=installed.get(works.value);
  const auto commitment=work_commitment(runtime,dao_id,works,project_id);
  start(runtime,dao_id,member_id,ballot_id,policy.config.kind,2,duration,quorum,approval,metadata,"openwork"_n);
  auto deadline=uint64_t(current_time_point().sec_since_epoch())+duration+604800;check(deadline<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");
  work_executions plans(get_self(),runtime.value);check(plans.find(ballot_id)==plans.end(),"EXECUTION_EXISTS");
  plans.emplace(get_self(),[&](auto& r){r.ballot_id=ballot_id;r.dao_id=dao_id;r.works=works;r.project_id=project_id;r.commitment=commitment;r.works_hash=grant.code_hash;r.policy_revision=policy.revision;r.deadline=deadline;});
  snapshot_work(runtime,dao_id,ballot_id,works,project_id);freeze_definition(runtime,ballot_id,3);
 }
 ACTION execute(name runtime,uint64_t dao_id,uint64_t ballot_id){require_active_dao(runtime,dao_id);
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
  snapshot_grant(runtime,dao_id,ballot_id,grants,round,app);freeze_definition(runtime,ballot_id,4);
 }
 ACTION executeaward(name runtime,uint64_t dao_id,uint64_t ballot_id){require_active_dao(runtime,dao_id);
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
 ACTION scanclose(name runtime,uint64_t dao_id,uint32_t limit){
  check(limit>=1&&limit<=25,"CLOSURE_SCAN_BOUNDS");const auto stage=closure_stage(runtime,dao_id,get_self(),1);if(stage>=2)return;
  if(!stage)scan_closure<ballots>(runtime,dao_id,get_self(),1,0,2,limit,[](const auto& r){return r.status!=0;});
  else scan_closure<governing_documents>(runtime,dao_id,get_self(),1,1,2,limit,[](const auto& r){return r.pending_id==0;});
 }
 ACTION clearclose(name runtime,uint64_t dao_id){clear_closure(runtime,dao_id,get_self());}
 ACTION checkmig(name runtime,uint8_t kind){require_auth(runtime);check(kind==1,"RAM_MIGRATION_SOURCE_KIND");
  ballots polls(get_self(),runtime.value);auto pending=[&](uint64_t id,uint64_t dao_id){const auto& poll=polls.get(id,"BALLOT_UNKNOWN");check(poll.dao_id==dao_id,"BALLOT_DOMAIN");return poll.status!=2;};
  uint32_t count=0;const auto now=current_time_point().sec_since_epoch();work_executions work(get_self(),runtime.value);
  for(const auto& plan:work){check(++count<=5000,"RAM_POOL_SCAN_LIMIT");if(!plan.executed&&plan.deadline>=now&&pending(plan.ballot_id,plan.dao_id))check(plan.works_hash==get_code_hash(plan.works),"RAM_MIGRATION_PENDING_WORK");}
  count=0;grant_executions grants(get_self(),runtime.value);
  for(const auto& plan:grants){check(++count<=5000,"RAM_POOL_SCAN_LIMIT");if(!plan.executed&&plan.deadline>=now&&pending(plan.ballot_id,plan.dao_id))check(plan.works_hash==get_code_hash(plan.works)&&plan.grants_hash==get_code_hash(plan.grants),"RAM_MIGRATION_PENDING_WORK");}
 }
 ACTION scanram(name runtime,name table,uint32_t limit){
  if(scan_ram_binding(runtime,get_self(),table,1,limit))return;
  if(table=="closechecks"_n){closure_checks(get_self(),runtime.value).backfill(limit);return;}
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
  if(table=="votetargets"_n){ballot_targets(get_self(),runtime.value).backfill(limit);return;}
  if(table=="arbplans"_n){arbitration_plans(get_self(),runtime.value).backfill(limit);return;}
  if(table=="ballotdefs"_n){ballot_definitions(get_self(),runtime.value).backfill(limit);return;}
  if(table=="votes"_n){votes(get_self(),runtime.value).backfill(limit);return;}
  if(table=="pollends"_n){poll_ends(get_self(),runtime.value).backfill(limit);return;}
  if(table=="voteids"_n){vote_identities(get_self(),runtime.value).backfill(limit);return;}
  if(table=="elections"_n){elections(get_self(),runtime.value).backfill(limit);return;}
  if(table=="nominations"_n){nominations(get_self(),runtime.value).backfill(limit);return;}
  if(table=="terms"_n){terms(get_self(),runtime.value).backfill(limit);return;}
  if(table=="termholds"_n){term_holds(get_self(),runtime.value).backfill(limit);return;}
  if(table=="executions"_n){work_executions(get_self(),runtime.value).backfill(limit);return;}
  if(table=="grantplans"_n){grant_executions(get_self(),runtime.value).backfill(limit);return;}
  if(table=="docregs"_n){governing_documents(get_self(),runtime.value).backfill(limit);return;}
  if(table=="docchanges"_n){document_changes(get_self(),runtime.value).backfill(limit);return;}
  if(table=="docaccepts"_n){document_acceptances(get_self(),runtime.value).backfill(limit);return;}
  check(false,"RAM_MIGRATION_TABLE");
 }

private:
 void snapshot_work(name runtime,uint64_t dao_id,uint64_t ballot_id,name works,uint64_t project_id){
  work_ballot_target snapshot{};snapshot.project=works_projects(works,runtime.value).get(project_id,"PROJECT_UNKNOWN");check(snapshot.project.dao_id==dao_id&&snapshot.project.milestones.size()<=16,"PROJECT_DOMAIN");works_milestones milestones(works,runtime.value);for(auto id:snapshot.project.milestones)snapshot.milestones.push_back(milestones.get(id,"MILESTONE_UNKNOWN"));
  works_agreements agreements(works,runtime.value);auto agreement=agreements.find(project_id);if(agreement!=agreements.end())snapshot.agreement=*agreement;protected_terms protections(works,runtime.value);auto protection=protections.find(project_id);if(protection!=protections.end())snapshot.protection=*protection;snapshot.document_commitment=target_document_hash(runtime,dao_id,snapshot.project.document_id,snapshot.project.document_version);
  ballot_targets targets(get_self(),runtime.value);targets.emplace(get_self(),[&](auto& r){r.ballot_id=ballot_id;r.dao_id=dao_id;r.work=snapshot;});sync_target(runtime,targets.get(ballot_id));
 }
 void snapshot_grant(name runtime,uint64_t dao_id,uint64_t ballot_id,name grants,const grant_round& round,const grant_application& application){
  grant_ballot_target snapshot{};snapshot.round=round;snapshot.application=application;protected_terms protections(grants,runtime.value);auto protection=protections.find(application.id);if(protection!=protections.end())snapshot.protection=*protection;
  snapshot.rules_commitment=target_document_hash(runtime,dao_id,round.document_id,round.document_version);snapshot.application_commitment=target_document_hash(runtime,dao_id,application.document_id,application.document_version);snapshot.decision_commitment=target_document_hash(runtime,dao_id,application.decision_doc,application.decision_version);
  ballot_targets targets(get_self(),runtime.value);targets.emplace(get_self(),[&](auto& r){r.ballot_id=ballot_id;r.dao_id=dao_id;r.grant=snapshot;});sync_target(runtime,targets.get(ballot_id));
 }
 void sync_target(name runtime,const ballot_target& target){
  uint64_t body=0,rules=0,decision=0;uint32_t body_version=0,rules_version=0,decision_version=0;
  if(!target.released){if(target.work){body=target.work->project.document_id;body_version=target.work->project.document_version;}if(target.grant){body=target.grant->application.document_id;body_version=target.grant->application.document_version;rules=target.grant->round.document_id;rules_version=target.grant->round.document_version;decision=target.grant->application.decision_doc;decision_version=target.grant->application.decision_version;}}
  document_ref(runtime,target.dao_id,get_self(),"votetargets"_n,target.ballot_id,0,body,body_version);document_ref(runtime,target.dao_id,get_self(),"votetargets"_n,target.ballot_id,1,rules,rules_version);document_ref(runtime,target.dao_id,get_self(),"votetargets"_n,target.ballot_id,2,decision,decision_version);
 }
 void validate_poll(const std::string& metadata,uint8_t choices){
  json_metadata(metadata);const auto value=nlohmann::json::parse(metadata,nullptr,false);
  check(value.contains("options")&&value["options"].is_array()&&value["options"].size()==choices,"BALLOT_OPTIONS");
  if(value.contains("schemaVersion")&&value["schemaVersion"]==4){
   for(size_t i=0;i<choices;i++)check(value["options"][i].is_number_unsigned()&&value["options"][i]==i,"BALLOT_OPTIONS");return;
  }
  std::vector<std::string> labels;
  for(const auto& option:value["options"]){check(option.is_string(),"BALLOT_OPTIONS");const auto label=option.get<std::string>();check(!label.empty()&&label.size()<=320&&std::any_of(label.begin(),label.end(),[](unsigned char c){return c>0x20;}),"BALLOT_OPTIONS");check(std::find(labels.begin(),labels.end(),label)==labels.end(),"BALLOT_OPTIONS");labels.push_back(label);}
 }
 checksum256 subtype_commitment(name runtime,uint64_t dao_id,uint64_t ballot_id,uint8_t purpose,uint16_t version){
  if(purpose<=1)return checksum256{};
  std::vector<char> bytes;
  if(purpose==2){auto r=elections(get_self(),runtime.value).get(ballot_id,"ELECTION_UNKNOWN");check(r.dao_id==dao_id,"ELECTION_DOMAIN");r.status=0;bytes=pack(r);}
  else if(purpose==3){auto r=work_executions(get_self(),runtime.value).get(ballot_id,"EXECUTION_UNKNOWN");check(r.dao_id==dao_id,"EXECUTION_DOMAIN");r.executed=false;bytes=pack(r);}
  else if(purpose==4){auto r=grant_executions(get_self(),runtime.value).get(ballot_id,"EXECUTION_UNKNOWN");check(r.dao_id==dao_id,"EXECUTION_DOMAIN");r.executed=false;bytes=pack(r);}
  else if(purpose==5){document_changes rows(get_self(),runtime.value);auto index=rows.get_index<"byballot"_n>();auto r=index.get(ballot_id,"DOCUMENT_PROPOSAL_UNKNOWN");check(r.dao_id==dao_id,"DOCUMENT_DOMAIN");r.adopted_at=0;r.adopted_by=0;r.status=0;bytes=pack(r);}
  else if(purpose==6){auto r=arbitration_plans(get_self(),runtime.value).get(ballot_id,"ARBITRATION_PLAN_UNKNOWN");check(r.dao_id==dao_id,"ARBITRATION_DOMAIN");r.executed=false;bytes=pack(r);}
  else check(false,"BALLOT_SEMANTICS");
  const auto base=sha256(bytes.data(),bytes.size());if(version==2||version==4){check(purpose==3||purpose==4,"BALLOT_SEMANTICS");auto target=ballot_targets(get_self(),runtime.value).get(ballot_id,"BALLOT_TARGET_REQUIRED");check(target.version==1&&target.dao_id==dao_id&&target.ballot_id==ballot_id&&bool(target.work)==(purpose==3)&&bool(target.grant)==(purpose==4),"BALLOT_DEFINITION_DOMAIN");target.released=false;const auto snapshot=pack(target);const auto target_hash=sha256(snapshot.data(),snapshot.size());auto bound=pack(std::make_tuple(base,target_hash));return sha256(bound.data(),bound.size());}return base;
 }
 checksum256 current_definition(name runtime,const ballot_record& b,const ballot_definition_record& d){
  check((d.version>=1&&d.version<=4)&&d.dao_id==b.dao_id&&d.ballot_id==b.id,"BALLOT_DEFINITION_DOMAIN");
  return definition_commitment(runtime_chain_id(runtime),runtime,get_self(),b,d,subtype_commitment(runtime,b.dao_id,b.id,d.purpose,d.version));
 }
 void retain_private_ballot(name runtime,const ballot_record& b,uint8_t purpose,bool current){
  const auto value=nlohmann::json::parse(b.metadata,nullptr,false);
  if(!value.contains("schemaVersion")||value["schemaVersion"]!=4)return;
  check(value.size()==4+value.contains("document")&&value.contains("semantics")&&value["semantics"]==(purpose==1?"poll":"proposal")&&value.contains("privateContent"),"PRIVATE_BALLOT_FIELDS");validate_poll(b.metadata,b.choices);check(purpose==1||b.choices==2,"BALLOT_SEMANTICS");
  const auto doc=private_content_document(runtime,b.dao_id,value["privateContent"],current);check(doc.document_id==b.id,"PRIVATE_BALLOT_PARENT");
  uint64_t support=0;uint32_t version=0;
  if(value.contains("document")){
   const auto& ref=value["document"];check(ref.is_object()&&ref.size()==3&&ref.contains("documentId")&&ref.contains("version")&&ref.contains("commitment")&&ref["version"].is_number_unsigned()&&ref["version"].get<uint64_t>()>0&&ref["version"].get<uint64_t>()<=std::numeric_limits<uint32_t>::max(),"PRIVATE_CONTENT_REFERENCE");
   support=private_content_id(ref["documentId"]);version=ref["version"].get<uint32_t>();private_content_hash(target_document_hash(runtime,b.dao_id,support,version),ref["commitment"]);
  }
  document_ref(runtime,b.dao_id,get_self(),"ballotdefs"_n,b.id,0,doc.document_id,doc.version);
  document_ref(runtime,b.dao_id,get_self(),"ballotdefs"_n,b.id,1,support,version);
 }
 void freeze_definition(name runtime,uint64_t ballot_id,uint8_t purpose){
  const auto b=ballots(get_self(),runtime.value).get(ballot_id,"BALLOT_UNKNOWN");ballot_definitions rows(get_self(),runtime.value);check(rows.find(ballot_id)==rows.end(),"BALLOT_DEFINITION_EXISTS");
  if(purpose<=1){const auto value=nlohmann::json::parse(b.metadata,nullptr,false);
   if(value.contains("schemaVersion")&&value["schemaVersion"]==3){check(value.contains("semantics")&&value["semantics"].is_string()&&value["semantics"]==(purpose==1?"poll":"proposal"),"BALLOT_SEMANTICS");validate_poll(b.metadata,b.choices);
    if(!purpose)check(b.choices==2&&value["options"][0]=="Reject"&&value["options"][1]=="Approve","BALLOT_SEMANTICS");}
  }
  ballot_definition_record d{};d.ballot_id=b.id;d.dao_id=b.dao_id;d.purpose=purpose;if(purpose==3||purpose==4)d.version=2;
  const auto value=nlohmann::json::parse(b.metadata,nullptr,false);if(value.contains("schemaVersion")&&value["schemaVersion"]==4){check(purpose<=1||purpose==3||purpose==4,"BALLOT_SEMANTICS");d.version=(purpose==3||purpose==4)?4:3;}
  gov_policies policies(runtime,runtime.value);auto policy=policies.find(b.dao_id);if(policy!=policies.end()){d.policy_revision=policy->revision;const auto bytes=pack(*policy);d.policy_hash=sha256(bytes.data(),bytes.size());}
  retain_private_ballot(runtime,b,purpose,true);
  d.commitment=current_definition(runtime,b,d);rows.emplace(get_self(),[&](auto& r){r=d;});
 }
 void sync_docchange(name runtime,const document_change& r){const bool protect=r.status<=1;document_ref(runtime,r.dao_id,get_self(),"docchanges"_n,r.id,0,protect?r.document_id:0,protect?r.document_version:0);}
 void close_docchange(name runtime,const document_change& r,uint8_t status){governing_documents rows(get_self(),runtime.value);const auto& registered=rows.get(r.register_id);check(registered.pending_id==r.id,"DOCUMENT_REVISION_CHANGED");document_changes changes(get_self(),runtime.value);changes.modify(changes.get(r.id),same_payer,[&](auto& value){value.status=status;});rows.modify(registered,same_payer,[](auto& value){value.pending_id=0;});sync_docchange(runtime,changes.get(r.id));}
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
  daos communities(runtime,runtime.value);const auto& d=communities.get(dao_id);
  if(action_name=="open"_n||action_name=="openpoll"_n||action_name=="openwork"_n||action_name=="openaward"_n){
   const auto identity=nlohmann::json::parse(d.metadata,nullptr,false),value=nlohmann::json::parse(metadata,nullptr,false);
   if(identity.contains("schemaVersion")&&identity["schemaVersion"]==4)check((value.contains("schemaVersion")&&value["schemaVersion"]==4)||(value.contains("publicDisclosure")&&value["publicDisclosure"]==true)||((action_name=="openwork"_n||action_name=="openaward"_n)&&value.empty()),"PRIVATE_BALLOT_REQUIRED");
  }
  uint64_t denominator=voting_denominator(runtime,dao_id,kind);check(denominator>0,"NO_ELIGIBLE_WEIGHT");ballots rows(get_self(),runtime.value);check(rows.find(ballot_id)==rows.end(),"BALLOT_EXISTS");
  auto now=current_time_point().sec_since_epoch();check(uint64_t(now)+duration<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");uint32_t closes=now+duration;
  rows.emplace(get_self(),[&](auto& r){r.id=ballot_id;r.dao_id=dao_id;r.creator=member_id;r.kind=kind;r.choices=choices;r.closes=closes;r.quorum=quorum;r.approval=approval;r.denominator=denominator;r.max_member=d.max_member;r.tallies=std::vector<uint64_t>(choices,0);r.metadata=metadata;});
  if(action_name=="open"_n||action_name=="openpoll"_n){poll_ends ends(get_self(),runtime.value);check(ends.find(ballot_id)==ends.end(),"POLL_END_EXISTS");ends.emplace(get_self(),[&](auto& r){r.ballot_id=ballot_id;r.dao_id=dao_id;});}
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
 ACTION releasetgt(name runtime,uint64_t dao_id,std::vector<uint64_t> ballot_ids){
  check(!ballot_ids.empty()&&ballot_ids.size()<=25,"BALLOT_TARGET_BOUNDS");ballot_targets targets(get_self(),runtime.value);for(auto id:ballot_ids){const auto target=targets.get(id,"BALLOT_TARGET_REQUIRED");check(target.dao_id==dao_id,"BALLOT_DOMAIN");if(target.released)continue;const auto ballot=ballots(get_self(),runtime.value).get(id,"BALLOT_UNKNOWN");check(ballot.dao_id==dao_id&&ballot.status!=0,"BALLOT_OPEN");bool finished=ballot.status==2;
   if(target.work){const auto plan=work_executions(get_self(),runtime.value).get(id,"EXECUTION_UNKNOWN");finished=finished||plan.executed||current_time_point().sec_since_epoch()>plan.deadline;}
   if(target.grant){const auto plan=grant_executions(get_self(),runtime.value).get(id,"EXECUTION_UNKNOWN");finished=finished||plan.executed||current_time_point().sec_since_epoch()>plan.deadline;}check(finished,"BALLOT_TARGET_ACTIVE");targets.modify(targets.get(id),same_payer,[](auto& r){r.released=true;});sync_target(runtime,targets.get(id));}
 }
 ACTION markpoll(name runtime,uint64_t dao_id,uint64_t ballot_id){
  require_auth(get_self());pinned_module(runtime,dao_id,get_self());ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status!=0,"BALLOT_OPEN");check(ordinary(runtime,ballot_id),"ARCHIVE_FAMILY_PROTECTED");record_end(runtime,dao_id,ballot_id,true);
 }
 ACTION openarb(name runtime,uint64_t dao_id,uint64_t obligation_id,uint64_t ballot_id){
  check(ballot_id>0,"BALLOT_ID");protected_obligations protections(runtime,dao_id);auto protection=protections.get(obligation_id,"ARBITRATION_UNKNOWN");check(protection.rules.decide==get_self()&&protection.rules.decide_hash==get_code_hash(get_self()),"ARBITRATION_DECIDE");
  ballots rows(get_self(),runtime.value);arbitration_plans plans(get_self(),runtime.value);auto saved=plans.find(ballot_id);const auto now=current_time_point().sec_since_epoch();
  if(saved==plans.end()){
   if(protection.state<=3){check(protection.state!=2,"ARBITRATION_CHALLENGE");check(now>=protection.deadline,"ARBITRATION_DEADLINE");check(uint64_t(now)+protection.rules.vote_seconds+60<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");protection.state=4;protection.deadline=now+protection.rules.vote_seconds+60;}
   check(protection.state==4&&uint64_t(now)+60<protection.deadline&&!protection.ballot_id,"ARBITRATION_STATE");elections pending(get_self(),runtime.value);check(rows.find(ballot_id)==rows.end()&&pending.find(ballot_id)==pending.end(),"BALLOT_EXISTS");
   protection.ballot_id=ballot_id;protection.decision_hash=protection_decision_hash(runtime,dao_id,protection);
   // Inline callbacks run after this action; core independently binds the expected snapshot.
   core_action(runtime,get_self(),"arbstart"_n,pack(std::make_tuple(dao_id,obligation_id,ballot_id,protection.decision_hash)));
   nlohmann::json metadata={{"schemaVersion",3},{"semantics","poll"},{"title","Resolve disputed milestone"},{"description","Cancel the unpaid milestone or approve its fixed payment. An invalid result keeps the funds reserved."},{"options",nlohmann::json::array({"Cancel unpaid milestone","Pay contributor"})}};
   const auto raw=protection.challenge_commitment.extract_as_byte_array();const char* digits="0123456789abcdef";std::string hash;hash.reserve(64);for(auto byte:raw){hash+=digits[byte>>4];hash+=digits[byte&15];}
   if(protection.challenge_doc)metadata["document"]={{"documentId",std::to_string(protection.challenge_doc)},{"version",protection.challenge_version},{"commitment",hash}};
   const auto community=daos(runtime,runtime.value).get(dao_id,"DAO_UNKNOWN");const uint32_t closes=protection.deadline-60;
   rows.emplace(get_self(),[&](auto& r){r.id=ballot_id;r.dao_id=dao_id;r.creator=protection.rules.representative;r.kind=protection.rules.kind;r.choices=2;r.closes=closes;r.quorum=protection.rules.quorum;r.approval=protection.rules.approval;r.denominator=0;r.max_member=community.max_member;r.tallies={0,0};r.metadata=metadata.dump();r.status=3;});
   const auto debt=obligations(runtime,dao_id).get(obligation_id,"OBLIGATION_UNKNOWN");check(debt.status==0&&debt.recipient==protection.recipient&&debt.source==protection.source&&debt.source_id==protection.source_id,"ARBITRATION_DOMAIN");
   plans.emplace(get_self(),[&](auto& r){r.ballot_id=ballot_id;r.dao_id=dao_id;r.protection=protection;r.quantity=debt.quantity;r.due=debt.due;});saved=plans.find(ballot_id);core_action(runtime,get_self(),"govlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id,closes)));
  }
  check(saved->version==1&&saved->dao_id==dao_id&&saved->protection.id==obligation_id,"ARBITRATION_DOMAIN");const auto ballot=rows.get(ballot_id,"BALLOT_UNKNOWN");check(ballot.dao_id==dao_id,"BALLOT_DOMAIN");if(saved->ready||ballot.status!=3)return;
  if(now>=ballot.closes){rows.modify(rows.get(ballot_id),same_payer,[](auto& r){r.status=2;});freeze_definition(runtime,ballot_id,6);core_action(runtime,get_self(),"govunlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id)));return;}
  check(protection.state==4&&protection.ballot_id==ballot_id,"ARBITRATION_STATE");
  auto next=*saved;uint64_t denominator=ballot.denominator;members people(runtime,dao_id);nonvoters excluded(runtime,dao_id);participants actors(runtime,dao_id);auto person=people.upper_bound(next.cursor);uint32_t count=0;
  for(;person!=people.end()&&person->id<=ballot.max_member&&count<256;++person,++count){check(++next.scanned<=5000,"ARBITRATION_ELECTORATE_LIMIT");next.cursor=person->id;if(!person->active||person->id==next.protection.recipient||person->id==next.protection.reviewer||std::find(next.protection.reviewers.begin(),next.protection.reviewers.end(),person->id)!=next.protection.reviewers.end()||excluded.find(person->id)!=excluded.end())continue;auto actor=actors.find(person->id);if(actor!=actors.end()&&actor->revoked)continue;const uint64_t weight=ballot.kind==0?1:ballot.kind==1?person->credits:uint64_t(person->stake);if(!weight)continue;denominator=add64(denominator,weight);next.voters.push_back({person->id,weight});}
  next.ready=person==people.end()||person->id>ballot.max_member;plans.modify(saved,same_payer,[&](auto& r){r=next;});rows.modify(rows.get(ballot_id),same_payer,[&](auto& r){r.denominator=denominator;if(next.ready)r.status=denominator?0:2;});
  if(next.ready){freeze_definition(runtime,ballot_id,6);if(!denominator)core_action(runtime,get_self(),"govunlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id)));}
 }
 ACTION execarb(name runtime,uint64_t dao_id,uint64_t ballot_id){
  arbitration_plans plans(get_self(),runtime.value);const auto plan=plans.get(ballot_id,"ARBITRATION_PLAN_UNKNOWN");check(plan.dao_id==dao_id&&plan.version==1,"ARBITRATION_DOMAIN");if(plan.executed)return;
  const auto ballot=ballots(get_self(),runtime.value).get(ballot_id,"BALLOT_UNKNOWN");check(ballot.dao_id==dao_id&&ballot.status==1&&ballot.winner>=0&&ballot.winner<=1,"BALLOT_NOT_PASSED");
  const auto definition=ballot_definitions(get_self(),runtime.value).get(ballot_id,"BALLOT_DEFINITION_REQUIRED");check(definition.purpose==6&&definition.commitment==current_definition(runtime,ballot,definition),"BALLOT_DEFINITION_CHANGED");
  plans.modify(plans.get(ballot_id),same_payer,[](auto& r){r.executed=true;});core_action(runtime,get_self(),"arbitrate"_n,pack(std::make_tuple(dao_id,plan.protection.id,ballot_id,plan.protection.decision_hash,ballot.winner==1)));
 }
 ACTION vote(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t choice){
  ballot_definitions definitions(get_self(),runtime.value);check(definitions.find(ballot_id)==definitions.end(),"BALLOT_COMMITMENT_REQUIRED");
  cast_vote(runtime,dao_id,member_id,ballot_id,choice,"vote"_n);
 }
 ACTION votecommit(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,checksum256 expected,uint8_t choice){
  const auto b=ballots(get_self(),runtime.value).get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");
  const auto d=ballot_definitions(get_self(),runtime.value).get(ballot_id,"BALLOT_DEFINITION_REQUIRED");
  check(expected==d.commitment&&expected==current_definition(runtime,b,d),"BALLOT_DEFINITION_CHANGED");
  cast_vote(runtime,dao_id,member_id,ballot_id,choice,"votecommit"_n);
 }
 ACTION finalize(name runtime,uint64_t dao_id,uint64_t ballot_id){
  ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status==0,"BALLOT_FINALIZED");check(current_time_point().sec_since_epoch()>=b.closes,"BALLOT_OPEN");
  elections election_rows(get_self(),runtime.value);auto election=election_rows.find(ballot_id);if(election!=election_rows.end())finish_election(runtime,dao_id,*election,b);else{
  bool quorum=(__uint128_t(b.cast)*10000)>=__uint128_t(b.denominator)*b.quorum;uint64_t maximum=0;int16_t winner=-1;bool tie=false;
  for(size_t i=0;i<b.tallies.size();i++){if(b.tallies[i]>maximum){maximum=b.tallies[i];winner=i;tie=false;}else if(b.tallies[i]==maximum)tie=true;}
  ballot_definitions definitions(get_self(),runtime.value);auto definition=definitions.find(ballot_id);const bool binary=definition==definitions.end()?b.choices==2:definition->purpose!=1&&definition->purpose!=6;
  bool passed=quorum&&b.cast>0&&!tie&&winner>=0&&(!binary||winner==1)&&(__uint128_t(maximum)*10000)>=__uint128_t(b.cast)*b.approval;
  rows.modify(b,same_payer,[&](auto& r){r.status=passed?1:2;r.winner=passed?winner:-1;});
  }
  if(ordinary(runtime,ballot_id))record_end(runtime,dao_id,ballot_id,false);
  // Expired lock cleanup can already have been called permissionlessly.
  governance_locks locks(runtime,dao_id);auto index=locks.get_index<"bysource"_n>();auto packed=pack(std::make_tuple(get_self(),ballot_id));const auto& lock=index.get(sha256(packed.data(),packed.size()),"LOCK_UNKNOWN");if(lock.active)core_action(runtime,get_self(),"govunlock"_n,pack(std::make_tuple(dao_id,get_self(),ballot_id)));
 }
private:
 void cast_vote(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t ballot_id,uint8_t choice,name action_name){
  const auto person=module_actor(runtime,dao_id,member_id,get_self(),action_name);check(can_vote(runtime,dao_id,member_id),"VOTER_INELIGIBLE");ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id,"BALLOT_UNKNOWN");check(b.dao_id==dao_id,"BALLOT_DOMAIN");check(b.status==0&&current_time_point().sec_since_epoch()<b.closes,"BALLOT_CLOSED");check(member_id<=b.max_member,"SNAPSHOT_MEMBER");check(choice<b.choices,"CHOICE");
  votes cast(get_self(),runtime.value);auto index=cast.get_index<"bymember"_n>();check(index.find((uint128_t(ballot_id)<<64)|member_id)==index.end(),"ALREADY_VOTED");uint64_t weight=b.kind==0?1:b.kind==1?person.credits:uint64_t(person.stake);arbitration_plans plans(get_self(),runtime.value);auto plan=plans.find(ballot_id);if(plan!=plans.end()){check(plan->version==1&&plan->ready&&plan->dao_id==dao_id&&plan->voters.size()<=5000,"ARBITRATION_DOMAIN");auto voter=std::find_if(plan->voters.begin(),plan->voters.end(),[&](const auto& v){return v.member_id==member_id;});check(voter!=plan->voters.end(),"ARBITRATION_VOTER");check(arbitration_document_access(runtime,dao_id,member_id,plan->protection.submission_doc,plan->protection.submission_version)&&arbitration_document_access(runtime,dao_id,member_id,plan->protection.review_doc,plan->protection.review_version)&&arbitration_document_access(runtime,dao_id,member_id,plan->protection.challenge_doc,plan->protection.challenge_version),"ARBITRATION_EVIDENCE_ACCESS");weight=voter->weight;}check(weight>0,"NO_VOTING_WEIGHT");check(weight<=b.denominator-b.cast,"VOTE_WEIGHT_RANGE");auto id=next_vote_id(runtime);
  cast.emplace(get_self(),[&](auto& r){r.id=id;r.ballot=ballot_id;r.member=member_id;r.weight=weight;r.choice=choice;});rows.modify(b,same_payer,[&](auto& r){r.cast=add64(r.cast,weight);r.tallies[choice]=add64(r.tallies[choice],weight);});
 }
 void preserve_vote_ids(name runtime){
  vote_identities ids(get_self(),runtime.value);if(ids.find(0)!=ids.end())return;votes cast(get_self(),runtime.value);uint64_t maximum=0;if(cast.begin()!=cast.end()){auto last=cast.end();--last;maximum=last->id;}
  ids.emplace(get_self(),[&](auto& r){r.high_water=maximum;});
 }
 uint64_t next_vote_id(name runtime){
  preserve_vote_ids(runtime);vote_identities ids(get_self(),runtime.value);const auto& current=ids.get(0);check(current.high_water<std::numeric_limits<uint64_t>::max(),"VOTE_ID_LIMIT");const auto id=current.high_water+1;ids.modify(current,same_payer,[&](auto& r){r.high_water=id;});return id;
 }
 bool ordinary(name runtime,uint64_t ballot_id){
  document_changes changes(get_self(),runtime.value);auto bound=changes.get_index<"byballot"_n>();if(bound.find(ballot_id)!=bound.end())return false;
  arbitration_plans plans(get_self(),runtime.value);if(plans.find(ballot_id)!=plans.end())return false;
  elections election_rows(get_self(),runtime.value);work_executions works(get_self(),runtime.value);grant_executions grants(get_self(),runtime.value);return election_rows.find(ballot_id)==election_rows.end()&&works.find(ballot_id)==works.end()&&grants.find(ballot_id)==grants.end();
 }
 void record_end(name runtime,uint64_t dao_id,uint64_t ballot_id,bool legacy){
  poll_ends ends(get_self(),runtime.value);auto found=ends.find(ballot_id);
  if(found!=ends.end()){check(found->dao_id==dao_id,"BALLOT_DOMAIN");if(found->completed_at)return;ends.modify(found,same_payer,[&](auto& r){r.completed_at=current_time_point().sec_since_epoch();r.legacy=legacy;});}
  else ends.emplace(get_self(),[&](auto& r){r.dao_id=dao_id;r.ballot_id=ballot_id;r.completed_at=current_time_point().sec_since_epoch();r.legacy=legacy;});
 }
};
EOSIO_DISPATCH(decide,(scanclose)(clearclose)(regdoc)(proposedoc)(adoptdoc)(canceldoc)(ackdoc)(cleardocs)(checkquota)(checkmig)(scanram)(backfillrefs)(bindrampool)(open)(openpoll)(openarb)(execarb)(openwork)(vote)(votecommit)(finalize)(markpoll)(releasetgt)(prunevotes)(execute)(openaward)(executeaward)(newelect)(nominate)(startelect)(recall))
