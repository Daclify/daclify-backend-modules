import { ABI, Serializer } from '@wharfkit/antelope';
import { endorseAbi, type EndorseActions } from './generated/endorse.js';
import { EndorseActionSchemas } from './generated/endorse-schemas.js';
export { endorseAbi, endorseAbiHash } from './generated/endorse.js';
export { EndorseActionSchemas, EndorseTableSchemas } from './generated/endorse-schemas.js';
export type { EndorseActions };
export function encodeEndorse<K extends keyof EndorseActions>(
  name: K,
  data: EndorseActions[K],
): Uint8Array {
  return Serializer.encode({
    abi: ABI.from(endorseAbi),
    type: name,
    object: EndorseActionSchemas[name].parse(data),
  }).array;
}
import { grantsAbi, type GrantsActions } from './generated/grants.js';
import { GrantsActionSchemas } from './generated/grants-schemas.js';
export { grantsAbi, grantsAbiHash } from './generated/grants.js';
export { GrantsActionSchemas, GrantsTableSchemas } from './generated/grants-schemas.js';
export type { GrantsActions };
export function encodeGrants<K extends keyof GrantsActions>(
  name: K,
  data: GrantsActions[K],
): Uint8Array {
  return Serializer.encode({
    abi: ABI.from(grantsAbi),
    type: name,
    object: GrantsActionSchemas[name].parse(data),
  }).array;
}
import { decideAbi, type DecideActions } from './generated/decide.js';
import { worksAbi, type WorksActions } from './generated/works.js';
import { payrollAbi, type PayrollActions } from './generated/payroll.js';
import { DecideActionSchemas } from './generated/decide-schemas.js';
import { WorksActionSchemas } from './generated/works-schemas.js';
import { PayrollActionSchemas } from './generated/payroll-schemas.js';
export { decideAbi, decideAbiHash } from './generated/decide.js';
export { worksAbi, worksAbiHash } from './generated/works.js';
export { payrollAbi, payrollAbiHash } from './generated/payroll.js';
export type { DecideActions, WorksActions, PayrollActions };
export { DecideActionSchemas, DecideTableSchemas } from './generated/decide-schemas.js';
export { WorksActionSchemas, WorksTableSchemas } from './generated/works-schemas.js';
export { PayrollActionSchemas, PayrollTableSchemas } from './generated/payroll-schemas.js';
export function encodeDecide<K extends keyof DecideActions>(
  name: K,
  data: DecideActions[K],
): Uint8Array {
  return Serializer.encode({
    abi: ABI.from(decideAbi),
    type: name,
    object: DecideActionSchemas[name].parse(data),
  }).array;
}
export function encodeWorks<K extends keyof WorksActions>(
  name: K,
  data: WorksActions[K],
): Uint8Array {
  return Serializer.encode({
    abi: ABI.from(worksAbi),
    type: name,
    object: WorksActionSchemas[name].parse(data),
  }).array;
}
export function encodePayroll<K extends keyof PayrollActions>(
  name: K,
  data: PayrollActions[K],
): Uint8Array {
  return Serializer.encode({
    abi: ABI.from(payrollAbi),
    type: name,
    object: PayrollActionSchemas[name].parse(data),
  }).array;
}

export { ModuleCodeHashes } from './generated/releases.js';
