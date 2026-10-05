import { describe, it, expect } from 'vitest';
import { ModuleApiRoutes } from '../protocol/api.js';
describe('module finalization API protocol', () => {
  it('binds a ballot to its complete runtime reference', () => {
    const input = {
      dao: { chainId: '12'.repeat(32), contract: 'daclifycore', daoId: '1', interfaceVersion: 1 },
      ballotId: '9',
    };
    expect(ModuleApiRoutes.finalize.input.parse(input)).toEqual(input);
    for (const invalid of [
      { ...input, ballotId: '0' },
      { ...input, arbitraryAction: 'reserve' },
      { ...input, dao: { ...input.dao, interfaceVersion: 2 } },
    ])
      expect(ModuleApiRoutes.finalize.input.safeParse(invalid).success).toBe(false);
  });
  it('represents a retry after finalization without fabricating a transaction ID', () => {
    expect(ModuleApiRoutes.finalize.response.parse({ state: 'already-finalized' })).toEqual({
      state: 'already-finalized',
    });
    expect(ModuleApiRoutes.finalize.response.safeParse({ state: 'finalized' }).success).toBe(false);
  });
});
