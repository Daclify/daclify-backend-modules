// Retained trusted source schema before payer binding. Never edit an existing identity.
export const pruningPollRelease = {
  identity: {
    codeHash: '9e941cea5b7c43a2b4e4c69f52f74fdd5a616999f36b8a3edecc9460ac2006ac',
    rawAbiHash: 'f6b6c5c28d95b86ff27212177f87f806dd170f745c577908cd258eb051cabab2',
    schemaHash: 'fb23817bda0cb12420e6433bb4b435851ae98f649d3de7da6037774e02c77ebb',
    rowType: 'vote_record',
  },
  abi: {
    version: 'eosio::abi/1.2',
    types: [],
    structs: [
      {
        name: 'archive_prune_proof',
        base: '',
        fields: [
          {
            name: 'primary_key',
            type: 'uint64',
          },
          {
            name: 'siblings',
            type: 'checksum256[]',
          },
        ],
      },
      {
        name: 'ballot_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'creator',
            type: 'uint64',
          },
          {
            name: 'kind',
            type: 'uint8',
          },
          {
            name: 'choices',
            type: 'uint8',
          },
          {
            name: 'closes',
            type: 'uint32',
          },
          {
            name: 'quorum',
            type: 'uint16',
          },
          {
            name: 'approval',
            type: 'uint16',
          },
          {
            name: 'denominator',
            type: 'uint64',
          },
          {
            name: 'max_member',
            type: 'uint64',
          },
          {
            name: 'cast',
            type: 'uint64',
          },
          {
            name: 'tallies',
            type: 'uint64[]',
          },
          {
            name: 'status',
            type: 'uint8',
          },
          {
            name: 'winner',
            type: 'int16',
          },
          {
            name: 'metadata',
            type: 'string',
          },
        ],
      },
      {
        name: 'election_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'creator',
            type: 'uint64',
          },
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'document_id',
            type: 'uint64',
          },
          {
            name: 'document_version',
            type: 'uint32',
          },
          {
            name: 'document_commitment',
            type: 'checksum256',
          },
          {
            name: 'policy_revision',
            type: 'uint64',
          },
          {
            name: 'nomination_close',
            type: 'uint32',
          },
          {
            name: 'term_start',
            type: 'uint32',
          },
          {
            name: 'term_end',
            type: 'uint32',
          },
          {
            name: 'seats',
            type: 'uint8',
          },
          {
            name: 'status',
            type: 'uint8',
          },
          {
            name: 'candidates',
            type: 'uint64[]',
          },
        ],
      },
      {
        name: 'execute',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'ballot_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'executeaward',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'ballot_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'finalize',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'ballot_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'grant_execution',
        base: '',
        fields: [
          {
            name: 'ballot_id',
            type: 'uint64',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'grants',
            type: 'name',
          },
          {
            name: 'works',
            type: 'name',
          },
          {
            name: 'round_id',
            type: 'uint64',
          },
          {
            name: 'application_id',
            type: 'uint64',
          },
          {
            name: 'application_revision',
            type: 'uint64',
          },
          {
            name: 'project_id',
            type: 'uint64',
          },
          {
            name: 'commitment',
            type: 'checksum256',
          },
          {
            name: 'grants_hash',
            type: 'checksum256',
          },
          {
            name: 'works_hash',
            type: 'checksum256',
          },
          {
            name: 'policy_revision',
            type: 'uint64',
          },
          {
            name: 'deadline',
            type: 'uint32',
          },
          {
            name: 'executed',
            type: 'bool',
          },
        ],
      },
      {
        name: 'markpoll',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'ballot_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'newelect',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'election_id',
            type: 'uint64',
          },
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'document_id',
            type: 'uint64',
          },
          {
            name: 'document_version',
            type: 'uint32',
          },
          {
            name: 'nomination_close',
            type: 'uint32',
          },
          {
            name: 'term_start',
            type: 'uint32',
          },
          {
            name: 'term_end',
            type: 'uint32',
          },
          {
            name: 'seats',
            type: 'uint8',
          },
        ],
      },
      {
        name: 'nominate',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'election_id',
            type: 'uint64',
          },
          {
            name: 'active',
            type: 'bool',
          },
        ],
      },
      {
        name: 'nomination_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'election_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'open',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'ballot_id',
            type: 'uint64',
          },
          {
            name: 'kind',
            type: 'uint8',
          },
          {
            name: 'choices',
            type: 'uint8',
          },
          {
            name: 'duration',
            type: 'uint32',
          },
          {
            name: 'quorum',
            type: 'uint16',
          },
          {
            name: 'approval',
            type: 'uint16',
          },
          {
            name: 'metadata',
            type: 'string',
          },
        ],
      },
      {
        name: 'openaward',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'ballot_id',
            type: 'uint64',
          },
          {
            name: 'grants',
            type: 'name',
          },
          {
            name: 'round_id',
            type: 'uint64',
          },
          {
            name: 'application_id',
            type: 'uint64',
          },
          {
            name: 'project_id',
            type: 'uint64',
          },
          {
            name: 'duration',
            type: 'uint32',
          },
          {
            name: 'quorum',
            type: 'uint16',
          },
          {
            name: 'approval',
            type: 'uint16',
          },
          {
            name: 'metadata',
            type: 'string',
          },
        ],
      },
      {
        name: 'openwork',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'ballot_id',
            type: 'uint64',
          },
          {
            name: 'works',
            type: 'name',
          },
          {
            name: 'project_id',
            type: 'uint64',
          },
          {
            name: 'duration',
            type: 'uint32',
          },
          {
            name: 'quorum',
            type: 'uint16',
          },
          {
            name: 'approval',
            type: 'uint16',
          },
          {
            name: 'metadata',
            type: 'string',
          },
        ],
      },
      {
        name: 'poll_end',
        base: '',
        fields: [
          {
            name: 'ballot_id',
            type: 'uint64',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'completed_at',
            type: 'uint32',
          },
          {
            name: 'legacy',
            type: 'bool',
          },
        ],
      },
      {
        name: 'prunevotes',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'archive_id',
            type: 'uint64',
          },
          {
            name: 'chunk_ordinal',
            type: 'uint32',
          },
          {
            name: 'start',
            type: 'uint32',
          },
          {
            name: 'proofs',
            type: 'archive_prune_proof[]',
          },
        ],
      },
      {
        name: 'recall',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'term_id',
            type: 'uint64',
          },
          {
            name: 'document_id',
            type: 'uint64',
          },
          {
            name: 'document_version',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'startelect',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'election_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'term_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'election_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'starts',
            type: 'uint32',
          },
          {
            name: 'ends',
            type: 'uint32',
          },
          {
            name: 'recalled',
            type: 'bool',
          },
          {
            name: 'recalled_at',
            type: 'uint32',
          },
          {
            name: 'recall_doc',
            type: 'uint64',
          },
          {
            name: 'recall_version',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'vote',
        base: '',
        fields: [
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'ballot_id',
            type: 'uint64',
          },
          {
            name: 'choice',
            type: 'uint8',
          },
        ],
      },
      {
        name: 'vote_identity',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'high_water',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'vote_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'ballot',
            type: 'uint64',
          },
          {
            name: 'member',
            type: 'uint64',
          },
          {
            name: 'weight',
            type: 'uint64',
          },
          {
            name: 'choice',
            type: 'uint8',
          },
        ],
      },
      {
        name: 'work_execution_record',
        base: '',
        fields: [
          {
            name: 'ballot_id',
            type: 'uint64',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'works',
            type: 'name',
          },
          {
            name: 'project_id',
            type: 'uint64',
          },
          {
            name: 'commitment',
            type: 'checksum256',
          },
          {
            name: 'works_hash',
            type: 'checksum256',
          },
          {
            name: 'policy_revision',
            type: 'uint64',
          },
          {
            name: 'deadline',
            type: 'uint32',
          },
          {
            name: 'executed',
            type: 'bool',
          },
        ],
      },
    ],
    actions: [
      {
        name: 'execute',
        type: 'execute',
        ricardian_contract: '',
      },
      {
        name: 'executeaward',
        type: 'executeaward',
        ricardian_contract: '',
      },
      {
        name: 'finalize',
        type: 'finalize',
        ricardian_contract: '',
      },
      {
        name: 'markpoll',
        type: 'markpoll',
        ricardian_contract: '',
      },
      {
        name: 'newelect',
        type: 'newelect',
        ricardian_contract: '',
      },
      {
        name: 'nominate',
        type: 'nominate',
        ricardian_contract: '',
      },
      {
        name: 'open',
        type: 'open',
        ricardian_contract: '',
      },
      {
        name: 'openaward',
        type: 'openaward',
        ricardian_contract: '',
      },
      {
        name: 'openwork',
        type: 'openwork',
        ricardian_contract: '',
      },
      {
        name: 'prunevotes',
        type: 'prunevotes',
        ricardian_contract: '',
      },
      {
        name: 'recall',
        type: 'recall',
        ricardian_contract: '',
      },
      {
        name: 'startelect',
        type: 'startelect',
        ricardian_contract: '',
      },
      {
        name: 'vote',
        type: 'vote',
        ricardian_contract: '',
      },
    ],
    tables: [
      {
        name: 'ballots',
        type: 'ballot_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'elections',
        type: 'election_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'executions',
        type: 'work_execution_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'grantplans',
        type: 'grant_execution',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'nominations',
        type: 'nomination_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'pollends',
        type: 'poll_end',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'terms',
        type: 'term_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'voteids',
        type: 'vote_identity',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'votes',
        type: 'vote_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
    ],
    variants: [],
    ricardian_clauses: [],
    action_results: [],
  },
};
