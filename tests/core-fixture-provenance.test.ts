import { expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Blockchain } from '@proton/vert';
import { load } from './helpers/vert.js';

it('rejects a normal core-release fixture whose binary differs from the pinned producer release', () => {
  const root = mkdtempSync(join(tmpdir(), 'daclify-fixture-'));
  try {
    const directory = join(root, 'core-release');
    mkdirSync(directory);
    const artifact = join(directory, 'runtime');
    copyFileSync('.artifacts/core-release/runtime.abi', artifact + '.abi');
    const wasm = readFileSync('.artifacts/core-release/runtime.wasm');
    wasm[wasm.length - 1] = (wasm[wasm.length - 1] ?? 0) ^ 1;
    writeFileSync(artifact + '.wasm', wasm);
    expect(() => load(new Blockchain(), 'core', artifact)).toThrow('CORE_FIXTURE_RELEASE_MISMATCH');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
