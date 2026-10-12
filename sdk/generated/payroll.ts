// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const payrollAbiHash = '6a325ea097ae2491a7205b6e16fe6f02f5a3fa32e87d6fae6307e332e7a1fa44';
export const payrollAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
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
      "name": "commit",
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
          "name": "schedule_id",
          "type": "uint64"
        },
        {
          "name": "recipient",
          "type": "uint64"
        },
        {
          "name": "quantity",
          "type": "asset"
        },
        {
          "name": "periods",
          "type": "uint8"
        },
        {
          "name": "interval",
          "type": "uint32"
        },
        {
          "name": "starts",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "control_record",
      "base": "",
      "fields": [
        {
          "name": "schedule_id",
          "type": "uint64"
        },
        {
          "name": "paused",
          "type": "uint8"
        },
        {
          "name": "last_payout",
          "type": "uint32"
        },
        {
          "name": "label",
          "type": "string"
        }
      ]
    },
    {
      "name": "edit",
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
          "name": "schedule_id",
          "type": "uint64"
        },
        {
          "name": "paused",
          "type": "uint8"
        },
        {
          "name": "label",
          "type": "string"
        }
      ]
    },
    {
      "name": "entry_record",
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
          "name": "schedule_id",
          "type": "uint64"
        },
        {
          "name": "due",
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
      "name": "schedule_record",
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
          "name": "recipient",
          "type": "uint64"
        },
        {
          "name": "quantity",
          "type": "asset"
        },
        {
          "name": "periods",
          "type": "uint8"
        },
        {
          "name": "interval",
          "type": "uint32"
        },
        {
          "name": "starts",
          "type": "uint32"
        },
        {
          "name": "entries",
          "type": "uint64[]"
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
          "name": "entry_id",
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
      "name": "clearclose",
      "type": "clearclose",
      "ricardian_contract": ""
    },
    {
      "name": "commit",
      "type": "commit",
      "ricardian_contract": ""
    },
    {
      "name": "edit",
      "type": "edit",
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
      "name": "settle",
      "type": "settle",
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
      "name": "controls",
      "type": "control_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "entries",
      "type": "entry_record",
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
      "name": "schedules",
      "type": "schedule_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    }
  ],
  "variants": [],
  "ricardian_clauses": [],
  "action_results": []
} satisfies ABI.Def;
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
export interface clearclose {
  runtime: string;
  dao_id: string;
}
export interface closure_check {
  dao_id: string;
  code_hash: string;
  closing_at: number;
  stage: number;
  cursor: string;
  complete: boolean;
}
export interface commit {
  runtime: string;
  dao_id: string;
  member_id: string;
  schedule_id: string;
  recipient: string;
  quantity: string;
  periods: number;
  interval: number;
  starts: number;
}
export interface control_record {
  schedule_id: string;
  paused: number;
  last_payout: number;
  label: string;
}
export interface edit {
  runtime: string;
  dao_id: string;
  member_id: string;
  schedule_id: string;
  paused: number;
  label: string;
}
export interface entry_record {
  id: string;
  dao_id: string;
  schedule_id: string;
  due: number;
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
export interface schedule_record {
  id: string;
  dao_id: string;
  creator: string;
  recipient: string;
  quantity: string;
  periods: number;
  interval: number;
  starts: number;
  entries: string[];
}
export interface settle {
  runtime: string;
  dao_id: string;
  entry_id: string;
}
export interface PayrollActions {
  backfillrefs: backfillrefs;
  bindrampool: bindrampool;
  checkmig: checkmig;
  checkquota: checkquota;
  clearclose: clearclose;
  commit: commit;
  edit: edit;
  scanclose: scanclose;
  scanram: scanram;
  settle: settle;
}
