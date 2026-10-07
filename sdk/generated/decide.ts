// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const decideAbiHash = '0ca71692eb8136c2fc30fbc6c49a5ebe319daa0ab5e9e71f82aa5a0888d3aa52';
export const decideAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
    {
      "name": "ballot_record",
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
          "name": "kind",
          "type": "uint8"
        },
        {
          "name": "choices",
          "type": "uint8"
        },
        {
          "name": "closes",
          "type": "uint32"
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
          "name": "denominator",
          "type": "uint64"
        },
        {
          "name": "max_member",
          "type": "uint64"
        },
        {
          "name": "cast",
          "type": "uint64"
        },
        {
          "name": "tallies",
          "type": "uint64[]"
        },
        {
          "name": "status",
          "type": "uint8"
        },
        {
          "name": "winner",
          "type": "int16"
        },
        {
          "name": "metadata",
          "type": "string"
        }
      ]
    },
    {
      "name": "election_record",
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
          "name": "title",
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
          "name": "document_commitment",
          "type": "checksum256"
        },
        {
          "name": "policy_revision",
          "type": "uint64"
        },
        {
          "name": "nomination_close",
          "type": "uint32"
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
          "name": "seats",
          "type": "uint8"
        },
        {
          "name": "status",
          "type": "uint8"
        },
        {
          "name": "candidates",
          "type": "uint64[]"
        }
      ]
    },
    {
      "name": "execute",
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
          "name": "ballot_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "executeaward",
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
          "name": "ballot_id",
          "type": "uint64"
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
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "grant_execution",
      "base": "",
      "fields": [
        {
          "name": "ballot_id",
          "type": "uint64"
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
          "name": "works",
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
          "name": "application_revision",
          "type": "uint64"
        },
        {
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "commitment",
          "type": "checksum256"
        },
        {
          "name": "grants_hash",
          "type": "checksum256"
        },
        {
          "name": "works_hash",
          "type": "checksum256"
        },
        {
          "name": "policy_revision",
          "type": "uint64"
        },
        {
          "name": "deadline",
          "type": "uint32"
        },
        {
          "name": "executed",
          "type": "bool"
        }
      ]
    },
    {
      "name": "newelect",
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
          "name": "election_id",
          "type": "uint64"
        },
        {
          "name": "title",
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
          "name": "nomination_close",
          "type": "uint32"
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
          "name": "seats",
          "type": "uint8"
        }
      ]
    },
    {
      "name": "nominate",
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
          "name": "election_id",
          "type": "uint64"
        },
        {
          "name": "active",
          "type": "bool"
        }
      ]
    },
    {
      "name": "nomination_record",
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
          "name": "election_id",
          "type": "uint64"
        },
        {
          "name": "member_id",
          "type": "uint64"
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
          "name": "kind",
          "type": "uint8"
        },
        {
          "name": "choices",
          "type": "uint8"
        },
        {
          "name": "duration",
          "type": "uint32"
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
          "name": "metadata",
          "type": "string"
        }
      ]
    },
    {
      "name": "openaward",
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
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "duration",
          "type": "uint32"
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
          "name": "metadata",
          "type": "string"
        }
      ]
    },
    {
      "name": "openwork",
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
          "name": "works",
          "type": "name"
        },
        {
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "duration",
          "type": "uint32"
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
          "name": "metadata",
          "type": "string"
        }
      ]
    },
    {
      "name": "recall",
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
          "name": "term_id",
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
    },
    {
      "name": "startelect",
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
          "name": "election_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "term_record",
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
          "name": "election_id",
          "type": "uint64"
        },
        {
          "name": "member_id",
          "type": "uint64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "starts",
          "type": "uint32"
        },
        {
          "name": "ends",
          "type": "uint32"
        },
        {
          "name": "recalled",
          "type": "bool"
        },
        {
          "name": "recalled_at",
          "type": "uint32"
        },
        {
          "name": "recall_doc",
          "type": "uint64"
        },
        {
          "name": "recall_version",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "vote",
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
          "name": "choice",
          "type": "uint8"
        }
      ]
    },
    {
      "name": "vote_record",
      "base": "",
      "fields": [
        {
          "name": "id",
          "type": "uint64"
        },
        {
          "name": "ballot",
          "type": "uint64"
        },
        {
          "name": "member",
          "type": "uint64"
        },
        {
          "name": "weight",
          "type": "uint64"
        },
        {
          "name": "choice",
          "type": "uint8"
        }
      ]
    },
    {
      "name": "work_execution_record",
      "base": "",
      "fields": [
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "works",
          "type": "name"
        },
        {
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "commitment",
          "type": "checksum256"
        },
        {
          "name": "works_hash",
          "type": "checksum256"
        },
        {
          "name": "policy_revision",
          "type": "uint64"
        },
        {
          "name": "deadline",
          "type": "uint32"
        },
        {
          "name": "executed",
          "type": "bool"
        }
      ]
    }
  ],
  "actions": [
    {
      "name": "execute",
      "type": "execute",
      "ricardian_contract": ""
    },
    {
      "name": "executeaward",
      "type": "executeaward",
      "ricardian_contract": ""
    },
    {
      "name": "finalize",
      "type": "finalize",
      "ricardian_contract": ""
    },
    {
      "name": "newelect",
      "type": "newelect",
      "ricardian_contract": ""
    },
    {
      "name": "nominate",
      "type": "nominate",
      "ricardian_contract": ""
    },
    {
      "name": "open",
      "type": "open",
      "ricardian_contract": ""
    },
    {
      "name": "openaward",
      "type": "openaward",
      "ricardian_contract": ""
    },
    {
      "name": "openwork",
      "type": "openwork",
      "ricardian_contract": ""
    },
    {
      "name": "recall",
      "type": "recall",
      "ricardian_contract": ""
    },
    {
      "name": "startelect",
      "type": "startelect",
      "ricardian_contract": ""
    },
    {
      "name": "vote",
      "type": "vote",
      "ricardian_contract": ""
    }
  ],
  "tables": [
    {
      "name": "ballots",
      "type": "ballot_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "elections",
      "type": "election_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "executions",
      "type": "work_execution_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "grantplans",
      "type": "grant_execution",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "nominations",
      "type": "nomination_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "terms",
      "type": "term_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "votes",
      "type": "vote_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    }
  ],
  "variants": [],
  "ricardian_clauses": [],
  "action_results": []
} satisfies ABI.Def;
export interface ballot_record {
  id: string;
  dao_id: string;
  creator: string;
  kind: number;
  choices: number;
  closes: number;
  quorum: number;
  approval: number;
  denominator: string;
  max_member: string;
  cast: string;
  tallies: string[];
  status: number;
  winner: number;
  metadata: string;
}
export interface election_record {
  id: string;
  dao_id: string;
  creator: string;
  title: string;
  document_id: string;
  document_version: number;
  document_commitment: string;
  policy_revision: string;
  nomination_close: number;
  term_start: number;
  term_end: number;
  seats: number;
  status: number;
  candidates: string[];
}
export interface execute {
  runtime: string;
  dao_id: string;
  ballot_id: string;
}
export interface executeaward {
  runtime: string;
  dao_id: string;
  ballot_id: string;
}
export interface finalize {
  runtime: string;
  dao_id: string;
  ballot_id: string;
}
export interface grant_execution {
  ballot_id: string;
  dao_id: string;
  grants: string;
  works: string;
  round_id: string;
  application_id: string;
  application_revision: string;
  project_id: string;
  commitment: string;
  grants_hash: string;
  works_hash: string;
  policy_revision: string;
  deadline: number;
  executed: boolean;
}
export interface newelect {
  runtime: string;
  dao_id: string;
  member_id: string;
  election_id: string;
  title: string;
  document_id: string;
  document_version: number;
  nomination_close: number;
  term_start: number;
  term_end: number;
  seats: number;
}
export interface nominate {
  runtime: string;
  dao_id: string;
  member_id: string;
  election_id: string;
  active: boolean;
}
export interface nomination_record {
  id: string;
  dao_id: string;
  election_id: string;
  member_id: string;
}
export interface open {
  runtime: string;
  dao_id: string;
  member_id: string;
  ballot_id: string;
  kind: number;
  choices: number;
  duration: number;
  quorum: number;
  approval: number;
  metadata: string;
}
export interface openaward {
  runtime: string;
  dao_id: string;
  member_id: string;
  ballot_id: string;
  grants: string;
  round_id: string;
  application_id: string;
  project_id: string;
  duration: number;
  quorum: number;
  approval: number;
  metadata: string;
}
export interface openwork {
  runtime: string;
  dao_id: string;
  member_id: string;
  ballot_id: string;
  works: string;
  project_id: string;
  duration: number;
  quorum: number;
  approval: number;
  metadata: string;
}
export interface recall {
  runtime: string;
  dao_id: string;
  member_id: string;
  term_id: string;
  document_id: string;
  document_version: number;
}
export interface startelect {
  runtime: string;
  dao_id: string;
  member_id: string;
  election_id: string;
}
export interface term_record {
  id: string;
  dao_id: string;
  election_id: string;
  member_id: string;
  title: string;
  starts: number;
  ends: number;
  recalled: boolean;
  recalled_at: number;
  recall_doc: string;
  recall_version: number;
}
export interface vote {
  runtime: string;
  dao_id: string;
  member_id: string;
  ballot_id: string;
  choice: number;
}
export interface vote_record {
  id: string;
  ballot: string;
  member: string;
  weight: string;
  choice: number;
}
export interface work_execution_record {
  ballot_id: string;
  dao_id: string;
  works: string;
  project_id: string;
  commitment: string;
  works_hash: string;
  policy_revision: string;
  deadline: number;
  executed: boolean;
}
export interface DecideActions {
  execute: execute;
  executeaward: executeaward;
  finalize: finalize;
  newelect: newelect;
  nominate: nominate;
  open: open;
  openaward: openaward;
  openwork: openwork;
  recall: recall;
  startelect: startelect;
  vote: vote;
}
