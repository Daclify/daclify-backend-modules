import { describe, it, expect } from 'vitest';
import { encodeDecide, encodeWorks, encodePayroll } from '../sdk/index.js';
import { compatible, VERSION as CoreVersion } from '@daclify/core-protocol';
import {
  Catalog,
  CONTRACT_VERSION,
  DecideConfigSchema,
  ModuleInstallationSchema,
} from '../protocol/index.js';
describe('public module codecs', () => {
  it('requires the coordinated contract release without claiming older or future compatibility', () => {
    for (const manifest of Catalog) {
      expect(compatible('0.9.0-alpha.6', manifest.coreRange)).toBe(false);
      expect(compatible('0.10.0-alpha.1', manifest.coreRange)).toBe(false);
      expect(compatible('0.11.0-alpha.1', manifest.coreRange)).toBe(false);
      expect(manifest.version).toBe('0.10.0-alpha.4');
    }
  });
  it('installs the governing-document contract release with its complete action list', () => {
    expect(Catalog.every((manifest) => manifest.version === CONTRACT_VERSION)).toBe(true);
    expect(
      ModuleInstallationSchema.parse({
        id: 'decide',
        account: 'decide',
        version: '0.10.0-alpha.4',
        config: DecideConfigSchema.parse({
          configVersion: 1,
          weight: 'member',
          duration: 60,
          quorumBasisPoints: 5000,
          approvalBasisPoints: 5001,
        }),
        actions: [
          'open',
          'vote',
          'votecommit',
          'openpoll',
          'openarb',
          'openwork',
          'openaward',
          'newelect',
          'nominate',
          'startelect',
          'recall',
          'regdoc',
          'proposedoc',
          'adoptdoc',
          'canceldoc',
          'ackdoc',
        ],
        grants: ['govlock', 'electexec'],
      }).version,
    ).toBe('0.10.0-alpha.4');
  });
  it('requires the core release with the new definition RAM migration coverage', () => {
    for (const manifest of Catalog) {
      expect(compatible(CoreVersion, manifest.coreRange)).toBe(true);
      for (const unsupported of ['0.12.0-alpha.1', '0.14.0-alpha.10', '0.15.0-alpha.22', '0.15.0-alpha.24', '0.16.0'])
        expect(compatible(unsupported, manifest.coreRange)).toBe(false);
    }
  });
  it('encodes exact binary member vote data', () => {
    expect(
      encodeDecide('vote', {
        runtime: 'daclifycore',
        dao_id: '18446744073709551615',
        member_id: '1',
        ballot_id: '3',
        choice: 1,
      }),
    ).toHaveLength(33);
  });
  it('encodes a bounded proposal with exact asset units', () => {
    expect(
      encodeWorks('propose', {
        runtime: 'daclifycore',
        dao_id: '1',
        member_id: '1',
        project_id: '1',
        contributor: '2',
        document_id: '1',
        document_version: 1,
        payments: ['1.0000 TLOS'],
        dues: [0],
      }).length,
    ).toBeGreaterThan(24);
  });
  it('encodes a fixed-term payroll commitment', () => {
    expect(
      encodePayroll('commit', {
        runtime: 'daclifycore',
        dao_id: '1',
        member_id: '1',
        schedule_id: '1',
        recipient: '2',
        quantity: '1.0000 TLOS',
        periods: 2,
        interval: 86400,
        starts: 60,
      }).length,
    ).toBeGreaterThan(24);
  });
});
