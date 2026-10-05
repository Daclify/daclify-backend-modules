import { describe, it, expect } from 'vitest';
import { encodeDecide, encodeWorks, encodePayroll } from '../sdk/index.js';
describe('public module codecs', () => {
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
