// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const payrollAbiHash = '851a4e53ee8014e03d1e4ef6942d6430227cd6de0bb25ea7bbf3dd8e135a121c';
export const payrollAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
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
      "name": "commit",
      "type": "commit",
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
      "name": "entries",
      "type": "entry_record",
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
export interface entry_record {
  id: string;
  dao_id: string;
  schedule_id: string;
  due: number;
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
  commit: commit;
  settle: settle;
}
