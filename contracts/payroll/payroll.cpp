#define DACLIFY_DOCUMENT_TABLES {"payterms"_n,"controls"_n}
#define DACLIFY_RAM_PAYER_CONTRACT "payroll"
#include "module.hpp"
#include "private_records.hpp"
using namespace daclify;
CONTRACT payroll:public contract {
public:
 using contract::contract;
 ACTION backfillrefs(name runtime,uint64_t dao_id){backfill_document_refs<terms>(runtime,dao_id,get_self(),"payterms"_n,25,[&](const auto& r){if(!r.references_released){document_ref(runtime,dao_id,get_self(),"payterms"_n,r.schedule_id,0,r.document_id,r.document_version);if(auto ref=r.private_label.value_or())document_ref(runtime,dao_id,get_self(),"payterms"_n,r.schedule_id,1,ref->document_id,ref->version);}});backfill_document_refs<controls>(runtime,dao_id,get_self(),"controls"_n,25,[&](const auto& r){if(auto ref=r.private_label.value_or())document_ref(runtime,dao_id,get_self(),"controls"_n,r.schedule_id,0,ref->document_id,ref->version);});}
 ACTION bindrampool(name runtime){bind_ram_pool(get_self(),runtime);}
 TABLE schedule_record {uint64_t id;uint64_t dao_id;uint64_t creator;uint64_t recipient;asset quantity;uint8_t periods;uint32_t interval;uint32_t starts;std::vector<uint64_t> entries;uint64_t primary_key()const{return id;}uint64_t by_dao()const{return dao_id;}EOSLIB_SERIALIZE(schedule_record,(id)(dao_id)(creator)(recipient)(quantity)(periods)(interval)(starts)(entries))};
 using schedules=ram_table<"schedules"_n,schedule_record,indexed_by<"bydao"_n,const_mem_fun<schedule_record,uint64_t,&schedule_record::by_dao>>>;
 TABLE entry_record {uint64_t id;uint64_t dao_id;uint64_t schedule_id;uint32_t due;uint64_t primary_key()const{return id;}uint64_t by_schedule()const{return schedule_id;}EOSLIB_SERIALIZE(entry_record,(id)(dao_id)(schedule_id)(due))};
 using entries=ram_table<"entries"_n,entry_record,indexed_by<"byschedule"_n,const_mem_fun<entry_record,uint64_t,&entry_record::by_schedule>>>;
 TABLE control_record {uint64_t schedule_id;uint8_t paused;uint32_t last_payout;std::string label;eosio::binary_extension<std::optional<private_record_reference>> private_label;uint64_t ram_owner(name code,uint64_t scope)const{return schedules(code,scope).get(schedule_id,"SCHEDULE_UNKNOWN").dao_id;}uint64_t primary_key()const{return schedule_id;}EOSLIB_SERIALIZE(control_record,(schedule_id)(paused)(last_payout)(label)(private_label))};
 using controls=ram_table<"controls"_n,control_record>;
 TABLE payroll_terms {uint64_t schedule_id,dao_id,document_id;uint32_t document_version;checksum256 commitment;std::string label;uint64_t successor_of=0;uint16_t schema_version=1;bool references_released=false;eosio::binary_extension<std::optional<private_record_reference>> private_label;uint64_t primary_key()const{return schedule_id;}uint64_t by_previous()const{return successor_of;}EOSLIB_SERIALIZE(payroll_terms,(schedule_id)(dao_id)(document_id)(document_version)(commitment)(label)(successor_of)(schema_version)(references_released)(private_label))};
 using terms=ram_table<"payterms"_n,payroll_terms,indexed_by<"byprevious"_n,const_mem_fun<payroll_terms,uint64_t,&payroll_terms::by_previous>>>;
 ACTION commit(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,uint64_t recipient,asset quantity,uint8_t periods,uint32_t interval,uint32_t starts){create_schedule(runtime,dao_id,member_id,schedule_id,recipient,quantity,periods,interval,starts,"commit"_n,"");}
 ACTION commitdoc(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,uint64_t recipient,asset quantity,uint8_t periods,uint32_t interval,uint32_t starts,std::string label,uint64_t document_id,uint32_t document_version,checksum256 expected,uint64_t successor_of){
  check(daos(runtime,runtime.value).get(dao_id,"DAO_UNKNOWN").privacy==0,"PRIVATE_PAYROLL_REQUIRED");
  commit_document(runtime,dao_id,member_id,schedule_id,recipient,quantity,periods,interval,starts,label,document_id,document_version,expected,successor_of,"commitdoc"_n,std::nullopt);
 }
 ACTION commitpriv(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,uint64_t recipient,asset quantity,uint8_t periods,uint32_t interval,uint32_t starts,private_record_reference label,uint64_t document_id,uint32_t document_version,checksum256 expected,uint64_t successor_of){
  check(label.document_id==schedule_id,"PRIVATE_PAYROLL_PARENT");protected_document(runtime,dao_id,label);
  commit_document(runtime,dao_id,member_id,schedule_id,recipient,quantity,periods,interval,starts,"Private payroll",document_id,document_version,expected,successor_of,"commitpriv"_n,label);
 }
 ACTION releaseterms(name runtime,uint64_t dao_id,uint64_t schedule_id){
  terms details(get_self(),runtime.value);const auto& term=details.get(schedule_id,"PAYROLL_TERMS_UNKNOWN");check(term.dao_id==dao_id,"PAYROLL_DOMAIN");if(term.references_released)return;
  schedules rows(get_self(),runtime.value);const auto& schedule=rows.get(schedule_id,"SCHEDULE_UNKNOWN");check(schedule.dao_id==dao_id&&!schedule.entries.empty()&&schedule.entries.size()<=12,"PAYROLL_DOMAIN");
  obligations debts(runtime,dao_id);auto index=debts.get_index<"bysource"_n>();for(auto id:schedule.entries){auto bytes=pack(std::make_tuple(get_self(),id));const auto& debt=index.get(sha256(bytes.data(),bytes.size()),"OBLIGATION_UNKNOWN");check(debt.source==get_self()&&debt.source_id==id&&debt.status==2,"PAYROLL_UNSETTLED");}
  document_ref(runtime,dao_id,get_self(),"payterms"_n,schedule_id,0,0,0);if(term.private_label.value_or())document_ref(runtime,dao_id,get_self(),"payterms"_n,schedule_id,1,0,0);details.modify(term,same_payer,[](auto& r){r.references_released=true;});
 }
 ACTION edit(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,uint8_t paused,std::string label){
  module_actor(runtime,dao_id,member_id,get_self(),"edit"_n,true);schedules rows(get_self(),runtime.value);const auto& schedule=rows.get(schedule_id,"SCHEDULE_UNKNOWN");check(schedule.dao_id==dao_id,"PAYROLL_DOMAIN");
  check(paused<=1,"PAYROLL_STATE");check(label.size()<=80,"PAYROLL_LABEL");for(unsigned char c:label)check(c>=0x20&&c<=0x7e,"PAYROLL_LABEL");
  controls flags(get_self(),runtime.value);auto flag=flags.find(schedule_id);
  if(daos(runtime,runtime.value).get(dao_id,"DAO_UNKNOWN").privacy>0)check(label==(flag==flags.end()?std::string{}:flag->label),"PRIVATE_PAYROLL_REQUIRED");
  if(flag==flags.end())flags.emplace(get_self(),[&](auto& r){r.schedule_id=schedule_id;r.paused=paused;r.last_payout=0;r.label=label;});else flags.modify(*flag,same_payer,[&](auto& r){r.paused=paused;r.label=label;});
 }
 ACTION editpriv(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,private_record_reference label){
  module_actor(runtime,dao_id,member_id,get_self(),"editpriv"_n,true);const auto schedule=schedules(get_self(),runtime.value).get(schedule_id,"SCHEDULE_UNKNOWN");check(schedule.dao_id==dao_id,"PAYROLL_DOMAIN");protected_document(runtime,dao_id,label);
  controls flags(get_self(),runtime.value);auto prior=flags.find(schedule_id);if(prior==flags.end())flags.emplace(get_self(),[&](auto& r){r.schedule_id=schedule_id;r.paused=0;r.last_payout=0;r.label="Private payroll";r.private_label.emplace(label);});else flags.modify(*prior,same_payer,[&](auto& r){r.label="Private payroll";r.private_label.emplace(label);});
  document_ref(runtime,dao_id,get_self(),"controls"_n,schedule_id,0,label.document_id,label.version);
 }
 ACTION releaselabel(name runtime,uint64_t dao_id,uint64_t schedule_id){
  const auto schedule=schedules(get_self(),runtime.value).get(schedule_id,"SCHEDULE_UNKNOWN");check(schedule.dao_id==dao_id&&!schedule.entries.empty()&&schedule.entries.size()<=12,"PAYROLL_DOMAIN");obligations debts(runtime,dao_id);auto index=debts.get_index<"bysource"_n>();
  for(auto id:schedule.entries){const auto bytes=pack(std::make_tuple(get_self(),id));const auto& debt=index.get(sha256(bytes.data(),bytes.size()),"OBLIGATION_UNKNOWN");check(debt.source==get_self()&&debt.source_id==id&&debt.status==2,"PAYROLL_UNSETTLED");}
  controls flags(get_self(),runtime.value);auto flag=flags.find(schedule_id);if(flag==flags.end()||!flag->private_label.value_or())return;document_ref(runtime,dao_id,get_self(),"controls"_n,schedule_id,0,0,0);flags.modify(*flag,same_payer,[](auto& r){r.private_label.emplace(std::nullopt);});
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
 ACTION scanclose(name runtime,uint64_t dao_id,uint32_t limit){
  check(limit>=1&&limit<=25,"CLOSURE_SCAN_BOUNDS");if(closure_stage(runtime,dao_id,get_self(),3)>=1)return;
  scan_closure<schedules>(runtime,dao_id,get_self(),3,0,1,limit,[&](const auto& s){if(s.entries.empty()||s.entries.size()>12)return false;obligations debts(runtime,dao_id);auto index=debts.get_index<"bysource"_n>();
   for(auto id:s.entries){const auto bytes=pack(std::make_tuple(get_self(),id));auto debt=index.find(sha256(bytes.data(),bytes.size()));if(debt==index.end()||debt->source!=get_self()||debt->source_id!=id||debt->status!=2)return false;}return true;});
 }
 ACTION clearclose(name runtime,uint64_t dao_id){clear_closure(runtime,dao_id,get_self());}
 ACTION checkmig(name runtime,uint8_t kind){require_auth(runtime);check(kind==3,"RAM_MIGRATION_SOURCE_KIND");}
 ACTION checkquota(name runtime,uint64_t dao_id){
  require_auth(runtime);pinned_module(runtime,dao_id,get_self());check_ram_payer_runtime(get_self(),runtime);
  schedules rows(get_self(),runtime.value);auto owned=rows.get_index<"bydao"_n>();controls flags(get_self(),runtime.value);uint32_t count=0;
  for(auto it=owned.lower_bound(dao_id);it!=owned.end()&&it->dao_id==dao_id;++it){check(++count<=5000,"RAM_COMPLETION_SCAN_LIMIT");check(flags.find(it->id)!=flags.end(),"RAM_PAYROLL_CONTROL_REQUIRED");}
 }
 ACTION scanram(name runtime,name table,uint32_t limit){
  if(scan_ram_binding(runtime,get_self(),table,3,limit))return;
  if(table=="closechecks"_n){closure_checks(get_self(),runtime.value).backfill(limit);return;}
  if(table=="adoptpay"_n){
   auto progress=migration_cursor(runtime,get_self(),runtime.value,table,false,0,0);if(progress.complete)return;
   schedules rows(get_self(),runtime.value);controls flags(get_self(),runtime.value);auto it=progress.advanced?rows.upper_bound(progress.cursor):rows.begin();uint32_t count=0;
   for(;it!=rows.end()&&count<limit;++it,++count){if(flags.find(it->id)==flags.end()){check_completion_adoption(runtime,it->dao_id);pinned_module(runtime,it->dao_id,get_self());flags.emplace(get_self(),[&](auto& r){r.schedule_id=it->id;r.paused=0;r.last_payout=0;r.label="";});}progress.cursor=it->id;progress.advanced=true;}
   progress.complete=it==rows.end();ram_migration_cursors cursors(get_self(),runtime.value);cursors.modify(cursors.get(table.value),same_payer,[&](auto& r){r=progress;});return;
  }
  if(table=="schedules"_n){schedules(get_self(),runtime.value).backfill(limit);return;}
  if(table=="entries"_n){entries(get_self(),runtime.value).backfill(limit);return;}
  if(table=="controls"_n){controls(get_self(),runtime.value).backfill(limit);return;}
  if(table=="payterms"_n){terms(get_self(),runtime.value).backfill(limit);return;}
  check(false,"RAM_MIGRATION_TABLE");
 }

private:
 void commit_document(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,uint64_t recipient,asset quantity,uint8_t periods,uint32_t interval,uint32_t starts,const std::string& label,uint64_t document_id,uint32_t document_version,checksum256 expected,uint64_t successor_of,name action_name,std::optional<private_record_reference> private_label){
  check(!label.empty()&&label.size()<=80,"PAYROLL_LABEL");for(unsigned char c:label)check(c>=0x20,"PAYROLL_LABEL");
  documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();const auto& document=versions.get((uint128_t(document_id)<<32)|document_version,"DOCUMENT_UNKNOWN");check(document.commitment==expected,"PAYROLL_TERMS_CHANGED");
  terms details(get_self(),runtime.value);if(successor_of){schedules rows(get_self(),runtime.value);const auto& previous=rows.get(successor_of,"SCHEDULE_UNKNOWN");check(previous.dao_id==dao_id&&previous.recipient==recipient,"PAYROLL_DOMAIN");check(uint64_t(starts)>=uint64_t(previous.starts)+uint64_t(previous.interval)*previous.periods,"PAYROLL_TERM_OVERLAP");auto successors=details.get_index<"byprevious"_n>();check(successors.find(successor_of)==successors.end(),"PAYROLL_ALREADY_RENEWED");}
  create_schedule(runtime,dao_id,member_id,schedule_id,recipient,quantity,periods,interval,starts,action_name,label);
  details.emplace(get_self(),[&](auto& r){r.schedule_id=schedule_id;r.dao_id=dao_id;r.document_id=document_id;r.document_version=document_version;r.commitment=expected;r.label=label;r.successor_of=successor_of;if(private_label){r.schema_version=2;r.private_label.emplace(*private_label);}});
  document_ref(runtime,dao_id,get_self(),"payterms"_n,schedule_id,0,document_id,document_version);
  if(private_label){document_ref(runtime,dao_id,get_self(),"payterms"_n,schedule_id,1,private_label->document_id,private_label->version);controls flags(get_self(),runtime.value);flags.modify(flags.get(schedule_id),same_payer,[&](auto& r){r.private_label.emplace(*private_label);});document_ref(runtime,dao_id,get_self(),"controls"_n,schedule_id,0,private_label->document_id,private_label->version);}
 }
 void create_schedule(name runtime,uint64_t dao_id,uint64_t member_id,uint64_t schedule_id,uint64_t recipient,asset quantity,uint8_t periods,uint32_t interval,uint32_t starts,name action_name,const std::string& label){
  module_actor(runtime,dao_id,member_id,get_self(),action_name,true);check(schedule_id>0,"SCHEDULE_ID");check(periods>=1&&periods<=12&&interval>=86400&&interval<=2678400,"PAYROLL_LIMIT");auto now=current_time_point().sec_since_epoch();check(starts>=now&&uint64_t(starts)<=uint64_t(now)+2678400,"PAYROLL_START");check(uint64_t(starts)+uint64_t(interval)*(periods-1)<=std::numeric_limits<uint32_t>::max(),"TIME_RANGE");
  daos communities(runtime,runtime.value);const auto& d=communities.get(dao_id);check(quantity.is_valid()&&quantity.amount>0&&quantity.symbol==d.token_symbol,"ASSET_QUANTITY");check(__int128(quantity.amount)*periods<=asset::max_amount,"AMOUNT_RANGE");members people(runtime,dao_id);check(people.get(recipient,"MEMBER_UNKNOWN").active,"MEMBER_INACTIVE");schedules rows(get_self(),runtime.value);check(rows.find(schedule_id)==rows.end(),"SCHEDULE_EXISTS");entries items(get_self(),runtime.value);std::vector<uint64_t> ids;
  for(uint32_t i=0;i<periods;i++){auto id=items.available_primary_key();if(!id)id=1;check(id<std::numeric_limits<uint64_t>::max(),"PAYROLL_LIMIT");uint32_t due=starts+interval*i;ids.push_back(id);items.emplace(get_self(),[&](auto& r){r.id=id;r.dao_id=dao_id;r.schedule_id=schedule_id;r.due=due;});core_action(runtime,get_self(),"reserve"_n,pack(std::make_tuple(dao_id,get_self(),id,recipient,quantity,due)));core_action(runtime,get_self(),"approveob"_n,pack(std::make_tuple(dao_id,get_self(),id)));}
  rows.emplace(get_self(),[&](auto& r){r.id=schedule_id;r.dao_id=dao_id;r.creator=member_id;r.recipient=recipient;r.quantity=quantity;r.periods=periods;r.interval=interval;r.starts=starts;r.entries=ids;});
  controls flags(get_self(),runtime.value);flags.emplace(get_self(),[&](auto& r){r.schedule_id=schedule_id;r.paused=0;r.last_payout=0;r.label=label;});
 }

};
EOSIO_DISPATCH(payroll,(scanclose)(clearclose)(checkquota)(checkmig)(scanram)(backfillrefs)(bindrampool)(commit)(commitdoc)(commitpriv)(releaseterms)(releaselabel)(edit)(editpriv)(settle))
