import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
  'docker',
  [
    'run',
    '--rm',
    '--platform',
    'linux/amd64',
    '-v',
    resolve('.') + ':/work',
    'daclify-v2-toolchain:4.1.1-spring1.2.2',
    'cdt-cpp',
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
  { stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024 },
);
