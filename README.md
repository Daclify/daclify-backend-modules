# Daclify V2 backend modules

Antelope C++ contracts for Decide, Works, Payroll, Grants rounds and Endorsement admission, plus the generated module protocol, configuration schemas, and guides. This repository does not own the runtime, the API, the database, or custody. Those live in [daclify-backend-core](https://github.com/Daclify/daclify-backend-core). The screens live in [daclify-frontend](https://github.com/Daclify/daclify-frontend).

Check the three repositories out as siblings. Install from core’s [development bootstrap](https://github.com/Daclify/daclify-backend-core/blob/main/docs/development.md). Core’s [operations guide](https://github.com/Daclify/daclify-backend-core/blob/main/docs/operations.md) names the account each contract is deployed to. In a local checkout that guide is `../daclify-backend-core/docs/operations.md`. Use the [documentation index](docs/README.md) for guide ownership and current compatibility.

Current development version: **0.7.0-alpha.1**, requiring the matching 0.7 core protocol/SDK. Contract interface 1 and existing module WASM remain unchanged. The package adds a Node-only `ConnectedPaymentClient` for DAO-scoped central Connect calls. Core owns all Stripe configuration, accounting and authorization; this client never needs a platform Stripe key. Products create receipts, with module fulfillment explicit. See [operator payment integration](docs/connected-payments.md) and [core upgrade 0.7](../daclify-backend-core/docs/operations/upgrade-0.7.md). This development package is not a qualified production release.

## Contracts in this repository

Decide (`contracts/decide`) opens a ballot with `kind` 0, 1, or 2.

- Kind 0 snapshots active members and counts each vote as weight 1.
- Kind 1 snapshots governance credits and counts the member’s credits.
- Kind 2 snapshots deposited native stake and counts that stake.

A ballot has 2 to 16 choices, a quorum and an approval threshold in basis points, and a duration from 60 seconds through 30 days. Closing and finalization are separate from execution. A passed ballot does not make an arbitrary contract call. An advisory poll is this ballot with no treasury movement. There is no separate poll contract.

Where core stores a governance policy, every ballot must match its exact settings. `openwork` binds a binary vote to a specific Works project, module code, policy revision and execution deadline. `execute` reserves the passed project's milestones once; it does not run arbitrary actions or approve delivery. See core's [authority and compatibility notes](../daclify-backend-core/docs/dao-presets.md).

Works (`contracts/works`) funds a contributor through milestones. Acceptance reserves the DAO treasury. Delivery review approves the obligation. Governed funding requires inline acceptance from the configured Decide contract; direct administrator acceptance is rejected. Submission, review, and revision stay on the module. Settlement of an approved obligation goes through the core treasury. A separate dispute process is not implemented.

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
