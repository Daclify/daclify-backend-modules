#include "module.hpp"
using namespace daclify;
CONTRACT payroll:public contract {
public:
 using contract::contract;
 TABLE schedule_record {uint64_t id;uint64_t dao_id;uint64_t creator;uint64_t recipient;asset quantity;uint8_t periods;uint32_t interval;uint32_t starts;std::vector<uint64_t> entries;uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}EOSLIB_SERIALIZE(schedule_record,(id)(dao_id)(creator)(recipient)(quantity)(periods)(interval)(starts)(entries))};
 using schedules=multi_index<"schedules"_n,schedule_record,indexed_by<"bydao"_n,const_mem_fun<schedule_record,uint64_t,&schedule_record::by_dao>>>;
 TABLE entry_record {uint64_t id;uint64_t dao_id;uint64_t schedule_id;uint32_t due;uint64_t primary_key()const{return id;}uint64_t by_schedule()const{return schedule_id;}EOSLIB_SERIALIZE(entry_record,(id)(dao_id)(schedule_id)(due))};
 using entries=multi_index<"entries"_n,entry_record,indexed_by<"byschedule"_n,const_mem_fun<entry_record,uint64_t,&entry_record::by_schedule>>>;
 TABLE control_record {uint64_t schedule_id;uint8_t paused;uint32_t last_payout;std::string label;uint64_t primary_key()const{return schedule_id;}EOSLIB_SERIALIZE(control_record,(schedule_id)(paused)(last_payout)(label))};
 using controls=multi_index<"controls"_n,control_record>;
 ACTION commit(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,uint64_t recipient,asset quantity,uint8_t periods,uint32_t interval,uint32_t starts){
  module_actor(runtime,dao_id,member_id,get_self(),"commit"_n,true);check(schedule_id>0,"SCHEDULE_ID");check(periods>=1&&periods<=12&&interval>=86400&&interval<=2678400,"PAYROLL_LIMIT");auto now=current_time_point().sec_since_epoch();check(starts>=now&&uint64_t(starts)<=uint64_t(now)+2678400,"PAYROLL_START");check(uint64_t(starts)+uint64_t(interval)*(periods-1)<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");
  daos communities(runtime,runtime.value);const auto& d=communities.get(dao_id);check(quantity.is_valid()&&quantity.amount>0&&quantity.symbol==d.token_symbol,"ASSET_QUANTITY");check(__int128(quantity.amount)*periods<=asset::max_amount,"AMOUNT_RANGE");members people(runtime,dao_id);check(people.get(recipient,"MEMBER_UNKNOWN").active,"MEMBER_INACTIVE");schedules rows(get_self(),runtime.value);check(rows.find(schedule_id)==rows.end(),"SCHEDULE_EXISTS");entries items(get_self(),runtime.value);std::vector<uint64_t> ids;
  for(uint32_t i=0;i<periods;i++){auto id=items.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"PAYROLL_LIMIT");uint32_t due=starts+interval*i;ids.push_back(id);items.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.schedule_id=schedule_id;r.due=due;});core_action(runtime,get_self(),"reserve"_n,pack(std::make_tuple(dao_id,get_self(),id,recipient,quantity,due)));core_action(runtime,get_self(),"approveob"_n,pack(std::make_tuple(dao_id,get_self(),id)));}
  rows.emplace(get_self(),[&](auto& r){r.id=schedule_id;r.dao_id=dao_id;r.creator=member_id;r.recipient=recipient;r.quantity=quantity;r.periods=periods;r.interval=interval;r.starts=starts;r.entries=ids;});
 }
 ACTION edit(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,uint8_t paused,std::string label){
  module_actor(runtime,dao_id,member_id,get_self(),"edit"_n,true);schedules rows(get_self(),runtime.value);const auto& schedule=rows.get(schedule_id,"SCHEDULE_UNKNOWN");check(schedule.dao_id==dao_id,"PAYROLL_DOMAIN");
  check(paused<=1,"PAYROLL_STATE");check(label.size()<=80,"PAYROLL_LABEL");for(unsigned char c:label)check(c>=0x20&&c<=0x7e,"PAYROLL_LABEL");
  controls flags(get_self(),runtime.value);auto flag=flags.find(schedule_id);
  if(flag==flags.end())flags.emplace(get_self(),[&](auto& r){r.schedule_id=schedule_id;r.paused=paused;r.last_payout=0;r.label=label;});else flags.modify(*flag,same_payer,[&](auto& r){r.paused=paused;r.label=label;});
 }
 ACTION settle(name runtime,uint64_t dao_id,uint64_t entry_id){
  entries items(get_self(),runtime.value);const auto& item=items.get(entry_id,"ENTRY_UNKNOWN");check(item.dao_id==dao_id,"PAYROLL_DOMAIN");
  schedules rows(get_self(),runtime.value);const auto& schedule=rows.get(item.schedule_id,"SCHEDULE_UNKNOWN");check(schedule.dao_id==dao_id,"PAYROLL_DOMAIN");
  bool found=false;for(const auto id:schedule.entries)if(id==entry_id)found=true;check(found,"ENTRY_UNKNOWN");
  controls flags(get_self(),runtime.value);auto flag=flags.find(schedule.id);if(flag!=flags.end())check(flag->paused==0,"PAYROLL_PAUSED");
  obligations debts(runtime,dao_id);auto index=debts.get_index<"bysource"_n>();auto now=current_time_point().sec_since_epoch();bool paid=false;
  for(const auto id:schedule.entries){auto packed=pack(std::make_tuple(get_self(),id));const auto& debt=index.get(sha256(packed.data(),packed.size()),"OBLIGATION_UNKNOWN");check(debt.source==get_self()&&debt.source_id==id,"OBLIGATION_DOMAIN");if(debt.status==2)continue;check(debt.status==1,"NOT_PAYABLE");const auto& due=items.get(id,"ENTRY_UNKNOWN");if(due.due>now)break;core_action(runtime,get_self(),"payob"_n,pack(std::make_tuple(dao_id,get_self(),id)));paid=true;}
  check(paid,"NOT_PAYABLE");
  if(flag==flags.end())flags.emplace(get_self(),[&](auto& r){r.schedule_id=schedule.id;r.paused=0;r.last_payout=now;r.label="";});else flags.modify(*flag,same_payer,[&](auto& r){r.last_payout=now;});
 }
};
EOSIO_DISPATCH(payroll,(commit)(edit)(settle))
