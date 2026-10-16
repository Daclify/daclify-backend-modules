// Reproduce historical decoder pins from reviewed source snapshots; this never accepts arbitrary code.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { format, resolveConfig } from 'prettier';
import { ABI, Serializer } from '@wharfkit/antelope';
import { ChainIdSchema } from '@daclify/core-protocol';
import { z } from 'zod';
import { previousContactArchiveReleases } from '../archive/releases/trusted-contact-previous.js';
const coreCommits = [
  '38514071e531bc8cbc1d77f641ea1018917529aa',
  'a20f770',
  '1e58f70',
  '8f539a1',
  '6aaae633eeb1f2d0e89e32391c9f860c10d8d4dd',
] as const;
const moduleCommits = [
  '491e9dbed0fd0895bc54c75bbfe4198aec132a9c',
  '4f94127',
  'fed5453',
  'b52fc03',
  '050f18b',
] as const;
const hash = (bytes: string | Uint8Array) => createHash('sha256').update(bytes).digest('hex');
type Kind = keyof typeof previousContactArchiveReleases;
type Identity = { codeHash: string; rawAbiHash: string; schemaHash: string; rowType: string };
const result: Record<Kind, Identity[]> = {
  'document-versions': [],
  'ordinary-poll-votes': [],
  'quick-ballot-responses': [],
  'quick-ballot-grants': [],
};
function literal(repo: string, commit: string, path: string, name: string) {
  const source = execFileSync('git', ['-C', repo, 'show', commit + ':' + path], {
    encoding: 'utf8',
    maxBuffer: 4_000_000,
  });
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== name) continue;
      let value = declaration.initializer;
      while (
        value &&
        (ts.isAsExpression(value) ||
          ts.isSatisfiesExpression(value) ||
          ts.isParenthesizedExpression(value))
      )
        value = value.expression;
      if (!value) throw Error('MISSING_HISTORICAL_LITERAL');
      return ts.isStringLiteral(value) ? value.text : value.getText(file);
    }
  }
  throw Error('MISSING_HISTORICAL_EXPORT');
}
function checkpoint(
  repo: string,
  commit: string,
  contract: 'runtime' | 'decide' | 'quickvote',
  kinds: Kind[],
) {
  const path = 'sdk/generated/' + contract + '.ts';
  const abi = ABI.from(literal(repo, commit, path, contract + 'Abi'));
  // The producer's AbiHash is its original ABI file-text hash, distinct from the binary ABI hash.
  const canonical = ChainIdSchema.parse(literal(repo, commit, path, contract + 'AbiHash'));
  const raw = hash(Serializer.encode({ object: abi }).array);
  const code =
    contract === 'runtime'
      ? ChainIdSchema.parse(literal(repo, commit, 'sdk/generated/releases.ts', 'RuntimeCodeHash'))
      : z
          .record(z.string(), ChainIdSchema)
          .parse(
            JSON.parse(literal(repo, commit, 'sdk/generated/releases.ts', 'ModuleCodeHashes')),
          )[contract === 'quickvote' ? 'quick-ballots' : contract];
  if (!code) throw Error('HISTORICAL_CODE_PIN_MISSING');
  if (commit === coreCommits[0] || (commit === moduleCommits[0] && contract === 'decide')) {
    const built = readFileSync(
      '../daclify-backend-core/.artifacts/privacy-upgrade/' + contract + '.abi',
    );
    if (
      hash(built) !== canonical ||
      hash(Serializer.encode({ object: ABI.from(built.toString()) }).array) !== raw
    )
      throw Error('HISTORICAL_COMPILED_ABI_MISMATCH');
  }
  for (const kind of kinds) {
    const prior = previousContactArchiveReleases[kind],
      row = abi.structs.find((row) => row.name === prior.identity.rowType),
      original = prior.abi.structs.find((row) => row.name === prior.identity.rowType);
    if (
      !row ||
      JSON.stringify({
        name: row.name,
        base: row.base,
        fields: row.fields.map((field) => ({ name: field.name, type: field.type })),
      }) !== JSON.stringify(original)
    )
      throw Error('HISTORICAL_ROW_LAYOUT_CHANGED');
    const table =
      kind === 'document-versions'
        ? 'documents'
        : kind === 'ordinary-poll-votes'
          ? 'votes'
          : kind === 'quick-ballot-responses'
            ? 'qresponses'
            : 'qgrants';
    const schemaHash = hash(
      kind === 'quick-ballot-responses'
        ? 'daclify.quick-ballot.responses.row.v1'
        : kind === 'quick-ballot-grants'
          ? 'daclify.quick-ballot.grants.row.v1'
          : JSON.stringify({
              formatVersion: 1,
              canonicalAbiHash: canonical,
              table,
              rowType: prior.identity.rowType,
            }),
    );
    const identity = {
      codeHash: code,
      rawAbiHash: raw,
      schemaHash,
      rowType: prior.identity.rowType,
    };
    if (!result[kind].some((entry) => entry.codeHash === code && entry.rawAbiHash === raw))
      result[kind].push(identity);
  }
}
for (const commit of coreCommits)
  checkpoint('../daclify-backend-core', commit, 'runtime', ['document-versions']);
for (const commit of moduleCommits) {
  checkpoint('.', commit, 'decide', ['ordinary-poll-votes']);
  checkpoint('.', commit, 'quickvote', ['quick-ballot-responses', 'quick-ballot-grants']);
}
const output = await format(
  '// Frozen identities from the live pre-privacy cohort and qualified privacy checkpoints.\n// Generated by tools/freeze-privacy-archives.ts; exact source ABI hashes and row layouts were checked.\nexport const contentPrivacyArchiveReleases = ' +
  JSON.stringify(result, null, 2) +
  ' as const;\n',
  { ...(await resolveConfig('archive/releases/content-privacy-previous.ts')), parser: 'typescript' },
);
if (process.argv.includes('--check')) {
  if (readFileSync('archive/releases/content-privacy-previous.ts', 'utf8') !== output)
    throw Error('HISTORICAL_PRIVACY_PINS_STALE');
} else writeFileSync('archive/releases/content-privacy-previous.ts', output);
console.log('Historical privacy archive identities and unchanged row layouts verified.');
