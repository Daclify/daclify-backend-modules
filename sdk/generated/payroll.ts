// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const payrollAbiHash = '8ad24e62adb11c5bb6564b67a47ab0b00a09ea5046c0c19072ca7b0c8548f084';
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
  commit: commit;
  edit: edit;
  scanram: scanram;
  settle: settle;
}
