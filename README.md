# Daclify V2 Backend Modules

Private development repository for first-party governance, funding, payroll and integration modules. Modules own their Antelope C++ contracts, TypeScript handlers/jobs, configuration schemas, generated module artifacts, namespaced migrations, guides and tests. Decide and Works reuse useful Telos governance patterns with Daclify's identity and authorization model.

Current status: incomplete development implementation. Antelope C++ Decide, Works and fixed-term payroll contracts, generated SDK/schema artifacts, configuration manifests, API schemas and versioned references are implemented and exercised with compiled-WASM tests. Application journeys use the core treasury for approved settlement after module removal. Custom persistent Works/payroll policy settings, execution/committee extensions, module-host integrations and chain adapters remain incomplete. Core’s confirmed native authorization defect and missing runtime code pinning block production readiness.

The canonical [master plan](https://github.com/Daclify/daclify-backend-core/blob/main/docs/superpowers/plans/2026-10-05-daclify-v2-master-plan.md), [work packages](https://github.com/Daclify/daclify-backend-core/blob/main/docs/superpowers/plans/2026-10-05-daclify-v2-work-packages.md) and [versioning, documentation, Pinata and test policy](https://github.com/Daclify/daclify-backend-core/blob/main/docs/superpowers/plans/2026-10-05-daclify-v2-release-docs-test-policy.md) live in the core repository. In the standard local layout, core is at `../daclify-backend-core/`.

Consume core's pinned public protocol and bounded host capabilities. Do not import private authorization/database/custody code or add unrestricted signing/database access. Module UI components are reviewed source in the frontend repository; configuration metadata cannot load arbitrary remote executable UI.

Each module declares compatible core interfaces, versioned configuration and explicit grants. Add generated references and explanatory guides with the behavior, test accepted/rejected transitions and monetary invariants, and verify against supported core releases. Module removal/upgrades preserve pending ballots, obligations and document access.

The user requests one continuous implementation session and reviews the complete code afterward. Internal tests and reviews continue throughout. Production deployment, authority changes and asset migration require separate express authorization after that review.
Daclify V2 — governance, funding, payroll, and integration modules

Install from the three sibling repositories using core’s [development bootstrap](https://github.com/Daclify/daclify-backend-core/blob/feat/v2-implementation/docs/development.md). Run `npm run typecheck`, `npm run docs:check`, and `npm test`. The `--contracts` bootstrap option rebuilds artifacts and stages the core runtime used by the module harness; it does not deploy a chain.
