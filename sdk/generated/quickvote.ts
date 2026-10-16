// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const quickvoteAbiHash = '47d728ba05fc1c03f7a6acca2063e4c0bc41a41fc382ac57c853d82f1e34edb1';
export const quickvoteAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
    {
      "name": "archive_prune_proof",
      "base": "",
      "fields": [
        {
          "name": "primary_key",
          "type": "uint64"
        },
        {
          "name": "siblings",
          "type": "checksum256[]"
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
      "name": "clearclosed",
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
      "name": "close",
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
          "name": "ballot_id",
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
      "name": "finalize",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "up",
          "type": "uint32"
        },
        {
          "name": "proof",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "init",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "authority",
          "type": "name"
        },
        {
          "name": "authority_hash",
          "type": "checksum256"
        }
      ]
    },
    {
      "name": "open",
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
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "definition",
          "type": "quick_definition"
        },
        {
          "name": "key",
          "type": "bytes"
        },
        {
          "name": "possession",
          "type": "bytes"
        },
        {
          "name": "grants",
          "type": "bytes[]"
        }
      ]
    },
    {
      "name": "prepare",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "limit",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "prune",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "archive_id",
          "type": "uint64"
        },
        {
          "name": "chunk_ordinal",
          "type": "uint32"
        },
        {
          "name": "start",
          "type": "uint32"
        },
        {
          "name": "proofs",
          "type": "archive_prune_proof[]"
        }
      ]
    },
    {
      "name": "prunegrants",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "archive_id",
          "type": "uint64"
        },
        {
          "name": "siblings",
          "type": "checksum256[]"
        }
      ]
    },
    {
      "name": "quick_actor_context",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "authority",
          "type": "name"
        },
        {
          "name": "account_id",
          "type": "uint64"
        },
        {
          "name": "credential",
          "type": "quick_anchor"
        }
      ]
    },
    {
      "name": "quick_anchor",
      "base": "",
      "fields": [
        {
          "name": "kind",
          "type": "uint8"
        },
        {
          "name": "credential",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "quick_ballot",
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
          "name": "creator_id",
          "type": "uint64"
        },
        {
          "name": "opened_at",
          "type": "uint32"
        },
        {
          "name": "definition",
          "type": "quick_definition"
        },
        {
          "name": "definition_hash",
          "type": "checksum256"
        },
        {
          "name": "key",
          "type": "bytes"
        },
        {
          "name": "key_proof",
          "type": "bytes"
        },
        {
          "name": "aggregate",
          "type": "bytes"
        },
        {
          "name": "count",
          "type": "uint32"
        },
        {
          "name": "identities",
          "type": "uint32"
        },
        {
          "name": "closed_at",
          "type": "uint32"
        },
        {
          "name": "scan_cursor",
          "type": "uint64"
        },
        {
          "name": "scan_rows",
          "type": "uint32"
        },
        {
          "name": "scan_count",
          "type": "uint32"
        },
        {
          "name": "scan_aggregate",
          "type": "bytes"
        },
        {
          "name": "response_root",
          "type": "checksum256"
        },
        {
          "name": "prepared",
          "type": "bool"
        },
        {
          "name": "up",
          "type": "uint32"
        },
        {
          "name": "final_proof",
          "type": "bytes"
        },
        {
          "name": "verified",
          "type": "bool"
        },
        {
          "name": "pruned",
          "type": "bool"
        }
      ]
    },
    {
      "name": "quick_clock",
      "base": "",
      "fields": [
        {
          "name": "id",
          "type": "uint64"
        },
        {
          "name": "authority",
          "type": "name"
        },
        {
          "name": "authority_hash",
          "type": "checksum256"
        },
        {
          "name": "next_response_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "quick_definition",
      "base": "",
      "fields": [
        {
          "name": "protocol",
          "type": "uint16"
        },
        {
          "name": "question",
          "type": "string"
        },
        {
          "name": "explanation",
          "type": "string"
        },
        {
          "name": "all_accounts",
          "type": "bool"
        },
        {
          "name": "audience",
          "type": "uint64[]"
        },
        {
          "name": "closes",
          "type": "uint32"
        },
        {
          "name": "readers",
          "type": "quick_reader[]"
        }
      ]
    },
    {
      "name": "quick_grant",
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
          "name": "grants",
          "type": "bytes[]"
        }
      ]
    },
    {
      "name": "quick_reader",
      "base": "",
      "fields": [
        {
          "name": "member_id",
          "type": "uint64"
        },
        {
          "name": "encryption_key",
          "type": "string"
        }
      ]
    },
    {
      "name": "quick_response",
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
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "identity",
          "type": "checksum256"
        },
        {
          "name": "revision",
          "type": "uint64"
        },
        {
          "name": "active",
          "type": "bool"
        },
        {
          "name": "ciphertext",
          "type": "bytes"
        },
        {
          "name": "proof",
          "type": "bytes"
        },
        {
          "name": "receipt",
          "type": "bytes"
        },
        {
          "name": "updated_at",
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
      "name": "remove",
      "base": "",
      "fields": [
        {
          "name": "actor",
          "type": "quick_actor_context"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "expected_revision",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "respond",
      "base": "",
      "fields": [
        {
          "name": "actor",
          "type": "quick_actor_context"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "expected_revision",
          "type": "uint64"
        },
        {
          "name": "ciphertext",
          "type": "bytes"
        },
        {
          "name": "proof",
          "type": "bytes"
        },
        {
          "name": "receipt",
          "type": "bytes"
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
      "name": "tick",
      "base": "",
      "fields": [
        {
          "name": "runtime",
          "type": "name"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        }
      ]
    }
  ],
  "actions": [
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
      "name": "clearclosed",
      "type": "clearclosed",
      "ricardian_contract": ""
    },
    {
      "name": "close",
      "type": "close",
      "ricardian_contract": ""
    },
    {
      "name": "finalize",
      "type": "finalize",
      "ricardian_contract": ""
    },
    {
      "name": "init",
      "type": "init",
      "ricardian_contract": ""
    },
    {
      "name": "open",
      "type": "open",
      "ricardian_contract": ""
    },
    {
      "name": "prepare",
      "type": "prepare",
      "ricardian_contract": ""
    },
    {
      "name": "prune",
      "type": "prune",
      "ricardian_contract": ""
    },
    {
      "name": "prunegrants",
      "type": "prunegrants",
      "ricardian_contract": ""
    },
    {
      "name": "remove",
      "type": "remove",
      "ricardian_contract": ""
    },
    {
      "name": "respond",
      "type": "respond",
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
      "name": "tick",
      "type": "tick",
      "ricardian_contract": ""
    }
  ],
  "tables": [
    {
      "name": "closechecks",
      "type": "closure_check",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "qballots",
      "type": "quick_ballot",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "qclock",
      "type": "quick_clock",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "qgrants",
      "type": "quick_grant",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "qresponses",
      "type": "quick_response",
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
export interface archive_prune_proof {
  primary_key: string;
  siblings: string[];
}
export interface backfillrefs {
  runtime: string;
  dao_id: string;
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
export interface clearclosed {
  runtime: string;
  dao_id: string;
}
export interface close {
  runtime: string;
  dao_id: string;
  member_id: string;
  ballot_id: string;
}
export interface closure_check {
  dao_id: string;
  code_hash: string;
  closing_at: number;
  stage: number;
  cursor: string;
  complete: boolean;
}
export interface finalize {
  runtime: string;
  ballot_id: string;
  up: number;
  proof: string;
}
export interface init {
  runtime: string;
  authority: string;
  authority_hash: string;
}
export interface open {
  runtime: string;
  dao_id: string;
  member_id: string;
  ballot_id: string;
  definition: quick_definition;
  key: string;
  possession: string;
  grants: string[];
}
export interface prepare {
  runtime: string;
  ballot_id: string;
  limit: number;
}
export interface prune {
  runtime: string;
  ballot_id: string;
  archive_id: string;
  chunk_ordinal: number;
  start: number;
  proofs: archive_prune_proof[];
}
export interface prunegrants {
  runtime: string;
  ballot_id: string;
  archive_id: string;
  siblings: string[];
}
export interface quick_actor_context {
  runtime: string;
  authority: string;
  account_id: string;
  credential: quick_anchor;
}
export interface quick_anchor {
  kind: number;
  credential: string;
}
export interface quick_ballot {
  id: string;
  dao_id: string;
  creator_id: string;
  opened_at: number;
  definition: quick_definition;
  definition_hash: string;
  key: string;
  key_proof: string;
  aggregate: string;
  count: number;
  identities: number;
  closed_at: number;
  scan_cursor: string;
  scan_rows: number;
  scan_count: number;
  scan_aggregate: string;
  response_root: string;
  prepared: boolean;
  up: number;
  final_proof: string;
  verified: boolean;
  pruned: boolean;
}
export interface quick_clock {
  id: string;
  authority: string;
  authority_hash: string;
  next_response_id: string;
}
export interface quick_definition {
  protocol: number;
  question: string;
  explanation: string;
  all_accounts: boolean;
  audience: string[];
  closes: number;
  readers: quick_reader[];
}
export interface quick_grant {
  id: string;
  dao_id: string;
  grants: string[];
}
export interface quick_reader {
  member_id: string;
  encryption_key: string;
}
export interface quick_response {
  id: string;
  dao_id: string;
  ballot_id: string;
  identity: string;
  revision: string;
  active: boolean;
  ciphertext: string;
  proof: string;
  receipt: string;
  updated_at: number;
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
export interface remove {
  actor: quick_actor_context;
  ballot_id: string;
  expected_revision: string;
}
export interface respond {
  actor: quick_actor_context;
  ballot_id: string;
  expected_revision: string;
  ciphertext: string;
  proof: string;
  receipt: string;
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
export interface tick {
  runtime: string;
  ballot_id: string;
}
export interface QuickvoteActions {
  backfillrefs: backfillrefs;
  bindrampool: bindrampool;
  checkmig: checkmig;
  checkquota: checkquota;
  clearclosed: clearclosed;
  close: close;
  finalize: finalize;
  init: init;
  open: open;
  prepare: prepare;
  prune: prune;
  prunegrants: prunegrants;
  remove: remove;
  respond: respond;
  scanclose: scanclose;
  scanram: scanram;
  tick: tick;
}
