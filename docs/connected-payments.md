# Independent-server payment integration

Use `ConnectedPaymentClient` from `@daclify/modules/sdk` only in a Node backend. It consumes canonical core schemas, validates HTTPS/full DAO identity and provider responses, and uses a revocable DAO-scoped bearer credential. Never bundle the credential or platform Stripe keys in browser code, Hub metadata or Git.

```ts
import { ConnectedPaymentClient } from '@daclify/modules/sdk';
const client = new ConnectedPaymentClient(apiOrigin, privateBrokerToken, daoReference);
const catalogue = await client.catalogue();
const merchant = await client.status();
const order = await client.checkout(productId, stableRequestId, localBuyerReference);
const receipt = await client.order(order.id);
```

`daoReference` must use the canonical producer schema. The backend supplies a stable request ID and authenticates/records local buyer ownership before calls. Retry the same approved request after uncertain responses; do not create a new charge. A broker is scoped to one chain/runtime/DAO/interface, can create/read receipts, and cannot onboard merchants, edit products or refund. Its issuing administrator must retain active on-chain authority. Central merchant controls require a separate central session and fresh signing proof.

The core API includes `DACLIFY_CONNECT_OPERATOR` for this backend adapter. See [payment operations](../../daclify-backend-core/docs/operations/connected-payments.md) for setup, OAuth, webhook delivery, consent, fees and recovery. Existing native module contracts do not consume fiat receipts automatically; fulfill module-specific entitlements only after confirmed reconciliation. Unit/HTTP fixtures do not establish actual Stripe or operator-domain qualification.
