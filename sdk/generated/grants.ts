// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const grantsAbiHash = '692414352d30640d57e0fcf3bbaf7b6f7117c3d8f25e7a433155f7bbcee309a2';
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
      "name": "arbitration_rules",
      "base": "",
      "fields": [
        {
          "name": "decide",
          "type": "name"
        },
        {
          "name": "decide_hash",
          "type": "checksum256"
        },
        {
          "name": "backup",
          "type": "uint64"
        },
        {
          "name": "representative",
          "type": "uint64"
        },
        {
          "name": "kind",
          "type": "uint8"
        },
        {
          "name": "quorum",
          "type": "uint16"
        },
        {
          "name": "approval",
          "type": "uint16"
        },
        {
          "name": "review_seconds",
          "type": "uint32"
        },
        {
          "name": "challenge_seconds",
          "type": "uint32"
        },
        {
          "name": "vote_seconds",
          "type": "uint32"
        },
        {
          "name": "backup_seconds",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "arbitration_terms",
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
          "name": "contributor",
          "type": "uint64"
        },
        {
          "name": "cutoff",
          "type": "uint32"
        },
        {
          "name": "version",
          "type": "uint16"
        },
        {
          "name": "rules",
          "type": "arbitration_rules"
        },
        {
          "name": "base",
          "type": "checksum256"
        },
        {
          "name": "commitment",
          "type": "checksum256"
        },
        {
          "name": "accepted",
          "type": "bool"
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
      "name": "clearclose",
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
      "name": "clearprot",
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
          "name": "application_id",
          "type": "uint64"
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
      "name": "closure_check",
      "base": "",
      "fields": [
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "code_hash",
          "type": "checksum256"
        },
        {
          "name": "closing_at",
          "type": "uint32"
        },
        {
          "name": "stage",
          "type": "uint8"
        },
        {
          "name": "cursor",
          "type": "uint64"
        },
        {
          "name": "complete",
          "type": "bool"
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
      "name": "offerprot",
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
          "name": "decide",
          "type": "name"
        },
        {
          "name": "backup",
          "type": "uint64"
        },
        {
          "name": "representative",
          "type": "uint64"
        },
        {
          "name": "review_seconds",
          "type": "uint32"
        },
        {
          "name": "challenge_seconds",
          "type": "uint32"
        },
        {
          "name": "vote_seconds",
          "type": "uint32"
        },
        {
          "name": "backup_seconds",
          "type": "uint32"
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
      "name": "scanclose",
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
          "name": "limit",
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
    },
    {
      "name": "submitprot",
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
          "name": "expected",
          "type": "checksum256"
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
      "name": "checkquota",
      "type": "checkquota",
      "ricardian_contract": ""
    },
    {
      "name": "clearclose",
      "type": "clearclose",
      "ricardian_contract": ""
    },
    {
      "name": "clearprot",
      "type": "clearprot",
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
      "name": "offerprot",
      "type": "offerprot",
      "ricardian_contract": ""
    },
    {
      "name": "reviewapp",
      "type": "reviewapp",
      "ricardian_contract": ""
    },
    {
      "name": "scanclose",
      "type": "scanclose",
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
    },
    {
      "name": "submitprot",
      "type": "submitprot",
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
      "name": "arbterms",
      "type": "arbitration_terms",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "closechecks",
      "type": "closure_check",
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
export interface arbitration_rules {
  decide: string;
  decide_hash: string;
  backup: string;
  representative: string;
  kind: number;
  quorum: number;
  approval: number;
  review_seconds: number;
  challenge_seconds: number;
  vote_seconds: number;
  backup_seconds: number;
}
export interface arbitration_terms {
  id: string;
  dao_id: string;
  contributor: string;
  cutoff: number;
  version: number;
  rules: arbitration_rules;
  base: string;
  commitment: string;
  accepted: boolean;
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
export interface checkquota {
  runtime: string;
  dao_id: string;
}
export interface clearclose {
  runtime: string;
  dao_id: string;
}
export interface clearprot {
  runtime: string;
  dao_id: string;
  application_id: string;
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
export interface closure_check {
  dao_id: string;
  code_hash: string;
  closing_at: number;
  stage: number;
  cursor: string;
  complete: boolean;
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
export interface offerprot {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
  decide: string;
  backup: string;
  representative: string;
  review_seconds: number;
  challenge_seconds: number;
  vote_seconds: number;
  backup_seconds: number;
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
export interface scanclose {
  runtime: string;
  dao_id: string;
  limit: number;
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
export interface submitprot {
  runtime: string;
  dao_id: string;
  member_id: string;
  application_id: string;
  expected: string;
}
export interface GrantsActions {
  amend: amend;
  applygrant: applygrant;
  backfillrefs: backfillrefs;
  bindrampool: bindrampool;
  checkmig: checkmig;
  checkquota: checkquota;
  clearclose: clearclose;
  clearprot: clearprot;
  closeapp: closeapp;
  closeround: closeround;
  govaward: govaward;
  newround: newround;
  offerprot: offerprot;
  reviewapp: reviewapp;
  scanclose: scanclose;
  scanram: scanram;
  submitapp: submitapp;
  submitprot: submitprot;
}
