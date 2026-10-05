import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
mkdirSync('.artifacts/contracts', { recursive: true });
for (const name of ['decide', 'works', 'payroll'])
  execFileSync(
    'docker',
    [
      'run',
      '--rm',
      '--platform',
      'linux/amd64',
      '-v',
      `${resolve('.')}:/work`,
      'daclify-v2-toolchain:4.1.1-spring1.2.2',
      'cdt-cpp',
      `contracts/${name}/${name}.cpp`,
      '-I',
      'node_modules/@daclify/core-protocol/contracts/common',
      '-I',
      'contracts/common',
      '-I',
      'contracts/vendor',
      '-o',
      `.artifacts/contracts/${name}.wasm`,
      '--abigen',
      '-contract',
      name,
    ],
    { stdio: 'inherit' },
  );
