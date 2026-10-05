import { describe, it, expect } from 'vitest';
import { HelpBundleSchema } from '@daclify/core-protocol';
import { Catalog, VERSION } from '../protocol/index.js';
import { ModulesHelpBundle } from '../protocol/generated/help.js';
describe('released module documentation', () => {
  it('documents every module at its producer version with an exact configuration schema', () => {
    const bundle = HelpBundleSchema.parse(ModulesHelpBundle);
    expect(bundle.producer).toBe('modules');
    expect(bundle.packageVersion).toBe(VERSION);
    expect(bundle.modules.map((module) => module.manifest)).toEqual(Catalog);
    for (const module of bundle.modules) {
      expect(bundle.topics.some((topic) => topic.id === module.manifest.helpTopic)).toBe(true);
      expect(module.configuration).toHaveProperty('properties.configVersion.const', 1);
    }
  });
  it('includes compiled actions, durable payment tables and the module read API', () => {
    const bundle = HelpBundleSchema.parse(ModulesHelpBundle);
    expect(
      bundle.contracts
        .find((contract) => contract.name === 'works')
        ?.actions.some((action) => action.name === 'submitwork'),
    ).toBe(true);
    expect(
      bundle.contracts
        .find((contract) => contract.name === 'payroll')
        ?.tables.some((table) => table.name === 'entries'),
    ).toBe(true);
    expect(bundle.api.some((endpoint) => endpoint.path === '/v1/daos/:id/modules')).toBe(true);
  });
});
