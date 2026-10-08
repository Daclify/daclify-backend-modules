// Generated from producer-owned guides, compiled ABI and module schemas.
import type {HelpBundle} from '@daclify/core-protocol';
export const ModulesHelpBundle={
  "producer": "modules",
  "packageVersion": "0.7.0-alpha.1",
  "interfaceVersion": 1,
  "topics": [
    {
      "id": "decide",
      "title": "Weights with an explicit snapshot",
      "paragraphs": [
        "Choose equal active member voting, internal governance credits, or deposited native stake. Pick quorum and approval thresholds before opening a ballot.",
        "A ballot snapshots its eligible denominator and highest member ID. Active ballots freeze issuance, stake changes, and reactivation so a voter cannot change their weight during voting.",
        "Closing and finalization are separate from execution. A passed proposal does not authorize arbitrary contract calls. Executors require bounded, explicitly configured effects.",
        "After the closing time, select Finalize ballot to calculate its result and release its expired governance lock. The service only forwards the reviewed Decide finalization action. Finalization is idempotent and remains available for a compatible, verified deployment after disabling new member actions.",
        "DAOs with a saved governance policy must use its exact ballot settings. A funding vote binds one proposed Works project and all milestone records; ordinary ballots remain advisory."
      ]
    },
    {
      "id": "works",
      "title": "Fund work through milestones",
      "paragraphs": [
        "A proposal names a contributor, a deliverable reference, and bounded milestone payments. Funds must be reserved before commitment.",
        "Submission and review are separate permissions. A contributor cannot approve their own work. A reviewer can request changes and the contributor can submit a revision. A separate dispute or arbitration process is not implemented in this release.",
        "Approval records a backed obligation. A job retry or duplicate submission cannot create a second payment for the same milestone.",
        "Publish the proposal document, propose work, and have an administrator accept its funded milestones. The contributor publishes evidence and submits its document reference. A different active administrator or member with reviewer permission publishes a review reference and approves or requests changes. Approved payments are settled separately. Cancelling a project releases unapproved reservations while preserving approved payments.",
        "When governed Works funding is enabled, direct administrator acceptance is rejected. An approved funding ballot reserves the pinned project; contributor submission and independent review are still required before payment."
      ]
    },
    {
      "id": "payroll",
      "title": "Funded payroll with a clear end date",
      "paragraphs": [
        "A payroll commitment names a DAO contributor, exact native-token amount, start date, payment interval and a bounded number of installments. The full term must be funded before commitment.",
        "Committed installments are approved liabilities. They remain payable after module removal, account offboarding or subscription expiry. Settlement after its due time is separate from approval.",
        "This initial contract uses fixed terms of at most twelve installments. Renewal is a new funded commitment. It does not promise an unfunded, automatically renewable salary.",
        "Choose a future first-installment time in UTC. The interval between installments is the claim frequency. The UI shows each installment’s due time, the schedule label, whether settlement is paused, and the core obligation state. Once due, settlement remains available after payroll is disabled; disabling the module prevents new commitments and does not cancel an approved term.",
        "One settlement pays every installment that is already due, oldest first, and leaves any later installment unpaid. Pausing a schedule stops the payroll settlement helper until an administrator resumes it. It does not stop direct Treasury payment of an approved, due obligation. Only the separate DAO guardian pause blocks those obligation payments. Pause and the last payout time remain after the module is removed. An administrator can change the short label without changing the funded amount, the recipient, or the interval. The recipient is the member stored on the approved obligation, and the only treasury is the DAO treasury in its configured asset. A direct treasury payment can still pay one approved obligation and does not apply this schedule."
      ]
    },
    {
      "id": "module-reference",
      "title": "Read the matching module reference",
      "paragraphs": [
        "Each reference bundle identifies the module package and interface version it describes. The module read API reports deployment versions, configured permissions and code verification alongside current ballots, projects and payroll entries.",
        "The configuration reference is generated from the producer's validation schemas. Decide settings are selected for each ballot. Works currently uses a fixed limit of sixteen milestones and independent review; payroll uses a fixed limit of twelve installments. Installing a module does not yet persist custom Works or payroll settings.",
        "Generated action and table fields describe serialized structure. They do not replace the contributor, reviewer, funding, timing and authorization rules in the explanatory guides. A code or version mismatch must be resolved before relying on a guide for an installed deployment.",
        "Core now persists the DAO ballot policy and commitment limits. Module installation does not provide arbitrary custom Works or payroll policies. The executor supports only a specific Works project, not arbitrary contract calls.",
        "Module history is paged by DAO and related parent records. Continue using each non-null next cursor; use done for a collection that is complete. A continuation page can contain no records for your DAO while still providing an advancing cursor through shared primary rows. Votes are returned for the requested member, not all shared votes. Disabled installations remain readable so old obligations and ballot finalization are not lost. Signing controls require active membership, unlocked keys and the exact installed action grant."
      ]
    },
    {
      "id": "governed-funding",
      "title": "Vote on a specific Works project",
      "paragraphs": [
        "Publish the deliverable reference, propose milestone work, then select Propose funding vote. The contract opens a binary vote using the DAO policy and pins the project, contributor, document version, milestone amounts and due times, runtime, module code and policy revision.",
        "After closing, finalize the ballot. Only a passed, finalized result can execute. Execute approved funding reserves all milestones atomically and at most once. A failed reservation rolls back the execution flag. The native contract accepts permissionless execution; the hosted API requires a signed-in account and applies sponsorship limits.",
        "Execution expires seven days after the scheduled closing time. Changed or cancelled projects, a changed policy revision, missing modules, replaced code, a guardian pause or insufficient funding prevent execution. A second passed ballot for an already funded project cannot reserve it again.",
        "Funding approval does not approve a deliverable. The contributor submits evidence and a different administrator or reviewer accepts it before settlement. Distinct member keys do not prove different operators; admission and review policy must address conflicts. Existing approved liabilities remain payable after module removal, subject to a temporary guardian pause.",
        "Advisory ballots cannot be repurposed as funding authority. There is no arbitrary-action executor, game-result oracle, secret ballot or independent-operator verification in this release."
      ]
    },
    {
      "id": "contribution-agreements",
      "title": "Contribution agreements and member services",
      "paragraphs": [
        "Start in Documents: publish a scope/deliverables document, encrypted for a private DAO. Propose a Works project with contributor, native milestone amounts and due dates. Offer a contribution agreement on that proposed project and set a term containing every milestone due date (maximum one year).",
        "The designated active contributor must sign agreement acceptance. Consent commits the exact document version/content commitment, project/contributor, native milestone amounts/dues and term. A funding vote or administrator acceptance cannot reserve an unaccepted agreement. Funding still requires the DAO policy and full backing.",
        "Review belongs to the actual DAO reviewer/admin team. Contributors cannot review their own work, even if they hold a reviewer role. Cancellation preserves already approved obligations; use a successor project and fresh consent for changed terms. Existing ordinary Works projects need no new agreement record.",
        "A version 1 contribution-agreement document includes type, dao reference, contributor, title, scope, deliverables, optional roleTitle, term {start,end} in native epoch seconds, native asset reference, milestones [{amount,due}] in integer base units, reviewPolicy dao-review-team and cancellationPolicy preserve-approved-liabilities. Terms shown on chain govern the enforced money flow. Narrative role titles grant no privileges and this is not legal contract certification.",
        "A public version 1 service-offer document includes type service-offer, dao reference, memberId matching its author, title, summary and skills. The catalogue reads the latest authored public JSON document from active members. Choose an offer to prefill a Works contributor. Encrypted narratives stay in Documents; a service listing holds no funds and is separate from the platform module Marketplace.",
        "Milestone agreements and Payroll are separate compensation lifecycles. Do not fund both for the same work period. Basic proposal, consent, evidence, review, claim and export remain free; optional hosted reminders and dashboards cannot revoke approved liabilities.",
        "An upgrade changes a module code hash. Existing project/milestone rows and liabilities are preserved. A pending code-pinned funding plan needs renewed authorization against the reviewed upgrade; a preserved document commitment alone does not authorize a changed executable."
      ]
    },
    {
      "id": "grants-rounds",
      "title": "Apply for a fully backed grant",
      "paragraphs": [
        "An administrator freezes rules and document versions, native-asset lifetime award cap, participant eligibility and application/review/award deadlines. A cap reserves no Treasury funds. Matching and donor pots are not part of these rounds.",
        "The applicant creates or amends their own application with exact document version, native milestone payments and due dates, and a bounded contribution term. Submit application is explicit consent to those terms. Amendment increments revision and removes consent and eligibility; submit and review again.",
        "An administrator reviews eligibility using a decision document. Eligibility authorizes no spending. A Decide award vote pins the application revision/commitment, DAO policy and grant/Works code. Only a passed finalized vote can execute before the award cutoff.",
        "Execution atomically checks the round cap, creates a Works agreement accepted by the applicant submission and reserves every milestone from real Treasury funds. If any cap, backing, identity, policy or code check fails, nothing is awarded or reserved. Delivery, independent review, cancellation and once-only settlement then use Works and Treasury.",
        "Awarded is the cumulative committed award amount, not a current cash balance. Cancellation does not reopen the lifetime cap. Private narrative belongs in encrypted Documents; on-chain terms, membership, votes and asset amounts remain public. Changing the application or review invalidates its earlier vote."
      ]
    },
    {
      "id": "endorsement-admission",
      "title": "Join with member endorsements",
      "paragraphs": [
        "Administrator admission remains the default. Enable the endorsement module, then an administrator explicitly sets the core admission policy, threshold (1–20), whether agents may endorse and an optional administrator override. The override is disabled by default. Owners and signed administrator admission cannot bypass a policy without that disclosed override.",
        "A current member sponsors the applicant’s public join identity and exact application document version, kind/operator and expiry. Verify the public keys through a trusted channel. Applications last at most 30 days. Sponsoring is not proof of unique personhood; multiple paired credentials add no endorsement weight.",
        "Distinct current eligible member IDs endorse an exact revision; they can withdraw their endorsement before admission. Amending or renewing by the same sponsor increments the revision and clears old endorsements. A policy revision invalidates earlier applications. At most 64 endorsements are stored; amend to reset a stale list if needed.",
        "Admission rechecks current active, guardian-revoked and self-endorsement status, threshold, expiry, source code pin and complete identity. The authenticated module callback adds one ordinary member once. It cannot assign roles, issue credits or reserve assets. Native or EVM wallet governance authorization is activated separately after joining.",
        "DAO administrators may change the admission policy or explicitly enable administrator override. Member endorsement is a configurable admission rule, not a unique-human guarantee. Private membership grants and history access remain separate approvals; admission itself decrypts no documents."
      ]
    },
    {
      "id": "representative-elections",
      "title": "Elect representatives for a fixed term",
      "paragraphs": [
        "An administrator creates a named representative election, exact rules document version, future nomination cutoff, one to eight seats and a term of at most one year. The term must allow the saved DAO voting duration after nominations close. Candidate and voter identities are stable member IDs; paired logins add no votes.",
        "Each active member nominates only themselves or withdraws before the cutoff. At most fifteen current eligible candidates plus the abstention choice enter voting. Withdrawal removes a nomination slot. Inactive or guardian-revoked nominations can be cleared when another member nominates. There is no random group assignment or meeting attendance oracle.",
        "After nominations close, any active member may start the election before the term’s start. A changed policy revision prevents starting; schedule a successor election with reviewed rules. Starting freezes the sorted candidate IDs, exact DAO quorum/weight and normal voting denominator/highest member snapshot. One member votes once for one candidate or explicit abstention.",
        "Finalization requires the frozen quorum; the yes/no approval majority is not used to rank candidates. Positive candidate tallies rank by weight. A tied group is installed only when the whole group fits remaining seats; a tie crossing the seat boundary leaves those seats vacant. No quorum or abstention-only voting creates no terms. Inactive or revoked winners leave their ranked seats vacant, without promoting a runner-up. Finalizing after the term ends creates no terms.",
        "A durable term records its exact start/end and recall. The term window starts no earlier than that date; actual membership must remain eligible. An administrator can recall a term with a reason document. Titles grant no administrator flag, reviewer permission, module power, credit issuance or Treasury authority. Permanent roles and approved liabilities remain separate and survive term expiry.",
        "Vote and finalize in Decide. Representative terms are read-only mandates unless a future separately reviewed bounded authority module is explicitly installed. Delegated budgets and fractal elections remain outside this release."
      ]
    },
    {
      "id": "archive",
      "title": "Archive exports and recovery — development",
      "paragraphs": [
        "The Archive format library binds packed records to their DAO, source code, released schema, table and snapshot domain. Bounded chunks, canonical manifests and index-derived proofs protect record integrity. Core hosts resumable ordinary-poll exports, complete storage reservations and verified recovery downloads. Core can additionally create an authenticated encrypted backup, restore it independently and record an immutable receipt when the operator configures a separate backup store. The development runtime can additionally anchor one bounded ordinary-poll export, record restricted availability attestation and accept the administrator's exact signed approval or revocation. Bounded ordinary-poll source pruning and on-chain discovery/browsing are implemented in development, with destructive production use separately gated.",
        "Ordinary polls have a parallel terminal marker using actual finalization time. Marking an old finalized poll is native operator maintenance: its migration timestamp starts a fresh 90-day wait and retries never change it. Closing time is not finalization time. The bounded ordinary-poll planner checks age, code/schema/domain, complete vote/tally coverage and exclusions for work, grants and elections. Its output never authorizes pruning; the host still must verify irreversible state, storage and independent backup, and obtain matching native administrator approval.",
        "A valid proof does not establish file availability or authorize deletion. Source contracts must independently check approval, eligibility, references and the qualified schema before pruning. Identities, key grants, liabilities and financial replay guards stay live.",
        "Archived files remain pinned and use ordinary approved storage capacity. The approved launch policy is 100 MB free and $1 per additional approved 1 GB monthly; core has explicitly approved prepaid storage subscriptions behind configuration, while live provider qualification and destructive retention enforcement remain pending. Original private ciphertext requires the original decryption keys.",
        "In Resources, active administrators select a finalized poll, preview its eligibility and approve the displayed maximum stored-byte reservation. Export uses existing hosting capacity and creates no subscription or pruning approval. Source changes require a new preview; a newer irreversible snapshot alone does not alter consent. Saved exports survive page/server restarts. Refresh advances bounded work; uncertain provider outcomes keep their holds. The original requesting administrator must remain authorized for completion.",
        "Download the verified recovery bundle and store its displayed manifest SHA-256 separately, off the server. Standalone verification requires that expected commitment and the matching qualified schema package, not a hash supplied only by the file itself. The current manifest is not yet anchored on chain. These exports contain ordinary-poll votes and a manifest, not account keys, social-login pairings or original document files. A download is not an independently verified backup or permission to delete source rows.",
        "When an independent encrypted backup store is configured, Resources offers Create and verify encrypted backup for the exact displayed manifest. The host writes only ciphertext, verifies its restored records, and saves the encrypted-file commitment. Retries preserve the original file. A separate folder on the same disk is not an independent failure domain; the operator must qualify the storage and keep its backup encryption key offline. This copy does not include member decryption keys, social pairings or original document files. Verified primary-provider downloads can fall back to the matching saved backup. A receipt does not authorize pruning or guarantee perpetual availability.",
        "Resources offers a separate signed archive approval after independent backup verification. The verifier cannot approve for the administrator. Approval binds the exact manifest, descriptor, backup and retention delay; a changed verifier or availability older than 15 minutes requires a fresh matching attestation. Revoke approval works without access to the backup store. The bounded on-chain anchor is restricted to one ordinary-poll family and preserves transaction receipts and preallocated completion cursors. Approving does not delete data; backed allocations, legacy migration, complete private/history recovery and provider qualification still gate release. Native pruning checks actual packed proofs, fresh availability, the current administrator and source pins, terminal retention, revocation and exact cursors; ballots/tallies and permanent vote IDs remain."
      ]
    }
  ],
  "schemaVersion": 1,
  "contracts": [
    {
      "name": "decide",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "6f77d2d6bf34e494d7babff5ca57029e99c004809542045c25ebcfc27909e5f7",
      "actions": [
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "execute",
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
          "name": "markpoll",
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
          "name": "newelect",
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
          "name": "open",
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
          "name": "prunevotes",
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
          "name": "recall",
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
          "name": "vote",
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
        }
      ],
      "tables": [
        {
          "name": "ballots",
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
          "name": "elections",
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
          "name": "executions",
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
        },
        {
          "name": "grantplans",
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
          "name": "nominations",
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
          "name": "pollends",
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
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "terms",
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
          "name": "voteids",
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
          "name": "votes",
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
      ]
    },
    {
      "name": "works",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "ebf8a690244852786209e5aaecc9e4277722a6ad42d1ade1576642f2f6f2d4fc",
      "actions": [
        {
          "name": "accept",
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
              "name": "project_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "acceptagr",
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
              "name": "project_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "cancel",
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
              "name": "project_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "govaccept",
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
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "grantwork",
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
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "offeragr",
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
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "term_start",
              "type": "uint32"
            },
            {
              "name": "term_end",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "propose",
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
              "name": "project_id",
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
              "name": "payments",
              "type": "asset[]"
            },
            {
              "name": "dues",
              "type": "uint32[]"
            }
          ]
        },
        {
          "name": "review",
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
              "name": "milestone_id",
              "type": "uint64"
            },
            {
              "name": "approve",
              "type": "bool"
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
          "name": "settle",
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
              "name": "milestone_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "submitwork",
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
              "name": "milestone_id",
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
        }
      ],
      "tables": [
        {
          "name": "agreements",
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
          "name": "milestones",
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
          "name": "projects",
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
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        }
      ]
    },
    {
      "name": "payroll",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "e3488ccc9705efac2bd25f0ae0fa5628fa8dfcee86d932c58386b087172027f8",
      "actions": [
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "commit",
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
          "name": "edit",
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
          "name": "settle",
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
      "tables": [
        {
          "name": "controls",
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
          "name": "entries",
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
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "schedules",
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
        }
      ]
    },
    {
      "name": "grants",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "594c4aeeb20a5889fc8b49148f9910c3a24f8cec380f7ce3631e2709a8f6c393",
      "actions": [
        {
          "name": "amend",
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
              "name": "application_id",
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
            }
          ]
        },
        {
          "name": "applygrant",
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
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
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
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "closeapp",
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
              "name": "application_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "closeround",
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
              "name": "round_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "govaward",
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
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "newround",
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
              "name": "round_id",
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
              "name": "allow_agents",
              "type": "bool"
            },
            {
              "name": "works",
              "type": "name"
            }
          ]
        },
        {
          "name": "reviewapp",
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
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "eligible",
              "type": "bool"
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
          "name": "submitapp",
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
              "name": "application_id",
              "type": "uint64"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "applications",
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
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "rounds",
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
        }
      ]
    },
    {
      "name": "endorse",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "86beab601f29ab425b9aa85d526379497e7c9f392a4ab22962970367a6885e13",
      "actions": [
        {
          "name": "admit",
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
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "applyjoin",
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
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "signing_key",
              "type": "public_key"
            },
            {
              "name": "encryption_key",
              "type": "string"
            },
            {
              "name": "custody",
              "type": "uint8"
            },
            {
              "name": "kind",
              "type": "uint8"
            },
            {
              "name": "operator_label",
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
              "name": "expires",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "unwitness",
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
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "witness",
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
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "joinapps",
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
              "name": "sponsor",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            },
            {
              "name": "policy_revision",
              "type": "uint64"
            },
            {
              "name": "signing_key",
              "type": "public_key"
            },
            {
              "name": "encryption_key",
              "type": "string"
            },
            {
              "name": "custody",
              "type": "uint8"
            },
            {
              "name": "kind",
              "type": "uint8"
            },
            {
              "name": "operator_label",
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
              "name": "expires",
              "type": "uint32"
            },
            {
              "name": "witnesses",
              "type": "uint64[]"
            },
            {
              "name": "admitted",
              "type": "bool"
            },
            {
              "name": "member_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        }
      ]
    }
  ],
  "api": [
    {
      "method": "GET",
      "path": "/v1/daos/:id/modules",
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "ballots": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "projects": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "schedules": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "elections": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "terms": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "joinApplications": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "rounds": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "applications": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "memberId": {
            "type": "string",
            "maxLength": 20
          }
        },
        "additionalProperties": false
      },
      "response": {
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
          "next": {
            "default": {
              "ballots": null,
              "projects": null,
              "schedules": null,
              "rounds": null,
              "applications": null,
              "joinApplications": null,
              "elections": null,
              "terms": null
            },
            "type": "object",
            "properties": {
              "ballots": {
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "projects": {
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "schedules": {
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "elections": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "terms": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "joinApplications": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "rounds": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "applications": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "ballots",
              "projects",
              "schedules",
              "elections",
              "terms",
              "joinApplications",
              "rounds",
              "applications"
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
                        "payroll",
                        "grants-rounds",
                        "endorsement-admission"
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
                "installed": {
                  "default": false,
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
                "installed",
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
          "agreements": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "project_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "schema_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "term_start": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "term_end": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "terms": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "accepted": {
                  "type": "boolean"
                },
                "accepted_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "project_id",
                "dao_id",
                "schema_version",
                "term_start",
                "term_end",
                "terms",
                "accepted",
                "accepted_at"
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
          "elections": {
            "default": [],
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
                "title": {
                  "type": "string",
                  "maxLength": 16384
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
                "document_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "nomination_close": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "term_start": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "term_end": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "seats": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "candidates": {
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
                "title",
                "document_id",
                "document_version",
                "document_commitment",
                "policy_revision",
                "nomination_close",
                "term_start",
                "term_end",
                "seats",
                "status",
                "candidates"
              ],
              "additionalProperties": false
            }
          },
          "nominations": {
            "default": [],
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
                "election_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "member_id": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "required": [
                "id",
                "dao_id",
                "election_id",
                "member_id"
              ],
              "additionalProperties": false
            }
          },
          "terms": {
            "default": [],
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
                "election_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "member_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "title": {
                  "type": "string",
                  "maxLength": 16384
                },
                "starts": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "ends": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "recalled": {
                  "type": "boolean"
                },
                "recalled_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "recall_doc": {
                  "type": "string",
                  "maxLength": 20
                },
                "recall_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "id",
                "dao_id",
                "election_id",
                "member_id",
                "title",
                "starts",
                "ends",
                "recalled",
                "recalled_at",
                "recall_doc",
                "recall_version"
              ],
              "additionalProperties": false
            }
          },
          "joinApplications": {
            "default": [],
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
                "sponsor": {
                  "type": "string",
                  "maxLength": 20
                },
                "revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "signing_key": {
                  "type": "string",
                  "maxLength": 128
                },
                "encryption_key": {
                  "type": "string",
                  "maxLength": 16384
                },
                "custody": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "kind": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "operator_label": {
                  "type": "string",
                  "maxLength": 16384
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
                "document_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "expires": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "witnesses": {
                  "maxItems": 64,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 20
                  }
                },
                "admitted": {
                  "type": "boolean"
                },
                "member_id": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "required": [
                "id",
                "dao_id",
                "sponsor",
                "revision",
                "policy_revision",
                "signing_key",
                "encryption_key",
                "custody",
                "kind",
                "operator_label",
                "document_id",
                "document_version",
                "document_commitment",
                "expires",
                "witnesses",
                "admitted",
                "member_id"
              ],
              "additionalProperties": false
            }
          },
          "rounds": {
            "default": [],
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
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "rules_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "applications_close": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "review_close": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "awards_close": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "maximum": {
                  "type": "string",
                  "maxLength": 64,
                  "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                },
                "awarded": {
                  "type": "string",
                  "maxLength": 20
                },
                "allow_agents": {
                  "type": "boolean"
                },
                "works": {
                  "type": "string",
                  "maxLength": 13
                },
                "closed": {
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao_id",
                "creator",
                "document_id",
                "document_version",
                "rules_revision",
                "applications_close",
                "review_close",
                "awards_close",
                "maximum",
                "awarded",
                "allow_agents",
                "works",
                "closed"
              ],
              "additionalProperties": false
            }
          },
          "applications": {
            "default": [],
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
                "round_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "contributor": {
                  "type": "string",
                  "maxLength": 20
                },
                "revision": {
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
                "payments": {
                  "maxItems": 64,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 64,
                    "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                  }
                },
                "dues": {
                  "maxItems": 64,
                  "type": "array",
                  "items": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  }
                },
                "term_start": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "term_end": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "consent_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "decision_doc": {
                  "type": "string",
                  "maxLength": 20
                },
                "decision_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "project_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "funding_ballot": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "required": [
                "id",
                "dao_id",
                "round_id",
                "contributor",
                "revision",
                "document_id",
                "document_version",
                "payments",
                "dues",
                "term_start",
                "term_end",
                "status",
                "consent_at",
                "decision_doc",
                "decision_version",
                "project_id",
                "funding_ballot"
              ],
              "additionalProperties": false
            }
          },
          "grantPlans": {
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
                "grants": {
                  "type": "string",
                  "maxLength": 13
                },
                "works": {
                  "type": "string",
                  "maxLength": 13
                },
                "round_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "application_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "application_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "project_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "grants_hash": {
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
                "grants",
                "works",
                "round_id",
                "application_id",
                "application_revision",
                "project_id",
                "commitment",
                "grants_hash",
                "works_hash",
                "policy_revision",
                "deadline",
                "executed"
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
          "next",
          "modules",
          "ballots",
          "votes",
          "projects",
          "milestones",
          "agreements",
          "schedules",
          "entries",
          "controls",
          "elections",
          "nominations",
          "terms",
          "joinApplications",
          "rounds",
          "applications",
          "grantPlans",
          "executions"
        ],
        "additionalProperties": false
      },
      "helpTopic": "module-reference"
    },
    {
      "method": "POST",
      "path": "/v1/decide/finalize",
      "input": {
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
      },
      "response": {
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
      },
      "helpTopic": "decide"
    },
    {
      "method": "POST",
      "path": "/v1/decide/execute",
      "input": {
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
      },
      "response": {
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
      },
      "helpTopic": "governed-funding"
    },
    {
      "method": "GET",
      "path": "/v1/archive/history",
      "input": {
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
          "cursor": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "dao"
        ],
        "additionalProperties": false
      },
      "response": {
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
          "anchors": {
            "maxItems": 20,
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
                "manifest": {
                  "type": "object",
                  "properties": {
                    "format_version": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 65535
                    },
                    "chain_id": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "runtime": {
                      "type": "string",
                      "maxLength": 13
                    },
                    "dao_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "source": {
                      "type": "string",
                      "maxLength": 13
                    },
                    "code_hash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "abi_hash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "block_number": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "block_id": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "timestamp": {
                      "type": "string",
                      "maxLength": 16384
                    },
                    "families": {
                      "maxItems": 64,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "kind": {
                            "type": "string",
                            "maxLength": 16384
                          },
                          "parent_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "table": {
                            "type": "string",
                            "maxLength": 13
                          },
                          "scope": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "schema_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "records": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "chunks": {
                            "maxItems": 64,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "domain": {
                                  "type": "object",
                                  "properties": {
                                    "format_version": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 65535
                                    },
                                    "chain_id": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "runtime": {
                                      "type": "string",
                                      "maxLength": 13
                                    },
                                    "dao_id": {
                                      "type": "string",
                                      "maxLength": 20
                                    },
                                    "source": {
                                      "type": "string",
                                      "maxLength": 13
                                    },
                                    "code_hash": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "abi_hash": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "schema_hash": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "table": {
                                      "type": "string",
                                      "maxLength": 13
                                    },
                                    "scope": {
                                      "type": "string",
                                      "maxLength": 20
                                    },
                                    "chunk_ordinal": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 4294967295
                                    },
                                    "leaf_count": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 4294967295
                                    }
                                  },
                                  "required": [
                                    "format_version",
                                    "chain_id",
                                    "runtime",
                                    "dao_id",
                                    "source",
                                    "code_hash",
                                    "abi_hash",
                                    "schema_hash",
                                    "table",
                                    "scope",
                                    "chunk_ordinal",
                                    "leaf_count"
                                  ],
                                  "additionalProperties": false
                                },
                                "root": {
                                  "type": "string",
                                  "pattern": "^[0-9a-f]{64}$"
                                },
                                "cid": {
                                  "type": "string",
                                  "maxLength": 16384
                                },
                                "bytes": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 4294967295
                                },
                                "commitment": {
                                  "type": "string",
                                  "pattern": "^[0-9a-f]{64}$"
                                },
                                "first_key": {
                                  "type": "string",
                                  "maxLength": 20
                                },
                                "last_key": {
                                  "type": "string",
                                  "maxLength": 20
                                }
                              },
                              "required": [
                                "domain",
                                "root",
                                "cid",
                                "bytes",
                                "commitment",
                                "first_key",
                                "last_key"
                              ],
                              "additionalProperties": false
                            }
                          }
                        },
                        "required": [
                          "kind",
                          "parent_id",
                          "table",
                          "scope",
                          "schema_hash",
                          "records",
                          "chunks"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "files": {
                      "maxItems": 64,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "document_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "version": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "cid": {
                            "type": "string",
                            "maxLength": 16384
                          },
                          "bytes": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "commitment": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "envelope_version": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 255
                          },
                          "key_epoch": {
                            "type": "string",
                            "maxLength": 20
                          }
                        },
                        "required": [
                          "document_id",
                          "version",
                          "cid",
                          "bytes",
                          "commitment",
                          "envelope_version",
                          "key_epoch"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "format_version",
                    "chain_id",
                    "runtime",
                    "dao_id",
                    "source",
                    "code_hash",
                    "abi_hash",
                    "block_number",
                    "block_id",
                    "timestamp",
                    "families",
                    "files"
                  ],
                  "additionalProperties": false
                },
                "manifest_cid": {
                  "type": "string",
                  "maxLength": 16384
                },
                "manifest_bytes": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "manifest_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "descriptor_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "backup_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "verifier": {
                  "type": "string",
                  "maxLength": 13
                },
                "attestation_transaction": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "approval_transaction": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "retention_seconds": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "attested_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "approved_by": {
                  "type": "string",
                  "maxLength": 20
                },
                "approved_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "revoked": {
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao_id",
                "manifest",
                "manifest_cid",
                "manifest_bytes",
                "manifest_commitment",
                "descriptor_commitment",
                "backup_commitment",
                "verifier",
                "attestation_transaction",
                "approval_transaction",
                "retention_seconds",
                "attested_at",
                "approved_by",
                "approved_at",
                "revoked"
              ],
              "additionalProperties": false
            }
          },
          "next": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "dao",
          "anchors",
          "next"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/history/recover",
      "input": {
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
          "manifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "dao",
          "manifestCommitment"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "manifest": {
            "type": "object",
            "properties": {
              "schemaVersion": {
                "type": "number",
                "const": 1
              },
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
              "snapshot": {
                "type": "object",
                "properties": {
                  "blockNumber": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 4294967295
                  },
                  "blockId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "timestamp": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "blockNumber",
                  "blockId",
                  "timestamp"
                ],
                "additionalProperties": false
              },
              "source": {
                "type": "object",
                "properties": {
                  "account": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "codeHash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "abiHash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "account",
                  "codeHash",
                  "abiHash"
                ],
                "additionalProperties": false
              },
              "families": {
                "minItems": 1,
                "maxItems": 64,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "kind": {
                      "type": "string",
                      "enum": [
                        "ordinary-poll-votes",
                        "document-versions",
                        "protected-export"
                      ]
                    },
                    "parentId": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "table": {
                      "type": "string",
                      "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                    },
                    "scope": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "schemaHash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "records": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "chunks": {
                      "maxItems": 1024,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "domain": {
                            "type": "object",
                            "properties": {
                              "format_version": {
                                "type": "number",
                                "const": 1
                              },
                              "chain_id": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "runtime": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "dao_id": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "source": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "code_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "abi_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "schema_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "table": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "scope": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "chunk_ordinal": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 4294967295
                              },
                              "leaf_count": {
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 65536
                              }
                            },
                            "required": [
                              "format_version",
                              "chain_id",
                              "runtime",
                              "dao_id",
                              "source",
                              "code_hash",
                              "abi_hash",
                              "schema_hash",
                              "table",
                              "scope",
                              "chunk_ordinal",
                              "leaf_count"
                            ],
                            "additionalProperties": false
                          },
                          "root": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "cid": {
                            "type": "string",
                            "maxLength": 128
                          },
                          "bytes": {
                            "type": "integer",
                            "minimum": 188,
                            "maximum": 5242880
                          },
                          "commitment": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "firstKey": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "lastKey": {
                            "type": "string",
                            "maxLength": 20
                          }
                        },
                        "required": [
                          "domain",
                          "root",
                          "cid",
                          "bytes",
                          "commitment",
                          "firstKey",
                          "lastKey"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "kind",
                    "parentId",
                    "table",
                    "scope",
                    "schemaHash",
                    "records",
                    "chunks"
                  ],
                  "additionalProperties": false
                }
              },
              "files": {
                "maxItems": 65536,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "document_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "version": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4294967295
                    },
                    "cid": {
                      "type": "string",
                      "maxLength": 128
                    },
                    "bytes": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "envelope_version": {
                      "anyOf": [
                        {
                          "type": "number",
                          "const": 0
                        },
                        {
                          "type": "number",
                          "const": 1
                        }
                      ]
                    },
                    "key_epoch": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "required": [
                    "document_id",
                    "version",
                    "cid",
                    "bytes",
                    "commitment",
                    "envelope_version",
                    "key_epoch"
                  ],
                  "additionalProperties": false
                }
              },
              "descriptorCommitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "schemaVersion",
              "dao",
              "snapshot",
              "source",
              "families",
              "files",
              "descriptorCommitment"
            ],
            "additionalProperties": false
          },
          "manifestFile": {
            "type": "object",
            "properties": {
              "cid": {
                "type": "string",
                "maxLength": 128
              },
              "bytes": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5242880
              },
              "commitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "content": {
                "type": "string",
                "minLength": 4,
                "maxLength": 6990508
              }
            },
            "required": [
              "cid",
              "bytes",
              "commitment",
              "content"
            ],
            "additionalProperties": false
          },
          "chunks": {
            "maxItems": 1024,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "cid": {
                  "type": "string",
                  "maxLength": 128
                },
                "content": {
                  "type": "string",
                  "minLength": 4,
                  "maxLength": 6990508
                }
              },
              "required": [
                "cid",
                "content"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "id",
          "manifest",
          "manifestFile",
          "chunks"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/history/page",
      "input": {
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
          "manifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "cursor": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "dao",
          "manifestCommitment"
        ],
        "additionalProperties": false
      },
      "response": {
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
          "manifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "parentId": {
            "type": "string",
            "maxLength": 20
          },
          "records": {
            "maxItems": 25,
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
          "next": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          },
          "coverage": {
            "type": "string",
            "const": "verified-archive"
          },
          "liveRowsIncluded": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "dao",
          "manifestCommitment",
          "parentId",
          "records",
          "next",
          "coverage",
          "liveRowsIncluded"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/preview",
      "input": {
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
          "ballotIds": {
            "minItems": 1,
            "maxItems": 64,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 20
            }
          },
          "retentionSeconds": {
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          }
        },
        "required": [
          "dao",
          "ballotIds",
          "retentionSeconds"
        ],
        "additionalProperties": false
      },
      "response": {
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
          "source": {
            "type": "object",
            "properties": {
              "account": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "codeHash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "abiHash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "account",
              "codeHash",
              "abiHash"
            ],
            "additionalProperties": false
          },
          "snapshot": {
            "type": "object",
            "properties": {
              "blockNumber": {
                "type": "integer",
                "minimum": 1,
                "maximum": 4294967295
              },
              "blockId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "timestamp": {
                "anyOf": [
                  {
                    "type": "string",
                    "format": "date-time",
                    "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                  },
                  {
                    "type": "string",
                    "format": "date-time",
                    "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                  }
                ]
              }
            },
            "required": [
              "blockNumber",
              "blockId",
              "timestamp"
            ],
            "additionalProperties": false
          },
          "pruningAuthorized": {
            "type": "boolean",
            "const": false
          },
          "grossRamBytes": {
            "type": "string",
            "maxLength": 20
          },
          "blocked": {
            "maxItems": 64,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "parentId": {
                  "type": "string",
                  "maxLength": 20
                },
                "reason": {
                  "type": "string",
                  "enum": [
                    "protected-family",
                    "ballot-active",
                    "terminal-marker-required",
                    "terminal-not-irreversible",
                    "retention"
                  ]
                }
              },
              "required": [
                "parentId",
                "reason"
              ],
              "additionalProperties": false
            }
          },
          "families": {
            "maxItems": 64,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "kind": {
                  "type": "string",
                  "const": "ordinary-poll-votes"
                },
                "parentId": {
                  "type": "string",
                  "maxLength": 20
                },
                "grossRamBytes": {
                  "type": "string",
                  "maxLength": 20
                },
                "chunks": {
                  "maxItems": 1,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "domain": {
                        "type": "object",
                        "properties": {
                          "format_version": {
                            "type": "number",
                            "const": 1
                          },
                          "chain_id": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "runtime": {
                            "type": "string",
                            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                          },
                          "dao_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "source": {
                            "type": "string",
                            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                          },
                          "code_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "abi_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "schema_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "table": {
                            "type": "string",
                            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                          },
                          "scope": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "chunk_ordinal": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "leaf_count": {
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 65536
                          }
                        },
                        "required": [
                          "format_version",
                          "chain_id",
                          "runtime",
                          "dao_id",
                          "source",
                          "code_hash",
                          "abi_hash",
                          "schema_hash",
                          "table",
                          "scope",
                          "chunk_ordinal",
                          "leaf_count"
                        ],
                        "additionalProperties": false
                      },
                      "root": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "bytes": {
                        "type": "integer",
                        "minimum": 188,
                        "maximum": 5242880
                      },
                      "rows": {
                        "minItems": 1,
                        "maxItems": 65536,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "primaryKey": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "packed": {
                              "type": "string",
                              "maxLength": 10485760,
                              "pattern": "^[0-9a-f]*$"
                            }
                          },
                          "required": [
                            "primaryKey",
                            "packed"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "domain",
                      "root",
                      "bytes",
                      "rows"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "kind",
                "parentId",
                "grossRamBytes",
                "chunks"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "dao",
          "source",
          "snapshot",
          "pruningAuthorized",
          "grossRamBytes",
          "blocked",
          "families"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "requestId": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "selection": {
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
              "ballotIds": {
                "minItems": 1,
                "maxItems": 64,
                "type": "array",
                "items": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "retentionSeconds": {
                "type": "integer",
                "minimum": 7776000,
                "maximum": 315360000
              }
            },
            "required": [
              "dao",
              "ballotIds",
              "retentionSeconds"
            ],
            "additionalProperties": false
          },
          "selectionCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "requestId",
          "selection",
          "selectionCommitment",
          "maximumStoredBytes"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
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
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
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
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 64,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "GET",
      "path": "/v1/archive/exports/:id",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
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
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
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
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 64,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports/:id/reconcile",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {},
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
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
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
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
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 64,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports/:id/attest",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "manifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "descriptorCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "backupCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "retentionSeconds": {
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          }
        },
        "required": [
          "manifestCommitment",
          "descriptorCommitment",
          "backupCommitment",
          "retentionSeconds"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
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
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
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
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 64,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports/:id/backup",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "expectedManifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "expectedManifestCommitment"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
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
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
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
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 64,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "GET",
      "path": "/v1/archive/exports/:id/bundle",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "manifest": {
            "type": "object",
            "properties": {
              "schemaVersion": {
                "type": "number",
                "const": 1
              },
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
              "snapshot": {
                "type": "object",
                "properties": {
                  "blockNumber": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 4294967295
                  },
                  "blockId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "timestamp": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "blockNumber",
                  "blockId",
                  "timestamp"
                ],
                "additionalProperties": false
              },
              "source": {
                "type": "object",
                "properties": {
                  "account": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "codeHash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "abiHash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "account",
                  "codeHash",
                  "abiHash"
                ],
                "additionalProperties": false
              },
              "families": {
                "minItems": 1,
                "maxItems": 64,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "kind": {
                      "type": "string",
                      "enum": [
                        "ordinary-poll-votes",
                        "document-versions",
                        "protected-export"
                      ]
                    },
                    "parentId": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "table": {
                      "type": "string",
                      "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                    },
                    "scope": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "schemaHash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "records": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "chunks": {
                      "maxItems": 1024,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "domain": {
                            "type": "object",
                            "properties": {
                              "format_version": {
                                "type": "number",
                                "const": 1
                              },
                              "chain_id": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "runtime": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "dao_id": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "source": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "code_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "abi_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "schema_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "table": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "scope": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "chunk_ordinal": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 4294967295
                              },
                              "leaf_count": {
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 65536
                              }
                            },
                            "required": [
                              "format_version",
                              "chain_id",
                              "runtime",
                              "dao_id",
                              "source",
                              "code_hash",
                              "abi_hash",
                              "schema_hash",
                              "table",
                              "scope",
                              "chunk_ordinal",
                              "leaf_count"
                            ],
                            "additionalProperties": false
                          },
                          "root": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "cid": {
                            "type": "string",
                            "maxLength": 128
                          },
                          "bytes": {
                            "type": "integer",
                            "minimum": 188,
                            "maximum": 5242880
                          },
                          "commitment": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "firstKey": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "lastKey": {
                            "type": "string",
                            "maxLength": 20
                          }
                        },
                        "required": [
                          "domain",
                          "root",
                          "cid",
                          "bytes",
                          "commitment",
                          "firstKey",
                          "lastKey"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "kind",
                    "parentId",
                    "table",
                    "scope",
                    "schemaHash",
                    "records",
                    "chunks"
                  ],
                  "additionalProperties": false
                }
              },
              "files": {
                "maxItems": 65536,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "document_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "version": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4294967295
                    },
                    "cid": {
                      "type": "string",
                      "maxLength": 128
                    },
                    "bytes": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "envelope_version": {
                      "anyOf": [
                        {
                          "type": "number",
                          "const": 0
                        },
                        {
                          "type": "number",
                          "const": 1
                        }
                      ]
                    },
                    "key_epoch": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "required": [
                    "document_id",
                    "version",
                    "cid",
                    "bytes",
                    "commitment",
                    "envelope_version",
                    "key_epoch"
                  ],
                  "additionalProperties": false
                }
              },
              "descriptorCommitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "schemaVersion",
              "dao",
              "snapshot",
              "source",
              "families",
              "files",
              "descriptorCommitment"
            ],
            "additionalProperties": false
          },
          "manifestFile": {
            "type": "object",
            "properties": {
              "cid": {
                "type": "string",
                "maxLength": 128
              },
              "bytes": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5242880
              },
              "commitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "content": {
                "type": "string",
                "minLength": 4,
                "maxLength": 6990508
              }
            },
            "required": [
              "cid",
              "bytes",
              "commitment",
              "content"
            ],
            "additionalProperties": false
          },
          "chunks": {
            "maxItems": 1024,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "cid": {
                  "type": "string",
                  "maxLength": 128
                },
                "content": {
                  "type": "string",
                  "minLength": 4,
                  "maxLength": 6990508
                }
              },
              "required": [
                "cid",
                "content"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "id",
          "manifest",
          "manifestFile",
          "chunks"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports/:id/prune",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "expectedManifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "expectedManifestCommitment"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
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
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
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
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 64,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 64,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "GET",
      "path": "/v1/archive/exports",
      "input": {
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
          "cursor": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          }
        },
        "required": [
          "dao"
        ],
        "additionalProperties": false
      },
      "response": {
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
          "exports": {
            "maxItems": 20,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
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
                "state": {
                  "type": "string",
                  "enum": [
                    "planned",
                    "exporting",
                    "pinned",
                    "verified",
                    "approved",
                    "pruning",
                    "completed",
                    "failed",
                    "review"
                  ]
                },
                "maximumStoredBytes": {
                  "type": "string",
                  "maxLength": 20
                },
                "heldBytes": {
                  "type": "string",
                  "maxLength": 20
                },
                "verifiedChunks": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 1024
                },
                "totalChunks": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 1024
                },
                "manifest": {
                  "anyOf": [
                    {
                      "type": "object",
                      "properties": {
                        "cid": {
                          "type": "string",
                          "maxLength": 128
                        },
                        "bytes": {
                          "type": "integer",
                          "minimum": 1,
                          "maximum": 5242880
                        },
                        "commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        }
                      },
                      "required": [
                        "cid",
                        "bytes",
                        "commitment"
                      ],
                      "additionalProperties": false
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "retentionSeconds": {
                  "default": 7776000,
                  "type": "integer",
                  "minimum": 7776000,
                  "maximum": 315360000
                },
                "anchor": {
                  "default": null,
                  "anyOf": [
                    {
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
                        "manifest": {
                          "type": "object",
                          "properties": {
                            "format_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 65535
                            },
                            "chain_id": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "runtime": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "dao_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "source": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "code_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "abi_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "block_number": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "block_id": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "timestamp": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "families": {
                              "maxItems": 64,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "kind": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "parent_id": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "table": {
                                    "type": "string",
                                    "maxLength": 13
                                  },
                                  "scope": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "schema_hash": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "records": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "chunks": {
                                    "maxItems": 64,
                                    "type": "array",
                                    "items": {
                                      "type": "object",
                                      "properties": {
                                        "domain": {
                                          "type": "object",
                                          "properties": {
                                            "format_version": {
                                              "type": "integer",
                                              "minimum": 0,
                                              "maximum": 65535
                                            },
                                            "chain_id": {
                                              "type": "string",
                                              "pattern": "^[0-9a-f]{64}$"
                                            },
                                            "runtime": {
                                              "type": "string",
                                              "maxLength": 13
                                            },
                                            "dao_id": {
                                              "type": "string",
                                              "maxLength": 20
                                            },
                                            "source": {
                                              "type": "string",
                                              "maxLength": 13
                                            },
                                            "code_hash": {
                                              "type": "string",
                                              "pattern": "^[0-9a-f]{64}$"
                                            },
                                            "abi_hash": {
                                              "type": "string",
                                              "pattern": "^[0-9a-f]{64}$"
                                            },
                                            "schema_hash": {
                                              "type": "string",
                                              "pattern": "^[0-9a-f]{64}$"
                                            },
                                            "table": {
                                              "type": "string",
                                              "maxLength": 13
                                            },
                                            "scope": {
                                              "type": "string",
                                              "maxLength": 20
                                            },
                                            "chunk_ordinal": {
                                              "type": "integer",
                                              "minimum": 0,
                                              "maximum": 4294967295
                                            },
                                            "leaf_count": {
                                              "type": "integer",
                                              "minimum": 0,
                                              "maximum": 4294967295
                                            }
                                          },
                                          "required": [
                                            "format_version",
                                            "chain_id",
                                            "runtime",
                                            "dao_id",
                                            "source",
                                            "code_hash",
                                            "abi_hash",
                                            "schema_hash",
                                            "table",
                                            "scope",
                                            "chunk_ordinal",
                                            "leaf_count"
                                          ],
                                          "additionalProperties": false
                                        },
                                        "root": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "cid": {
                                          "type": "string",
                                          "maxLength": 16384
                                        },
                                        "bytes": {
                                          "type": "integer",
                                          "minimum": 0,
                                          "maximum": 4294967295
                                        },
                                        "commitment": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "first_key": {
                                          "type": "string",
                                          "maxLength": 20
                                        },
                                        "last_key": {
                                          "type": "string",
                                          "maxLength": 20
                                        }
                                      },
                                      "required": [
                                        "domain",
                                        "root",
                                        "cid",
                                        "bytes",
                                        "commitment",
                                        "first_key",
                                        "last_key"
                                      ],
                                      "additionalProperties": false
                                    }
                                  }
                                },
                                "required": [
                                  "kind",
                                  "parent_id",
                                  "table",
                                  "scope",
                                  "schema_hash",
                                  "records",
                                  "chunks"
                                ],
                                "additionalProperties": false
                              }
                            },
                            "files": {
                              "maxItems": 64,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "document_id": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "version": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "envelope_version": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 255
                                  },
                                  "key_epoch": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "document_id",
                                  "version",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "envelope_version",
                                  "key_epoch"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "format_version",
                            "chain_id",
                            "runtime",
                            "dao_id",
                            "source",
                            "code_hash",
                            "abi_hash",
                            "block_number",
                            "block_id",
                            "timestamp",
                            "families",
                            "files"
                          ],
                          "additionalProperties": false
                        },
                        "manifest_cid": {
                          "type": "string",
                          "maxLength": 16384
                        },
                        "manifest_bytes": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "manifest_commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "descriptor_commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "backup_commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "verifier": {
                          "type": "string",
                          "maxLength": 13
                        },
                        "attestation_transaction": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "approval_transaction": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "retention_seconds": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "attested_at": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "approved_by": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "approved_at": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "revoked": {
                          "type": "boolean"
                        }
                      },
                      "required": [
                        "id",
                        "dao_id",
                        "manifest",
                        "manifest_cid",
                        "manifest_bytes",
                        "manifest_commitment",
                        "descriptor_commitment",
                        "backup_commitment",
                        "verifier",
                        "attestation_transaction",
                        "approval_transaction",
                        "retention_seconds",
                        "attested_at",
                        "approved_by",
                        "approved_at",
                        "revoked"
                      ],
                      "additionalProperties": false
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "backup": {
                  "default": null,
                  "anyOf": [
                    {
                      "type": "object",
                      "properties": {
                        "formatVersion": {
                          "type": "number",
                          "const": 1
                        },
                        "storeId": {
                          "type": "string",
                          "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                        },
                        "keyId": {
                          "type": "string",
                          "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                        },
                        "commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "manifestCommitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "bytes": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "verifiedAt": {
                          "anyOf": [
                            {
                              "type": "string",
                              "format": "date-time",
                              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                            },
                            {
                              "type": "string",
                              "format": "date-time",
                              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                            }
                          ]
                        }
                      },
                      "required": [
                        "formatVersion",
                        "storeId",
                        "keyId",
                        "commitment",
                        "manifestCommitment",
                        "bytes",
                        "verifiedAt"
                      ],
                      "additionalProperties": false
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "backupSupported": {
                  "default": false,
                  "type": "boolean"
                },
                "pruningAuthorized": {
                  "default": false,
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao",
                "state",
                "maximumStoredBytes",
                "heldBytes",
                "verifiedChunks",
                "totalChunks",
                "manifest",
                "retentionSeconds",
                "anchor",
                "backup",
                "backupSupported",
                "pruningAuthorized"
              ],
              "additionalProperties": false
            }
          },
          "next": {
            "anyOf": [
              {
                "type": "string",
                "format": "uuid",
                "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "dao",
          "exports",
          "next"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    }
  ],
  "modules": [
    {
      "manifest": {
        "id": "decide",
        "version": "0.7.0-alpha.1",
        "coreRange": "^0.7.0-alpha.1",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "ballot.create",
          "ballot.finalize",
          "ballot.execute"
        ],
        "helpTopic": "decide"
      },
      "configuration": {
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
    },
    {
      "manifest": {
        "id": "works",
        "version": "0.7.0-alpha.1",
        "coreRange": "^0.7.0-alpha.1",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "obligation.create",
          "obligation.execute"
        ],
        "helpTopic": "works"
      },
      "configuration": {
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
    },
    {
      "manifest": {
        "id": "payroll",
        "version": "0.7.0-alpha.1",
        "coreRange": "^0.7.0-alpha.1",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "obligation.create",
          "obligation.execute"
        ],
        "helpTopic": "payroll"
      },
      "configuration": {
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
    },
    {
      "manifest": {
        "id": "grants-rounds",
        "version": "0.7.0-alpha.1",
        "coreRange": "^0.7.0-alpha.1",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "obligation.create"
        ],
        "helpTopic": "grants-rounds"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          },
          "assetRail": {
            "type": "string",
            "const": "native"
          },
          "maxMilestones": {
            "type": "number",
            "const": 16
          },
          "matching": {
            "type": "boolean",
            "const": false
          }
        },
        "required": [
          "configVersion",
          "assetRail",
          "maxMilestones",
          "matching"
        ],
        "additionalProperties": false
      }
    },
    {
      "manifest": {
        "id": "endorsement-admission",
        "version": "0.7.0-alpha.1",
        "coreRange": "^0.7.0-alpha.1",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "member.manage"
        ],
        "helpTopic": "endorsement-admission"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          },
          "witnessLimit": {
            "type": "number",
            "const": 64
          }
        },
        "required": [
          "configVersion",
          "witnessLimit"
        ],
        "additionalProperties": false
      }
    }
  ]
} satisfies HelpBundle;
