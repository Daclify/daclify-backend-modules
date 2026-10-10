# Module audit — 2026-10-10

The [complete cross-repository report](https://github.com/Daclify/daclify-backend-core/blob/dev/docs/evidence/2026-10-10-three-repository-audit.md) records architecture, priorities, evidence and the login finding and its subsequent approved fix.

Reviewed Decide, Works, Payroll, Grants and Endorsement actor/permission boundaries, treasury/document references, configurations/manifests, Archive retained decoders and SDK/provider integration. Kept the canonical core types, required historical decoders and contract binaries intact.

Fixed `ConnectedPaymentClient`: enforce 64 KiB while streaming bytes, release rejected bodies, preserve split UTF-8 and return redacted errors for malformed JSON/schema responses. Added seven regressions covering oversized streams, invalid declared lengths, unread error bodies, Unicode and malformed output. Existing cross-DAO/order validation remains.

SDK/help is alpha.7 with exact core alpha.6 peer; contract version remains alpha.5. Regenerated help/docs and development packages; core/frontend consumers pin the new archive. Manual sibling checkouts now follow the selected branch/tag and remain opt-in.

Verified: `npm run verify` (27 files / 161 tests, actual compiled WASM/ABI), `npm run format:check`, `npm run build`; core SQL integration (195), owned native permission/module integration (22), standalone frontend install/verify/build. No C++/ABI, financial policy, row layout or migration changes.

Remaining: VERT development-only lodash.set/elliptic advisories have no advertised safe npm fix. Retain trusted local fixtures; emulator replacement needs compatibility evidence. Live module fiat fulfillment is explicit application integration, not an automatic permission to mint votes or treasury claims. No new live Stripe/Pinata or full supported-release native matrix was qualified.

The user subsequently approved login v3. [The follow-up](2026-10-10-login-key-binding.md) records the matching core SDK peer, supported compatibility range and preserved contract release. The version/check results above describe the original audit checkpoint.
