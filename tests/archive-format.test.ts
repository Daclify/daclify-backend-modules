import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import { Bytes } from '@wharfkit/antelope';
import * as fc from 'fast-check';
import { ArchiveDomainSchema, MAX_ARCHIVE_CHUNK_BYTES } from '../protocol/archive.js';
import {
  buildArchiveTree,
  packArchiveDomain,
  archiveDomainHash,
  verifyArchiveProof,
  encodeArchiveChunk,
  decodeArchiveChunk,
} from '../archive/format.js';
const fixture = z
  .object({
    domain: ArchiveDomainSchema,
    domainHex: z.string(),
    domainHash: z.string(),
    rows: z.array(z.object({ primaryKey: z.string(), packed: z.string() })),
    leaves: z.array(z.string()),
    root: z.string(),
    proofs: z.array(z.array(z.string())),
  })
  .parse(JSON.parse(readFileSync('tests/fixtures/archive-v1.json', 'utf8')));
it('matches an independent packed-domain, odd-tree and varuint-boundary vector', () => {
  expect(Bytes.from(packArchiveDomain(fixture.domain)).hexString).toBe(fixture.domainHex);
  expect(archiveDomainHash(fixture.domain)).toBe(fixture.domainHash);
  const tree = buildArchiveTree(fixture.domain, fixture.rows);
  expect(tree.leaves).toEqual(fixture.leaves);
  expect(tree.root).toBe(fixture.root);
  for (const [i, row] of fixture.rows.entries()) {
    const proof = tree.proof(i);
    expect(proof).toEqual(fixture.proofs[i]);
    expect(verifyArchiveProof(fixture.domain, i, row, proof, tree.root)).toBe(true);
    const alteredRow = () =>
      verifyArchiveProof(
        fixture.domain,
        i,
        { ...row, packed: row.packed + '00' },
        proof,
        tree.root,
      );
    const alteredDomain = () =>
      verifyArchiveProof({ ...fixture.domain, dao_id: '8' }, i, row, proof, tree.root);
    if (i === 2) {
      expect(alteredRow).toThrow('ARCHIVE_PROOF_DUPLICATE');
      expect(alteredDomain).toThrow('ARCHIVE_PROOF_DUPLICATE');
    } else {
      expect(alteredRow()).toBe(false);
      expect(alteredDomain()).toBe(false);
    }
  }
});
it('round trips original packed rows and rejects trailing bytes, wrong domains and unknown wire formats', () => {
  const bytes = encodeArchiveChunk(fixture.domain, fixture.rows);
  expect(bytes.length).toBe(buildArchiveTree(fixture.domain, fixture.rows).encodedBytes);
  expect(decodeArchiveChunk(bytes, fixture.domain, fixture.root)).toEqual(fixture.rows);
  expect(() =>
    decodeArchiveChunk(Uint8Array.from([...bytes, 0]), fixture.domain, fixture.root),
  ).toThrow('ARCHIVE_CHUNK_TRAILING');
  expect(() => decodeArchiveChunk(bytes, { ...fixture.domain, dao_id: '8' }, fixture.root)).toThrow(
    'ARCHIVE_CHUNK_DOMAIN',
  );
  expect(() => decodeArchiveChunk(bytes, fixture.domain, '00'.repeat(32))).toThrow(
    'ARCHIVE_CHUNK_ROOT',
  );
  const changed = bytes.slice();
  changed[0] = 2;
  expect(() => decodeArchiveChunk(changed, fixture.domain, fixture.root)).toThrow();
});
it('rejects empty chunks, duplicates, unsorted rows, bad domains and invalid proofs', () => {
  expect(() => buildArchiveTree(fixture.domain, [])).toThrow();
  expect(() => buildArchiveTree(fixture.domain, [...fixture.rows].reverse())).toThrow(
    'ARCHIVE_ROW_ORDER',
  );
  const row = fixture.rows[0];
  if (!row) throw new Error('FIXTURE_ROW_REQUIRED');
  expect(() => buildArchiveTree(fixture.domain, [row, row, row])).toThrow('ARCHIVE_ROW_ORDER');
  expect(() => buildArchiveTree({ ...fixture.domain, leaf_count: 0 }, [])).toThrow();
  expect(() => buildArchiveTree({ ...fixture.domain, leaf_count: 65537 }, fixture.rows)).toThrow();
  expect(() =>
    buildArchiveTree({ ...fixture.domain, leaf_count: 1 }, [{ ...row, packed: 'xyz' }]),
  ).toThrow();
  expect(() => verifyArchiveProof(fixture.domain, 3, row, [], fixture.root)).toThrow(
    'ARCHIVE_PROOF_INDEX',
  );
  expect(() => verifyArchiveProof(fixture.domain, 0, row, [], fixture.root)).toThrow(
    'ARCHIVE_PROOF_DEPTH',
  );
  const oddRow = fixture.rows[2],
    oddProof = fixture.proofs[2];
  if (!oddRow || !oddProof) throw new Error('FIXTURE_ODD_REQUIRED');
  expect(() =>
    verifyArchiveProof(
      fixture.domain,
      2,
      oddRow,
      ['00'.repeat(32), ...oddProof.slice(1)],
      fixture.root,
    ),
  ).toThrow('ARCHIVE_PROOF_DUPLICATE');
});
it('handles one-leaf and even trees with index-derived proof direction', () => {
  for (const rows of fixture.rows.slice(0, 2).map((_, i) => fixture.rows.slice(0, i + 1))) {
    const domain = { ...fixture.domain, leaf_count: rows.length };
    const tree = buildArchiveTree(domain, rows);
    for (const [i, row] of rows.entries())
      expect(verifyArchiveProof(domain, i, row, tree.proof(i), tree.root)).toBe(true);
  }
});
it('enforces the final encoded chunk size on multi-MiB input without recursive regexes', () => {
  expect(() =>
    buildArchiveTree({ ...fixture.domain, leaf_count: 1 }, [
      { primaryKey: '1', packed: '00'.repeat(MAX_ARCHIVE_CHUNK_BYTES) },
    ]),
  ).toThrow('ARCHIVE_CHUNK_SIZE');
  const row = { primaryKey: '1', packed: '00'.repeat(MAX_ARCHIVE_CHUNK_BYTES - 191) };
  expect(buildArchiveTree({ ...fixture.domain, leaf_count: 1 }, [row]).encodedBytes).toBe(
    MAX_ARCHIVE_CHUNK_BYTES,
  );
});
it('rejects oversized counts and noncanonical varuint encodings before allocating rows', () => {
  const prefix = packArchiveDomain(fixture.domain),
    rows = encodeArchiveChunk(fixture.domain, fixture.rows);
  expect(() =>
    decodeArchiveChunk(
      Uint8Array.from([...prefix, 255, 255, 255, 255, 15]),
      fixture.domain,
      fixture.root,
    ),
  ).toThrow('ARCHIVE_LEAF_COUNT');
  expect(() =>
    decodeArchiveChunk(Uint8Array.from([...prefix, 131, 0]), fixture.domain, fixture.root),
  ).toThrow('ARCHIVE_CHUNK_ENCODING');
  expect(() =>
    decodeArchiveChunk(
      Uint8Array.from([...prefix, 255, 255, 255, 255, 255]),
      fixture.domain,
      fixture.root,
    ),
  ).toThrow('ARCHIVE_CHUNK_ENCODING');
  expect(() =>
    decodeArchiveChunk(
      Uint8Array.from([...rows.subarray(0, 187), 131, 0, ...rows.subarray(188)]),
      fixture.domain,
      fixture.root,
    ),
  ).toThrow('ARCHIVE_CHUNK_ENCODING');
});
it('round trips bounded arbitrary packed records and verifies every proof', () => {
  fc.assert(
    fc.property(
      fc.array(fc.uint8Array({ maxLength: 128 }), { minLength: 1, maxLength: 32 }),
      (values) => {
        const rows = values.map((bytes, i) => ({
            primaryKey: String(i + 1),
            packed: Bytes.from(bytes).hexString,
          })),
          domain = { ...fixture.domain, leaf_count: rows.length };
        const tree = buildArchiveTree(domain, rows);
        expect(decodeArchiveChunk(encodeArchiveChunk(domain, rows), domain, tree.root)).toEqual(
          rows,
        );
        for (const [i, row] of rows.entries())
          expect(verifyArchiveProof(domain, i, row, tree.proof(i), tree.root)).toBe(true);
      },
    ),
    { seed: 20261008, numRuns: 50 },
  );
});
it('supports the maximum 65536-leaf tree with exactly sixteen proof levels', () => {
  const rows = Array.from({ length: 65536 }, (_, i) => ({
      primaryKey: String(i + 1),
      packed: '00',
    })),
    domain = { ...fixture.domain, leaf_count: rows.length };
  const tree = buildArchiveTree(domain, rows);
  const last = rows[65535];
  if (!last) throw new Error('LAST_ROW_REQUIRED');
  expect(tree.proof(65535)).toHaveLength(16);
  expect(verifyArchiveProof(domain, 65535, last, tree.proof(65535), tree.root)).toBe(true);
}, 20000);
