// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const activityAbiHash = 'abcc28e110ce500f06c7784fdc85c1184e23650a4e683171f5f372304925cf5f';
export const activityAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
    {
      "name": "activity_decision",
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
          "name": "decide",
          "type": "name"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "metadata_hash",
          "type": "checksum256"
        }
      ]
    },
    {
      "name": "activity_record",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "actor",
          "type": "uint64"
        },
        {
          "name": "kind",
          "type": "uint8"
        },
        {
          "name": "source_id",
          "type": "checksum256"
        },
        {
          "name": "source_revision",
          "type": "checksum256"
        },
        {
          "name": "event_id",
          "type": "checksum256"
        },
        {
          "name": "evidence_cid",
          "type": "string"
        },
        {
          "name": "evidence_hash",
          "type": "checksum256"
        },
        {
          "name": "key_epoch",
          "type": "uint64"
        },
        {
          "name": "created_at",
          "type": "uint32"
        },
        {
          "name": "status",
          "type": "uint8"
        }
      ]
    },
    {
      "name": "activity_review",
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
          "name": "reviewer",
          "type": "uint64"
        },
        {
          "name": "accepted",
          "type": "bool"
        },
        {
          "name": "evidence_cid",
          "type": "string"
        },
        {
          "name": "evidence_hash",
          "type": "checksum256"
        },
        {
          "name": "key_epoch",
          "type": "uint64"
        },
        {
          "name": "reviewed_at",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "app_count",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "receipts",
          "type": "uint64"
        },
        {
          "name": "epochs",
          "type": "uint16"
        },
        {
          "name": "current_key_epoch",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "app_key_epoch",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "security_epoch",
          "type": "uint64"
        },
        {
          "name": "app_revision",
          "type": "uint64"
        },
        {
          "name": "max_member",
          "type": "uint64"
        },
        {
          "name": "key_commitment",
          "type": "checksum256"
        },
        {
          "name": "created_at",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "app_key_grant",
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
          "name": "key_epoch",
          "type": "uint64"
        },
        {
          "name": "recipient",
          "type": "uint64"
        },
        {
          "name": "encryption_key",
          "type": "string"
        },
        {
          "name": "envelope",
          "type": "string"
        }
      ]
    },
    {
      "name": "askreview",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "source_id",
          "type": "checksum256"
        },
        {
          "name": "source_revision",
          "type": "checksum256"
        },
        {
          "name": "event_id",
          "type": "checksum256"
        },
        {
          "name": "evidence_cid",
          "type": "string"
        },
        {
          "name": "evidence_hash",
          "type": "checksum256"
        },
        {
          "name": "key_epoch",
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
      "name": "grantappkey",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "key_epoch",
          "type": "uint64"
        },
        {
          "name": "recipient",
          "type": "uint64"
        },
        {
          "name": "encryption_key",
          "type": "string"
        },
        {
          "name": "envelope",
          "type": "string"
        }
      ]
    },
    {
      "name": "linkdecision",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "receipt_id",
          "type": "uint64"
        },
        {
          "name": "decide",
          "type": "name"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "newappkey",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "key_epoch",
          "type": "uint64"
        },
        {
          "name": "security_epoch",
          "type": "uint64"
        },
        {
          "name": "app_revision",
          "type": "uint64"
        },
        {
          "name": "key_commitment",
          "type": "checksum256"
        },
        {
          "name": "self_grant",
          "type": "string"
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
      "name": "recordact",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "source_id",
          "type": "checksum256"
        },
        {
          "name": "source_revision",
          "type": "checksum256"
        },
        {
          "name": "event_id",
          "type": "checksum256"
        },
        {
          "name": "evidence_cid",
          "type": "string"
        },
        {
          "name": "evidence_hash",
          "type": "checksum256"
        },
        {
          "name": "key_epoch",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "reviewact",
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
          "name": "app_id",
          "type": "uint64"
        },
        {
          "name": "receipt_id",
          "type": "uint64"
        },
        {
          "name": "source_revision",
          "type": "checksum256"
        },
        {
          "name": "accepted",
          "type": "bool"
        },
        {
          "name": "evidence_cid",
          "type": "string"
        },
        {
          "name": "evidence_hash",
          "type": "checksum256"
        },
        {
          "name": "key_epoch",
          "type": "uint64"
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
    }
  ],
  "actions": [
    {
      "name": "askreview",
      "type": "askreview",
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
      "name": "grantappkey",
      "type": "grantappkey",
      "ricardian_contract": ""
    },
    {
      "name": "linkdecision",
      "type": "linkdecision",
      "ricardian_contract": ""
    },
    {
      "name": "newappkey",
      "type": "newappkey",
      "ricardian_contract": ""
    },
    {
      "name": "recordact",
      "type": "recordact",
      "ricardian_contract": ""
    },
    {
      "name": "reviewact",
      "type": "reviewact",
      "ricardian_contract": ""
    },
    {
      "name": "scanram",
      "type": "scanram",
      "ricardian_contract": ""
    }
  ],
  "tables": [
    {
      "name": "actdecisions",
      "type": "activity_decision",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "activities",
      "type": "activity_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "actreviews",
      "type": "activity_review",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "appcounts",
      "type": "app_count",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "appgrants",
      "type": "app_key_grant",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "appkeys",
      "type": "app_key_epoch",
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
export interface activity_decision {
  id: string;
  dao_id: string;
  decide: string;
  ballot_id: string;
  metadata_hash: string;
}
export interface activity_record {
  id: string;
  dao_id: string;
  app_id: string;
  actor: string;
  kind: number;
  source_id: string;
  source_revision: string;
  event_id: string;
  evidence_cid: string;
  evidence_hash: string;
  key_epoch: string;
  created_at: number;
  status: number;
}
export interface activity_review {
  id: string;
  dao_id: string;
  reviewer: string;
  accepted: boolean;
  evidence_cid: string;
  evidence_hash: string;
  key_epoch: string;
  reviewed_at: number;
}
export interface app_count {
  id: string;
  dao_id: string;
  app_id: string;
  receipts: string;
  epochs: number;
  current_key_epoch: string;
}
export interface app_key_epoch {
  id: string;
  dao_id: string;
  app_id: string;
  security_epoch: string;
  app_revision: string;
  max_member: string;
  key_commitment: string;
  created_at: number;
}
export interface app_key_grant {
  id: string;
  dao_id: string;
  key_epoch: string;
  recipient: string;
  encryption_key: string;
  envelope: string;
}
export interface askreview {
  runtime: string;
  dao_id: string;
  member_id: string;
  app_id: string;
  source_id: string;
  source_revision: string;
  event_id: string;
  evidence_cid: string;
  evidence_hash: string;
  key_epoch: string;
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
export interface grantappkey {
  runtime: string;
  dao_id: string;
  member_id: string;
  app_id: string;
  key_epoch: string;
  recipient: string;
  encryption_key: string;
  envelope: string;
}
export interface linkdecision {
  runtime: string;
  dao_id: string;
  member_id: string;
  app_id: string;
  receipt_id: string;
  decide: string;
  ballot_id: string;
}
export interface newappkey {
  runtime: string;
  dao_id: string;
  member_id: string;
  app_id: string;
  key_epoch: string;
  security_epoch: string;
  app_revision: string;
  key_commitment: string;
  self_grant: string;
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
export interface recordact {
  runtime: string;
  dao_id: string;
  member_id: string;
  app_id: string;
  source_id: string;
  source_revision: string;
  event_id: string;
  evidence_cid: string;
  evidence_hash: string;
  key_epoch: string;
}
export interface reviewact {
  runtime: string;
  dao_id: string;
  member_id: string;
  app_id: string;
  receipt_id: string;
  source_revision: string;
  accepted: boolean;
  evidence_cid: string;
  evidence_hash: string;
  key_epoch: string;
}
export interface scanram {
  runtime: string;
  table: string;
  limit: number;
}
export interface ActivityActions {
  askreview: askreview;
  bindrampool: bindrampool;
  checkmig: checkmig;
  checkquota: checkquota;
  grantappkey: grantappkey;
  linkdecision: linkdecision;
  newappkey: newappkey;
  recordact: recordact;
  reviewact: reviewact;
  scanram: scanram;
}
