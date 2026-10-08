import { ABI, ABIDecoder, Bytes, Checksum256, Name, Serializer } from '@wharfkit/antelope';
import { IdSchema } from '@daclify/core-protocol';
import {
  runtimeAbi,
  runtimeAbiHash,
  RuntimeCodeHash,
  RuntimeTableSchemas,
} from '@daclify/core-protocol/sdk';
import { decideAbi, decideAbiHash } from '../sdk/generated/decide.js';
import { DecideTableSchemas } from '../sdk/generated/decide-schemas.js';
import { ModuleCodeHashes } from '../sdk/generated/releases.js';
import {
  ArchiveDomainSchema,
  ArchiveRowSchema,
  type ArchiveDomain,
  type ArchiveRow,
} from '../protocol/archive.js';
const sources = {
  'ordinary-poll-votes': {
    abi: ABI.from(decideAbi),
    canonicalAbiHash: decideAbiHash,
    codeHash: ModuleCodeHashes.decide,
    table: 'votes',
  },
  'document-versions': {
    abi: ABI.from(runtimeAbi),
    canonicalAbiHash: runtimeAbiHash,
    codeHash: RuntimeCodeHash,
    table: 'documents',
  },
};
export function archiveSourceSchema(kind: keyof typeof sources) {
  const source = sources[kind],
    rowType = source.abi.tables.find((table) => table.name.toString() === source.table)?.type;
  if (!rowType) throw new Error('ARCHIVE_RELEASE_SCHEMA_MISSING');
  return {
    codeHash: source.codeHash,
    rawAbiHash: Checksum256.hash(Serializer.encode({ object: source.abi }).array).toString(),
    schemaHash: Checksum256.hash(
      new TextEncoder().encode(
        JSON.stringify({
          formatVersion: 1,
          canonicalAbiHash: source.canonicalAbiHash,
          table: source.table,
          rowType,
        }),
      ),
    ).toString(),
    rowType,
  };
}
// Only this development packet's compiled schemas are accepted; retain qualified historic releases before pruning ships.
export function decodeReleasedArchiveRow(
  value: ArchiveDomain,
  original: ArchiveRow,
  parentId: string,
) {
  const domain = ArchiveDomainSchema.parse(value),
    row = ArchiveRowSchema.parse(original),
    parent = IdSchema.parse(parentId);
  const kind =
    domain.table === 'votes'
      ? 'ordinary-poll-votes'
      : domain.table === 'documents'
        ? 'document-versions'
        : undefined;
  if (!kind) throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  const source = sources[kind],
    schema = archiveSourceSchema(kind);
  if (
    domain.code_hash !== schema.codeHash ||
    domain.abi_hash !== schema.rawAbiHash ||
    domain.schema_hash !== schema.schemaHash ||
    (kind === 'document-versions'
      ? domain.source !== domain.runtime || domain.scope !== domain.dao_id
      : domain.source === domain.runtime ||
        domain.scope !== Name.from(domain.runtime).value.toString())
  )
    throw new RangeError('ARCHIVE_SCHEMA_UNSUPPORTED');
  const reader = new ABIDecoder(Bytes.from(row.packed).array);
  const decoded: unknown = JSON.parse(
    JSON.stringify(Serializer.decode({ abi: source.abi, type: schema.rowType, data: reader })),
  );
  if (reader.canRead()) throw new RangeError('ARCHIVE_ROW_TRAILING');
  if (kind === 'ordinary-poll-votes') {
    const vote = DecideTableSchemas.votes.parse(decoded);
    if (vote.id !== row.primaryKey || vote.ballot !== parent)
      throw new RangeError('ARCHIVE_ROW_DOMAIN');
    if (
      Serializer.encode({ abi: source.abi, type: schema.rowType, object: vote }).hexString !==
      row.packed
    )
      throw new RangeError('ARCHIVE_ROW_CANONICAL');
    return { kind, value: vote, original: row };
  }
  const document = RuntimeTableSchemas.documents.parse(decoded);
  if (document.id !== row.primaryKey || document.document_id !== parent)
    throw new RangeError('ARCHIVE_ROW_DOMAIN');
  if (
    Serializer.encode({ abi: source.abi, type: schema.rowType, object: document }).hexString !==
    row.packed
  )
    throw new RangeError('ARCHIVE_ROW_CANONICAL');
  return { kind, value: document, original: row };
}
