import { ABI, Checksum256, Serializer } from '@wharfkit/antelope';
import { z } from 'zod';
import { ChainIdSchema, NativeAccountSchema } from '@daclify/core-protocol';
import { BallotMetadataV4Schema } from '../protocol/ballots.js';
import { decideAbi } from './generated/decide.js';
import { DecideTableSchemas } from './generated/decide-schemas.js';

const inputSchema = z.strictObject({
  chainId: ChainIdSchema,
  runtime: NativeAccountSchema,
  decide: NativeAccountSchema,
  ballot: DecideTableSchemas.ballots,
  definition: DecideTableSchemas.ballotdefs,
  election: DecideTableSchemas.elections.optional(),
  execution: DecideTableSchemas.executions.optional(),
  grantPlan: DecideTableSchemas.grantplans.optional(),
  documentChange: DecideTableSchemas.docchanges.optional(),
  dispute: DecideTableSchemas.arbplans.optional(),
  target: DecideTableSchemas.votetargets.optional(),
});
export type BallotCommitmentInput = z.input<typeof inputSchema>;

// This order matches definition_commitment in the published C++ header.
const fields = [
  ['version', 'uint16'],
  ['chain_id', 'checksum256'],
  ['runtime', 'name'],
  ['decide', 'name'],
  ['dao_id', 'uint64'],
  ['ballot_id', 'uint64'],
  ['purpose', 'uint8'],
  ['creator', 'uint64'],
  ['kind', 'uint8'],
  ['choices', 'uint8'],
  ['closes', 'uint32'],
  ['quorum', 'uint16'],
  ['approval', 'uint16'],
  ['denominator', 'uint64'],
  ['max_member', 'uint64'],
  ['metadata', 'string'],
  ['policy_revision', 'uint64'],
  ['policy_hash', 'checksum256'],
  ['subtype_hash', 'checksum256'],
].map(([name, type]) => {
  if (!name || !type) throw new Error('BALLOT_DEFINITION_ENCODING');
  return { name, type };
});
const definitionAbi = ABI.from({
  version: 'eosio::abi/1.2',
  structs: [{ name: 'ballot_definition', base: '', fields }],
});
const zero = '00'.repeat(32);

