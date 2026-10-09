// Reproduce the actual resource checkpoint; never synthesize old serialized rows.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve('.artifacts/document-upgrade-old');
mkdirSync(root, { recursive: true });
for (const [directory, repository, revision] of [
  ['core', '../daclify-backend-core', '6145da8'],
  ['modules', '.', '4a43786'],
] as const) {
  const target = resolve(root, directory),
    tar = resolve(root, directory + '.tar');
  mkdirSync(target, { recursive: true });
  execFileSync('git', ['archive', '--output=' + tar, revision ?? '', 'contracts'], {
    cwd: repository,
    stdio: 'pipe',
  });
  execFileSync('tar', ['-xf', tar, '-C', target], { stdio: 'pipe' });
}
for (const [directory, contract] of [
  ['core', 'runtime'],
  ['modules', 'works'],
  ['modules', 'payroll'],
  ['modules', 'grants'],
  ['modules', 'decide'],
] as const)
  execFileSync(
    'docker',
    [
      'run',
      '--rm',
      '--platform',
      'linux/amd64',
      '-v',
      root + ':/work',
      'daclify-v2-toolchain:4.1.1-spring1.2.2',
      'cdt-cpp',
      `${directory}/contracts/${contract}/${contract}.cpp`,
      '-I',
      'core/contracts/common',
      '-I',
      `${directory}/contracts/common`,
      '-I',
      `${directory}/contracts/vendor`,
      '-o',
      // Keep the separately qualified election fixture's original Decide binary.
      (contract === 'decide' ? 'award-decide' : contract) + '.wasm',
      '--abigen',
      '-contract',
      contract ?? '',
    ],
    { stdio: 'pipe' },
  );
console.log('Rebuilt the retained document-reference upgrade fixture.');
