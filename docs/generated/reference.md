# Daclify modules reference

Package 0.7.0-alpha.1 · interface 1.

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

Publish the proposal document, propose work, and have an administrator accept its funded milestones. The contributor publishes evidence and submits its document reference. A different active administrator or member with reviewer permission publishes a review reference and approves or requests changes. Approved payments are settled separately. Cancelling a project releases unapproved reservations while preserving approved payments.

When governed Works funding is enabled, direct administrator acceptance is rejected. An approved funding ballot reserves the pinned project; contributor submission and independent review are still required before payment.

## Funded payroll with a clear end date

A payroll commitment names a DAO contributor, exact native-token amount, start date, payment interval and a bounded number of installments. The full term must be funded before commitment.

Committed installments are approved liabilities. They remain payable after module removal, account offboarding or subscription expiry. Settlement after its due time is separate from approval.

This initial contract uses fixed terms of at most twelve installments. Renewal is a new funded commitment. It does not promise an unfunded, automatically renewable salary.

Choose a future first-installment time in UTC. The interval between installments is the claim frequency. The UI shows each installment’s due time, the schedule label, whether settlement is paused, and the core obligation state. Once due, settlement remains available after payroll is disabled; disabling the module prevents new commitments and does not cancel an approved term.

One settlement pays every installment that is already due, oldest first, and leaves any later installment unpaid. Pausing a schedule stops the payroll settlement helper until an administrator resumes it. It does not stop direct Treasury payment of an approved, due obligation. Only the separate DAO guardian pause blocks those obligation payments. Pause and the last payout time remain after the module is removed. An administrator can change the short label without changing the funded amount, the recipient, or the interval. The recipient is the member stored on the approved obligation, and the only treasury is the DAO treasury in its configured asset. A direct treasury payment can still pay one approved obligation and does not apply this schedule.

## Read the matching module reference

Each reference bundle identifies the module package and interface version it describes. The module read API reports deployment versions, configured permissions and code verification alongside current ballots, projects and payroll entries.

The configuration reference is generated from the producer's validation schemas. Decide settings are selected for each ballot. Works currently uses a fixed limit of sixteen milestones and independent review; payroll uses a fixed limit of twelve installments. Installing a module does not yet persist custom Works or payroll settings.

Generated action and table fields describe serialized structure. They do not replace the contributor, reviewer, funding, timing and authorization rules in the explanatory guides. A code or version mismatch must be resolved before relying on a guide for an installed deployment.

Core now persists the DAO ballot policy and commitment limits. Module installation does not provide arbitrary custom Works or payroll policies. The executor supports only a specific Works project, not arbitrary contract calls.

Module history is paged by DAO and related parent records. Continue using each non-null next cursor; use done for a collection that is complete. A continuation page can contain no records for your DAO while still providing an advancing cursor through shared primary rows. Votes are returned for the requested member, not all shared votes. Disabled installations remain readable so old obligations and ballot finalization are not lost. Signing controls require active membership, unlocked keys and the exact installed action grant.

## Vote on a specific Works project

Publish the deliverable reference, propose milestone work, then select Propose funding vote. The contract opens a binary vote using the DAO policy and pins the project, contributor, document version, milestone amounts and due times, runtime, module code and policy revision.

After closing, finalize the ballot. Only a passed, finalized result can execute. Execute approved funding reserves all milestones atomically and at most once. A failed reservation rolls back the execution flag. The native contract accepts permissionless execution; the hosted API requires a signed-in account and applies sponsorship limits.

Execution expires seven days after the scheduled closing time. Changed or cancelled projects, a changed policy revision, missing modules, replaced code, a guardian pause or insufficient funding prevent execution. A second passed ballot for an already funded project cannot reserve it again.

Funding approval does not approve a deliverable. The contributor submits evidence and a different administrator or reviewer accepts it before settlement. Distinct member keys do not prove different operators; admission and review policy must address conflicts. Existing approved liabilities remain payable after module removal, subject to a temporary guardian pause.

Advisory ballots cannot be repurposed as funding authority. There is no arbitrary-action executor, game-result oracle, secret ballot or independent-operator verification in this release.

## Contribution agreements and member services

Start in Documents: publish a scope/deliverables document, encrypted for a private DAO. Propose a Works project with contributor, native milestone amounts and due dates. Offer a contribution agreement on that proposed project and set a term containing every milestone due date (maximum one year).

