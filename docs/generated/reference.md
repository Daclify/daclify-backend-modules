# Daclify modules reference

Package 0.3.0-alpha.1 · interface 1.

Generated from compiled ABI and canonical API schemas. Field layout does not describe all contract business rules; read the matching explanatory guides.

## Weights with an explicit snapshot

Choose equal active member voting, internal governance credits, or deposited native stake. Pick quorum and approval thresholds before opening a ballot.

A ballot snapshots its eligible denominator and highest member ID. Active ballots freeze issuance, stake changes, and reactivation so a voter cannot change their weight during voting.

Closing and finalization are separate from execution. A passed proposal does not authorize arbitrary contract calls. Executors require bounded, explicitly configured effects.

After the closing time, select Finalize ballot to calculate its result and release its expired governance lock. The service only forwards the reviewed Decide finalization action. Finalization is idempotent and remains available for a compatible, verified deployment after disabling new member actions.

DAOs with a saved governance policy must use its exact ballot settings. A funding vote binds one proposed Works project and all milestone records; ordinary ballots remain advisory.

## Fund work through milestones

A proposal names a contributor, a deliverable reference, and bounded milestone payments. Funds must be reserved before commitment.

Submission and review are separate permissions. A contributor cannot approve their own work. A reviewer can request changes and the contributor can submit a revision. A separate dispute or arbitration process is not implemented in this release.

Approval records a backed obligation. A job retry or duplicate submission cannot create a second payment for the same milestone.

Publish the proposal document, propose work, and have an administrator accept its funded milestones. The contributor publishes evidence and submits its document reference. A different member with reviewer permission publishes a review reference and approves or requests changes. Approved payments are settled separately. Cancelling a project releases unapproved reservations while preserving approved payments.

When governed Works funding is enabled, direct administrator acceptance is rejected. An approved funding ballot reserves the pinned project; contributor submission and independent review are still required before payment.

## Funded payroll with a clear end date

A payroll commitment names a DAO contributor, exact native-token amount, start date, payment interval and a bounded number of installments. The full term must be funded before commitment.

Committed installments are approved liabilities. They remain payable after module removal, account offboarding or subscription expiry. Settlement after its due time is separate from approval.

This initial contract uses fixed terms of at most twelve installments. Renewal is a new funded commitment. It does not promise an unfunded, automatically renewable salary.

Choose a future first-installment time in UTC. The interval between installments is the claim frequency. The UI shows each installment’s due time, the schedule label, whether settlement is paused, and the core obligation state. Once due, settlement remains available after payroll is disabled; disabling the module prevents new commitments and does not cancel an approved term.

One settlement pays every installment that is already due, oldest first, and leaves any later installment unpaid. A paused schedule pays nothing until an administrator resumes it. Pause and the last payout time remain after the module is removed. An administrator can change the short label without changing the funded amount, the recipient, or the interval. The recipient is the member stored on the approved obligation, and the only treasury is the DAO treasury in its configured asset. A direct treasury payment can still pay one approved obligation and does not apply this schedule.

## Read the matching module reference

Each reference bundle identifies the module package and interface version it describes. The module read API reports deployment versions, configured permissions and code verification alongside current ballots, projects and payroll entries.

The configuration reference is generated from the producer's validation schemas. Decide settings are selected for each ballot. Works currently uses a fixed limit of sixteen milestones and independent review; payroll uses a fixed limit of twelve installments. Installing a module does not yet persist custom Works or payroll settings.

Generated action and table fields describe serialized structure. They do not replace the contributor, reviewer, funding, timing and authorization rules in the explanatory guides. A code or version mismatch must be resolved before relying on a guide for an installed deployment.

Core now persists the DAO ballot policy and commitment limits. Module installation does not provide arbitrary custom Works or payroll policies. The executor supports only a specific Works project, not arbitrary contract calls.

## Vote on a specific Works project

Publish the deliverable reference, propose milestone work, then select Propose funding vote. The contract opens a binary vote using the DAO policy and pins the project, contributor, document version, milestone amounts and due times, runtime, module code and policy revision.

