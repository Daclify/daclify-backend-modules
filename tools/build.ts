import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
mkdirSync('.artifacts/contracts', { recursive: true });
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
const contracts = ['decide', 'works', 'payroll', 'grants', 'endorse', 'activity', 'quickvote'];
const selected = process.argv.slice(2);
if (selected.some((name) => ![...contracts, 'quickfixture'].includes(name)))
  throw new Error('CONTRACT_UNKNOWN');
for (const name of selected.length ? selected : contracts)
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
            `${resolve('.')}:/work`,
            'daclify-v2-toolchain:4.1.1-spring1.2.2',
            'cdt-cpp',
          ]),
      `contracts/${name}/${name}.cpp`,
      '-O=s',
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
    { stdio: 'inherit', env: environment },
  );