The designated active contributor must sign agreement acceptance. Consent commits the exact document version/content commitment, project/contributor, native milestone amounts/dues and term. A funding vote or administrator acceptance cannot reserve an unaccepted agreement. Funding still requires the DAO policy and full backing.

Review belongs to the actual DAO reviewer/admin team. Contributors cannot review their own work, even if they hold a reviewer role. Cancellation preserves already approved obligations; use a successor project and fresh consent for changed terms. Existing ordinary Works projects need no new agreement record.

A version 1 contribution-agreement document includes type, dao reference, contributor, title, scope, deliverables, optional roleTitle, term {start,end} in native epoch seconds, native asset reference, milestones [{amount,due}] in integer base units, reviewPolicy dao-review-team and cancellationPolicy preserve-approved-liabilities. Terms shown on chain govern the enforced money flow. Narrative role titles grant no privileges and this is not legal contract certification.

A public version 1 service-offer document includes type service-offer, dao reference, memberId matching its author, title, summary and skills. The catalogue reads the latest authored public JSON document from active members. Choose an offer to prefill a Works contributor. Encrypted narratives stay in Documents; a service listing holds no funds and is separate from the platform module Marketplace.

Milestone agreements and Payroll are separate compensation lifecycles. Do not fund both for the same work period. Basic proposal, consent, evidence, review, claim and export remain free; optional hosted reminders and dashboards cannot revoke approved liabilities.

An upgrade changes a module code hash. Existing project/milestone rows and liabilities are preserved. A pending code-pinned funding plan needs renewed authorization against the reviewed upgrade; a preserved document commitment alone does not authorize a changed executable.

## Apply for a fully backed grant

An administrator freezes rules and document versions, native-asset lifetime award cap, participant eligibility and application/review/award deadlines. A cap reserves no Treasury funds. Matching and donor pots are not part of these rounds.

The applicant creates or amends their own application with exact document version, native milestone payments and due dates, and a bounded contribution term. Submit application is explicit consent to those terms. Amendment increments revision and removes consent and eligibility; submit and review again.

An administrator reviews eligibility using a decision document. Eligibility authorizes no spending. A Decide award vote pins the application revision/commitment, DAO policy and grant/Works code. Only a passed finalized vote can execute before the award cutoff.

Execution atomically checks the round cap, creates a Works agreement accepted by the applicant submission and reserves every milestone from real Treasury funds. If any cap, backing, identity, policy or code check fails, nothing is awarded or reserved. Delivery, independent review, cancellation and once-only settlement then use Works and Treasury.

Awarded is the cumulative committed award amount, not a current cash balance. Cancellation does not reopen the lifetime cap. Private narrative belongs in encrypted Documents; on-chain terms, membership, votes and asset amounts remain public. Changing the application or review invalidates its earlier vote.

## Join with member endorsements

Administrator admission remains the default. Enable the endorsement module, then an administrator explicitly sets the core admission policy, threshold (1–20), whether agents may endorse and an optional administrator override. The override is disabled by default. Owners and signed administrator admission cannot bypass a policy without that disclosed override.

A current member sponsors the applicant’s public join identity and exact application document version, kind/operator and expiry. Verify the public keys through a trusted channel. Applications last at most 30 days. Sponsoring is not proof of unique personhood; multiple paired credentials add no endorsement weight.

Distinct current eligible member IDs endorse an exact revision; they can withdraw their endorsement before admission. Amending or renewing by the same sponsor increments the revision and clears old endorsements. A policy revision invalidates earlier applications. At most 64 endorsements are stored; amend to reset a stale list if needed.

Admission rechecks current active, guardian-revoked and self-endorsement status, threshold, expiry, source code pin and complete identity. The authenticated module callback adds one ordinary member once. It cannot assign roles, issue credits or reserve assets. Native or EVM wallet governance authorization is activated separately after joining.

DAO administrators may change the admission policy or explicitly enable administrator override. Member endorsement is a configurable admission rule, not a unique-human guarantee. Private membership grants and history access remain separate approvals; admission itself decrypts no documents.

## Elect representatives for a fixed term

An administrator creates a named representative election, exact rules document version, future nomination cutoff, one to eight seats and a term of at most one year. The term must allow the saved DAO voting duration after nominations close. Candidate and voter identities are stable member IDs; paired logins add no votes.

