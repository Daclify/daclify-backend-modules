// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const worksAbiHash = '49776a429c3e77a0af5f534e7cfc7fb03784fc9ab8751e3be13a174e62dcd324';
export const worksAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
    {
      "name": "accept",
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
          "name": "project_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "cancel",
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
          "name": "project_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "milestone_record",
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
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "quantity",
          "type": "asset"
        },
        {
          "name": "due",
          "type": "uint32"
        },
        {
          "name": "status",
          "type": "uint8"
        },
        {
          "name": "submission_doc",
          "type": "uint64"
        },
        {
          "name": "submission_version",
          "type": "uint32"
        },
        {
          "name": "review_doc",
          "type": "uint64"
        },
        {
          "name": "review_version",
          "type": "uint32"
        },
        {
          "name": "reviewer",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "project_record",
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
          "name": "creator",
          "type": "uint64"
        },
        {
          "name": "contributor",
          "type": "uint64"
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
          "name": "milestones",
          "type": "uint64[]"
        },
        {
          "name": "status",
          "type": "uint8"
        }
      ]
    },
    {
      "name": "propose",
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
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "contributor",
          "type": "uint64"
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
          "name": "payments",
          "type": "asset[]"
        },
        {
          "name": "dues",
          "type": "uint32[]"
        }
      ]
    },
    {
      "name": "review",
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
          "name": "milestone_id",
          "type": "uint64"
        },
        {
          "name": "approve",
          "type": "bool"
        },
        {
          "name": "document_id",
          "type": "uint64"
        },
        {
          "name": "document_version",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "settle",
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
          "name": "milestone_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "submitwork",
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
          "name": "milestone_id",
          "type": "uint64"
        },
        {
          "name": "document_id",
          "type": "uint64"
        },
        {
          "name": "document_version",
          "type": "uint32"
        }
      ]
    }
  ],
  "actions": [
    {
      "name": "accept",
      "type": "accept",
      "ricardian_contract": ""
    },
    {
      "name": "cancel",
      "type": "cancel",
      "ricardian_contract": ""
    },
    {
      "name": "propose",
      "type": "propose",
      "ricardian_contract": ""
    },
    {
      "name": "review",
      "type": "review",
      "ricardian_contract": ""
    },
    {
      "name": "settle",
      "type": "settle",
      "ricardian_contract": ""
    },
    {
      "name": "submitwork",
      "type": "submitwork",
      "ricardian_contract": ""
    }
  ],
  "tables": [
    {
      "name": "milestones",
      "type": "milestone_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "projects",
      "type": "project_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    }
  ],
  "variants": [],
  "ricardian_clauses": [],
  "action_results": []
} satisfies ABI.Def;
export interface accept {
  runtime: string;
  dao_id: string;
  member_id: string;
  project_id: string;
}
export interface cancel {
  runtime: string;
  dao_id: string;
  member_id: string;
  project_id: string;
}
export interface milestone_record {
  id: string;
  dao_id: string;
  project_id: string;
  quantity: string;
  due: number;
  status: number;
  submission_doc: string;
  submission_version: number;
  review_doc: string;
  review_version: number;
  reviewer: string;
}
export interface project_record {
  id: string;
  dao_id: string;
  creator: string;
  contributor: string;
  document_id: string;
  document_version: number;
  milestones: string[];
  status: number;
}
export interface propose {
  runtime: string;
  dao_id: string;
  member_id: string;
  project_id: string;
  contributor: string;
  document_id: string;
  document_version: number;
  payments: string[];
  dues: number[];
}
export interface review {
  runtime: string;
  dao_id: string;
  member_id: string;
  milestone_id: string;
  approve: boolean;
  document_id: string;
  document_version: number;
}
export interface settle {
  runtime: string;
  dao_id: string;
  milestone_id: string;
}
export interface submitwork {
  runtime: string;
  dao_id: string;
  member_id: string;
  milestone_id: string;
  document_id: string;
  document_version: number;
}
export interface WorksActions {
  accept: accept;
  cancel: cancel;
  propose: propose;
  review: review;
  settle: settle;
  submitwork: submitwork;
}