export function ballotCommitment(value: BallotCommitmentInput): string {
  const input = inputSchema.parse(value),
    b = input.ballot,
    d = input.definition;
  if (![1, 2, 3, 4].includes(d.version) || d.dao_id !== b.dao_id || d.ballot_id !== b.id)
    throw new Error('BALLOT_DEFINITION_DOMAIN');
  if (d.version >= 3) {
    const metadata = BallotMetadataV4Schema.parse(JSON.parse(b.metadata));
    if (
      metadata.privateContent.documentId !== b.id ||
      metadata.options.length !== b.choices ||
      metadata.semantics !== (d.purpose === 1 ? 'poll' : 'proposal') ||
      (d.version === 3 ? ![0, 1].includes(d.purpose) : ![3, 4].includes(d.purpose))
    )
      throw Error('BALLOT_DEFINITION_DOMAIN');
  }
  let subtypeHash = zero;
  const hashRecord = (table: string, record: object) => {
    const type = decideAbi.tables.find((entry) => entry.name === table)?.type;
    if (!type) throw new Error('BALLOT_DEFINITION_ENCODING');
    return Checksum256.hash(
      Serializer.encode({ abi: ABI.from(decideAbi), type, object: record }).array,
    ).toString();
  };
  if (d.purpose === 2) {
    const r = DecideTableSchemas.elections.parse(input.election);
    if (r.id !== b.id || r.dao_id !== b.dao_id) throw new Error('BALLOT_DEFINITION_DOMAIN');
    subtypeHash = hashRecord('elections', { ...r, status: 0 });
  } else if (d.purpose === 3) {
    const r = DecideTableSchemas.executions.parse(input.execution);
    if (r.ballot_id !== b.id || r.dao_id !== b.dao_id) throw new Error('BALLOT_DEFINITION_DOMAIN');
    subtypeHash = hashRecord('executions', { ...r, executed: false });
  } else if (d.purpose === 4) {
    const r = DecideTableSchemas.grantplans.parse(input.grantPlan);
    if (r.ballot_id !== b.id || r.dao_id !== b.dao_id) throw new Error('BALLOT_DEFINITION_DOMAIN');
    subtypeHash = hashRecord('grantplans', { ...r, executed: false });
  } else if (d.purpose === 5) {
    const r = DecideTableSchemas.docchanges.parse(input.documentChange);
    if (r.ballot_id !== b.id || r.dao_id !== b.dao_id) throw new Error('BALLOT_DEFINITION_DOMAIN');
    subtypeHash = hashRecord('docchanges', { ...r, adopted_at: 0, adopted_by: '0', status: 0 });
  } else if (d.purpose === 6) {
    const r = DecideTableSchemas.arbplans.parse(input.dispute);
    if (
      r.ballot_id !== b.id ||
      r.dao_id !== b.dao_id ||
      r.protection.ballot_id !== b.id ||
      r.protection.rules.decide !== input.decide
    )
      throw new Error('BALLOT_DEFINITION_DOMAIN');
    subtypeHash = hashRecord('arbplans', { ...r, executed: false });
  } else if (d.purpose !== 0 && d.purpose !== 1) throw new Error('BALLOT_SEMANTICS');
  if (d.version === 2 || d.version === 4) {
    const target = DecideTableSchemas.votetargets.parse(input.target);
    if (
      target.version !== 1 ||
      target.dao_id !== b.dao_id ||
      target.ballot_id !== b.id ||
      Boolean(target.work) !== (d.purpose === 3) ||
      Boolean(target.grant) !== (d.purpose === 4) ||
      ![3, 4].includes(d.purpose)
    )
      throw new Error('BALLOT_DEFINITION_DOMAIN');
    if (target.work) {
      const work = target.work,
        plan = input.execution;
      if (
        work.project.dao_id !== b.dao_id ||
        work.project.id !== plan?.project_id ||
        work.milestones.length > 16 ||
        work.milestones.length !== work.project.milestones.length ||
        work.milestones.some(
          (row, index) =>
            row.dao_id !== b.dao_id ||
            row.project_id !== work.project.id ||
            row.id !== work.project.milestones[index],
        ) ||
        (work.agreement &&
          (work.agreement.dao_id !== b.dao_id || work.agreement.project_id !== work.project.id)) ||
        (work.protection &&
          (work.protection.dao_id !== b.dao_id || work.protection.id !== work.project.id))
      )
        throw new Error('BALLOT_DEFINITION_DOMAIN');
    }
    if (target.grant) {
      const grant = target.grant,
        plan = input.grantPlan;
      if (
        grant.round.dao_id !== b.dao_id ||
        grant.application.dao_id !== b.dao_id ||
        grant.round.id !== plan?.round_id ||
        grant.application.id !== plan.application_id ||
        grant.application.round_id !== grant.round.id ||
        grant.application.revision !== plan.application_revision ||
        grant.round.works !== plan.works ||
        (grant.protection &&
          (grant.protection.dao_id !== b.dao_id || grant.protection.id !== grant.application.id))
      )
        throw new Error('BALLOT_DEFINITION_DOMAIN');
    }
    const targetHash = hashRecord('votetargets', { ...target, released: false });
    subtypeHash = Checksum256.hash(
      Uint8Array.from([
        ...Checksum256.from(subtypeHash).array,
        ...Checksum256.from(targetHash).array,
      ]),
    ).toString();
  }
  return Checksum256.hash(
    Serializer.encode({
      abi: definitionAbi,
      type: 'ballot_definition',
      object: {
        version: d.version,
        chain_id: input.chainId,
        runtime: input.runtime,
        decide: input.decide,
        dao_id: b.dao_id,
        ballot_id: b.id,
        purpose: d.purpose,
        creator: b.creator,
        kind: b.kind,
        choices: b.choices,
        closes: b.closes,
        quorum: b.quorum,
        approval: b.approval,
        denominator: b.denominator,
        max_member: b.max_member,
        metadata: b.metadata,
        policy_revision: d.policy_revision,
        policy_hash: d.policy_hash,
        subtype_hash: subtypeHash,
      },
    }).array,
  ).toString();
}
