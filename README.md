# Daclify V2 backend modules

Antelope C++ contracts for Decide, Works, Payroll, Grants rounds, Endorsement admission and Community Activity, plus the generated module protocol, configuration schemas, and guides. This repository does not own the runtime, the API, the database, or custody. Those live in [daclify-backend-core](https://github.com/Daclify/daclify-backend-core). The screens live in [daclify-frontend](https://github.com/Daclify/daclify-frontend).

Development uses **`dev`**, with matching core/frontend checkouts on `dev`. Feature branches start from `dev` and return there; `main` is updated only on an explicit release request. See core's [branch workflow](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/development.md#branches).

Check the three repositories out as siblings. Install from core’s [development bootstrap](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/development.md). Core’s [operations guide](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/operations.md) names the account each contract is deployed to. In a local checkout that guide is `../daclify-backend-core/docs/operations.md`. Use the [documentation index](docs/README.md) for guide ownership and current compatibility.

Source SDK and exact core peer versions are pinned in `package.json`. The contract catalogue's `CONTRACT_VERSION`, interfaces and generated WASM/ABI pins are separate; the current status checkpoint is in [core documentation](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/current-status.md). Current contracts include definition-bound ballots, protected Works disputes and encrypted Quick ballots; consult their producer pins and migration evidence rather than treating the current package as a historical SDK-only update. Community Activity, the existing DAO tools, RAM observation and bounded adoption/enforcement remain subject to their configured deployment and qualification requirements. The Node-only `ConnectedPaymentClient` performs DAO-scoped Connect calls; core owns Stripe configuration, accounting and authorization, and the client never needs a platform Stripe key. Products create receipts with explicit module fulfillment. See [payment integration](docs/connected-payments.md). This is a development package, not a qualified production release.

The Archive service provides terminal markers, a bounded ordinary-poll planner, export consent/manifest assembly and standalone recovery verification through `@daclify/modules/archive`. Core hosts resumable uploads, reservations and downloads; see the [Archive format and operations boundary](docs/archive-format.md). The branch implements independent encrypted backups, native attestation/approval/revocation, bounded ordinary-poll pruning, and verified history merged with live votes. Production destructive use and the full supported-release migration/recovery matrix remain gated. Local native original-kit recovery is recorded in core’s execution evidence. Archive uses normal core storage subscriptions.

## Contracts in this repository

Decide (`contracts/decide`) opens a ballot with `kind` 0, 1, or 2.

- Kind 0 snapshots active members and counts each vote as weight 1.
- Kind 1 snapshots governance credits and counts the member’s credits.
- Kind 2 snapshots deposited native stake and counts that stake.

A ballot has 2 to 16 choices, a quorum and an approval threshold in basis points, and a duration from 60 seconds through 30 days. Closing and finalization are separate from execution. A passed ballot does not make an arbitrary contract call. An advisory poll is this ballot with no treasury movement. There is no separate poll contract.

Where core stores a governance policy, every ballot must match its exact settings. `openwork` binds a binary vote to a specific Works project, module code, policy revision and execution deadline. `execute` reserves the passed project's milestones once; it does not run arbitrary actions or approve delivery. See core's [authority and compatibility notes](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/dao-presets.md).

Works (`contracts/works`) funds a contributor through milestones. Acceptance reserves the DAO treasury. For unprotected work, a positive review approves the payment obligation; with protected terms, review stays provisional through the agreed challenge period. Governed funding requires inline acceptance from the configured Decide contract; direct administrator acceptance is rejected. Submission, review, and revision stay on the module. Protected disputes use eligible-member voting that excludes the contributor and participating reviewers, with agreed backup deadlines and mutual settlement safeguards. Settlement of an approved obligation goes through the core treasury. See the [Works guide](docs/generated/reference.md#fund-work-through-milestones) for protected terms, deadlines and decision permissions; deployment qualification requirements still apply.

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

Build and test locally on the supported development host. GitHub verification is manual-only: pushes and pull requests do not start builds or tests. Core's [development guide](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/development.md) is the source for the shared local workflow.

```sh
npm run lint
npm run typecheck
npm run docs:check
npm test
npm run verify
```

`npm test` runs the compiled-WASM tests in this repository. It does not start a chain. Core’s `--contracts` bootstrap compiles these contracts and stages the runtime the harness links against. Ordinary bootstrap also refreshes existing compiled current-core fixtures. The normal harness rejects WASM or serialized ABI hashes that differ from the installed core SDK before running; old upgrade fixtures retain their separate recorded versions. `npm run build:contracts` compiles only this repository when the toolchain image is already built.

Generated references are produced by `npm run docs:generate` from the guides and the compiled ABI. `docs:check` fails when the generated files drift. Do not hand-edit `docs/generated/` or `protocol/generated/`.

## Research modules and recovery

Works adds exact frozen contribution terms and contributor consent while retaining the existing Treasury ledger. Grants rounds binds eligible applications to passed Decide award votes and fully reserved Works milestones; caps are cumulative lifetime limits, without matching or donor pots. Endorsement admission enforces an opt-in runtime policy using distinct current member witnesses and once-only ordinary enrollment. Decide representative elections freeze candidates, votes and term/recall records without granting administrative or spending powers.

Modules require reviewed runtime action links and code pins. Existing liabilities survive module removal/upgrades. See core’s [0.5 upgrade runbook](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/operations/upgrade-0.5.md) and [execution ledger](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/evidence/2026-10-07-research-execution.md) for the earlier contract changes. Use the [0.6 upgrade guide](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/operations/upgrade-0.6.md) for its historical service migration. Use [current status](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/current-status.md) and the producer manifests for current artifacts; the [audit remediation runbook](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/operations/project-audit-remediation.md) retains its coordinated historical upgrade requirements.

Module records remain on chain through service loss. Recovering an existing member restores only their current permissions, adds no voting weight and does not recreate agreements or obligations. Each member recovers independently. Approved liabilities survive module removal; historical private content still needs the original decryption key, encrypted grant and surviving bytes. Login pairings and jobs are core PostgreSQL state. Modules do not store or recover user private keys. Follow core’s [disaster recovery runbook](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/disaster-recovery.md).

## Archive development branch

The public Archive package owns deterministic bounded bundles/Merkle proofs, schema identities, eligibility planning, old-version document/ordinary-poll readers, merged history and namespaced immutable migrations. Core hosts verified exports, encrypted independent backups, native availability/approval/revocation, manual source-owned pruning and exact document restoration. Original row serialization and old poll request JSON are preserved. Host migration 029 and Archive migration 005 record whole manifest/chunk retention groups. See [Archive format](docs/archive-format.md) and core’s [execution evidence](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/evidence/2026-10-08-resource-execution.md).

The owned native encrypted-document drill verified pruning, database-loss accounting reconstruction, original-kit decryption and exact signed restoration. Production pruning/cleanup require separate reviewed enablement. All five module payers support immutable exclusive runtime binding before receiving a funded pool. Existing shared payers must drain or explicitly migrate old executable work first; a binding does not rewrite old approvals or provide completion holds. Open and approved funding votes retain their accepted Works/Grants code hashes. A finalized failed vote cannot execute and no longer blocks replacement until its former deadline.

Custom C++ module authors must declare `DACLIFY_DOCUMENT_TABLES` before including `module.hpp`, listing every direct document-bearing table. Use an empty list only when there are no direct references. The recipe is immutable per code hash. An incomplete recipe can make pruning unsafe and cannot qualify a module. Preserve old row serialization and source-pinned executable work through upgrades.

Automatic included payer offers are implemented behind explicit qualified/funded configuration. Bounded legacy migration, obligation-specific completion holds and explicit quota enforcement are implemented with local native evidence. Complete provider/public-target and immutable-release qualification remain open.

## License

First-party code, contracts, SDKs and documentation are licensed under
**AGPL-3.0-only**. See [LICENSE](LICENSE) and [licensing and source obligations](LICENSING.md).
Third-party files retain their own licenses. Contributions remain owned by their authors.

The development migration controller scans all five module payers using canonical row/index recipes and checks module kind/source code. Decide adopts missing legacy term holds and poll completion markers without rewriting ballot/term records or approved executable hashes. See [core migration operations](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/operations/ram-migration.md); a bound payer belongs exclusively to one runtime. Migration and quotas still need release qualification.

Each first-party contract exposes an authenticated readonly `checkquota(runtime,dao_id)` for atomic core activation. Works verifies fixed pending-work document references, Payroll verifies fixed settlement controls, and Decide verifies active election holds/open ordinary-poll completion markers. Bounded completion-only adoption supports already observed deployments with guards disabled; it preserves existing projects, schedules, ballots and executable approval hashes. See core’s RAM migration runbook for exact families and release limits.

The retained actual historical fixtures now include Endorsement. [Pending-admission upgrade evidence](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/evidence/2026-10-09-admission-upgrade.md) covers original application/key/witness preservation, idempotent document-reference backfill, current witness eligibility and once-only ordinary admission. Rebuild with `npx tsx tools/build-document-upgrade.ts`; these compiled-WASM cases are distinct from native RAM/public-provider qualification.


Archive retains the exact native-qualified Grants checkpoint runtime decoder (`6ad460…`) after the receiving-wallet payout update. Existing bundles still require their original code/raw-ABI/schema identity and exact DAO scope; unknown identities remain refused. Modules consume the updated core development packet. See [receiving-wallet evidence](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/evidence/2026-10-09-receiving-wallet-ram.md) for payout preparation and public qualification limits.

## Executive governance

Decide supports non-voting members and opt-in executive elections titled `Executives`, with the pinned `electexec` grant and a pending roster that activates at term start once eligible successors pair. Representative elections retain their previous behaviour. Core validates the roster, term, native-controller availability and once-only handover.

## Module interaction qualification

Core’s [permission map](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/guides/contract-permissions.md) explains shared versus independent module ownership and the signed member/callback paths. The dedicated native integration suite exercises all five modules after owner handover, and `tests/grants.test.ts` verifies that missing Grants-to-Works grants or cleared executor pins cannot consume an approved award. See [reproducible integration evidence](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/evidence/2026-10-09-contract-integration.md); native permissions require a real node, not only VERT.

SDK/help package versions and contract versions are independent. `protocol/index.ts` owns `VERSION`, `CONTRACT_VERSION` and the exact `CORE_RANGE`; generated manifests pin the actual contract bytes. Documentation-only changes require new immutable package versions when packed bytes change, but do not by themselves require WASM redeployment.

Historical core 0.10.0-alpha.1 introduced both-key binding in vault login v3. Its old compatibility range is not the current SDK peer range; consumers must use the exact core peer declared in the current package. See the [coordinated rollout](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/operations/login-v3.md).

The historical core 0.13.0-alpha.4 update introduced a separate member-activity table, preserving the member layout and then-existing module pins. Module actions submitted through authenticated core dispatch update the actor’s DAO activity only after transaction success. The five module binaries need no redeployment for this change. See [unified Users](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/operations/unified-users.md).

## Community Activity

The Activity contract records selected completions/review submissions, independent reviews and exact-revision Decide ballot links. It keeps opaque identifiers and commitments on-chain; projects keep their detailed task database. App-specific encryption grants are separate from the browser's recording credential. See the [developer guide](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/connected-community-apps.md) and [runnable mini app](https://github.com/Daclify/daclify-backend-core/blob/dev/examples/community-mini-app/README.md).

The original Activity rollout retained the then-unchanged five contracts. For current contracts, use the pinned CDT and `-O=s`; build all contracts with `npm run build:contracts`, or select `activity` when only its source changed. Match every candidate to its current generated WASM/raw-ABI pins and qualify new binary bytes before deployment. Historical fixtures alone retain their original compiler flags and hashes.