Each active member nominates only themselves or withdraws before the cutoff. At most fifteen current eligible candidates plus the abstention choice enter voting. Withdrawal removes a nomination slot. Inactive or guardian-revoked nominations can be cleared when another member nominates. There is no random group assignment or meeting attendance oracle.

After nominations close, any active member may start the election before the term’s start. A changed policy revision prevents starting; schedule a successor election with reviewed rules. Starting freezes the sorted candidate IDs, exact DAO quorum/weight and normal voting denominator/highest member snapshot. One member votes once for one candidate or explicit abstention.

Finalization requires the frozen quorum; the yes/no approval majority is not used to rank candidates. Positive candidate tallies rank by weight. A tied group is installed only when the whole group fits remaining seats; a tie crossing the seat boundary leaves those seats vacant. No quorum or abstention-only voting creates no terms. Inactive or revoked winners leave their ranked seats vacant, without promoting a runner-up. Finalizing after the term ends creates no terms.

A durable term records its exact start/end and recall. The term window starts no earlier than that date; actual membership must remain eligible. An administrator can recall a term with a reason document. Titles grant no administrator flag, reviewer permission, module power, credit issuance or Treasury authority. Permanent roles and approved liabilities remain separate and survive term expiry.

Vote and finalize in Decide. Representative terms are read-only mandates unless a future separately reviewed bounded authority module is explicitly installed. Delegated budgets and fractal elections remain outside this release.

## decide contract

Source ABI JSON SHA-256: `0ca71692eb8136c2fc30fbc6c49a5ebe319daa0ab5e9e71f82aa5a0888d3aa52`.

### Action: execute

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| ballot_id | uint64 |

### Action: executeaward

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

### Action: newelect

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| election_id | uint64 |
| title | string |
| document_id | uint64 |
| document_version | uint32 |
| nomination_close | uint32 |
| term_start | uint32 |
| term_end | uint32 |
| seats | uint8 |

### Action: nominate

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| election_id | uint64 |
| active | bool |

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

### Action: openaward

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| ballot_id | uint64 |
| grants | name |
| round_id | uint64 |
| application_id | uint64 |
| project_id | uint64 |
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

### Action: recall

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| term_id | uint64 |
| document_id | uint64 |
| document_version | uint32 |

### Action: startelect

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| election_id | uint64 |

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

### Table: elections

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| creator | uint64 |
| title | string |
| document_id | uint64 |
| document_version | uint32 |
| document_commitment | checksum256 |
| policy_revision | uint64 |
| nomination_close | uint32 |
| term_start | uint32 |
| term_end | uint32 |
| seats | uint8 |
| status | uint8 |
| candidates | uint64[] |

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

### Table: grantplans

| Field | ABI type |
| --- | --- |
| ballot_id | uint64 |
| dao_id | uint64 |
| grants | name |
| works | name |
| round_id | uint64 |
| application_id | uint64 |
| application_revision | uint64 |
| project_id | uint64 |
| commitment | checksum256 |
| grants_hash | checksum256 |
| works_hash | checksum256 |
| policy_revision | uint64 |
| deadline | uint32 |
| executed | bool |

### Table: nominations

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| election_id | uint64 |
| member_id | uint64 |

### Table: terms

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| election_id | uint64 |
| member_id | uint64 |
| title | string |
| starts | uint32 |
| ends | uint32 |
| recalled | bool |
| recalled_at | uint32 |
| recall_doc | uint64 |
| recall_version | uint32 |

### Table: votes

| Field | ABI type |
| --- | --- |
| id | uint64 |
| ballot | uint64 |
| member | uint64 |
| weight | uint64 |
| choice | uint8 |

## works contract

Source ABI JSON SHA-256: `cf94bbfde89949656dadbfe80bca5cd27b9dddfff479e66aca3058f3d33b93b1`.

### Action: accept

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| project_id | uint64 |

### Action: acceptagr

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

### Action: grantwork

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| grants | name |
| round_id | uint64 |
| application_id | uint64 |
| ballot_id | uint64 |

### Action: offeragr

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| project_id | uint64 |
| term_start | uint32 |
| term_end | uint32 |

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

### Table: agreements

| Field | ABI type |
| --- | --- |
| project_id | uint64 |
| dao_id | uint64 |
| schema_version | uint16 |
| term_start | uint32 |
| term_end | uint32 |
| terms | checksum256 |
| accepted | bool |
| accepted_at | uint32 |

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