After closing, finalize the ballot. Only a passed, finalized result can execute. Execute approved funding reserves all milestones atomically and at most once. A failed reservation rolls back the execution flag. The native contract accepts permissionless execution; the hosted API requires a signed-in account and applies sponsorship limits.

Execution expires seven days after the scheduled closing time. Changed or cancelled projects, a changed policy revision, missing modules, replaced code, a guardian pause or insufficient funding prevent execution. A second passed ballot for an already funded project cannot reserve it again.

Funding approval does not approve a deliverable. The contributor submits evidence and a different administrator or reviewer accepts it before settlement. Distinct member keys do not prove different operators; admission and review policy must address conflicts. Existing approved liabilities remain payable after module removal, subject to a temporary guardian pause.

Advisory ballots cannot be repurposed as funding authority. There is no arbitrary-action executor, game-result oracle, secret ballot or independent-operator verification in this release.

## decide contract

Source ABI JSON SHA-256: `1c480fcf81851dc918b243573b48fb474030cb7876c1ff7386f808b23205e3c0`.

### Action: execute

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| ballot_id | uint64 |

### Action: finalize

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| ballot_id | uint64 |

### Action: open

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| ballot_id | uint64 |
| kind | uint8 |
| choices | uint8 |
| duration | uint32 |
| quorum | uint16 |
| approval | uint16 |
| metadata | string |

### Action: openwork

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| ballot_id | uint64 |
| works | name |
| project_id | uint64 |
| duration | uint32 |
| quorum | uint16 |
| approval | uint16 |
| metadata | string |

### Action: vote

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| ballot_id | uint64 |
| choice | uint8 |

### Table: ballots

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| creator | uint64 |
| kind | uint8 |
| choices | uint8 |
| closes | uint32 |
| quorum | uint16 |
| approval | uint16 |
| denominator | uint64 |
| max_member | uint64 |
| cast | uint64 |
| tallies | uint64[] |
| status | uint8 |
| winner | int16 |
| metadata | string |

### Table: executions

| Field | ABI type |
| --- | --- |
| ballot_id | uint64 |
| dao_id | uint64 |
| works | name |
| project_id | uint64 |
| commitment | checksum256 |
| works_hash | checksum256 |
| policy_revision | uint64 |
| deadline | uint32 |
| executed | bool |

### Table: votes

| Field | ABI type |
| --- | --- |
| id | uint64 |
| ballot | uint64 |
| member | uint64 |
| weight | uint64 |
| choice | uint8 |

## works contract

Source ABI JSON SHA-256: `fe2ba5568cec281572aabbc3086f7c83d9c1293342c6ec1e6bffd3eb6bb992a3`.

### Action: accept

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| project_id | uint64 |

### Action: cancel

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| project_id | uint64 |

### Action: govaccept

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| project_id | uint64 |
| ballot_id | uint64 |

### Action: propose

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| project_id | uint64 |
| contributor | uint64 |
| document_id | uint64 |
| document_version | uint32 |
| payments | asset[] |
| dues | uint32[] |

### Action: review

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| milestone_id | uint64 |
| approve | bool |
| document_id | uint64 |
| document_version | uint32 |

### Action: settle

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| milestone_id | uint64 |

### Action: submitwork

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| milestone_id | uint64 |
| document_id | uint64 |
| document_version | uint32 |

### Table: milestones

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| project_id | uint64 |
| quantity | asset |
| due | uint32 |
| status | uint8 |
| submission_doc | uint64 |
| submission_version | uint32 |
| review_doc | uint64 |
| review_version | uint32 |
| reviewer | uint64 |

### Table: projects

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| creator | uint64 |
| contributor | uint64 |
| document_id | uint64 |
| document_version | uint32 |
| milestones | uint64[] |
| status | uint8 |

## payroll contract

Source ABI JSON SHA-256: `eba6046a954cba2281f8edc73fbac92198096892e9f58a1092b1c6041d98a5a2`.

### Action: commit

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| schedule_id | uint64 |
| recipient | uint64 |
| quantity | asset |
| periods | uint8 |
| interval | uint32 |
| starts | uint32 |

### Action: edit

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| schedule_id | uint64 |
| paused | uint8 |
| label | string |

### Action: settle

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| entry_id | uint64 |

