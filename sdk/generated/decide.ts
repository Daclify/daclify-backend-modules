// Generated from compiled C++ ABI. Regenerate with npm run codegen; do not edit.
import type { ABI } from '@wharfkit/antelope';
export const decideAbiHash = '5ce73db291c57e82891ddc78f68afa7fc6c169058135564ac60e07a45cab3b9b';
export const decideAbi = {
  "version": "eosio::abi/1.2",
  "types": [],
  "structs": [
    {
      "name": "ackdoc",
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
          "name": "adoption_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "adoptdoc",
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
          "name": "proposal_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "agreement_record",
      "base": "",
      "fields": [
        {
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "dao_id",
          "type": "uint64"
        },
        {
          "name": "schema_version",
          "type": "uint16"
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
          "name": "terms",
          "type": "checksum256"
        },
        {
          "name": "accepted",
          "type": "bool"
        },
        {
          "name": "accepted_at",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "arbitration_plan",
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
          "name": "protection",
          "type": "protected_obligation"
        },
        {
          "name": "quantity",
          "type": "asset"
        },
        {
          "name": "due",
          "type": "uint32"
        },
        {
          "name": "voters",
          "type": "arbitration_voter[]"
        },
        {
          "name": "executed",
          "type": "bool"
        },
        {
          "name": "version",
          "type": "uint16"
        },
        {
          "name": "cursor",
          "type": "uint64"
        },
        {
          "name": "scanned",
          "type": "uint32"
        },
        {
          "name": "ready",
          "type": "bool"
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
      "name": "arbitration_voter",
      "base": "",
      "fields": [
        {
          "name": "member_id",
          "type": "uint64"
        },
        {
          "name": "weight",
          "type": "uint64"
        }
      ]
    },
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
      "name": "ballot_definition_record",
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
          "name": "version",
          "type": "uint16"
        },
        {
          "name": "purpose",
          "type": "uint8"
        },
        {
          "name": "policy_revision",
          "type": "uint64"
        },
        {
          "name": "policy_hash",
          "type": "checksum256"
        },
        {
          "name": "commitment",
          "type": "checksum256"
        }
      ]
    },
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
      "name": "ballot_target",
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
          "name": "version",
          "type": "uint16"
        },
        {
          "name": "work",
          "type": "work_ballot_target?"
        },
        {
          "name": "grant",
          "type": "grant_ballot_target?"
        },
        {
          "name": "released",
          "type": "bool"
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
      "name": "canceldoc",
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
          "name": "proposal_id",
          "type": "uint64"
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
      "name": "cleardocs",
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
          "name": "proposal_ids",
          "type": "uint64[]"
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
      "name": "document_acceptance",
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
          "name": "adoption_id",
          "type": "uint64"
        },
        {
          "name": "member_id",
          "type": "uint64"
        },
        {
          "name": "accepted_at",
          "type": "uint32"
        }
      ]
    },
    {
      "name": "document_change",
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
          "name": "register_id",
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
          "name": "source_hash",
          "type": "checksum256"
        },
        {
          "name": "expected_revision",
          "type": "uint64"
        },
        {
          "name": "policy_revision",
          "type": "uint64"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "proposer",
          "type": "uint64"
        },
        {
          "name": "proposed_at",
          "type": "uint32"
        },
        {
          "name": "deadline",
          "type": "uint32"
        },
        {
          "name": "adopted_at",
          "type": "uint32"
        },
        {
          "name": "adopted_by",
          "type": "uint64"
        },
        {
          "name": "status",
          "type": "uint8"
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
      "name": "execarb",
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
      "name": "governing_document",
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
          "name": "document_id",
          "type": "uint64"
        },
        {
          "name": "category",
          "type": "uint8"
        },
        {
          "name": "approval",
          "type": "uint8"
        },
        {
          "name": "track_acceptance",
          "type": "bool"
        },
        {
          "name": "revision",
          "type": "uint64"
        },
        {
          "name": "adopted_id",
          "type": "uint64"
        },
        {
          "name": "pending_id",
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
      "name": "grant_ballot_target",
      "base": "",
      "fields": [
        {
          "name": "round",
          "type": "grant_round"
        },
        {
          "name": "application",
          "type": "grant_application"
        },
        {
          "name": "protection",
          "type": "arbitration_terms?"
        },
        {
          "name": "rules_commitment",
          "type": "checksum256"
        },
        {
          "name": "application_commitment",
          "type": "checksum256"
        },
        {
          "name": "decision_commitment",
          "type": "checksum256"
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
      "name": "markpoll",
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
      "name": "milestone_record",
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
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "quantity",
          "type": "asset"
        },
        {
          "name": "due",
          "type": "uint32"
        },
        {
          "name": "status",
          "type": "uint8"
        },
        {
          "name": "submission_doc",
          "type": "uint64"
        },
        {
          "name": "submission_version",
          "type": "uint32"
        },
        {
          "name": "review_doc",
          "type": "uint64"
        },
        {
          "name": "review_version",
          "type": "uint32"
        },
        {
          "name": "reviewer",
          "type": "uint64"
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
      "name": "openarb",
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
          "name": "obligation_id",
          "type": "uint64"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
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
      "name": "openpoll",
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
      "name": "poll_end",
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
          "name": "completed_at",
          "type": "uint32"
        },
        {
          "name": "legacy",
          "type": "bool"
        }
      ]
    },
    {
      "name": "project_record",
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
          "name": "contributor",
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
          "name": "milestones",
          "type": "uint64[]"
        },
        {
          "name": "status",
          "type": "uint8"
        }
      ]
    },
    {
      "name": "proposedoc",
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
          "name": "register_id",
          "type": "uint64"
        },
        {
          "name": "document_version",
          "type": "uint32"
        },
        {
          "name": "expected_revision",
          "type": "uint64"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        }
      ]
    },
    {
      "name": "protected_obligation",
      "base": "",
      "fields": [
        {
          "name": "id",
          "type": "uint64"
        },
        {
          "name": "source",
          "type": "name"
        },
        {
          "name": "source_id",
          "type": "uint64"
        },
        {
          "name": "project_id",
          "type": "uint64"
        },
        {
          "name": "recipient",
          "type": "uint64"
        },
        {
          "name": "version",
          "type": "uint16"
        },
        {
          "name": "source_hash",
          "type": "checksum256"
        },
        {
          "name": "terms",
          "type": "checksum256"
        },
        {
          "name": "rules",
          "type": "arbitration_rules"
        },
        {
          "name": "cutoff",
          "type": "uint32"
        },
        {
          "name": "reviewer",
          "type": "uint64"
        },
        {
          "name": "state",
          "type": "uint8"
        },
        {
          "name": "deadline",
          "type": "uint32"
        },
        {
          "name": "ballot_id",
          "type": "uint64"
        },
        {
          "name": "decision_hash",
          "type": "checksum256"
        },
        {
          "name": "consent_outcome",
          "type": "uint8"
        },
        {
          "name": "consent_mask",
          "type": "uint8"
        },
        {
          "name": "reviewers",
          "type": "uint64[]"
        },
        {
          "name": "submission_doc",
          "type": "uint64"
        },
        {
          "name": "review_doc",
          "type": "uint64"
        },
        {
          "name": "challenge_doc",
          "type": "uint64"
        },
        {
          "name": "submission_version",
          "type": "uint32"
        },
        {
          "name": "review_version",
          "type": "uint32"
        },
        {
          "name": "challenge_version",
          "type": "uint32"
        },
        {
          "name": "submission_commitment",
          "type": "checksum256"
        },
        {
          "name": "review_commitment",
          "type": "checksum256"
        },
        {
          "name": "challenge_commitment",
          "type": "checksum256"
        }
      ]
    },
    {
      "name": "prunevotes",
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
      "name": "regdoc",
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
          "name": "document_id",
          "type": "uint64"
        },
        {
          "name": "category",
          "type": "uint8"
        },
        {
          "name": "approval",
          "type": "uint8"
        },
        {
          "name": "track_acceptance",
          "type": "bool"
        }
      ]
    },
    {
      "name": "releasetgt",
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
          "name": "ballot_ids",
          "type": "uint64[]"
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
      "name": "term_hold",
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
          "name": "padding",
          "type": "bytes"
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
      "name": "vote_identity",
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
          "name": "high_water",
          "type": "uint64"
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
      "name": "votecommit",
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
          "name": "expected",
          "type": "checksum256"
        },
        {
          "name": "choice",
          "type": "uint8"
        }
      ]
    },
    {
      "name": "work_ballot_target",
      "base": "",
      "fields": [
        {
          "name": "project",
          "type": "project_record"
        },
        {
          "name": "milestones",
          "type": "milestone_record[]"
        },
        {
          "name": "agreement",
          "type": "agreement_record?"
        },
        {
          "name": "protection",
          "type": "arbitration_terms?"
        },
        {
          "name": "document_commitment",
          "type": "checksum256"
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
      "name": "ackdoc",
      "type": "ackdoc",
      "ricardian_contract": ""
    },
    {
      "name": "adoptdoc",
      "type": "adoptdoc",
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
      "name": "canceldoc",
      "type": "canceldoc",
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
      "name": "cleardocs",
      "type": "cleardocs",
      "ricardian_contract": ""
    },
    {
      "name": "execarb",
      "type": "execarb",
      "ricardian_contract": ""
    },
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
      "name": "markpoll",
      "type": "markpoll",
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
      "name": "openarb",
      "type": "openarb",
      "ricardian_contract": ""
    },
    {
      "name": "openaward",
      "type": "openaward",
      "ricardian_contract": ""
    },
    {
      "name": "openpoll",
      "type": "openpoll",
      "ricardian_contract": ""
    },
    {
      "name": "openwork",
      "type": "openwork",
      "ricardian_contract": ""
    },
    {
      "name": "proposedoc",
      "type": "proposedoc",
      "ricardian_contract": ""
    },
    {
      "name": "prunevotes",
      "type": "prunevotes",
      "ricardian_contract": ""
    },
    {
      "name": "recall",
      "type": "recall",
      "ricardian_contract": ""
    },
    {
      "name": "regdoc",
      "type": "regdoc",
      "ricardian_contract": ""
    },
    {
      "name": "releasetgt",
      "type": "releasetgt",
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
      "name": "startelect",
      "type": "startelect",
      "ricardian_contract": ""
    },
    {
      "name": "vote",
      "type": "vote",
      "ricardian_contract": ""
    },
    {
      "name": "votecommit",
      "type": "votecommit",
      "ricardian_contract": ""
    }
  ],
  "tables": [
    {
      "name": "arbplans",
      "type": "arbitration_plan",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "ballotdefs",
      "type": "ballot_definition_record",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "ballots",
      "type": "ballot_record",
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
      "name": "docaccepts",
      "type": "document_acceptance",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "docchanges",
      "type": "document_change",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    },
    {
      "name": "docregs",
      "type": "governing_document",
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
      "name": "pollends",
      "type": "poll_end",
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
      "name": "termholds",
      "type": "term_hold",
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
      "name": "voteids",
      "type": "vote_identity",
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
    },
    {
      "name": "votetargets",
      "type": "ballot_target",
      "index_type": "i64",
      "key_names": [],
      "key_types": []
    }
  ],
  "variants": [],
  "ricardian_clauses": [],
  "action_results": []
} satisfies ABI.Def;
export interface ackdoc {
  runtime: string;
  dao_id: string;
  member_id: string;
  adoption_id: string;
}
export interface adoptdoc {
  runtime: string;
  dao_id: string;
  member_id: string;
  proposal_id: string;
}
export interface agreement_record {
  project_id: string;
  dao_id: string;
  schema_version: number;
  term_start: number;
  term_end: number;
  terms: string;
  accepted: boolean;
  accepted_at: number;
}
export interface arbitration_plan {
  ballot_id: string;
  dao_id: string;
  protection: protected_obligation;
  quantity: string;
  due: number;
  voters: arbitration_voter[];
  executed: boolean;
  version: number;
  cursor: string;
  scanned: number;
  ready: boolean;
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
export interface arbitration_voter {
  member_id: string;
  weight: string;
}
export interface archive_prune_proof {
  primary_key: string;
  siblings: string[];
}
export interface backfillrefs {
  runtime: string;
  dao_id: string;
  table: string;
  limit: number;
}
export interface ballot_definition_record {
  ballot_id: string;
  dao_id: string;
  version: number;
  purpose: number;
  policy_revision: string;
  policy_hash: string;
  commitment: string;
}
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
export interface ballot_target {
  ballot_id: string;
  dao_id: string;
  version: number;
  work?: work_ballot_target | undefined;
  grant?: grant_ballot_target | undefined;
  released: boolean;
}
export interface bindrampool {
  runtime: string;
}
export interface canceldoc {
  runtime: string;
  dao_id: string;
  member_id: string;
  proposal_id: string;
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
export interface cleardocs {
  runtime: string;
  dao_id: string;
  proposal_ids: string[];
}
export interface closure_check {
  dao_id: string;
  code_hash: string;
  closing_at: number;
  stage: number;
  cursor: string;
  complete: boolean;
}
export interface document_acceptance {
  id: string;
  dao_id: string;
  adoption_id: string;
  member_id: string;
  accepted_at: number;
}
export interface document_change {
  id: string;
  dao_id: string;
  register_id: string;
  document_id: string;
  document_version: number;
  commitment: string;
  source_hash: string;
  expected_revision: string;
  policy_revision: string;
  ballot_id: string;
  proposer: string;
  proposed_at: number;
  deadline: number;
  adopted_at: number;
  adopted_by: string;
  status: number;
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
export interface execarb {
  runtime: string;
  dao_id: string;
  ballot_id: string;
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
export interface governing_document {
  id: string;
  dao_id: string;
  document_id: string;
  category: number;
  approval: number;
  track_acceptance: boolean;
  revision: string;
  adopted_id: string;
  pending_id: string;
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
export interface grant_ballot_target {
  round: grant_round;
  application: grant_application;
  protection?: arbitration_terms | undefined;
  rules_commitment: string;
  application_commitment: string;
  decision_commitment: string;
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
export interface markpoll {
  runtime: string;
  dao_id: string;
  ballot_id: string;
}
export interface milestone_record {
  id: string;
  dao_id: string;
  project_id: string;
  quantity: string;
  due: number;
  status: number;
  submission_doc: string;
  submission_version: number;
  review_doc: string;
  review_version: number;
  reviewer: string;
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
export interface openarb {
  runtime: string;
  dao_id: string;
  obligation_id: string;
  ballot_id: string;
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
export interface openpoll {
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
export interface poll_end {
  ballot_id: string;
  dao_id: string;
  completed_at: number;
  legacy: boolean;
}
export interface project_record {
  id: string;
  dao_id: string;
  creator: string;
  contributor: string;
  document_id: string;
  document_version: number;
  milestones: string[];
  status: number;
}
export interface proposedoc {
  runtime: string;
  dao_id: string;
  member_id: string;
  register_id: string;
  document_version: number;
  expected_revision: string;
  ballot_id: string;
}
export interface protected_obligation {
  id: string;
  source: string;
  source_id: string;
  project_id: string;
  recipient: string;
  version: number;
  source_hash: string;
  terms: string;
  rules: arbitration_rules;
  cutoff: number;
  reviewer: string;
  state: number;
  deadline: number;
  ballot_id: string;
  decision_hash: string;
  consent_outcome: number;
  consent_mask: number;
  reviewers: string[];
  submission_doc: string;
  review_doc: string;
  challenge_doc: string;
  submission_version: number;
  review_version: number;
  challenge_version: number;
  submission_commitment: string;
  review_commitment: string;
  challenge_commitment: string;
}
export interface prunevotes {
  runtime: string;
  dao_id: string;
  archive_id: string;
  chunk_ordinal: number;
  start: number;
  proofs: archive_prune_proof[];
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
export interface recall {
  runtime: string;
  dao_id: string;
  member_id: string;
  term_id: string;
  document_id: string;
  document_version: number;
}
export interface regdoc {
  runtime: string;
  dao_id: string;
  member_id: string;
  document_id: string;
  category: number;
  approval: number;
  track_acceptance: boolean;
}
export interface releasetgt {
  runtime: string;
  dao_id: string;
  ballot_ids: string[];
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
export interface startelect {
  runtime: string;
  dao_id: string;
  member_id: string;
  election_id: string;
}
export interface term_hold {
  id: string;
  dao_id: string;
  padding: string;
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
export interface vote_identity {
  id: string;
  dao_id: string;
  high_water: string;
}
export interface vote_record {
  id: string;
  ballot: string;
  member: string;
  weight: string;
  choice: number;
}
export interface votecommit {
  runtime: string;
  dao_id: string;
  member_id: string;
  ballot_id: string;
  expected: string;
  choice: number;
}
export interface work_ballot_target {
  project: project_record;
  milestones: milestone_record[];
  agreement?: agreement_record | undefined;
  protection?: arbitration_terms | undefined;
  document_commitment: string;
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
  ackdoc: ackdoc;
  adoptdoc: adoptdoc;
  backfillrefs: backfillrefs;
  bindrampool: bindrampool;
  canceldoc: canceldoc;
  checkmig: checkmig;
  checkquota: checkquota;
  clearclose: clearclose;
  cleardocs: cleardocs;
  execarb: execarb;
  execute: execute;
  executeaward: executeaward;
  finalize: finalize;
  markpoll: markpoll;
  newelect: newelect;
  nominate: nominate;
  open: open;
  openarb: openarb;
  openaward: openaward;
  openpoll: openpoll;
  openwork: openwork;
  proposedoc: proposedoc;
  prunevotes: prunevotes;
  recall: recall;
  regdoc: regdoc;
  releasetgt: releasetgt;
  scanclose: scanclose;
  scanram: scanram;
  startelect: startelect;
  vote: vote;
  votecommit: votecommit;
}
