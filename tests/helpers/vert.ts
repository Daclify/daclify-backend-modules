import { readFileSync } from 'node:fs';
import { Blockchain, type Account } from '@proton/vert';
import { API, PermissionLevel } from '@greymass/eosio';
import { z } from 'zod';
const AbiSchema = z.object({
  version: z.string(),
  types: z.array(z.object({ new_type_name: z.string(), type: z.string() })),
  structs: z.array(
    z.object({
      name: z.string(),
      base: z.string(),
      fields: z.array(z.object({ name: z.string(), type: z.string() })),
    }),
  ),
  actions: z.array(
    z.object({ name: z.string(), type: z.string(), ricardian_contract: z.string() }),
  ),
  tables: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      index_type: z.string(),
      key_names: z.array(z.string()),
      key_types: z.array(z.string()),
    }),
  ),
});
export function load(chain: Blockchain, name: string, path: string): Account {
  const account = chain.createAccount({
    name,
    abi: AbiSchema.parse(JSON.parse(readFileSync(`${path}.abi`, 'utf8'))),
    wasm: readFileSync(`${path}.wasm`),
    enableInline: true,
  });
  account.setPermissions([
    ...account.permissions,
    API.v1.AccountPermission.from({
      perm_name: 'execctx',
      parent: 'active',
      required_auth: {
        threshold: 1,
        keys: [],
        waits: [],
        accounts: [{ permission: { actor: name, permission: 'eosio.code' }, weight: 1 }],
      },
    }),
  ]);
  return account;
}
export async function send(
  account: Account,
  action: string,
  data: unknown[],
  auth?: string | string[],
) {
  const method = account.actions[action];
  if (!method) throw new Error(`Missing ABI action ${action}`);
  await method(data).send(
    Array.isArray(auth) ? auth.map((value) => PermissionLevel.from(value)) : auth,
  );
}
export function row(account: Account, table: string, scope: bigint, id: bigint): unknown {
  const accessor = account.tables[table];
  if (!accessor) throw new Error(`Missing ABI table ${table}`);
  return accessor(scope).getTableRow(id);
}

export async function listFirstParty(core: Account, module: string, codeHash: string) {
  await send(
    core,
    'setfees',
    [500, 10000, 'alice', 'eosio.token', '4,TLOS', ''],
    'daclifycore@active',
  );
  await send(
    core,
    'listmod',
    [module, 'alice', 0, 1, '0.0000 TLOS', codeHash, 'First-party fixture'],
    'daclifycore@active',
  );
}
