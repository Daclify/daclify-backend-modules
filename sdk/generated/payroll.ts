// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const payrollAbiHash = 'd70ab21057308d4da7007177458c53c46ceaf96bc2d93dec67f4b1b1a421298e';
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
      "name": "commitdoc",
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
        },
        {
          "name": "label",
          "type": "string"
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
          "name": "expected",
          "type": "checksum256"
        },
        {
          "name": "successor_of",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "commitpriv",
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
        },
        {
          "name": "label",
          "type": "private_record_reference"
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
          "name": "expected",
          "type": "checksum256"
        },
        {
          "name": "successor_of",
          "type": "uint64"
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
        },
        {
          "name": "private_label",
          "type": "private_record_reference?$"
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
      "name": "editpriv",
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
          "name": "label",
          "type": "private_record_reference"
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
      "name": "payroll_terms",
      "base": "",
      "fields": [
        {
          "name": "schedule_id",
          "type": "uint64"
        },
        {
          "name": "dao_id",
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
          "name": "commitment",
          "type": "checksum256"
        },
        {
          "name": "label",
          "type": "string"
        },
        {
          "name": "successor_of",
          "type": "uint64"
        },
        {
          "name": "schema_version",
          "type": "uint16"
        },
        {
          "name": "references_released",
          "type": "bool"
        },
        {
          "name": "private_label",
          "type": "private_record_reference?$"
        }
      ]
    },
    {
      "name": "private_record_reference",
      "base": "",
      "fields": [
        {
          "name": "document_id",
          "type": "uint64"
        },
        {
          "name": "version",
          "type": "uint32"
        },
        {
          "name": "commitment",
          "type": "checksum256"
        },
        {
          "name": "key_epoch",
          "type": "uint64"
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
      "name": "releaselabel",
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
          "name": "schedule_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "releaseterms",
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
          "name": "schedule_id",
          "type": "uint64"
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
      "name": "commitdoc",
      "type": "commitdoc",
      "ricardian_contract": ""
    },
    {
      "name": "commitpriv",
      "type": "commitpriv",
      "ricardian_contract": ""
    },
    {
      "name": "edit",
      "type": "edit",
      "ricardian_contract": ""
    },
    {
      "name": "editpriv",
      "type": "editpriv",
      "ricardian_contract": ""
    },
    {
      "name": "releaselabel",
      "type": "releaselabel",
      "ricardian_contract": ""
    },
    {
      "name": "releaseterms",
      "type": "releaseterms",
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
      "name": "payterms",
      "type": "payroll_terms",
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
export interface commitdoc {
  runtime: string;
  dao_id: string;
  member_id: string;
  schedule_id: string;
  recipient: string;
  quantity: string;
  periods: number;
  interval: number;
  starts: number;
  label: string;
  document_id: string;
  document_version: number;
  expected: string;
  successor_of: string;
}
export interface commitpriv {
  runtime: string;
  dao_id: string;
  member_id: string;
  schedule_id: string;
  recipient: string;
  quantity: string;
  periods: number;
  interval: number;
  starts: number;
  label: private_record_reference;
  document_id: string;
  document_version: number;
  expected: string;
  successor_of: string;
}
export interface control_record {
  schedule_id: string;
  paused: number;
  last_payout: number;
  label: string;
  private_label?: private_record_reference | undefined | undefined;
}
export interface edit {
  runtime: string;
  dao_id: string;
  member_id: string;
  schedule_id: string;
  paused: number;
  label: string;
}
export interface editpriv {
  runtime: string;
  dao_id: string;
  member_id: string;
  schedule_id: string;
  label: private_record_reference;
}
export interface entry_record {
  id: string;
  dao_id: string;
  schedule_id: string;
  due: number;
}
export interface payroll_terms {
  schedule_id: string;
  dao_id: string;
  document_id: string;
  document_version: number;
  commitment: string;
  label: string;
  successor_of: string;
  schema_version: number;
  references_released: boolean;
  private_label?: private_record_reference | undefined | undefined;
}
export interface private_record_reference {
  document_id: string;
  version: number;
  commitment: string;
  key_epoch: string;
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
export interface releaselabel {
  runtime: string;
  dao_id: string;
  schedule_id: string;
}
export interface releaseterms {
  runtime: string;
  dao_id: string;
  schedule_id: string;
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
  commitdoc: commitdoc;
  commitpriv: commitpriv;
  edit: edit;
  editpriv: editpriv;
  releaselabel: releaselabel;
  releaseterms: releaseterms;
  scanclose: scanclose;
  scanram: scanram;
  settle: settle;
}
