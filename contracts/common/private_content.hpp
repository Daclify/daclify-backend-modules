#pragma once
#include "module.hpp"
namespace daclify {
inline uint64_t private_content_id(const nlohmann::json& value){
 check(value.is_string(),"PRIVATE_CONTENT_REFERENCE");const auto text=value.get<std::string>();check(!text.empty()&&text.size()<=20&&text[0]!='0',"PRIVATE_CONTENT_REFERENCE");uint64_t id=0;
 for(unsigned char c:text){check(c>='0'&&c<='9'&&id<=(std::numeric_limits<uint64_t>::max()-(c-'0'))/10,"PRIVATE_CONTENT_REFERENCE");id=id*10+c-'0';}return id;
}
inline void private_content_hash(checksum256 expected,const nlohmann::json& value){
 check(value.is_string(),"PRIVATE_CONTENT_REFERENCE");const auto text=value.get<std::string>();check(text.size()==64,"PRIVATE_CONTENT_REFERENCE");const auto bytes=expected.extract_as_byte_array();const char* hex="0123456789abcdef";
 for(size_t i=0;i<bytes.size();i++)check(text[i*2]==hex[bytes[i]>>4]&&text[i*2+1]==hex[bytes[i]&15],"PRIVATE_CONTENT_REFERENCE");
}
inline document_record private_content_document(name runtime,uint64_t dao_id,const nlohmann::json& ref,bool current_epoch=false){
 check(ref.is_object()&&ref.size()==4&&ref.contains("documentId")&&ref.contains("version")&&ref.contains("commitment")&&ref.contains("keyEpoch"),"PRIVATE_CONTENT_REFERENCE");
 check(ref["version"].is_number_unsigned()&&ref["version"].get<uint64_t>()>0&&ref["version"].get<uint64_t>()<=std::numeric_limits<uint32_t>::max(),"PRIVATE_CONTENT_REFERENCE");
 const auto id=private_content_id(ref["documentId"]),epoch=private_content_id(ref["keyEpoch"]);const auto version=ref["version"].get<uint32_t>();
 const auto dao=daos(runtime,runtime.value).get(dao_id,"DAO_UNKNOWN");check(dao.privacy>0&&(!current_epoch||epoch==dao.key_epoch),"PRIVATE_CONTENT_EPOCH");
 documents docs(runtime,dao_id);auto versions=docs.get_index<"byversion"_n>();const auto& doc=versions.get((uint128_t(id)<<32)|version,"DOCUMENT_UNKNOWN");
 check(doc.envelope_version==1&&doc.key_epoch==epoch,"PRIVATE_CONTENT_REFERENCE");private_content_hash(doc.commitment,ref["commitment"]);return doc;
}
}
