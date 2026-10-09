// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const worksAbiHash = 'd9f7e25bdd55e01c5386e838c2cdeb4abc5903e0438cc49c64efc95f19399a45';
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
      "name": "acceptagr",
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
      "name": "agreement_record",
      "base": "",
      "fields": [
        {
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "schema_version",
          "type": "uint16"
        },
        {
          "name": "term_start",
          "type": "uint32"
        },
        {
          "name": "term_end",
          "type": "uint32"
        },
        {
          "name": "terms",
          "type": "checksum256"
        },
        {
          "name": "accepted",
          "type": "bool"
        },
        {
          "name": "accepted_at",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "backfillrefs",
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
          "name": "table",
          "type": "name"
        },
        {
          "name": "limit",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "bindrampool",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
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
      "name": "checkmig",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "kind",
          "type": "uint8"
        }
      ]
    },
    {
      "name": "checkquota",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "govaccept",
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
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "grantwork",
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
          "name": "grants",
          "type": "name"
        },
        {
          "name": "round_id",
          "type": "uint64"
        },
        {
          "name": "application_id",
          "type": "uint64"
        },
        {
          "name": "ballot_id",
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
      "name": "offeragr",
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
          "name": "term_start",
          "type": "uint32"
        },
        {
          "name": "term_end",
          "type": "uint32"
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
      "name": "ram_migration_cursor",
      "base": "",
      "fields": [
        {
          "name": "table",
          "type": "name"
        },
        {
          "name": "cursor",
          "type": "uint64"
        },
        {
          "name": "advanced",
          "type": "bool"
        },
        {
          "name": "complete",
          "type": "bool"
        }
      ]
    },
    {
      "name": "ram_migration_overlay",
      "base": "",
      "fields": [
        {
          "name": "id",
          "type": "uint64"
        },
        {
          "name": "table",
          "type": "name"
        },
        {
          "name": "row",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "ram_payer_owner",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
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
      "name": "scanram",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "table",
          "type": "name"
        },
        {
          "name": "limit",
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
      "name": "acceptagr",
      "type": "acceptagr",
      "ricardian_contract": ""
    },
    {
      "name": "backfillrefs",
      "type": "backfillrefs",
      "ricardian_contract": ""
    },
    {
      "name": "bindrampool",
      "type": "bindrampool",
      "ricardian_contract": ""
    },
    {
      "name": "cancel",
      "type": "cancel",
      "ricardian_contract": ""
    },
    {
      "name": "checkmig",
      "type": "checkmig",
      "ricardian_contract": ""
    },
    {
      "name": "checkquota",
      "type": "checkquota",
      "ricardian_contract": ""
    },
    {
      "name": "govaccept",
      "type": "govaccept",
      "ricardian_contract": ""
    },
    {
      "name": "grantwork",
      "type": "grantwork",
      "ricardian_contract": ""
    },
    {
      "name": "offeragr",
      "type": "offeragr",
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
      "name": "scanram",
      "type": "scanram",
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
      "name": "agreements",
      "type": "agreement_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
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
    },
    {
      "name": "ramcursors",
      "type": "ram_migration_cursor",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "ramoverlays",
      "type": "ram_migration_overlay",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "rampayer",
      "type": "ram_payer_owner",
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
export interface acceptagr {
  runtime: string;
  dao_id: string;
  member_id: string;
  project_id: string;
}
export interface agreement_record {
  project_id: string;
  dao_id: string;
  schema_version: number;
  term_start: number;
  term_end: number;
  terms: string;
  accepted: boolean;
  accepted_at: number;
}
export interface backfillrefs {
  runtime: string;
  dao_id: string;
  table: string;
  limit: number;
}
export interface bindrampool {
  runtime: string;
}
export interface cancel {
  runtime: string;
  dao_id: string;
  member_id: string;
  project_id: string;
}
export interface checkmig {
  runtime: string;
  kind: number;
}
export interface checkquota {
  runtime: string;
  dao_id: string;
}
export interface govaccept {
  runtime: string;
  dao_id: string;
  project_id: string;
  ballot_id: string;
}
export interface grantwork {
  runtime: string;
  dao_id: string;
  grants: string;
  round_id: string;
  application_id: string;
  ballot_id: string;
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
export interface offeragr {
  runtime: string;
  dao_id: string;
  member_id: string;
  project_id: string;
  term_start: number;
  term_end: number;
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
export interface ram_migration_cursor {
  table: string;
  cursor: string;
  advanced: boolean;
  complete: boolean;
}
export interface ram_migration_overlay {
  id: string;
  table: string;
  row: string;
}
export interface ram_payer_owner {
  runtime: string;
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
export interface scanram {
  runtime: string;
  table: string;
  limit: number;
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
  acceptagr: acceptagr;
  backfillrefs: backfillrefs;
  bindrampool: bindrampool;
  cancel: cancel;
  checkmig: checkmig;
  checkquota: checkquota;
  govaccept: govaccept;
  grantwork: grantwork;
  offeragr: offeragr;
  propose: propose;
  review: review;
  scanram: scanram;
  settle: settle;
  submitwork: submitwork;
}