### Table: controls

| Field | ABI type |
| --- | --- |
| schedule_id | uint64 |
| paused | uint8 |
| last_payout | uint32 |
| label | string |

### Table: entries

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| schedule_id | uint64 |
| due | uint32 |

### Table: schedules

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| creator | uint64 |
| recipient | uint64 |
| quantity | asset |
| periods | uint8 |
| interval | uint32 |
| starts | uint32 |
| entries | uint64[] |

## GET /v1/daos/:id/modules

Guide: module-reference.

No request body.

Response:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "dao": {
      "type": "object",
      "properties": {
        "chainId": {
          "type": "string",
          "pattern": "^[0-9a-f]{64}$"
        },
        "contract": {
          "type": "string",
          "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
        },
        "daoId": {
          "type": "string",
          "maxLength": 20
        },
        "interfaceVersion": {
          "type": "number",
          "const": 1
        }
      },
      "required": [
        "chainId",
        "contract",
        "daoId",
        "interfaceVersion"
      ],
      "additionalProperties": false
    },
    "modules": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "deployment": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "enum": [
                  "decide",
                  "works",
                  "payroll"
                ]
              },
              "account": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "version": {
                "type": "string"
              },
              "codeHash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "id",
              "account",
              "version",
              "codeHash"
            ],
            "additionalProperties": false
          },
          "manifest": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "pattern": "^[a-z][a-z0-9-]{0,31}$"
              },
              "version": {
                "type": "string"
              },
              "coreRange": {
                "type": "string"
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              },
              "configVersion": {
                "type": "integer",
                "minimum": 1,
                "maximum": 9007199254740991
              },
              "capabilities": {
                "maxItems": 16,
                "type": "array",
                "items": {
                  "type": "string",
                  "enum": [
                    "ballot.create",
                    "ballot.finalize",
                    "ballot.execute",
                    "obligation.create",
                    "obligation.execute",
                    "member.manage",
                    "credit.issue",
                    "content.publish",
                    "notification.send"
                  ]
                }
              },
              "helpTopic": {
                "type": "string",
                "pattern": "^[a-z][a-z0-9.-]{1,63}$"
              }
            },
            "required": [
              "id",
              "version",
              "coreRange",
              "interfaceVersion",
              "configVersion",
              "capabilities",
              "helpTopic"
            ],
            "additionalProperties": false
          },
          "enabled": {
            "type": "boolean"
          },
          "compatible": {
            "type": "boolean"
          },
          "codeVerified": {
            "type": "boolean"
          },
          "actions": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
            }
          },
          "grants": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
            }
          }
        },
        "required": [
          "deployment",
          "manifest",
          "enabled",
          "compatible",
          "codeVerified",
          "actions",
          "grants"
        ],
        "additionalProperties": false
      }
    },
    "ballots": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "maxLength": 20
          },
          "dao_id": {
            "type": "string",
            "maxLength": 20
          },
          "creator": {
            "type": "string",
            "maxLength": 20
          },
          "kind": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          },
          "choices": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          },
          "closes": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "quorum": {
            "type": "integer",
            "minimum": 0,
            "maximum": 65535
          },
          "approval": {
            "type": "integer",
            "minimum": 0,
            "maximum": 65535
          },
          "denominator": {
            "type": "string",
            "maxLength": 20
          },
          "max_member": {
            "type": "string",
            "maxLength": 20
          },
          "cast": {
            "type": "string",
            "maxLength": 20
          },
          "tallies": {
            "maxItems": 64,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 20
            }
          },
          "status": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          },
          "winner": {
            "type": "integer",
            "minimum": -32768,
            "maximum": 32767
          },
          "metadata": {
            "type": "string",
            "maxLength": 16384
          }
        },
        "required": [
          "id",
          "dao_id",
          "creator",
          "kind",
          "choices",
          "closes",
          "quorum",
          "approval",
          "denominator",
          "max_member",
          "cast",
          "tallies",
          "status",
          "winner",
          "metadata"
        ],
        "additionalProperties": false
      }
    },
    "votes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "maxLength": 20
          },
          "ballot": {
            "type": "string",
            "maxLength": 20
          },
          "member": {
            "type": "string",
            "maxLength": 20
          },
          "weight": {
            "type": "string",
            "maxLength": 20
          },
          "choice": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          }
        },
        "required": [
          "id",
          "ballot",
          "member",
          "weight",
          "choice"
        ],
        "additionalProperties": false
      }
    },
    "projects": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "maxLength": 20
          },
          "dao_id": {
            "type": "string",
            "maxLength": 20
          },
          "creator": {
            "type": "string",
            "maxLength": 20
          },
          "contributor": {
            "type": "string",
            "maxLength": 20
          },
          "document_id": {
            "type": "string",
            "maxLength": 20
          },
          "document_version": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "milestones": {
            "maxItems": 64,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 20
            }
          },
          "status": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          }
        },
        "required": [
          "id",
          "dao_id",
          "creator",
          "contributor",
          "document_id",
          "document_version",
          "milestones",
          "status"
        ],
        "additionalProperties": false
      }
    },
    "milestones": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "maxLength": 20
          },
          "dao_id": {
            "type": "string",
            "maxLength": 20
          },
          "project_id": {
            "type": "string",
            "maxLength": 20
          },
          "quantity": {
            "type": "string",
            "maxLength": 64,
            "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
          },
          "due": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "status": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          },
          "submission_doc": {
            "type": "string",
            "maxLength": 20
          },
          "submission_version": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "review_doc": {
            "type": "string",
            "maxLength": 20
          },
          "review_version": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "reviewer": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "id",
          "dao_id",
          "project_id",
          "quantity",
          "due",
          "status",
          "submission_doc",
          "submission_version",
          "review_doc",
          "review_version",
          "reviewer"
        ],
        "additionalProperties": false
      }
    },
    "schedules": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "maxLength": 20
          },
          "dao_id": {
            "type": "string",
            "maxLength": 20
          },
          "creator": {
            "type": "string",
            "maxLength": 20
          },
          "recipient": {
            "type": "string",
            "maxLength": 20
          },
          "quantity": {
            "type": "string",
            "maxLength": 64,
            "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
          },
          "periods": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          },
          "interval": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "starts": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "entries": {
            "maxItems": 64,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 20
            }
          }
        },
        "required": [
          "id",
          "dao_id",
          "creator",
          "recipient",
          "quantity",
          "periods",
          "interval",
          "starts",
          "entries"
        ],
        "additionalProperties": false
      }
    },
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "maxLength": 20
          },
          "dao_id": {
            "type": "string",
            "maxLength": 20
          },
          "schedule_id": {
            "type": "string",
            "maxLength": 20
          },
          "due": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          }
        },
        "required": [
          "id",
          "dao_id",
          "schedule_id",
          "due"
        ],
        "additionalProperties": false
      }
    },
    "controls": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "schedule_id": {
            "type": "string",
            "maxLength": 20
          },
          "paused": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          },
          "last_payout": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "label": {
            "type": "string",
            "maxLength": 16384
          }
        },
        "required": [
          "schedule_id",
          "paused",
          "last_payout",
          "label"
        ],
        "additionalProperties": false
      }
    },
    "executions": {
      "default": [],
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "ballot_id": {
            "type": "string",
            "maxLength": 20
          },
          "dao_id": {
            "type": "string",
            "maxLength": 20
          },
          "works": {
            "type": "string",
            "maxLength": 13
          },
          "project_id": {
            "type": "string",
            "maxLength": 20
          },
          "commitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "works_hash": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "policy_revision": {
            "type": "string",
            "maxLength": 20
          },
          "deadline": {
            "type": "integer",
            "minimum": 0,
            "maximum": 4294967295
          },
          "executed": {
            "type": "boolean"
          }
        },
        "required": [
          "ballot_id",
          "dao_id",
          "works",
          "project_id",
          "commitment",
          "works_hash",
          "policy_revision",
          "deadline",
          "executed"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "dao",
    "modules",
    "ballots",
    "votes",
    "projects",
    "milestones",
    "schedules",
    "entries",
    "controls",
    "executions"
  ],
  "additionalProperties": false
}
```

## POST /v1/decide/finalize

Guide: decide.

Request:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "dao": {
      "type": "object",
      "properties": {
        "chainId": {
          "type": "string",
          "pattern": "^[0-9a-f]{64}$"
        },
        "contract": {
          "type": "string",
          "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
        },
        "daoId": {
          "type": "string",
          "maxLength": 20
        },
        "interfaceVersion": {
          "type": "number",
          "const": 1
        }
      },
      "required": [
        "chainId",
        "contract",
        "daoId",
        "interfaceVersion"
      ],
      "additionalProperties": false
    },
    "ballotId": {
      "type": "string",
      "maxLength": 20
    }
  },
  "required": [
    "dao",
    "ballotId"
  ],
  "additionalProperties": false
}
```

