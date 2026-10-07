# Module documentation

Current development package: **0.6.0-alpha.1**, core protocol 0.6.0-alpha.1, contract interface 1. [Repository README](../README.md) describes contract behavior and deploy accounts. Shared setup, login, recovery, operations and release manifests belong to [core documentation](https://github.com/Daclify/daclify-backend-core/blob/main/docs/README.md).

## Guides and reference

Edit `guides/topics.json` for module explanations. `npm run docs:generate` builds [reference.md](generated/reference.md), [reference.json](generated/reference.json) and `../protocol/generated/help.ts` from those guides, compiled module ABIs and canonical configuration/API schemas. `npm run docs:check` rejects drift. Never hand-edit generated files.

The packed `@daclify/modules/help` bundle appears in the app at `/docs/decide`, `/docs/works`, `/docs/payroll`, `/docs/contribution-agreements`, `/docs/grants-rounds`, `/docs/endorsement-admission` and `/docs/representative-elections`. Rebuild/reinstall the packed module SDK after guide changes. Configuration references describe accepted schemas; current install-time persistence limits and fixed contract rules are stated in the guides.

## Authority and compatibility

Module manifests declare compatible core versions, interface/configuration versions, actions and grants. The client and runtime verify reviewed module code pins. A guide version alone does not verify a deployed contract. Closed votes, elected titles and service sessions are not administrative or spending authority.

The 0.6 service update changes no module C++ layout/code. Existing liabilities and identities stay on chain. Follow [upgrade to 0.6](https://github.com/Daclify/daclify-backend-core/blob/main/docs/operations/upgrade-0.6.md), and consult [upgrade to 0.5](https://github.com/Daclify/daclify-backend-core/blob/main/docs/operations/upgrade-0.5.md) only for the earlier contract changes.

For server loss, [disaster recovery](https://github.com/Daclify/daclify-backend-core/blob/main/docs/disaster-recovery.md) distinguishes on-chain module records from database pairings and each member's private keys. One recovered administrator cannot recover everyone else's secrets. Managed custody, real providers/wallet clients, production deployment and durable off-host backups remain separate qualification work.

## Verification records

Run `npm run verify`, `npm run build` and `npm run format:check` locally. Compiled-WASM module tests require the actual core/module artifacts prepared by the sibling bootstrap; they do not deploy a public chain. GitHub checks are manual-only.

[Requirements](releases/requirements.json), [changelog](../CHANGELOG.md), [research evidence](https://github.com/Daclify/daclify-backend-core/blob/main/docs/evidence/2026-10-07-research-execution.md) and [recovery evidence](https://github.com/Daclify/daclify-backend-core/blob/main/docs/evidence/2026-10-07-wallet-recovery.md) record the supported scope and actual results. Plans and mocks are not live integration evidence.
