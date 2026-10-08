import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { Checksum256 } from '@wharfkit/antelope';
import { CID } from 'multiformats/cid';
import { create } from 'multiformats/hashes/digest';
import { z } from 'zod';
import { ArchiveDomainSchema, ArchiveManifestSchema } from '../protocol/archive.js';
import { encodeArchiveChunk } from '../archive/format.js';
import {
  createArchiveManifest,
  encodeArchiveManifest,
  decodeArchiveManifest,
  verifyArchiveChunks,
  archiveDescriptorHash,
} from '../archive/manifest.js';
const vector = z
  .object({
    domain: ArchiveDomainSchema,
    root: z.string(),
    rows: z.array(z.object({ primaryKey: z.string(), packed: z.string() })),
  })
  .parse(JSON.parse(readFileSync('tests/fixtures/archive-v1.json', 'utf8')));
const bytes = encodeArchiveChunk(vector.domain, vector.rows);
const commitment = Checksum256.hash(bytes).toString();
const cid = CID.createV1(0x55, create(0x12, Checksum256.from(commitment).array)).toString();
const manifestVector = z
  .object({
    manifest: ArchiveManifestSchema,
    descriptorCommitment: z.string(),
    manifestCommitment: z.string(),
  })
  .parse(JSON.parse(readFileSync('tests/fixtures/archive-manifest-v1.json', 'utf8')));
function body() {
  return {
    schemaVersion: 1,
    dao: {
      chainId: vector.domain.chain_id,
      contract: vector.domain.runtime,
      daoId: vector.domain.dao_id,
      interfaceVersion: 1,
    },
    snapshot: {
      blockNumber: 100,
      blockId: '00000064' + 'ab'.repeat(28),
      timestamp: '2026-10-08T10:00:00Z',
    },
    source: {
      account: vector.domain.source,
      codeHash: vector.domain.code_hash,
      abiHash: vector.domain.abi_hash,
    },
    families: [
      {
        kind: 'ordinary-poll-votes',
        parentId: '4',
        table: 'votes',
        scope: vector.domain.scope,
        schemaHash: vector.domain.schema_hash,
        records: '3',
        chunks: [
          {
            domain: vector.domain,
            root: vector.root,
            cid,
            bytes: bytes.length,
            commitment,
            firstKey: '1',
            lastKey: '18446744073709551615',
          },
        ],
      },
    ],
    files: [],
  };
}
it('canonicalizes a full bound manifest and verifies original chunk bytes', () => {
  const manifest = createArchiveManifest(body());
  const encoded = encodeArchiveManifest(manifest),
    hash = Checksum256.hash(encoded).toString();
  expect(decodeArchiveManifest(encoded, hash)).toEqual(manifest);
  expect(verifyArchiveChunks(manifest, [{ cid, bytes }])).toEqual(
    vector.rows.map((row) => ({ family: 0, ...row })),
  );
  expect(manifest.descriptorCommitment).toBe(archiveDescriptorHash(manifest));
  expect(manifest).toEqual(manifestVector.manifest);
  expect(manifest.descriptorCommitment).toBe(manifestVector.descriptorCommitment);
  expect(hash).toBe(manifestVector.manifestCommitment);
});
it.each(['chain', 'runtime', 'source', 'ordinal', 'count', 'snapshot'])(
  'rejects a %s mismatch before approval',
  (kind) => {
    const value = body(),
      family = value.families[0],
      chunk = family?.chunks[0];
    if (!family || !chunk) throw new Error('Missing fixture');
    if (kind === 'chain') value.dao.chainId = 'cd'.repeat(32);
    if (kind === 'runtime') value.dao.contract = 'other';
    if (kind === 'source') value.source.codeHash = 'ab'.repeat(32);
    if (kind === 'ordinal') chunk.domain = { ...vector.domain, chunk_ordinal: 1 };
    if (kind === 'count') family.records = '2';
    if (kind === 'snapshot') value.snapshot.blockNumber = 101;
    expect(() => createArchiveManifest(value)).toThrow();
  },
);
it('rejects missing or corrupt content, altered descriptors, duplicate coverage and noncanonical JSON', () => {
  const manifest = createArchiveManifest(body());
  expect(() => verifyArchiveChunks(manifest, [])).toThrow('ARCHIVE_CONTENTS_INCOMPLETE');
  const corrupt = bytes.slice();
  corrupt[corrupt.length - 1] = (corrupt.at(-1) ?? 0) ^ 1;
  expect(() => verifyArchiveChunks(manifest, [{ cid, bytes: corrupt }])).toThrow(
    'ARCHIVE_CONTENT_COMMITMENT',
  );
  const value = body();
  value.families.push(
    value.families[0] ??
      (() => {
        throw new Error('Missing fixture');
      })(),
  );
  expect(() => createArchiveManifest(value)).toThrow();
  expect(() =>
    encodeArchiveManifest({ ...manifest, descriptorCommitment: '00'.repeat(32) }),
  ).toThrow('ARCHIVE_DESCRIPTOR_COMMITMENT');
  const spaced = new TextEncoder().encode(JSON.stringify(manifest, null, 2));
  expect(() => decodeArchiveManifest(spaced, Checksum256.hash(spaced).toString())).toThrow(
    'ARCHIVE_MANIFEST_CANONICAL',
  );
});
it('preserves ciphertext file references and rejects invalid versions, envelopes and duplicated references', () => {
  const file = {
    document_id: '2',
    version: 1,
    cid,
    bytes: '8',
    commitment,
    envelope_version: 1,
    key_epoch: '3',
  };
  expect(createArchiveManifest({ ...body(), files: [file] }).files).toEqual([file]);
  for (const changed of [
    { version: 0 },
    { key_epoch: '0' },
    { envelope_version: 0 },
    { bytes: '0' },
    { document_id: '0' },
    { filename: 'private-name' },
  ])
    expect(() => createArchiveManifest({ ...body(), files: [{ ...file, ...changed }] })).toThrow();
  expect(() => createArchiveManifest({ ...body(), files: [file, file] })).toThrow();
});
it('allows an empty family with no chunk while retaining its descriptor binding', () => {
  const value = body(),
    family = value.families[0];
  if (!family) throw new Error('Missing fixture');
  const manifest = createArchiveManifest({
    ...value,
    families: [{ ...family, records: '0', chunks: [] }],
  });
  expect(verifyArchiveChunks(manifest, [])).toEqual([]);
  const changed = createArchiveManifest({
    ...value,
    source: { ...value.source, codeHash: 'cd'.repeat(32) },
    families: [{ ...family, records: '0', chunks: [] }],
  });
  expect(changed.descriptorCommitment).not.toBe(manifest.descriptorCommitment);
});
