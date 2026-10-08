// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const payrollAbiHash = 'e6a6f13ba4347bfa5293b9142649ec191c135c91f0d0acf1c5bf7b59c19a5226';
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
export interface ram_payer_owner {
  runtime: string;
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
  commit: commit;
  edit: edit;
  settle: settle;
}
