import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const compiler = process.env.DACLIFY_CDT_BINARY;
const environment = compiler
  ? { ...process.env, LD_LIBRARY_PATH: process.env.DACLIFY_NATIVE_LIBS ?? '' }
  : process.env;
if (
  compiler &&
  execFileSync(compiler, ['--version'], { env: environment, encoding: 'utf8' }).trim() !==
    'cdt-cpp version 4.1.1'
)
  throw new Error('PINNED_CDT_REQUIRED');
// Reproduce the unpublished observer baseline before adding terminal markers.
const destination = '.artifacts/archive-upgrade-old';
for (const [directory, commit, path, folder] of [
  ['.', '2d44085', 'contracts', 'modules'],
  ['../daclify-backend-core', 'c6e713e', 'contracts/common', 'core'],
] as const) {
  const target = destination + '/' + folder;
  mkdirSync(target, { recursive: true });
  const archive = target + '/source.tar';
  writeFileSync(
    archive,
    execFileSync('git', ['-C', directory, 'archive', commit, path], { maxBuffer: 8 * 1024 * 1024 }),
  );
  execFileSync('tar', ['-xf', archive, '-C', target]);
}
execFileSync(
  compiler ?? 'docker',
  [
    ...(compiler
      ? []
      : [
          'run',
          '--rm',
          '--platform',
          'linux/amd64',
          '-v',
          resolve('.') + ':/work',
          'daclify-v2-toolchain:4.1.1-spring1.2.2',
          'cdt-cpp',
        ]),
    destination + '/modules/contracts/decide/decide.cpp',
    '-I',
    destination + '/core/contracts/common',
    '-I',
    destination + '/modules/contracts/common',
    '-I',
    destination + '/modules/contracts/vendor',
    '-o',
    destination + '/decide.wasm',
    '--abigen',
    '-contract',
    'decide',
  ],
  { stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024, env: environment },
);
