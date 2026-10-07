import { afterEach, expect, it, vi } from 'vitest';
import { ConnectedPaymentClient } from '../sdk/connected-payments.js';
afterEach(() => vi.unstubAllGlobals());
const dao = {
  chainId: 'ab'.repeat(32),
  contract: 'daoone',
  daoId: '1',
  interfaceVersion: 1 as const,
};
const token = 'dcp_' + 'a'.repeat(43);
it('keeps the broker credential server-side and validates the complete DAO response', async () => {
  expect(() => new ConnectedPaymentClient('http://example.com', token, dao)).toThrow();
  const fetch = vi.fn(async () =>
    Response.json({
      id: '00000000-0000-4000-8000-000000000001',
      dao: { ...dao, contract: 'daotwo' },
      productId: '00000000-0000-4000-8000-000000000002',
      title: 'Workshop',
      moduleId: 'works',
      amountMinor: 1000,
      currency: 'usd',
      applicationFeeMinor: 50,
      policy: { basisPoints: 500, revision: '0' },
      state: 'paid',
      checkoutUrl: null,
      refundedMinor: 0,
      dispute: 'none',
    }),
  );
  vi.stubGlobal('fetch', fetch);
  const client = new ConnectedPaymentClient('https://api.example.com', token, dao);
  await expect(client.order('00000000-0000-4000-8000-000000000001')).rejects.toThrow(
    'PAYMENT_OPERATOR_RESPONSE',
  );
  const call = fetch.mock.calls.at(0);
  expect(call).toBeDefined();
});
