import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ABI, Name, Serializer } from '@wharfkit/antelope';
import { RuntimeCodeHash, RuntimeRawAbiHash } from '@daclify/core-protocol/sdk';
import { DecideTableSchemas } from '../../sdk/generated/decide-schemas.js';
import { ballotCommitment } from '../../sdk/ballot-commitment.js';
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
  const wasm = readFileSync(`${path}.wasm`),
    abiSource = readFileSync(`${path}.abi`, 'utf8');
  if (
    path.endsWith('/core-release/runtime') &&
    (createHash('sha256').update(wasm).digest('hex') !== RuntimeCodeHash ||
      createHash('sha256')
        .update(Serializer.encode({ object: ABI.from(abiSource) }).array)
        .digest('hex') !== RuntimeRawAbiHash)
  )
    throw new Error('CORE_FIXTURE_RELEASE_MISMATCH');
  const account = chain.createAccount({
    name,
    abi: AbiSchema.parse(JSON.parse(abiSource)),
    wasm,
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
  // VERT 0.3.24 omits the parent transaction on inline contexts. Inherit its
  // actual encoded transaction for receipt intrinsics; native checks compare real IDs.
  const recreate = account.recreateVm.bind(account);
  account.recreateVm = async () => {
    await recreate();
    const vm = account.vm;
    if (!vm) throw new Error('VERT_VM_REQUIRED');
    const apply = vm.apply.bind(vm);
    vm.apply = (context) => {
      if (!context.transaction) {
        const transaction = chain.actionTraces.find((trace) => trace.transaction)?.transaction;
        if (!transaction) throw new Error('VERT_TRANSACTION_REQUIRED');
        context.transaction = transaction;
      }
      return apply(context);
    };
  };
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
export function ballotExpectation(account: Account, runtime: string, ballotId: string | number): string {
  const scope = BigInt(Name.from(runtime).value.toString());
  const definition = row(account, 'ballotdefs', scope, BigInt(ballotId));
  if (definition === undefined) return '00'.repeat(32);
  const d = DecideTableSchemas.ballotdefs.parse(definition), b = DecideTableSchemas.ballots.parse(row(account, 'ballots', scope, BigInt(ballotId)));
  const input = { chainId:'ab'.repeat(32), runtime, decide:account.name.toString(), ballot:b, definition:d, target:d.version===2?DecideTableSchemas.votetargets.parse(row(account,'votetargets',scope,BigInt(ballotId))):undefined };
  if (d.purpose === 2) return ballotCommitment({...input,election:DecideTableSchemas.elections.parse(row(account,'elections',scope,BigInt(ballotId)))});
  if (d.purpose === 3) return ballotCommitment({...input,execution:DecideTableSchemas.executions.parse(row(account,'executions',scope,BigInt(ballotId)))});
  if (d.purpose === 4) return ballotCommitment({...input,grantPlan:DecideTableSchemas.grantplans.parse(row(account,'grantplans',scope,BigInt(ballotId)))});
  if(d.purpose===6)return ballotCommitment({...input,dispute:DecideTableSchemas.arbplans.parse(row(account,'arbplans',scope,BigInt(ballotId)))});
  if (d.purpose === 5) {
    const table = account.tables.docchanges;
    if (!table) throw new Error('Fixture document changes');
    const changes = z.array(DecideTableSchemas.docchanges).parse(table(scope).getTableRows());
    const change = changes.find(value => value.ballot_id === b.id && value.dao_id === b.dao_id);
    if (!change) throw new Error('Fixture ballot document change');
    return ballotCommitment({...input,documentChange:change});
  }
  return ballotCommitment(input);
}
export async function sendBoundVote(account: Account, data: unknown[], auth?: string | string[]) {
  const [runtime, dao, member, ballotId, choice] = z.tuple([z.string(), z.union([z.number(),z.string()]), z.union([z.number(),z.string()]), z.union([z.number(),z.string()]), z.number()]).parse(data);
  await send(account, 'votecommit', [runtime, dao, member, ballotId, ballotExpectation(account,runtime,ballotId), choice], auth);
}
export function replaceContract(account: Account, path: string): void {
  account.setContract(
    AbiSchema.parse(JSON.parse(readFileSync(path + '.abi', 'utf8'))),
    readFileSync(path + '.wasm'),
  );
}

export async function listFirstParty(core: Account, module: string, codeHash: string) {
  await send(
    core,
    'setfees',
    [500, 10000, 'alice', 'eosio.token', '4,TLOS', ''],
    `${core.name}@active`,
  );
  await send(
    core,
    'listmod',
    [module, 'alice', 0, 1, '0.0000 TLOS', codeHash, 'First-party fixture'],
    `${core.name}@active`,
  );
}