## grants contract

Source ABI JSON SHA-256: `6f7d79a48eae2559dd6b3b907c18e5d5ea6b98879ff5126bb3700170f8070eab`.

### Action: amend

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| application_id | uint64 |
| document_id | uint64 |
| document_version | uint32 |
| payments | asset[] |
| dues | uint32[] |
| term_start | uint32 |
| term_end | uint32 |

### Action: applygrant

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| round_id | uint64 |
| application_id | uint64 |
| document_id | uint64 |
| document_version | uint32 |
| payments | asset[] |
| dues | uint32[] |
| term_start | uint32 |
| term_end | uint32 |

### Action: closeapp

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| application_id | uint64 |

### Action: closeround

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| round_id | uint64 |

### Action: govaward

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| round_id | uint64 |
| application_id | uint64 |
| ballot_id | uint64 |

### Action: newround

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| round_id | uint64 |
| document_id | uint64 |
| document_version | uint32 |
| applications_close | uint32 |
| review_close | uint32 |
| awards_close | uint32 |
| maximum | asset |
| allow_agents | bool |
| works | name |

### Action: reviewapp

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| application_id | uint64 |
| eligible | bool |
| document_id | uint64 |
| document_version | uint32 |

### Action: submitapp

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| application_id | uint64 |

### Table: applications

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| round_id | uint64 |
| contributor | uint64 |
| revision | uint64 |
| document_id | uint64 |
| document_version | uint32 |
| payments | asset[] |
| dues | uint32[] |
| term_start | uint32 |
| term_end | uint32 |
| status | uint8 |
| consent_at | uint32 |
| decision_doc | uint64 |
| decision_version | uint32 |
| project_id | uint64 |
| funding_ballot | uint64 |

### Table: rounds

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| creator | uint64 |
| document_id | uint64 |
| document_version | uint32 |
| rules_revision | uint64 |
| applications_close | uint32 |
| review_close | uint32 |
| awards_close | uint32 |
| maximum | asset |
| awarded | int64 |
| allow_agents | bool |
| works | name |
| closed | bool |

## endorse contract

Source ABI JSON SHA-256: `b7ed7d2ca049178ef0af2cec9a280884c70c0e327c0214dbf9f06db7d79fbdaa`.

### Action: admit

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| application_id | uint64 |
| revision | uint64 |

### Action: applyjoin

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| application_id | uint64 |
| signing_key | public_key |
| encryption_key | string |
| custody | uint8 |
| kind | uint8 |
| operator_label | string |
| document_id | uint64 |
| document_version | uint32 |
| expires | uint32 |

### Action: unwitness

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| application_id | uint64 |
| revision | uint64 |

### Action: witness

| Field | ABI type |
| --- | --- |
| runtime | name |
| dao_id | uint64 |
| member_id | uint64 |
| application_id | uint64 |
| revision | uint64 |

### Table: joinapps

| Field | ABI type |
| --- | --- |
| id | uint64 |
| dao_id | uint64 |
| sponsor | uint64 |
| revision | uint64 |
| policy_revision | uint64 |
| signing_key | public_key |
| encryption_key | string |
| custody | uint8 |
| kind | uint8 |
| operator_label | string |
| document_id | uint64 |
| document_version | uint32 |
| document_commitment | checksum256 |
| expires | uint32 |
| witnesses | uint64[] |
| admitted | bool |
| member_id | uint64 |

## GET /v1/daos/:id/modules

Guide: module-reference.

No request body.

Query:

```json
{
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
}
```

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

Module 0.7.0-alpha.1 · config 1 · core ^0.7.0-alpha.1.

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

Module 0.7.0-alpha.1 · config 1 · core ^0.7.0-alpha.1.

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

Module 0.7.0-alpha.1 · config 1 · core ^0.7.0-alpha.1.

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

## grants-rounds configuration

Module 0.7.0-alpha.1 · config 1 · core ^0.7.0-alpha.1.

Capabilities: obligation.create.

Guide: grants-rounds.

```json
{
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
```

## endorsement-admission configuration

Module 0.7.0-alpha.1 · config 1 · core ^0.7.0-alpha.1.

Capabilities: member.manage.

Guide: endorsement-admission.

```json
{
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
```
