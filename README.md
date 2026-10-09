# Daclify V2 backend modules

Antelope C++ contracts for Decide, Works, Payroll, Grants rounds and Endorsement admission, plus the generated module protocol, configuration schemas, and guides. This repository does not own the runtime, the API, the database, or custody. Those live in [daclify-backend-core](https://github.com/Daclify/daclify-backend-core). The screens live in [daclify-frontend](https://github.com/Daclify/daclify-frontend).

Check the three repositories out as siblings. Install from core’s [development bootstrap](https://github.com/Daclify/daclify-backend-core/blob/main/docs/development.md). Core’s [operations guide](https://github.com/Daclify/daclify-backend-core/blob/main/docs/operations.md) names the account each contract is deployed to. In a local checkout that guide is `../daclify-backend-core/docs/operations.md`. Use the [documentation index](docs/README.md) for guide ownership and current compatibility.

Current development version: **0.7.0-alpha.1**, requiring the matching 0.7 core protocol/SDK. Contract interface 1 and existing serialized rows remain unchanged. This resource-billing-archives development branch changes the five module WASM builds for opt-in RAM observation; legacy migration and per-DAO enforcement are in qualification. A separate release and upgrade packet are required before deploying this branch. The package adds a Node-only `ConnectedPaymentClient` for DAO-scoped central Connect calls. Core owns all Stripe configuration, accounting and authorization; this client never needs a platform Stripe key. Products create receipts, with module fulfillment explicit. See [operator payment integration](docs/connected-payments.md) and [core upgrade 0.7](../daclify-backend-core/docs/operations/upgrade-0.7.md). This development package is not a qualified production release.

The Archive service provides terminal markers, a bounded ordinary-poll planner, export consent/manifest assembly and standalone recovery verification through `@daclify/modules/archive`. Core hosts resumable uploads, reservations and downloads; see the [Archive format and operations boundary](docs/archive-format.md). The branch implements independent encrypted backups, native attestation/approval/revocation, bounded ordinary-poll pruning, and verified history merged with live votes. Production destructive use and the full supported-release migration/recovery matrix remain gated. Local native original-kit recovery is recorded in core’s execution evidence. Archive uses normal core storage subscriptions.

## Contracts in this repository

Decide (`contracts/decide`) opens a ballot with `kind` 0, 1, or 2.

- Kind 0 snapshots active members and counts each vote as weight 1.
- Kind 1 snapshots governance credits and counts the member’s credits.
- Kind 2 snapshots deposited native stake and counts that stake.

A ballot has 2 to 16 choices, a quorum and an approval threshold in basis points, and a duration from 60 seconds through 30 days. Closing and finalization are separate from execution. A passed ballot does not make an arbitrary contract call. An advisory poll is this ballot with no treasury movement. There is no separate poll contract.

Where core stores a governance policy, every ballot must match its exact settings. `openwork` binds a binary vote to a specific Works project, module code, policy revision and execution deadline. `execute` reserves the passed project's milestones once; it does not run arbitrary actions or approve delivery. See core's [authority and compatibility notes](../daclify-backend-core/docs/dao-presets.md).

Works (`contracts/works`) funds a contributor through milestones. Acceptance reserves the DAO treasury. Delivery review approves the obligation. Governed funding requires inline acceptance from the configured Decide contract; direct administrator acceptance is rejected. Submission, review, and revision stay on the module. Settlement of an approved obligation goes through the core treasury. A separate dispute process is not implemented.

With RAM observation enabled, acceptance preallocates fixed submission/review reference slots before funds are reserved. Revisions update existing slots rather than allocating them at completion. Legacy pending work receives those slots through bounded `scanram(runtime,"adoptwork",limit)` during the core migration; creating new document contents still requires ordinary RAM/storage capacity. These are development qualification features, not public rollout approval.

Payroll (`contracts/payroll`) commits 1 to 12 installments of one native asset. One installment is the one-time payment. The full term is reserved and approved at commit. `settle` pays every installment that is already due, oldest first, and leaves a future installment unpaid. A paused schedule pays nothing until an administrator resumes it. The recipient, amount, interval, and start are not edited by the label or the pause. Direct core `payob` can still pay one approved obligation and does not apply the pause or the catch-up.

Privileged module callbacks call back into the runtime as the module account. The runtime pins `get_code_hash` while the module keeps any action. Replacing the wasm without updating that pin makes the next callback fail.

## Deploy accounts

The deploy profiles live in core. This repository does not create accounts.

| Contract              | Develop          | Testnet        | Production        |
| --------------------- | ---------------- | -------------- | ----------------- |
| Decide                | `decide`         | `daclifydecid` | `decide.we`       |
| Works                 | `works`          | `daclifyworks` | `works.we`        |
| Payroll               | `payroll`        | `daclifypayr1` | `payroll.we`      |
| Grants rounds         | fixture-selected | `daclifygrant` | operator-selected |
| Endorsement admission | fixture-selected | `daclifyendor` | operator-selected |

Testnet names are ordinary 12-character accounts because the testnet creator does not own a premium suffix. The API reads them from `MODULE_DEPLOYMENTS`. If that variable is empty, core does not call these contracts and payroll settlement stays on `payob`.

## Not in these contracts

The product catalogue still needs separate reviewed contracts for bounties, vesting and inbound dues. Per-obligation and UTC-day commitment limits belong to core's governance policy. A hackathon module would be global and would belong to the project DAO, not to Hub control of other DAOs. Decide representative elections support 1–8 seats, at most 15 candidates and terms up to one year; terms grant no administrative or spending powers. Endorsement admission is an optional membership policy. The legacy elections module stays in `daclifymodules` and is not ported. The legacy hooks registry is a different contract and is not this module host.

Custom persistent Works or payroll policy settings are not stored at install time. The guides in `docs/guides/topics.json` describe the fixed limits the contracts enforce today.

## Checks

Node 24.21 or later, and npm 11.19 or later.

Build and test locally on the Mac. GitHub verification is manual-only: pushes and pull requests do not start builds or tests. Core's [development guide](https://github.com/Daclify/daclify-backend-core/blob/main/docs/development.md) is the source for the shared local workflow.

```sh
npm run lint
npm run typecheck
npm run docs:check
npm test
npm run verify
```

`npm test` runs the compiled-WASM tests in this repository. It does not start a chain. Core’s `--contracts` bootstrap compiles these contracts and stages the runtime the harness links against. `npm run build:contracts` compiles only this repository when the toolchain image is already built.

Generated references are produced by `npm run docs:generate` from the guides and the compiled ABI. `docs:check` fails when the generated files drift. Do not hand-edit `docs/generated/` or `protocol/generated/`.

## Research modules and recovery

Works adds exact frozen contribution terms and contributor consent while retaining the existing Treasury ledger. Grants rounds binds eligible applications to passed Decide award votes and fully reserved Works milestones; caps are cumulative lifetime limits, without matching or donor pots. Endorsement admission enforces an opt-in runtime policy using distinct current member witnesses and once-only ordinary enrollment. Decide representative elections freeze candidates, votes and term/recall records without granting administrative or spending powers.

Modules require reviewed runtime action links and code pins. Existing liabilities survive module removal/upgrades. See core’s [0.5 upgrade runbook](../daclify-backend-core/docs/operations/upgrade-0.5.md) and [execution ledger](../daclify-backend-core/docs/evidence/2026-10-07-research-execution.md) for the earlier contract changes. Use the [0.6 upgrade guide](https://github.com/Daclify/daclify-backend-core/blob/main/docs/operations/upgrade-0.6.md) for current service compatibility and external qualification gates.

Module records remain on chain through service loss. Recovering an existing member restores only their current permissions, adds no voting weight and does not recreate agreements or obligations. Each member recovers independently. Approved liabilities survive module removal; historical private content still needs the original decryption key, encrypted grant and surviving bytes. Login pairings and jobs are core PostgreSQL state. Modules do not store or recover user private keys. Follow core’s [disaster recovery runbook](https://github.com/Daclify/daclify-backend-core/blob/main/docs/disaster-recovery.md).

## Archive development branch

The public Archive package owns deterministic bounded bundles/Merkle proofs, schema identities, eligibility planning, old-version document/ordinary-poll readers, merged history and namespaced immutable migrations. Core hosts verified exports, encrypted independent backups, native availability/approval/revocation, manual source-owned pruning and exact document restoration. Original row serialization and old poll request JSON are preserved. Host migration 029 and Archive migration 005 record whole manifest/chunk retention groups. See [Archive format](docs/archive-format.md) and core’s [execution evidence](../daclify-backend-core/docs/evidence/2026-10-08-resource-execution.md).

The owned native encrypted-document drill verified pruning, database-loss accounting reconstruction, original-kit decryption and exact signed restoration. Production pruning/cleanup require separate reviewed enablement. All five module payers support immutable exclusive runtime binding before receiving a funded pool. Existing shared payers must drain or explicitly migrate old executable work first; a binding does not rewrite old approvals or provide completion holds. Open and approved funding votes retain their accepted Works/Grants code hashes. A finalized failed vote cannot execute and no longer blocks replacement until its former deadline.

Custom C++ module authors must declare `DACLIFY_DOCUMENT_TABLES` before including `module.hpp`, listing every direct document-bearing table. Use an empty list only when there are no direct references. The recipe is immutable per code hash. An incomplete recipe can make pruning unsafe and cannot qualify a module. Preserve old row serialization and source-pinned executable work through upgrades.

Automatic included payer offers are implemented behind explicit qualified/funded configuration. General legacy migration, obligation-specific completion holds, quota enforcement, live providers and independent release verification remain open.

## License

First-party code, contracts, SDKs and documentation are licensed under
**AGPL-3.0-only**. See [LICENSE](LICENSE) and [licensing and source obligations](LICENSING.md).
Third-party files retain their own licenses. Contributions remain owned by their authors.

The development migration controller scans all five module payers using canonical row/index recipes and checks module kind/source code. Decide adopts missing legacy term holds and poll completion markers without rewriting ballot/term records or approved executable hashes. See [core migration operations](../daclify-backend-core/docs/operations/ram-migration.md); a bound payer belongs exclusively to one runtime. Migration and quotas still need release qualification.

Each first-party contract exposes an authenticated readonly `checkquota(runtime,dao_id)` for atomic core activation. Works verifies fixed pending-work document references, Payroll verifies fixed settlement controls, and Decide verifies active election holds/open ordinary-poll completion markers. Bounded completion-only adoption supports already observed deployments with guards disabled; it preserves existing projects, schedules, ballots and executable approval hashes. See core’s RAM migration runbook for exact families and release limits.
