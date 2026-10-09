// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const grantsAbiHash = '46b3493c3230110458318c2f20aba854c5b602bdee018b2f1eab487cef70dc75';
export const grantsAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
    {
      "name": "amend",
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
      "name": "applygrant",
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
          "name": "round_id",
          "type": "uint64"
        },
        {
          "name": "application_id",
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
      "name": "closeapp",
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
        }
      ]
    },
    {
      "name": "closeround",
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
          "name": "round_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "govaward",
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
      "name": "grant_application",
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
          "name": "round_id",
          "type": "uint64"
        },
        {
          "name": "contributor",
          "type": "uint64"
        },
        {
          "name": "revision",
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
          "name": "status",
          "type": "uint8"
        },
        {
          "name": "consent_at",
          "type": "uint32"
        },
        {
          "name": "decision_doc",
          "type": "uint64"
        },
        {
          "name": "decision_version",
          "type": "uint32"
        },
        {
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "funding_ballot",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "grant_round",
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
          "name": "document_id",
          "type": "uint64"
        },
        {
          "name": "document_version",
          "type": "uint32"
        },
        {
          "name": "rules_revision",
          "type": "uint64"
        },
        {
          "name": "applications_close",
          "type": "uint32"
        },
        {
          "name": "review_close",
          "type": "uint32"
        },
        {
          "name": "awards_close",
          "type": "uint32"
        },
        {
          "name": "maximum",
          "type": "asset"
        },
        {
          "name": "awarded",
          "type": "int64"
        },
        {
          "name": "allow_agents",
          "type": "bool"
        },
        {
          "name": "works",
          "type": "name"
        },
        {
          "name": "closed",
          "type": "bool"
        }
      ]
    },
    {
      "name": "newround",
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
          "name": "round_id",
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
          "name": "applications_close",
          "type": "uint32"
        },
        {
          "name": "review_close",
          "type": "uint32"
        },
        {
          "name": "awards_close",
          "type": "uint32"
        },
        {
          "name": "maximum",
          "type": "asset"
        },
        {
          "name": "allow_agents",
          "type": "bool"
        },
        {
          "name": "works",
          "type": "name"
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
      "name": "reviewapp",
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
          "name": "eligible",
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
      "name": "submitapp",
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
        }
      ]
    }
  ],
  "actions": [
    {
      "name": "amend",
      "type": "amend",
      "ricardian_contract": ""
    },
    {
      "name": "applygrant",
      "type": "applygrant",
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
      "name": "checkmig",
      "type": "checkmig",
      "ricardian_contract": ""
    },
    {
      "name": "closeapp",
      "type": "closeapp",
      "ricardian_contract": ""
    },
    {
      "name": "closeround",
      "type": "closeround",
      "ricardian_contract": ""
    },
    {
      "name": "govaward",
      "type": "govaward",
      "ricardian_contract": ""
    },
    {
      "name": "newround",
      "type": "newround",
      "ricardian_contract": ""
    },
    {
      "name": "reviewapp",
      "type": "reviewapp",
      "ricardian_contract": ""
    },
    {
      "name": "scanram",
      "type": "scanram",
      "ricardian_contract": ""
    },
    {
      "name": "submitapp",
      "type": "submitapp",
      "ricardian_contract": ""
    }
  ],
  "tables": [
    {
      "name": "applications",
      "type": "grant_application",
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
    },
    {
      "name": "rounds",
      "type": "grant_round",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    }
  ],
  "variants": [],
  "ricardian_clauses": [],
  "action_results": []
} satisfies ABI.Def;
export interface amend {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
  document_id: string;
  document_version: number;
  payments: string[];
  dues: number[];
  term_start: number;
  term_end: number;
}
export interface applygrant {
  runtime: string;
  dao_id: string;
  member_id: string;
  round_id: string;
  application_id: string;
  document_id: string;
  document_version: number;
  payments: string[];
  dues: number[];
  term_start: number;
  term_end: number;
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
export interface checkmig {
  runtime: string;
  kind: number;
}
export interface closeapp {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
}
export interface closeround {
  runtime: string;
  dao_id: string;
  member_id: string;
  round_id: string;
}
export interface govaward {
  runtime: string;
  dao_id: string;
  round_id: string;
  application_id: string;
  ballot_id: string;
}
export interface grant_application {
  id: string;
  dao_id: string;
  round_id: string;
  contributor: string;
  revision: string;
  document_id: string;
  document_version: number;
  payments: string[];
  dues: number[];
  term_start: number;
  term_end: number;
  status: number;
  consent_at: number;
  decision_doc: string;
  decision_version: number;
  project_id: string;
  funding_ballot: string;
}
export interface grant_round {
  id: string;
  dao_id: string;
  creator: string;
  document_id: string;
  document_version: number;
  rules_revision: string;
  applications_close: number;
  review_close: number;
  awards_close: number;
  maximum: string;
  awarded: string;
  allow_agents: boolean;
  works: string;
  closed: boolean;
}
export interface newround {
  runtime: string;
  dao_id: string;
  member_id: string;
  round_id: string;
  document_id: string;
  document_version: number;
  applications_close: number;
  review_close: number;
  awards_close: number;
  maximum: string;
  allow_agents: boolean;
  works: string;
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
export interface reviewapp {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
  eligible: boolean;
  document_id: string;
  document_version: number;
}
export interface scanram {
  runtime: string;
  table: string;
  limit: number;
}
export interface submitapp {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
}
export interface GrantsActions {
  amend: amend;
  applygrant: applygrant;
  backfillrefs: backfillrefs;
  bindrampool: bindrampool;
  checkmig: checkmig;
  closeapp: closeapp;
  closeround: closeround;
  govaward: govaward;
  newround: newround;
  reviewapp: reviewapp;
  scanram: scanram;
  submitapp: submitapp;
}
