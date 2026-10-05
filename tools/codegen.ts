import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Checksum256 } from '@wharfkit/antelope';
import { generateContract } from '@daclify/core-protocol/compiler';
mkdirSync('sdk/generated', { recursive: true });
for (const name of ['decide', 'works', 'payroll']) {
  const result = generateContract(
    readFileSync(`.artifacts/contracts/${name}.abi`, 'utf8'),
    name,
    '@daclify/core-protocol',
  );
  writeFileSync(`sdk/generated/${name}.ts`, result.types);
  writeFileSync(`sdk/generated/${name}-schemas.ts`, result.schemas);
}

writeFileSync(
  'sdk/generated/releases.ts',
  `// Generated build hashes; deployed code must match before enabling the release.\nexport const ModuleCodeHashes=${JSON.stringify(Object.fromEntries(['decide', 'works', 'payroll'].map((name) => [name, Checksum256.hash(readFileSync(`.artifacts/contracts/${name}.wasm`)).toString()])), null, 2)};\n`,
);
