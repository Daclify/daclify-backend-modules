// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const endorseAbiHash = 'b7ed7d2ca049178ef0af2cec9a280884c70c0e327c0214dbf9f06db7d79fbdaa';
export const endorseAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
    {
      "name": "admission_application",
      "base": "",
      "fields": [
        {
          "name": "id",
          "type": "uint64"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "sponsor",
          "type": "uint64"
        },
        {
          "name": "revision",
          "type": "uint64"
        },
        {
          "name": "policy_revision",
          "type": "uint64"
        },
        {
          "name": "signing_key",
          "type": "public_key"
        },
        {
          "name": "encryption_key",
          "type": "string"
        },
        {
          "name": "custody",
          "type": "uint8"
        },
        {
          "name": "kind",
          "type": "uint8"
        },
        {
          "name": "operator_label",
          "type": "string"
        },
        {
          "name": "document_id",
          "type": "uint64"
        },
        {
          "name": "document_version",
          "type": "uint32"
        },
        {
          "name": "document_commitment",
          "type": "checksum256"
        },
        {
          "name": "expires",
          "type": "uint32"
        },
        {
          "name": "witnesses",
          "type": "uint64[]"
        },
        {
          "name": "admitted",
          "type": "bool"
        },
        {
          "name": "member_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "admit",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "member_id",
          "type": "uint64"
        },
        {
          "name": "application_id",
          "type": "uint64"
        },
        {
          "name": "revision",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "applyjoin",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "member_id",
          "type": "uint64"
        },
        {
          "name": "application_id",
          "type": "uint64"
        },
        {
          "name": "signing_key",
          "type": "public_key"
        },
        {
          "name": "encryption_key",
          "type": "string"
        },
        {
          "name": "custody",
          "type": "uint8"
        },
        {
          "name": "kind",
          "type": "uint8"
        },
        {
          "name": "operator_label",
          "type": "string"
        },
        {
          "name": "document_id",
          "type": "uint64"
        },
        {
          "name": "document_version",
          "type": "uint32"
        },
        {
          "name": "expires",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "unwitness",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "member_id",
          "type": "uint64"
        },
        {
          "name": "application_id",
          "type": "uint64"
        },
        {
          "name": "revision",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "witness",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "member_id",
          "type": "uint64"
        },
        {
          "name": "application_id",
          "type": "uint64"
        },
        {
          "name": "revision",
          "type": "uint64"
        }
      ]
    }
  ],
  "actions": [
    {
      "name": "admit",
      "type": "admit",
      "ricardian_contract": ""
    },
    {
      "name": "applyjoin",
      "type": "applyjoin",
      "ricardian_contract": ""
    },
    {
      "name": "unwitness",
      "type": "unwitness",
      "ricardian_contract": ""
    },
    {
      "name": "witness",
      "type": "witness",
      "ricardian_contract": ""
    }
  ],
  "tables": [
    {
      "name": "joinapps",
      "type": "admission_application",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    }
  ],
  "variants": [],
  "ricardian_clauses": [],
  "action_results": []
} satisfies ABI.Def;
export interface admission_application {
  id: string;
  dao_id: string;
  sponsor: string;
  revision: string;
  policy_revision: string;
  signing_key: string;
  encryption_key: string;
  custody: number;
  kind: number;
  operator_label: string;
  document_id: string;
  document_version: number;
  document_commitment: string;
  expires: number;
  witnesses: string[];
  admitted: boolean;
  member_id: string;
}
export interface admit {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
  revision: string;
}
export interface applyjoin {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
  signing_key: string;
  encryption_key: string;
  custody: number;
  kind: number;
  operator_label: string;
  document_id: string;
  document_version: number;
  expires: number;
}
export interface unwitness {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
  revision: string;
}
export interface witness {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
  revision: string;
}
export interface EndorseActions {
  admit: admit;
  applyjoin: applyjoin;
  unwitness: unwitness;
  witness: witness;
}
