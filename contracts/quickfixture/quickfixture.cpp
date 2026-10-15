#define DACLIFY_MODULE_METERING
#define DACLIFY_RAM_PAYER_CONTRACT "quickfixture"
#define DACLIFY_DOCUMENT_TABLES {}
#include "quick_ballots.hpp"
using namespace eosio;
using namespace daclify;
// Owned native qualification only: simulate elapsed calendar time without changing the production ABI.
CONTRACT quickfixture:public contract {
public:
 using contract::contract;
 ACTION age(name runtime,uint64_t ballot_id,uint32_t closed_at){
  require_auth(get_self());check_ram_payer_runtime(get_self(),runtime);
  quick_ballots ballots(get_self(),runtime.value);auto ballot=ballots.get(ballot_id);
  check(ballot.closed_at&&!ballot.definition.closes&&ballot.identities<=25&&closed_at>2&&closed_at<=ballot.closed_at,"FIXTURE_CLOSED_BALLOT");
  quick_responses responses(get_self(),runtime.value);auto index=responses.get_index<"byballot"_n>();auto it=index.lower_bound(uint128_t(ballot_id)<<64);uint32_t count=0;
  for(;it!=index.end()&&it->ballot_id==ballot_id;++it){check(++count<=25,"FIXTURE_BATCH");index.modify(it,same_payer,[&](auto& row){row.updated_at=closed_at-1;});}
  ballot.opened_at=closed_at-2;ballot.closed_at=closed_at;ballot.scan_cursor=0;ballot.scan_rows=0;ballot.scan_count=0;ballot.scan_aggregate=std::vector<char>(192,0);ballot.prepared=false;
  ballot.verified=false;ballot.up=0;ballot.final_proof=std::vector<char>(64,0);ballot.response_root=quick_snapshot_seed(runtime,get_self(),ballot);
  ballots.modify(ballots.get(ballot_id),same_payer,[&](auto& row){row=ballot;});
 }
};
EOSIO_DISPATCH(quickfixture,(age))
