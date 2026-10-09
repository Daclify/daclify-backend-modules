import {
  BrokerRoutes,
  PublicApiOriginSchema,
  BrokerCredentialSchema,
  BrokerCheckoutInputSchema,
  PaymentOrderInputSchema,
  PaymentOrderSchema,
  PaymentStatusSchema,
  PaymentCatalogueSchema,
  DaoRefSchema,
  daoPaymentKey,
  type DaoRef,
} from '@daclify/core-protocol';
import type { z } from 'zod';
// Server integration only: never ship a broker credential in frontend code or public environment variables.
export class ConnectedPaymentClient {
  private readonly origin: string;
  private readonly token: string;
  private readonly dao: DaoRef;
  constructor(apiOrigin: string, token: string, dao: DaoRef) {
    if ('window' in globalThis) throw new Error('PAYMENT_OPERATOR_SERVER_ONLY');
    this.origin = new URL(PublicApiOriginSchema.parse(apiOrigin)).origin;
    this.token = BrokerCredentialSchema.parse({ token }).token;
    this.dao = DaoRefSchema.parse(dao);
  }
  private async request<T extends { dao: DaoRef }>(
    path: string,
    schema: z.ZodType<T>,
    input?: unknown,
  ): Promise<T> {
    const response = await fetch(this.origin + path, {
      method: input === undefined ? 'GET' : 'POST',
      redirect: 'error',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + this.token },
      ...(input === undefined ? {} : { body: JSON.stringify(input) }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      throw new Error('PAYMENT_OPERATOR_UNAVAILABLE');
    }
    if (!response.body) throw new Error('PAYMENT_OPERATOR_RESPONSE');
    const length = response.headers.get('content-length');
    if (length !== null && (!/^[0-9]+$/.test(length) || BigInt(length) > 65536n)) {
      await response.body.cancel().catch(() => undefined);
      throw new Error('PAYMENT_OPERATOR_RESPONSE');
    }
    const reader = response.body.getReader(),
      decoder = new TextDecoder();
    let size = 0,
      raw = '';
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > 65536) throw new Error('PAYMENT_OPERATOR_RESPONSE');
        raw += decoder.decode(chunk.value, { stream: true });
      }
      raw += decoder.decode();
    } catch (cause) {
      await reader.cancel().catch(() => undefined);
      throw cause;
    } finally {
      reader.releaseLock();
    }
    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch {
      throw new Error('PAYMENT_OPERATOR_RESPONSE');
    }
    const parsed = schema.safeParse(value);
    if (!parsed.success) throw new Error('PAYMENT_OPERATOR_RESPONSE');
    const result = parsed.data;
    if (daoPaymentKey(result.dao) !== daoPaymentKey(this.dao))
      throw new Error('PAYMENT_OPERATOR_RESPONSE');
    return result;
  }
  async checkout(productId: string, requestId: string, customerReference: string) {
    return this.request(
      BrokerRoutes.brokerCheckout.path,
      PaymentOrderSchema,
      BrokerCheckoutInputSchema.parse({ dao: this.dao, productId, requestId, customerReference }),
    );
  }
  async order(orderId: string) {
    const value = await this.request(
      BrokerRoutes.brokerOrder.path,
      PaymentOrderSchema,
      PaymentOrderInputSchema.parse({ dao: this.dao, orderId }),
    );
    if (value.id !== orderId) throw new Error('PAYMENT_OPERATOR_RESPONSE');
    return value;
  }
  async status() {
    return this.request(BrokerRoutes.brokerStatus.path, PaymentStatusSchema, { dao: this.dao });
  }
  async catalogue() {
    return this.request(
      '/v1/payments/catalogue?dao=' + encodeURIComponent(JSON.stringify(this.dao)),
      PaymentCatalogueSchema,
    );
  }
}
