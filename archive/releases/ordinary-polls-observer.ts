// Retained trusted development schema before source-owned pruning. Never edit an existing identity.
export const previousPollRelease = {
  identity: {
    codeHash: 'def994f232e0f7a3caa46df396541f7800a190fe925ff96383bb7561fa3dcfe1',
    rawAbiHash: '03546fc45c441b7c88ad809aad68d306a0f645640b7692b35617ff542cd362d0',
    schemaHash: '8af03e14456c1c0a207d68ecf920e6720e94311f243c061448d53a48e94a649a',
  },
  abi: {
    version: 'eosio::abi/1.2',
    types: [],
    structs: [
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
