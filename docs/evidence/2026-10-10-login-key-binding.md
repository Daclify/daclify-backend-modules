# Module SDK compatibility for login v3 — 2026-10-10

SDK/help 0.9.0-alpha.8 requires core protocol 0.10.0-alpha.1. Module contract version remains 0.9.0-alpha.5; C++/ABI/code hashes and financial/permission behavior are unchanged. Catalog compatibility retains the existing 0.9 range and adds exactly 0.10.0-alpha.1. The new compatibility regression failed before the declaration update and passes afterward. Generated help, manifests, peer and development lock integrity are refreshed.

Verified `npm run verify` (27 files / 162 unit/VERT tests), `npm run format:check` and `npm run build`. Core integration (206), fresh native API/wallet (7), browser payment/module flows (22) and standalone frontend package checks validate the coordinated consumers. The operator must deliver API/frontend together; no module contract redeployment is needed.

See [core evidence](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/evidence/2026-10-10-login-key-binding.md) and [coordinated rollout](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/operations/login-v3.md). No public deployment/live provider qualification occurred. Mixed versions reject new vault logins; older app tabs and pending logins need refreshing/restarting. Existing sessions and original encrypted recovery kits are preserved.
