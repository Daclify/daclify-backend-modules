import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { z } from 'zod';
import { generateDocumentation } from '@daclify/core-protocol/documentation';
import {
  Catalog,
  DecideConfigSchema,
  WorksConfigSchema,
  PayrollConfigSchema,
  VERSION,
} from '../../protocol/index.js';
import { ModuleApiRoutes } from '../../protocol/api.js';

const topics: unknown = JSON.parse(await readFile('docs/guides/topics.json', 'utf8'));
const contracts = await Promise.all(
  ['decide', 'works', 'payroll'].map(async (name) => ({
    name,
    abi: await readFile(`.artifacts/contracts/${name}.abi`, 'utf8'),
  })),
);
const configurations = {
  decide: DecideConfigSchema,
  works: WorksConfigSchema,
  payroll: PayrollConfigSchema,
};
const modules = Catalog.map((manifest) => {
  const schema =
    manifest.id === 'decide'
      ? configurations.decide
      : manifest.id === 'works'
        ? configurations.works
        : manifest.id === 'payroll'
          ? configurations.payroll
          : undefined;
  if (!schema) throw new Error('Missing documented module configuration');
  return { manifest, configuration: z.toJSONSchema(schema, { io: 'input' }) };
});
const api = Object.values(ModuleApiRoutes).map((endpoint) => ({
  method: endpoint.method,
  path: endpoint.path,
  ...('query' in endpoint ? { query: z.toJSONSchema(endpoint.query, { io: 'input' }) } : {}),
  ...('input' in endpoint ? { input: z.toJSONSchema(endpoint.input, { io: 'input' }) } : {}),
  response: z.toJSONSchema(endpoint.response, { io: 'output' }),
  helpTopic: endpoint.helpTopic,
}));
const output = generateDocumentation(
  { producer: 'modules', packageVersion: VERSION, interfaceVersion: 1, topics },
  contracts,
  api,
  modules,
);
const files = new Map([
  ['docs/generated/reference.json', JSON.stringify(output.bundle, null, 2) + '\n'],
  ['docs/generated/reference.md', output.markdown],
  [
    'protocol/generated/help.ts',
    `// Generated from producer-owned guides, compiled ABI and module schemas.\nimport type {HelpBundle} from '@daclify/core-protocol';\nexport const ModulesHelpBundle=${JSON.stringify(output.bundle, null, 2)} satisfies HelpBundle;\n`,
  ],
]);
const check = process.argv.includes('--check');
for (const [path, content] of files) {
  if (check) {
    if ((await readFile(path, 'utf8')) !== content)
      throw new Error(`Generated documentation changed: ${path}`);
  } else {
    await mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
    await writeFile(path, content);
  }
}
console.log(
  check
    ? 'Generated module documentation is unchanged.'
    : 'Generated module documentation and versioned guide bundle.',
);
