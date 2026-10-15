import { ABI, Bytes, Checksum256, Serializer } from '@wharfkit/antelope';
import { quickvoteAbi } from '../../sdk/generated/quickvote.js';
import {
  quickBallotDefinitionHash,
  quickKeyContext,
  quickResponseContext,
} from '../../sdk/quick-ballots.js';
import {
  createBallotKey,
  encryptBallotChoice,
  addBallotCiphertexts,
} from '../../sdk/quick-ballot-proof.js';
const abi = ABI.from(quickvoteAbi);
function concatenate(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((n, part) => n + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
export function snapshotFixture() {
  const domain = { chainId: '11'.repeat(32), runtime: 'daclifycore1', source: 'quickvote' };
  const definition = {
    protocol: 1,
    question: 'A question?',
    explanation: '',
    all_accounts: true,
    audience: [],
    closes: 0,
    readers: [{ member_id: '1', encryption_key: 'reader-key' }],
  };
  const definitionHash = quickBallotDefinitionHash({
    ...domain,
    ballotId: '9',
    daoId: '7',
    creatorId: '1',
    definition,
  });
  const context = { ...domain, ballotId: '9', definitionHash };
  const key = createBallotKey(
    quickKeyContext({
      chainId: domain.chainId,
      runtime: domain.runtime,
      ballotId: '9',
      definitionHash,
    }),
  );
  const responses = [1, 2, 3].map((n) => {
    const identity = n.toString(16).padStart(64, '0'),
      revision = '1';
    const encrypted =
      n === 3
        ? { ciphertext: '', proof: '' }
        : encryptBallotChoice(
            quickResponseContext({
              chainId: domain.chainId,
              runtime: domain.runtime,
              ballotId: '9',
              definitionHash,
              identity,
              revision,
            }),
            key.publicKey,
            n === 1 ? 1 : 0,
          );
    return {
      id: String(n),
      dao_id: '7',
      ballot_id: '9',
      identity,
      revision,
      active: n !== 3,
      ...encrypted,
      receipt: '',
      updated_at: 150,
    };
  });
  const aggregate = responses
    .filter((row) => row.active)
    .reduce((value, row) => addBallotCiphertexts(value, row.ciphertext), '00'.repeat(192));
  const seed = concatenate([
    Serializer.encode({ type: 'string', object: 'daclify.quick-ballot.responses.v1' }).array,
    Bytes.from(domain.chainId).array,
    ...[
      ['name', domain.runtime],
      ['name', domain.source],
      ['uint64', '9'],
    ].map(([type, object]) => Serializer.encode({ type: type ?? '', object }).array),
    Bytes.from(definitionHash).array,
    Serializer.encode({ type: 'uint64', object: '2' }).array,
    Serializer.encode({ type: 'bytes', object: aggregate }).array,
    Serializer.encode({ type: 'uint64', object: '3' }).array,
  ]);
  let response_root = Checksum256.hash(seed).toString();
  for (const row of responses)
    response_root = Checksum256.hash(
      concatenate([
        Bytes.from(response_root).array,
        Serializer.encode({ abi, type: 'quick_response', object: row }).array,
      ]),
    ).toString();
  const ballot = {
    id: '9',
    dao_id: '7',
    creator_id: '1',
    opened_at: 100,
    definition,
    definition_hash: definitionHash,
    key: key.publicKey,
    key_proof: key.proof,
    aggregate,
    count: 2,
    identities: 3,
    closed_at: 200,
    scan_cursor: '3',
    scan_rows: 3,
    scan_count: 2,
    scan_aggregate: '',
    response_root,
    prepared: true,
    up: 0,
    final_proof: '00'.repeat(64),
    verified: false,
    pruned: false,
  };
  return { domain, context, key, ballot, responses };
}
