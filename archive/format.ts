import { ABI, ABIDecoder, Bytes, Checksum256, Serializer, VarUInt } from '@wharfkit/antelope';
import { Uint64Schema, IdSchema } from '@daclify/core-protocol';
import { z } from 'zod';
import {
  ArchiveDomainSchema,
  ArchiveRowSchema,
  ArchiveProofSchema,
  MAX_ARCHIVE_CHUNK_BYTES,
  type ArchiveDomain,
  type ArchiveRow,
} from '../protocol/archive.js';
const domainAbi: ABI.Def = {
  version: 'eosio::abi/1.2',
  types: [],
  structs: [
    {
      name: 'archive_domain',
      base: '',
      fields: [
        { name: 'format_version', type: 'uint16' },
        { name: 'chain_id', type: 'checksum256' },
        { name: 'runtime', type: 'name' },
        { name: 'dao_id', type: 'uint64' },
        { name: 'source', type: 'name' },
        { name: 'code_hash', type: 'checksum256' },
        { name: 'abi_hash', type: 'checksum256' },
        { name: 'schema_hash', type: 'checksum256' },
        { name: 'table', type: 'name' },
        { name: 'scope', type: 'uint64' },
        { name: 'chunk_ordinal', type: 'uint32' },
        { name: 'leaf_count', type: 'uint32' },
      ],
    },
  ],
  actions: [],
  tables: [],
  ricardian_clauses: [],
  variants: [],
  action_results: [],
};
function concat(parts: readonly Uint8Array[]): Uint8Array {
  const bytes = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const p of parts) {
    bytes.set(p, offset);
    offset += p.length;
  }
  return bytes;
}
const hash = (bytes: Uint8Array) => Checksum256.hash(bytes).toString();
export function packArchiveDomain(input: ArchiveDomain): Uint8Array {
  return Serializer.encode({
    abi: ABI.from(domainAbi),
    type: 'archive_domain',
    object: ArchiveDomainSchema.parse(input),
  }).array;
}
export function archiveDomainHash(input: ArchiveDomain): string {
  return hash(packArchiveDomain(input));
}
function rowBytes(row: ArchiveRow) {
  return concat([
    Serializer.encode({ type: 'uint64', object: row.primaryKey }).array,
    Serializer.encode({ type: 'bytes', object: row.packed }).array,
  ]);
}
function leaf(domainHash: string, index: number, row: ArchiveRow) {
  return hash(
    concat([
      Uint8Array.of(0),
      Bytes.from(domainHash).array,
      Serializer.encode({ type: 'uint32', object: index }).array,
      rowBytes(row),
    ]),
  );
}
function parent(left: string, right: string) {
  return hash(concat([Uint8Array.of(1), Bytes.from(left).array, Bytes.from(right).array]));
}
function checkedIndex(index: number, count: number) {
  if (!Number.isInteger(index) || index < 0 || index >= count)
    throw new RangeError('ARCHIVE_PROOF_INDEX');
}
export function buildArchiveTree(input: ArchiveDomain, values: readonly ArchiveRow[]) {
  const domain = ArchiveDomainSchema.parse(input);
  if (values.length !== domain.leaf_count) throw new RangeError('ARCHIVE_LEAF_COUNT');
  const digest = archiveDomainHash(domain),
    leaves: string[] = [];
  let previous = -1n;
  let size =
    packArchiveDomain(domain).length +
    Serializer.encode({ type: VarUInt, object: values.length }).array.length;
  for (const [i, value] of values.entries()) {
    const row = ArchiveRowSchema.parse(value),
      key = BigInt(row.primaryKey);
    if (key <= previous) throw new RangeError('ARCHIVE_ROW_ORDER');
    previous = key;
    size += rowBytes(row).length;
    if (size > MAX_ARCHIVE_CHUNK_BYTES) throw new RangeError('ARCHIVE_CHUNK_SIZE');
    leaves.push(leaf(digest, i, row));
  }
  const levels = [leaves];
  let current = leaves;
  while (current.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < current.length; i += 2) {
      const left = current[i];
      if (!left) throw new Error('ARCHIVE_TREE_INCOMPLETE');
      next.push(parent(left, current[i + 1] ?? left));
    }
    levels.push(next);
    current = next;
  }
  const root = current[0];
  if (!root) throw new Error('ARCHIVE_EMPTY_CHUNK');
  return {
    root,
    leaves: [...leaves],
    encodedBytes: size,
    proof(index: number): string[] {
      checkedIndex(index, domain.leaf_count);
      const siblings: string[] = [];
      let cursor = index;
      for (const level of levels.slice(0, -1)) {
        const sibling = level[cursor ^ 1] ?? level[cursor];
        if (!sibling) throw new Error('ARCHIVE_TREE_INCOMPLETE');
        siblings.push(sibling);
        cursor = Math.floor(cursor / 2);
      }
      return siblings;
    },
  };
}
export function verifyArchiveProof(
  input: ArchiveDomain,
  index: number,
  value: ArchiveRow,
  siblings: readonly string[],
  root: string,
): boolean {
  const domain = ArchiveDomainSchema.parse(input),
    row = ArchiveRowSchema.parse(value),
    proof = ArchiveProofSchema.parse(siblings);
  z.string()
    .regex(/^[a-f0-9]{64}$/)
    .parse(root);
  checkedIndex(index, domain.leaf_count);
  let depth = 0;
  for (let width = domain.leaf_count; width > 1; width = Math.ceil(width / 2)) depth++;
  if (proof.length !== depth) throw new RangeError('ARCHIVE_PROOF_DEPTH');
  let width = domain.leaf_count,
    cursor = index,
    current = leaf(archiveDomainHash(domain), index, row);
  for (const sibling of proof) {
    if (width % 2 === 1 && cursor === width - 1 && sibling !== current)
      throw new RangeError('ARCHIVE_PROOF_DUPLICATE');
    current = cursor % 2 === 0 ? parent(current, sibling) : parent(sibling, current);
    cursor = Math.floor(cursor / 2);
    width = Math.ceil(width / 2);
  }
  return current === root;
}
export function encodeArchiveChunk(domain: ArchiveDomain, rows: readonly ArchiveRow[]): Uint8Array {
  const tree = buildArchiveTree(domain, rows);
  const bytes = concat([
    packArchiveDomain(domain),
    Serializer.encode({ type: VarUInt, object: rows.length }).array,
    ...rows.map(rowBytes),
  ]);
  if (bytes.length !== tree.encodedBytes) throw new Error('ARCHIVE_CHUNK_SIZE');
  return bytes;
}
// WharfKit's generic array decoder has no row-count bound; check counts before allocating.
function readCount(reader: ABIDecoder): number {
  let value = 0;
  for (let i = 0; i < 5; i++) {
    const byte = reader.readByte();
    if (i === 4 && byte > 15) throw new RangeError('ARCHIVE_CHUNK_ENCODING');
    value += (byte & 127) * 2 ** (7 * i);
    if (byte < 128) {
      if (i > 0 && byte === 0) throw new RangeError('ARCHIVE_CHUNK_ENCODING');
      return value;
    }
  }
  throw new RangeError('ARCHIVE_CHUNK_ENCODING');
}
const decodedUint64 = z
  .union([Uint64Schema, z.int().min(0).max(4294967295)])
  .transform((value) => String(value));
