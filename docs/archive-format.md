# Archive format v1 — development

`@daclify/modules/archive` currently exports bounded binary chunk encoding/decoding, domain validation, Merkle-tree construction and proof verification. This is the format library for the planned Archive service module. It has no separate blockchain account. Export jobs, administrator approval, availability attestations, source pruning, billing and history UI are not implemented by this library.

The format binds each chunk to its format version, chain, runtime, DAO, source account, source code hash, raw ABI hash, source schema hash, table, scope, chunk ordinal and leaf count, in that order. Fixed integers use unsigned little-endian Antelope serialization. Names use packed uint64 values; checksums use 32 raw bytes. The domain occupies 178 bytes in version 1.

A chunk contains the packed domain followed by a varuint32 row count and ordered `(uint64 primary key, length-prefixed original row bytes)` records. It may contain 1–65,536 rows and must fit within 5 MiB including this encoding. Empty families produce no chunk. Duplicate or descending primary keys, noncanonical variable-length integers and trailing bytes are rejected. The decoder bounds counts before allocating records.

The leaf is SHA256 of `0x00 || SHA256(domain bytes) || uint32 leaf index || uint64 primary key || varuint32 row length || original row bytes`. A parent is SHA256 of `0x01 || left hash || right hash`. An odd final node duplicates itself; proofs must supply that exact duplicate. Proof direction derives from the checked index, and path length derives from the leaf count, with at most 16 levels.

`decodeArchiveChunk` requires the expected domain and root from the approved descriptor. It returns the original packed bytes and does not accept a downloaded ABI. The eventual source decoder/planner must separately verify the released row schema, irreversible snapshot, complete coverage and pruning eligibility. A valid hash does not prove that a file remains available, that a source row is eligible for deletion, or that an administrator approved deletion.

Original ciphertext remains ciphertext. The formatter does not decrypt documents, transform key grants, or recover lost member keys. Manifests/provider labels must omit private titles, filenames and identities. Key grants, identities, treasury liabilities and payment replay protections remain live; the first planned pruning families are finalized ordinary-poll votes and unreferenced old document versions after manual approval and the eligibility delay.

Archived files remain pinned and count toward the same approved per-DAO storage capacity as active files. The approved commercial policy is 100 MB free plus $1 per additional approved 1 GB per month, in decimal units. Storage accounting/subscriptions and the 30-day nonpayment cleanup lifecycle are still implementation work; this library does not charge or unpin anything.

The independent fixture in `tests/fixtures/archive-v1.json` was calculated with Python `struct`/`hashlib`, including Antelope name and varuint packing. TypeScript and compiled C++ on the owned Spring/Telos-system fixture match its domain, leaves, root and proofs. Property tests use seed 20261008; boundary tests include the 5 MiB wire limit and 65,536 leaves. These results qualify the tested format, not a production Archive service.