Response:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "const": "finalized"
        },
        "transactionId": {
          "type": "string",
          "pattern": "^[0-9a-f]{64}$"
        }
      },
      "required": [
        "state",
        "transactionId"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "const": "already-finalized"
        }
      },
      "required": [
        "state"
      ],
      "additionalProperties": false
    }
  ]
}
```

## POST /v1/decide/execute

Guide: governed-funding.

Request:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "dao": {
      "type": "object",
      "properties": {
        "chainId": {
          "type": "string",
          "pattern": "^[0-9a-f]{64}$"
        },
        "contract": {
          "type": "string",
          "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
        },
        "daoId": {
          "type": "string",
          "maxLength": 20
        },
        "interfaceVersion": {
          "type": "number",
          "const": 1
        }
      },
      "required": [
        "chainId",
        "contract",
        "daoId",
        "interfaceVersion"
      ],
      "additionalProperties": false
    },
    "ballotId": {
      "type": "string",
      "maxLength": 20
    }
  },
  "required": [
    "dao",
    "ballotId"
  ],
  "additionalProperties": false
}
```

Response:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "const": "executed"
        },
        "transactionId": {
          "type": "string",
          "pattern": "^[0-9a-f]{64}$"
        }
      },
      "required": [
        "state",
        "transactionId"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "const": "already-executed"
        }
      },
      "required": [
        "state"
      ],
      "additionalProperties": false
    }
  ]
}
```

## decide configuration

Module 0.3.0-alpha.1 · config 1 · core ^0.3.0-alpha.1.

Capabilities: ballot.create, ballot.finalize, ballot.execute.

Guide: decide.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "configVersion": {
      "type": "number",
      "const": 1
    },
    "weight": {
      "type": "string",
      "enum": [
        "member",
        "credit",
        "native-stake"
      ]
    },
    "duration": {
      "type": "integer",
      "minimum": 60,
      "maximum": 2592000
    },
    "quorumBasisPoints": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000
    },
    "approvalBasisPoints": {
      "type": "integer",
      "minimum": 5001,
      "maximum": 10000
    }
  },
  "required": [
    "configVersion",
    "weight",
    "duration",
    "quorumBasisPoints",
    "approvalBasisPoints"
  ],
  "additionalProperties": false
}
```

## works configuration

Module 0.3.0-alpha.1 · config 1 · core ^0.3.0-alpha.1.

Capabilities: obligation.create, obligation.execute.

Guide: works.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "configVersion": {
      "type": "number",
      "const": 1
    },
    "maxMilestones": {
      "type": "integer",
      "minimum": 1,
      "maximum": 16
    },
    "reviewPolicy": {
      "type": "string",
      "const": "independent-reviewer"
    }
  },
  "required": [
    "configVersion",
    "maxMilestones",
    "reviewPolicy"
  ],
  "additionalProperties": false
}
```

## payroll configuration

Module 0.3.0-alpha.1 · config 1 · core ^0.3.0-alpha.1.

Capabilities: obligation.create, obligation.execute.

Guide: payroll.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "configVersion": {
      "type": "number",
      "const": 1
    },
    "maxPeriods": {
      "type": "integer",
      "minimum": 1,
      "maximum": 12
    },
    "minIntervalSeconds": {
      "type": "integer",
      "minimum": 86400,
      "maximum": 2678400
    }
  },
  "required": [
    "configVersion",
    "maxPeriods",
    "minIntervalSeconds"
  ],
  "additionalProperties": false
}
```
