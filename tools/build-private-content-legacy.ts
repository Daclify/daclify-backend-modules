import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { resolve, relative } from 'node:path';
import { ABI, Serializer } from '@wharfkit/antelope';
const root = resolve('.'),
  destination = resolve('.artifacts/private-content-legacy');
const pinned = {
  modules: '491e9dbed0fd0895bc54c75bbfe4198aec132a9c',
  core: '38514071e531bc8cbc1d77f641ea1018917529aa',
  compiler: 'CDT 4.1.1 -O=s',
  wasm: '1dbbd528e111c750e1b33eeef21db2252243de134fede3dea02ebb4341f1b95c',
  rawAbi: '2268cd779edfda686b5b5533ea1a9f8b771952b43c2628cdda28ac5e30e44511',
};
const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
function verify(directory: string) {
  if (
    hash(readFileSync(directory + '/decide.wasm')) !== pinned.wasm ||
    hash(
      Serializer.encode({ object: ABI.from(readFileSync(directory + '/decide.abi', 'utf8')) })
        .array,
    ) !== pinned.rawAbi
  )
    throw Error('PRIVATE_CONTENT_LEGACY_FIXTURE_MISMATCH');
}
function provenance() {
  const path = destination + '/provenance.json',
    text = JSON.stringify(pinned, null, 2) + '\n';
  if (existsSync(path)) {
    if (readFileSync(path, 'utf8') !== text) throw Error('PRIVATE_CONTENT_LEGACY_PROVENANCE');
  } else writeFileSync(path, text, { flag: 'wx' });
}
if (existsSync(destination + '/decide.wasm') && existsSync(destination + '/decide.abi')) {
  verify(destination);
  provenance();
} else {
  const compiler = process.env.DACLIFY_CDT_BINARY,
    environment = compiler
      ? { ...process.env, LD_LIBRARY_PATH: process.env.DACLIFY_NATIVE_LIBS ?? '' }
      : process.env;
  if (
    compiler &&
    execFileSync(compiler, ['--version'], { env: environment, encoding: 'utf8' }).trim() !==
      'cdt-cpp version 4.1.1'
  )
    throw Error('PINNED_CDT_REQUIRED');
  mkdirSync('.artifacts', { recursive: true });
  const scratch = mkdtempSync('.artifacts/private-content-legacy-build-');
  try {
    for (const [repository, commit, path, folder] of [
      [root, pinned.modules, 'contracts', 'modules'],
      [resolve('../daclify-backend-core'), pinned.core, 'contracts/common', 'core'],
    ]) {
      if (!repository || !commit || !path || !folder) throw Error('PRIVATE_CONTENT_LEGACY_SOURCE');
      const target = resolve(scratch, folder),
        archive = target + '/source.tar';
      mkdirSync(target, { recursive: true });
      writeFileSync(
        archive,
        execFileSync('git', ['-C', repository, 'archive', commit, path], {
          maxBuffer: 8 * 1024 * 1024,
        }),
      );
      execFileSync('tar', ['-xf', archive, '-C', target]);
    }
    const source = resolve(scratch, 'modules');
    mkdirSync(source + '/node_modules/@daclify/core-protocol/contracts', { recursive: true });
    cpSync(
      resolve(scratch, 'core/contracts/common'),
      source + '/node_modules/@daclify/core-protocol/contracts/common',
      { recursive: true },
    );
    mkdirSync(source + '/.artifacts/contracts', { recursive: true });
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
              root + ':/work',
              '--workdir',
              '/work/' + relative(root, source),
              'daclify-v2-toolchain:4.1.1-spring1.2.2',
              'cdt-cpp',
            ]),
        'contracts/decide/decide.cpp',
        '-O=s',
        '-I',
        'node_modules/@daclify/core-protocol/contracts/common',
        '-I',
        'contracts/common',
        '-I',
        'contracts/vendor',
        '-o',
        '.artifacts/contracts/decide.wasm',
        '--abigen',
        '-contract',
        'decide',
      ],
      {
        cwd: source,
        env: environment,
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 4 * 1024 * 1024,
      },
    );
    const output = source + '/.artifacts/contracts';
    verify(output);
    mkdirSync(destination, { recursive: true });
    for (const suffix of ['wasm', 'abi']) {
      const path = destination + '/decide.' + suffix,
        bytes = readFileSync(output + '/decide.' + suffix);
      if (existsSync(path)) {
        if (!readFileSync(path).equals(bytes))
          throw Error('PRIVATE_CONTENT_LEGACY_FIXTURE_MISMATCH');
      } else writeFileSync(path, bytes, { flag: 'wx' });
    }
    provenance();
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}
console.log(
  'Verified pinned pre-privacy Decide fixture; original compiler flags and hashes preserved.',
);
