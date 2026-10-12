import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const compiler = process.env.DACLIFY_CDT_BINARY;
if (!compiler) throw new Error('PINNED_CDT_REQUIRED');
const environment = { ...process.env, LD_LIBRARY_PATH: process.env.DACLIFY_NATIVE_LIBS ?? '' };
if (
  execFileSync(compiler, ['--version'], { env: environment, encoding: 'utf8' }).trim() !==
  'cdt-cpp version 4.1.1'
)
  throw new Error('PINNED_CDT_REQUIRED');
mkdirSync('.artifacts/governing-document-upgrade', { recursive: true });
const source = readFileSync('contracts/decide/decide.cpp', 'utf8');
if (!source.includes('DOCUMENT_SOURCE_CHANGED')) throw new Error('UPGRADE_FIXTURE_SOURCE_REQUIRED');
// Change one diagnostic to produce a genuinely different compiled binary with identical persisted layouts.
writeFileSync(
  '.artifacts/governing-document-upgrade/decide.cpp',
  source.replace('DOCUMENT_SOURCE_CHANGED', 'DOCUMENT_SOURCE_UPDATED'),
);
execFileSync(
  compiler,
  [
    '.artifacts/governing-document-upgrade/decide.cpp',
    '-O=s',
    '-I',
    'node_modules/@daclify/core-protocol/contracts/common',
    '-I',
    'contracts/common',
    '-I',
    'contracts/vendor',
    '-o',
    '.artifacts/governing-document-upgrade/decide.wasm',
    '--abigen',
    '-contract',
    'decide',
  ],
  { env: environment, stdio: 'inherit' },
);