const decodedDomain = ArchiveDomainSchema.extend({
  dao_id: decodedUint64.pipe(IdSchema),
  scope: decodedUint64,
});
export function decodeArchiveChunk(
  bytes: Uint8Array,
  expected: ArchiveDomain,
  root: string,
): ArchiveRow[] {
  if (bytes.length === 0 || bytes.length > MAX_ARCHIVE_CHUNK_BYTES)
    throw new RangeError('ARCHIVE_CHUNK_SIZE');
  const domain = ArchiveDomainSchema.parse(expected),
    reader = new ABIDecoder(bytes);
  const value: unknown = JSON.parse(
    JSON.stringify(
      Serializer.decode({ abi: ABI.from(domainAbi), type: 'archive_domain', data: reader }),
    ),
  );
  const decoded = decodedDomain.parse(value);
  if (!Bytes.from(packArchiveDomain(decoded)).equals(packArchiveDomain(domain)))
    throw new RangeError('ARCHIVE_CHUNK_DOMAIN');
  const count = readCount(reader);
  if (count !== domain.leaf_count) throw new RangeError('ARCHIVE_LEAF_COUNT');
  const rows: ArchiveRow[] = [];
  for (let i = 0; i < count; i++) {
    const primaryKey = Serializer.decode({ type: 'uint64', data: reader }).toString(),
      length = readCount(reader);
    if (length > MAX_ARCHIVE_CHUNK_BYTES) throw new RangeError('ARCHIVE_CHUNK_SIZE');
    rows.push({ primaryKey, packed: Bytes.from(reader.readArray(length)).hexString });
  }
  if (reader.canRead()) throw new RangeError('ARCHIVE_CHUNK_TRAILING');
  if (buildArchiveTree(domain, rows).root !== root) throw new RangeError('ARCHIVE_CHUNK_ROOT');
  return rows;
}
