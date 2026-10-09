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
it.each(['not-json', '{}'])(
  'maps malformed provider data (%s) to a redacted response failure',
  async (raw) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(raw)),
    );
    const client = new ConnectedPaymentClient('https://api.example.com', token, dao);
    await expect(client.catalogue()).rejects.toThrow('PAYMENT_OPERATOR_RESPONSE');
  },
);
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

it('rejects oversized streamed bytes before consuming the remaining payment response', async () => {
  const cancel = vi.fn();
  let pulled = 0;
  const body = new ReadableStream<Uint8Array>(
    {
      pull(controller) {
        pulled++;
        controller.enqueue(new TextEncoder().encode('é'.repeat(32769)));
        if (pulled === 2) controller.close();
      },
      cancel,
    },
    { highWaterMark: 0 },
  );
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(body)),
  );
  const client = new ConnectedPaymentClient('https://api.example.com', token, dao);
  await expect(client.catalogue()).rejects.toThrow('PAYMENT_OPERATOR_RESPONSE');
  expect(pulled).toBe(1);
  expect(cancel).toHaveBeenCalledTimes(1);
});

it.each(['65537', 'invalid'])(
  'cancels an invalid declared response length (%s)',
  async (length) => {
    const cancel = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(new ReadableStream<Uint8Array>({ cancel }), {
            headers: { 'content-length': length },
          }),
      ),
    );
    const client = new ConnectedPaymentClient('https://api.example.com', token, dao);
    await expect(client.catalogue()).rejects.toThrow('PAYMENT_OPERATOR_RESPONSE');
    expect(cancel).toHaveBeenCalledTimes(1);
  },
);

it('cancels unread error bodies and preserves the redacted operator error', async () => {
  const cancel = vi.fn();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(new ReadableStream<Uint8Array>({ cancel }), { status: 503 })),
  );
  const client = new ConnectedPaymentClient('https://api.example.com', token, dao);
  await expect(client.catalogue()).rejects.toThrow('PAYMENT_OPERATOR_UNAVAILABLE');
  expect(cancel).toHaveBeenCalledTimes(1);
});

it('preserves a Unicode product name when its UTF-8 sequence is split across chunks', async () => {
  const catalogue = {
    dao,
    enabled: true,
    policy: { basisPoints: 500, revision: '1' },
    products: [
      {
        dao,
        id: '00000000-0000-4000-8000-000000000002',
        moduleId: 'works',
        title: 'Café',
        amountMinor: 1000,
        currency: 'usd',
        active: true,
      },
    ],
  };
  const bytes = new TextEncoder().encode(JSON.stringify(catalogue)),
    split = bytes.indexOf(0xc3) + 1;
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(
          new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(bytes.slice(0, split));
              controller.enqueue(bytes.slice(split));
              controller.close();
            },
          }),
        ),
    ),
  );
  const client = new ConnectedPaymentClient('https://api.example.com', token, dao);
  expect(await client.catalogue()).toEqual(catalogue);
});
