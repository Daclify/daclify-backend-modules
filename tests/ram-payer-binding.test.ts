import { expect, it } from 'vitest';
import { Blockchain } from '@proton/vert';
import { Name } from '@wharfkit/antelope';
import { load, send, row } from './helpers/vert.js';
import { wasmCodeHash } from './helpers/code-hash.js';
it('binds each funded module payer once, authenticates its own owner and rejects another runtime', async () => {
  const chain = new Blockchain();
  chain.createAccounts('alice', 'eosio.token');
  const runtime = load(chain, 'daoone', '.artifacts/core-release/runtime');
  await send(runtime, 'init', ['ab'.repeat(32)], 'daoone@active');
  await send(runtime, 'initramobs', [], 'daoone@active');
  for (const name of ['decide', 'works', 'payroll', 'grants', 'endorse']) {
    const module = load(chain, name, '.artifacts/contracts/' + name),
      hash = wasmCodeHash('.artifacts/contracts/' + name + '.wasm');
    await send(runtime, 'setramcode', [name, hash], 'daoone@active');
    await expect(send(module, 'bindrampool', ['daoone'], 'alice@active')).rejects.toThrow();
    await send(module, 'bindrampool', ['daoone'], name + '@active');
    await send(module, 'bindrampool', ['daoone'], name + '@active');
    expect(
      row(
        module,
        'rampayer',
        BigInt(Name.from(name).value.toString()),
        BigInt(Name.from('rampayer').value.toString()),
      ),
    ).toMatchObject({ runtime: 'daoone' });
    await expect(send(module, 'bindrampool', ['alice'], name + '@active')).rejects.toThrow(
      'RAM_PAYER_RUNTIME',
    );
  }
});
