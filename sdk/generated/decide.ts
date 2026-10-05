// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const decideAbiHash = 'ec9a6b6c7953392985b5bf3f19aa4bc1530bba12502718e1f328f4eedcb31614';
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
    }
  ],
  "actions": [
    {
      "name": "finalize",
      "type": "finalize",
      "ricardian_contract": ""
    },
    {
      "name": "open",
      "type": "open",
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
export interface finalize {
  runtime: string;
  dao_id: string;
  ballot_id: string;
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
export interface DecideActions {
  finalize: finalize;
  open: open;
  vote: vote;
}
