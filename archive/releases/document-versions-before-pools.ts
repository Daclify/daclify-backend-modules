// Retained trusted core schema from 34bf5ef before payer pools. Never edit an existing identity.
export const previousDocumentRelease = {
  identity: {
    codeHash: 'fa451fd3522b50c4f587a2fb11f9d273bea613c798185886dae9ba9873acd2bf',
    rawAbiHash: 'b7c8e0f6468b83274663f93bd608a1c201e72bc5623741cf6b840755affe2b9f',
    schemaHash: '395a559b6457d3b92ab498376c1112a39330178bb129b5ef48e24ea3e78e431b',
  },
  abi: {
    version: 'eosio::abi/1.2',
    types: [],
    structs: [
      {
        name: 'addmember',
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
            name: 'signing_key',
            type: 'public_key',
          },
          {
            name: 'encryption_key',
            type: 'string',
          },
          {
            name: 'custody',
            type: 'uint8',
          },
          {
            name: 'kind',
            type: 'uint8',
          },
          {
            name: 'operator_label',
            type: 'string',
          },
        ],
      },
      {
        name: 'addsession',
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
            name: 'session_id',
            type: 'uint64',
          },
          {
            name: 'signing_key',
            type: 'public_key',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'permissions',
            type: 'session_permission[]',
          },
        ],
      },
      {
        name: 'admission_policy',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'revision',
            type: 'uint64',
          },
          {
            name: 'mode',
            type: 'uint8',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'threshold',
            type: 'uint8',
          },
          {
            name: 'allow_agents',
            type: 'bool',
          },
          {
            name: 'admin_override',
            type: 'bool',
          },
        ],
      },
      {
        name: 'admitfrom',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'application_id',
            type: 'uint64',
          },
          {
            name: 'revision',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'approveob',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'source_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'archapprove',
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
            name: 'manifest_commitment',
            type: 'checksum256',
          },
          {
            name: 'descriptor_commitment',
            type: 'checksum256',
          },
          {
            name: 'backup_commitment',
            type: 'checksum256',
          },
          {
            name: 'retention_seconds',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'archattest',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'manifest',
            type: 'archive_manifest_descriptor',
          },
          {
            name: 'manifest_cid',
            type: 'string',
          },
          {
            name: 'manifest_bytes',
            type: 'uint32',
          },
          {
            name: 'manifest_commitment',
            type: 'checksum256',
          },
          {
            name: 'backup_commitment',
            type: 'checksum256',
          },
          {
            name: 'retention_seconds',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'archive_anchor',
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
            name: 'manifest',
            type: 'archive_manifest_descriptor',
          },
          {
            name: 'manifest_cid',
            type: 'string',
          },
          {
            name: 'manifest_bytes',
            type: 'uint32',
          },
          {
            name: 'manifest_commitment',
            type: 'checksum256',
          },
          {
            name: 'descriptor_commitment',
            type: 'checksum256',
          },
          {
            name: 'backup_commitment',
            type: 'checksum256',
          },
          {
            name: 'verifier',
            type: 'name',
          },
          {
            name: 'attestation_transaction',
            type: 'checksum256',
          },
          {
            name: 'approval_transaction',
            type: 'checksum256',
          },
          {
            name: 'retention_seconds',
            type: 'uint32',
          },
          {
            name: 'attested_at',
            type: 'uint32',
          },
          {
            name: 'approved_by',
            type: 'uint64',
          },
          {
            name: 'approved_at',
            type: 'uint32',
          },
          {
            name: 'revoked',
            type: 'bool',
          },
        ],
      },
      {
        name: 'archive_chunk_descriptor',
        base: '',
        fields: [
          {
            name: 'domain',
            type: 'archive_domain',
          },
          {
            name: 'root',
            type: 'checksum256',
          },
          {
            name: 'cid',
            type: 'string',
          },
          {
            name: 'bytes',
            type: 'uint32',
          },
          {
            name: 'commitment',
            type: 'checksum256',
          },
          {
            name: 'first_key',
            type: 'uint64',
          },
          {
            name: 'last_key',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'archive_domain',
        base: '',
        fields: [
          {
            name: 'format_version',
            type: 'uint16',
          },
          {
            name: 'chain_id',
            type: 'checksum256',
          },
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
          {
            name: 'abi_hash',
            type: 'checksum256',
          },
          {
            name: 'schema_hash',
            type: 'checksum256',
          },
          {
            name: 'table',
            type: 'name',
          },
          {
            name: 'scope',
            type: 'uint64',
          },
          {
            name: 'chunk_ordinal',
            type: 'uint32',
          },
          {
            name: 'leaf_count',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'archive_family_descriptor',
        base: '',
        fields: [
          {
            name: 'kind',
            type: 'string',
          },
          {
            name: 'parent_id',
            type: 'uint64',
          },
          {
            name: 'table',
            type: 'name',
          },
          {
            name: 'scope',
            type: 'uint64',
          },
          {
            name: 'schema_hash',
            type: 'checksum256',
          },
          {
            name: 'records',
            type: 'uint64',
          },
          {
            name: 'chunks',
            type: 'archive_chunk_descriptor[]',
          },
        ],
      },
      {
        name: 'archive_file_reference',
        base: '',
        fields: [
          {
            name: 'document_id',
            type: 'uint64',
          },
          {
            name: 'version',
            type: 'uint32',
          },
          {
            name: 'cid',
            type: 'string',
          },
          {
            name: 'bytes',
            type: 'uint64',
          },
          {
            name: 'commitment',
            type: 'checksum256',
          },
          {
            name: 'envelope_version',
            type: 'uint8',
          },
          {
            name: 'key_epoch',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'archive_manifest_descriptor',
        base: '',
        fields: [
          {
            name: 'format_version',
            type: 'uint16',
          },
          {
            name: 'chain_id',
            type: 'checksum256',
          },
          {
            name: 'runtime',
            type: 'name',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
          {
            name: 'abi_hash',
            type: 'checksum256',
          },
          {
            name: 'block_number',
            type: 'uint32',
          },
          {
            name: 'block_id',
            type: 'checksum256',
          },
          {
            name: 'timestamp',
            type: 'string',
          },
          {
            name: 'families',
            type: 'archive_family_descriptor[]',
          },
          {
            name: 'files',
            type: 'archive_file_reference[]',
          },
        ],
      },
      {
        name: 'archive_policy',
        base: '',
        fields: [
          {
            name: 'verifier',
            type: 'name',
          },
          {
            name: 'minimum_retention_seconds',
            type: 'uint32',
          },
          {
            name: 'pruning_enabled',
            type: 'bool',
          },
        ],
      },
      {
        name: 'archive_position',
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
            name: 'archive_id',
            type: 'uint64',
          },
          {
            name: 'chunk_ordinal',
            type: 'uint32',
          },
          {
            name: 'pruned',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'archrevoke',
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
            name: 'manifest_commitment',
            type: 'checksum256',
          },
          {
            name: 'descriptor_commitment',
            type: 'checksum256',
          },
          {
            name: 'backup_commitment',
            type: 'checksum256',
          },
          {
            name: 'retention_seconds',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'archstep',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
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
            name: 'count',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'authproof',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'intent',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'budget_record',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'day',
            type: 'uint32',
          },
          {
            name: 'committed',
            type: 'int64',
          },
        ],
      },
      {
        name: 'cancelob',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'source_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'capacity_receipt',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'receipt',
            type: 'checksum256',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'members',
            type: 'uint32',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'revoked',
            type: 'bool',
          },
        ],
      },
      {
        name: 'cardcreate',
        base: '',
        fields: [
          {
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'usd_cents',
            type: 'uint32',
          },
          {
            name: 'checkout_reference',
            type: 'checksum256',
          },
          {
            name: 'paid_at',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'catalogue_record',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'publisher',
            type: 'name',
          },
          {
            name: 'party',
            type: 'uint8',
          },
          {
            name: 'complies',
            type: 'uint8',
          },
          {
            name: 'price',
            type: 'asset',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
          {
            name: 'title',
            type: 'string',
          },
        ],
      },
      {
        name: 'commitepoch',
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
            name: 'epoch',
            type: 'uint64',
          },
          {
            name: 'commitment',
            type: 'checksum256',
          },
          {
            name: 'self_grant',
            type: 'string',
          },
        ],
      },
      {
        name: 'confirmext',
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
            name: 'obligation_id',
            type: 'uint64',
          },
          {
            name: 'chain',
            type: 'string',
          },
          {
            name: 'payer',
            type: 'string',
          },
          {
            name: 'recipient',
            type: 'uint64',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
          {
            name: 'reference',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'createdao',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'owner',
            type: 'name',
          },
          {
            name: 'metadata',
            type: 'string',
          },
          {
            name: 'privacy',
            type: 'uint8',
          },
          {
            name: 'token_contract',
            type: 'name',
          },
          {
            name: 'token_symbol',
            type: 'symbol',
          },
        ],
      },
      {
        name: 'createpaid',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'owner',
            type: 'name',
          },
          {
            name: 'metadata',
            type: 'string',
          },
          {
            name: 'privacy',
            type: 'uint8',
          },
          {
            name: 'token_contract',
            type: 'name',
          },
          {
            name: 'token_symbol',
            type: 'symbol',
          },
          {
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'creator',
            type: 'public_key',
          },
        ],
      },
      {
        name: 'creation_order',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'creator',
            type: 'public_key',
          },
          {
            name: 'deployment',
            type: 'uint8',
          },
          {
            name: 'method',
            type: 'uint8',
          },
          {
            name: 'usd_cents',
            type: 'uint32',
          },
          {
            name: 'tlos_due',
            type: 'asset',
          },
          {
            name: 'created_at',
            type: 'uint32',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'paid',
            type: 'bool',
          },
          {
            name: 'used',
            type: 'bool',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'card_reference',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'creation_policy',
        base: '',
        fields: [
          {
            name: 'shared_usd',
            type: 'uint32',
          },
          {
            name: 'independent_usd',
            type: 'uint32',
          },
          {
            name: 'premium_bps',
            type: 'uint16',
          },
          {
            name: 'settler',
            type: 'name',
          },
          {
            name: 'median',
            type: 'uint64',
          },
          {
            name: 'precision',
            type: 'uint8',
          },
          {
            name: 'observed_at',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'dao_capacity',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'members',
            type: 'uint32',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'receipt',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'dao_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'owner',
            type: 'name',
          },
          {
            name: 'metadata',
            type: 'string',
          },
          {
            name: 'privacy',
            type: 'uint8',
          },
          {
            name: 'token_contract',
            type: 'name',
          },
          {
            name: 'token_symbol',
            type: 'symbol',
          },
          {
            name: 'credit_supply',
            type: 'uint64',
          },
          {
            name: 'member_count',
            type: 'uint64',
          },
          {
            name: 'max_member',
            type: 'uint64',
          },
          {
            name: 'active_ballots',
            type: 'uint32',
          },
          {
            name: 'available',
            type: 'int64',
          },
          {
            name: 'reserved',
            type: 'int64',
          },
          {
            name: 'claims',
            type: 'int64',
          },
          {
            name: 'staked',
            type: 'int64',
          },
          {
            name: 'eligible_credits',
            type: 'uint64',
          },
          {
            name: 'eligible_stake',
            type: 'int64',
          },
          {
            name: 'admin_count',
            type: 'uint32',
          },
          {
            name: 'key_epoch',
            type: 'uint64',
          },
          {
            name: 'history_policy',
            type: 'uint8',
          },
        ],
      },
      {
        name: 'delsession',
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
            name: 'session_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'document_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'document_id',
            type: 'uint64',
          },
          {
            name: 'version',
            type: 'uint32',
          },
          {
            name: 'author',
            type: 'uint64',
          },
          {
            name: 'cid',
            type: 'string',
          },
          {
            name: 'metadata',
            type: 'string',
          },
          {
            name: 'commitment',
            type: 'checksum256',
          },
          {
            name: 'bytes',
            type: 'uint32',
          },
          {
            name: 'envelope_version',
            type: 'uint16',
          },
          {
            name: 'key_epoch',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'enroll',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'native_account',
            type: 'name',
          },
          {
            name: 'signing_key',
            type: 'public_key',
          },
          {
            name: 'encryption_key',
            type: 'string',
          },
          {
            name: 'custody',
            type: 'uint8',
          },
        ],
      },
      {
        name: 'enrollagent',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'native_account',
            type: 'name',
          },
          {
            name: 'signing_key',
            type: 'public_key',
          },
          {
            name: 'encryption_key',
            type: 'string',
          },
          {
            name: 'custody',
            type: 'uint8',
          },
          {
            name: 'operator_label',
            type: 'string',
          },
        ],
      },
      {
        name: 'epoch_record',
        base: '',
        fields: [
          {
            name: 'epoch',
            type: 'uint64',
          },
          {
            name: 'commitment',
            type: 'checksum256',
          },
          {
            name: 'creator',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'evidence_record',
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
            name: 'obligation_id',
            type: 'uint64',
          },
          {
            name: 'recipient',
            type: 'uint64',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
          {
            name: 'chain',
            type: 'string',
          },
          {
            name: 'payer',
            type: 'string',
          },
          {
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'mode',
            type: 'uint8',
          },
        ],
      },
      {
        name: 'evm_binding_record',
        base: '',
        fields: [
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'chain_id',
            type: 'uint64',
          },
          {
            name: 'address',
            type: 'checksum160',
          },
          {
            name: 'epoch',
            type: 'uint64',
          },
          {
            name: 'active',
            type: 'bool',
          },
        ],
      },
      {
        name: 'fee_config',
        base: '',
        fields: [
          {
            name: 'third_party_bps',
            type: 'uint16',
          },
          {
            name: 'first_party_bps',
            type: 'uint16',
          },
          {
            name: 'treasury',
            type: 'name',
          },
          {
            name: 'token_contract',
            type: 'name',
          },
          {
            name: 'token_symbol',
            type: 'symbol',
          },
          {
            name: 'names',
            type: 'name',
          },
        ],
      },
      {
        name: 'finance_receipt',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'kind',
            type: 'uint8',
          },
          {
            name: 'obligation_id',
            type: 'uint64',
          },
          {
            name: 'recipient',
            type: 'uint64',
          },
          {
            name: 'destination',
            type: 'name',
          },
          {
            name: 'token_contract',
            type: 'name',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
          {
            name: 'at',
            type: 'uint32',
          },
          {
            name: 'transaction_id',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'finishram',
        base: '',
        fields: [
          {
            name: 'reference',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'fulfilram',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'policy_revision',
            type: 'uint64',
          },
          {
            name: 'maximum',
            type: 'asset',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'purchases',
            type: 'ram_purchase[]',
          },
        ],
      },
      {
        name: 'gov_policy_record',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'revision',
            type: 'uint64',
          },
          {
            name: 'config',
            type: 'gov_settings',
          },
        ],
      },
      {
        name: 'gov_settings',
        base: '',
        fields: [
          {
            name: 'participant_mode',
            type: 'uint8',
          },
          {
            name: 'decide',
            type: 'name',
          },
          {
            name: 'guardian',
            type: 'name',
          },
          {
            name: 'kind',
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
            name: 'governed_works',
            type: 'bool',
          },
          {
            name: 'max_commitment',
            type: 'int64',
          },
          {
            name: 'daily_commitment',
            type: 'int64',
          },
        ],
      },
      {
        name: 'govcreate',
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
            name: 'shared_usd',
            type: 'uint32',
          },
          {
            name: 'independent_usd',
            type: 'uint32',
          },
          {
            name: 'premium_bps',
            type: 'uint16',
          },
          {
            name: 'settler',
            type: 'name',
          },
        ],
      },
      {
        name: 'governance_lock',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'source_id',
            type: 'uint64',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'active',
            type: 'bool',
          },
        ],
      },
      {
        name: 'govfees',
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
            name: 'third_party_bps',
            type: 'uint16',
          },
          {
            name: 'first_party_bps',
            type: 'uint16',
          },
          {
            name: 'bump_bps',
            type: 'uint16',
          },
          {
            name: 'quote_premium_bps',
            type: 'uint16',
          },
        ],
      },
      {
        name: 'govhosted',
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
            name: 'free_members',
            type: 'uint32',
          },
          {
            name: 'settler',
            type: 'name',
          },
        ],
      },
      {
        name: 'govlist',
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
            name: 'account',
            type: 'name',
          },
          {
            name: 'price',
            type: 'asset',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
          {
            name: 'title',
            type: 'string',
          },
        ],
      },
      {
        name: 'govlock',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'source_id',
            type: 'uint64',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'govmodcopy',
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
            name: 'account',
            type: 'name',
          },
          {
            name: 'summary',
            type: 'string',
          },
          {
            name: 'detail',
            type: 'string',
          },
        ],
      },
      {
        name: 'govpayfees',
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
            name: 'bps',
            type: 'uint16',
          },
        ],
      },
      {
        name: 'govresources',
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
            name: 'expected_revision',
            type: 'uint64',
          },
          {
            name: 'native_ram_bps',
            type: 'uint16',
          },
          {
            name: 'card_ram_bps',
            type: 'uint16',
          },
          {
            name: 'included_activity_bytes',
            type: 'uint64',
          },
          {
            name: 'identity_bytes_per_slot',
            type: 'uint64',
          },
          {
            name: 'quote_lifetime_seconds',
            type: 'uint32',
          },
          {
            name: 'storage_free_bytes',
            type: 'uint64',
          },
          {
            name: 'storage_unit_bytes',
            type: 'uint64',
          },
          {
            name: 'storage_monthly_usd',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'govseatfee',
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
            name: 'first_usd',
            type: 'uint32',
          },
          {
            name: 'next_usd',
            type: 'uint32',
          },
          {
            name: 'rest_usd',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'govunlist',
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
            name: 'account',
            type: 'name',
          },
        ],
      },
      {
        name: 'govunlock',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'source_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'grantcredit',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'quantity',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'grantkey',
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
            name: 'recipient',
            type: 'uint64',
          },
          {
            name: 'epoch',
            type: 'uint64',
          },
          {
            name: 'envelope',
            type: 'string',
          },
        ],
      },
      {
        name: 'guardian_record',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'paused_until',
            type: 'uint32',
          },
          {
            name: 'reason',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'guardpause',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'until',
            type: 'uint32',
          },
          {
            name: 'reason',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'guardrecover',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'signing_key',
            type: 'public_key',
          },
        ],
      },
      {
        name: 'guardrevoke',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'hosted_policy',
        base: '',
        fields: [
          {
            name: 'free_members',
            type: 'uint32',
          },
          {
            name: 'settler',
            type: 'name',
          },
        ],
      },
      {
        name: 'init',
        base: '',
        fields: [
          {
            name: 'chain_id',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'initgov',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'settings',
            type: 'gov_settings',
          },
        ],
      },
      {
        name: 'initramobs',
        base: '',
        fields: [],
      },
      {
        name: 'instruction',
        base: '',
        fields: [
          {
            name: 'version',
            type: 'uint16',
          },
          {
            name: 'chain_id',
            type: 'checksum256',
          },
          {
            name: 'deployment',
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
            name: 'nonce',
            type: 'uint64',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'target',
            type: 'name',
          },
          {
            name: 'action',
            type: 'name',
          },
          {
            name: 'data',
            type: 'bytes',
          },
        ],
      },
      {
        name: 'key_grant_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'epoch',
            type: 'uint64',
          },
          {
            name: 'recipient',
            type: 'uint64',
          },
          {
            name: 'grantor',
            type: 'uint64',
          },
          {
            name: 'envelope',
            type: 'string',
          },
        ],
      },
      {
        name: 'linkevm',
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
            name: 'evm_chain_id',
            type: 'uint64',
          },
          {
            name: 'address',
            type: 'checksum160',
          },
          {
            name: 'epoch',
            type: 'uint64',
          },
          {
            name: 'nonce',
            type: 'uint64',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'proof',
            type: 'bytes',
          },
        ],
      },
      {
        name: 'linknative',
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
            name: 'account',
            type: 'name',
          },
        ],
      },
      {
        name: 'listmod',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'publisher',
            type: 'name',
          },
          {
            name: 'party',
            type: 'uint8',
          },
          {
            name: 'accepts_fee_rule',
            type: 'uint8',
          },
          {
            name: 'price',
            type: 'asset',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
          {
            name: 'title',
            type: 'string',
          },
        ],
      },
      {
        name: 'market_policy',
        base: '',
        fields: [
          {
            name: 'bump_bps',
            type: 'uint16',
          },
          {
            name: 'quote_premium_bps',
            type: 'uint16',
          },
          {
            name: 'dao_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'member_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'native_account',
            type: 'name',
          },
          {
            name: 'signing_key',
            type: 'public_key',
          },
          {
            name: 'encryption_key',
            type: 'string',
          },
          {
            name: 'custody',
            type: 'uint8',
          },
          {
            name: 'nonce',
            type: 'uint64',
          },
          {
            name: 'credits',
            type: 'uint64',
          },
          {
            name: 'active',
            type: 'bool',
          },
          {
            name: 'admin',
            type: 'bool',
          },
          {
            name: 'reviewer',
            type: 'bool',
          },
          {
            name: 'stake',
            type: 'int64',
          },
          {
            name: 'claim',
            type: 'int64',
          },
          {
            name: 'join_epoch',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'modconfig',
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
            name: 'account',
            type: 'name',
          },
          {
            name: 'version',
            type: 'uint16',
          },
          {
            name: 'actions',
            type: 'name[]',
          },
          {
            name: 'grants',
            type: 'name[]',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'modcopy_record',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'summary',
            type: 'string',
          },
          {
            name: 'detail',
            type: 'string',
          },
        ],
      },
      {
        name: 'modpay_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'modaccount',
            type: 'name',
          },
          {
            name: 'payer',
            type: 'name',
          },
          {
            name: 'publisher',
            type: 'name',
          },
          {
            name: 'gross',
            type: 'asset',
          },
          {
            name: 'platform_fee',
            type: 'asset',
          },
          {
            name: 'publisher_share',
            type: 'asset',
          },
          {
            name: 'party',
            type: 'uint8',
          },
          {
            name: 'bps',
            type: 'uint16',
          },
        ],
      },
      {
        name: 'module_record',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'version',
            type: 'uint16',
          },
          {
            name: 'actions',
            type: 'name[]',
          },
          {
            name: 'grants',
            type: 'name[]',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'obligation_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'source_id',
            type: 'uint64',
          },
          {
            name: 'recipient',
            type: 'uint64',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
          {
            name: 'due',
            type: 'uint32',
          },
          {
            name: 'status',
            type: 'uint8',
          },
        ],
      },
      {
        name: 'ordercreate',
        base: '',
        fields: [
          {
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'creator',
            type: 'public_key',
          },
          {
            name: 'deployment',
            type: 'uint8',
          },
          {
            name: 'method',
            type: 'uint8',
          },
        ],
      },
      {
        name: 'orderfree',
        base: '',
        fields: [
          {
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'creator',
            type: 'public_key',
          },
        ],
      },
      {
        name: 'orderram',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'payer',
            type: 'name',
          },
          {
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'policy_revision',
            type: 'uint64',
          },
          {
            name: 'maximum',
            type: 'asset',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'purchases',
            type: 'ram_purchase[]',
          },
        ],
      },
      {
        name: 'participant_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'kind',
            type: 'uint8',
          },
          {
            name: 'operator_label',
            type: 'string',
          },
          {
            name: 'revoked',
            type: 'bool',
          },
          {
            name: 'credential_epoch',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'payment_policy',
        base: '',
        fields: [
          {
            name: 'bps',
            type: 'uint16',
          },
          {
            name: 'revision',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'payob',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'source_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'profile_record',
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
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'account_name',
            type: 'name',
          },
          {
            name: 'profile',
            type: 'string',
          },
        ],
      },
      {
        name: 'putdoc',
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
            name: 'document_id',
            type: 'uint64',
          },
          {
            name: 'version',
            type: 'uint32',
          },
          {
            name: 'cid',
            type: 'string',
          },
          {
            name: 'metadata',
            type: 'string',
          },
          {
            name: 'commitment',
            type: 'checksum256',
          },
          {
            name: 'bytes',
            type: 'uint32',
          },
          {
            name: 'envelope_version',
            type: 'uint16',
          },
          {
            name: 'key_epoch',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'putjson',
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
            name: 'document_id',
            type: 'uint64',
          },
          {
            name: 'version',
            type: 'uint32',
          },
          {
            name: 'value',
            type: 'string',
          },
          {
            name: 'envelope_version',
            type: 'uint16',
          },
          {
            name: 'key_epoch',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'ram_acquisition',
        base: '',
        fields: [
          {
            name: 'receiver',
            type: 'name',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
          {
            name: 'minimum_bytes',
            type: 'uint64',
          },
          {
            name: 'before_bytes',
            type: 'uint64',
          },
          {
            name: 'acquired_bytes',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'ram_allocation',
        base: '',
        fields: [
          {
            name: 'payer',
            type: 'name',
          },
          {
            name: 'purchased_bytes',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'ram_card_receipt',
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
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'operational_bps',
            type: 'uint16',
          },
          {
            name: 'fulfiller',
            type: 'name',
          },
        ],
      },
      {
        name: 'ram_counter',
        base: '',
        fields: [
          {
            name: 'payer',
            type: 'name',
          },
          {
            name: 'identity',
            type: 'uint64',
          },
          {
            name: 'activity',
            type: 'uint64',
          },
          {
            name: 'retained',
            type: 'uint64',
          },
          {
            name: 'platform',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'ram_observer_config',
        base: '',
        fields: [
          {
            name: 'meter_bytes',
            type: 'uint64',
          },
          {
            name: 'runtime_hash',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'ram_operator_reserve',
        base: '',
        fields: [
          {
            name: 'available',
            type: 'asset',
          },
        ],
      },
      {
        name: 'ram_order',
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
            name: 'reference',
            type: 'checksum256',
          },
          {
            name: 'payer',
            type: 'name',
          },
          {
            name: 'treasury',
            type: 'name',
          },
          {
            name: 'policy_revision',
            type: 'uint64',
          },
          {
            name: 'fee_bps',
            type: 'uint16',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'maximum',
            type: 'asset',
          },
          {
            name: 'spent',
            type: 'asset',
          },
          {
            name: 'platform_fee',
            type: 'asset',
          },
          {
            name: 'received',
            type: 'asset',
          },
          {
            name: 'purchases',
            type: 'ram_acquisition[]',
          },
          {
            name: 'funded',
            type: 'bool',
          },
          {
            name: 'settled',
            type: 'bool',
          },
        ],
      },
      {
        name: 'ram_payment_intent',
        base: '',
        fields: [
          {
            name: 'order',
            type: 'ram_order',
          },
          {
            name: 'transaction_id',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'ram_purchase',
        base: '',
        fields: [
          {
            name: 'receiver',
            type: 'name',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
          {
            name: 'minimum_bytes',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'ram_source',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'ramadjust',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'payer',
            type: 'name',
          },
          {
            name: 'category',
            type: 'uint8',
          },
          {
            name: 'added',
            type: 'uint64',
          },
          {
            name: 'removed',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'rebindramobs',
        base: '',
        fields: [
          {
            name: 'expected_old_hash',
            type: 'checksum256',
          },
          {
            name: 'expected_new_hash',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'reserve',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'source_id',
            type: 'uint64',
          },
          {
            name: 'recipient',
            type: 'uint64',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
          {
            name: 'due',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'resource_policy',
        base: '',
        fields: [
          {
            name: 'schema_version',
            type: 'uint16',
          },
          {
            name: 'revision',
            type: 'uint64',
          },
          {
            name: 'native_ram_bps',
            type: 'uint16',
          },
          {
            name: 'card_ram_bps',
            type: 'uint16',
          },
          {
            name: 'included_activity_bytes',
            type: 'uint64',
          },
          {
            name: 'identity_bytes_per_slot',
            type: 'uint64',
          },
          {
            name: 'quote_lifetime_seconds',
            type: 'uint32',
          },
          {
            name: 'grace_seconds',
            type: 'uint32',
          },
          {
            name: 'storage_free_bytes',
            type: 'uint64',
          },
          {
            name: 'storage_unit_bytes',
            type: 'uint64',
          },
          {
            name: 'storage_monthly_usd',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'resumecap',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'receipt',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'revokecap',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'receipt',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'rotateepoch',
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
        ],
      },
      {
        name: 'rotatekey',
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
            name: 'signing_key',
            type: 'public_key',
          },
        ],
      },
      {
        name: 'seat_policy',
        base: '',
        fields: [
          {
            name: 'first_usd',
            type: 'uint32',
          },
          {
            name: 'next_usd',
            type: 'uint32',
          },
          {
            name: 'rest_usd',
            type: 'uint32',
          },
          {
            name: 'revision',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'session_permission',
        base: '',
        fields: [
          {
            name: 'target',
            type: 'name',
          },
          {
            name: 'action',
            type: 'name',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'session_record',
        base: '',
        fields: [
          {
            name: 'id',
            type: 'uint64',
          },
          {
            name: 'member_id',
            type: 'uint64',
          },
          {
            name: 'signing_key',
            type: 'public_key',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'credential_epoch',
            type: 'uint64',
          },
          {
            name: 'permissions',
            type: 'session_permission[]',
          },
        ],
      },
      {
        name: 'setactive',
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
            name: 'target',
            type: 'uint64',
          },
          {
            name: 'active',
            type: 'bool',
          },
        ],
      },
      {
        name: 'setadmit',
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
            name: 'enabled',
            type: 'bool',
          },
          {
            name: 'source',
            type: 'name',
          },
          {
            name: 'threshold',
            type: 'uint8',
          },
          {
            name: 'allow_agents',
            type: 'bool',
          },
          {
            name: 'admin_override',
            type: 'bool',
          },
        ],
      },
      {
        name: 'setarchcfg',
        base: '',
        fields: [
          {
            name: 'verifier',
            type: 'name',
          },
          {
            name: 'minimum_retention_seconds',
            type: 'uint32',
          },
          {
            name: 'pruning_enabled',
            type: 'bool',
          },
        ],
      },
      {
        name: 'setcapacity',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'member_limit',
            type: 'uint32',
          },
          {
            name: 'expires',
            type: 'uint32',
          },
          {
            name: 'receipt',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'setcreate',
        base: '',
        fields: [
          {
            name: 'shared_usd',
            type: 'uint32',
          },
          {
            name: 'independent_usd',
            type: 'uint32',
          },
          {
            name: 'premium_bps',
            type: 'uint16',
          },
          {
            name: 'settler',
            type: 'name',
          },
        ],
      },
      {
        name: 'setcredits',
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
            name: 'target',
            type: 'uint64',
          },
          {
            name: 'quantity',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'setcrrate',
        base: '',
        fields: [
          {
            name: 'median',
            type: 'uint64',
          },
          {
            name: 'precision',
            type: 'uint8',
          },
          {
            name: 'observed_at',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'setdaogov',
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
            name: 'settings',
            type: 'gov_settings',
          },
        ],
      },
      {
        name: 'setfees',
        base: '',
        fields: [
          {
            name: 'third_party_bps',
            type: 'uint16',
          },
          {
            name: 'first_party_bps',
            type: 'uint16',
          },
          {
            name: 'treasury',
            type: 'name',
          },
          {
            name: 'token_contract',
            type: 'name',
          },
          {
            name: 'token_symbol',
            type: 'symbol',
          },
          {
            name: 'names',
            type: 'name',
          },
        ],
      },
      {
        name: 'setgov',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
        ],
      },
      {
        name: 'sethosted',
        base: '',
        fields: [
          {
            name: 'free_members',
            type: 'uint32',
          },
          {
            name: 'settler',
            type: 'name',
          },
        ],
      },
      {
        name: 'setmeta',
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
            name: 'metadata',
            type: 'string',
          },
        ],
      },
      {
        name: 'setmodcopy',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'summary',
            type: 'string',
          },
          {
            name: 'detail',
            type: 'string',
          },
        ],
      },
      {
        name: 'setmodule',
        base: '',
        fields: [
          {
            name: 'dao_id',
            type: 'uint64',
          },
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'version',
            type: 'uint16',
          },
          {
            name: 'actions',
            type: 'name[]',
          },
          {
            name: 'grants',
            type: 'name[]',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'setoracle',
        base: '',
        fields: [
          {
            name: 'median',
            type: 'uint64',
          },
          {
            name: 'quoted_precision',
            type: 'uint8',
          },
          {
            name: 'observed_at',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'setpolicy',
        base: '',
        fields: [
          {
            name: 'bump_bps',
            type: 'uint16',
          },
          {
            name: 'quote_premium_bps',
            type: 'uint16',
          },
        ],
      },
      {
        name: 'setprofile',
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
            name: 'account_name',
            type: 'name',
          },
          {
            name: 'profile',
            type: 'string',
          },
        ],
      },
      {
        name: 'setramcode',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
          {
            name: 'code_hash',
            type: 'checksum256',
          },
        ],
      },
      {
        name: 'setresources',
        base: '',
        fields: [
          {
            name: 'native_ram_bps',
            type: 'uint16',
          },
          {
            name: 'card_ram_bps',
            type: 'uint16',
          },
          {
            name: 'included_activity_bytes',
            type: 'uint64',
          },
          {
            name: 'identity_bytes_per_slot',
            type: 'uint64',
          },
          {
            name: 'quote_lifetime_seconds',
            type: 'uint32',
          },
          {
            name: 'storage_free_bytes',
            type: 'uint64',
          },
          {
            name: 'storage_unit_bytes',
            type: 'uint64',
          },
          {
            name: 'storage_monthly_usd',
            type: 'uint32',
          },
        ],
      },
      {
        name: 'setroles',
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
            name: 'target',
            type: 'uint64',
          },
          {
            name: 'admin',
            type: 'bool',
          },
          {
            name: 'reviewer',
            type: 'bool',
          },
        ],
      },
      {
        name: 'settings',
        base: '',
        fields: [
          {
            name: 'chain_id',
            type: 'checksum256',
          },
          {
            name: 'interface_version',
            type: 'uint16',
          },
        ],
      },
      {
        name: 'submit',
        base: '',
        fields: [
          {
            name: 'request',
            type: 'instruction',
          },
          {
            name: 'sig',
            type: 'signature',
          },
        ],
      },
      {
        name: 'submitevm',
        base: '',
        fields: [
          {
            name: 'request',
            type: 'instruction',
          },
          {
            name: 'evm_chain_id',
            type: 'uint64',
          },
          {
            name: 'address',
            type: 'checksum160',
          },
          {
            name: 'binding_epoch',
            type: 'uint64',
          },
          {
            name: 'proof',
            type: 'bytes',
          },
        ],
      },
      {
        name: 'submitnat',
        base: '',
        fields: [
          {
            name: 'request',
            type: 'instruction',
          },
        ],
      },
      {
        name: 'submitsess',
        base: '',
        fields: [
          {
            name: 'request',
            type: 'instruction',
          },
          {
            name: 'session_id',
            type: 'uint64',
          },
          {
            name: 'sig',
            type: 'signature',
          },
        ],
      },
      {
        name: 'unlinkevm',
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
        ],
      },
      {
        name: 'unlinknat',
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
        ],
      },
      {
        name: 'unlistmod',
        base: '',
        fields: [
          {
            name: 'account',
            type: 'name',
          },
        ],
      },
      {
        name: 'unstake',
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
            name: 'destination',
            type: 'name',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
        ],
      },
      {
        name: 'withdraw',
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
            name: 'destination',
            type: 'name',
          },
          {
            name: 'quantity',
            type: 'asset',
          },
        ],
      },
    ],
    actions: [
      {
        name: 'addmember',
        type: 'addmember',
        ricardian_contract: '',
      },
      {
        name: 'addsession',
        type: 'addsession',
        ricardian_contract: '',
      },
      {
        name: 'admitfrom',
        type: 'admitfrom',
        ricardian_contract: '',
      },
      {
        name: 'approveob',
        type: 'approveob',
        ricardian_contract: '',
      },
      {
        name: 'archapprove',
        type: 'archapprove',
        ricardian_contract: '',
      },
      {
        name: 'archattest',
        type: 'archattest',
        ricardian_contract: '',
      },
      {
        name: 'archrevoke',
        type: 'archrevoke',
        ricardian_contract: '',
      },
      {
        name: 'archstep',
        type: 'archstep',
        ricardian_contract: '',
      },
      {
        name: 'authproof',
        type: 'authproof',
        ricardian_contract: '',
      },
      {
        name: 'cancelob',
        type: 'cancelob',
        ricardian_contract: '',
      },
      {
        name: 'cardcreate',
        type: 'cardcreate',
        ricardian_contract: '',
      },
      {
        name: 'commitepoch',
        type: 'commitepoch',
        ricardian_contract: '',
      },
      {
        name: 'confirmext',
        type: 'confirmext',
        ricardian_contract: '',
      },
      {
        name: 'createdao',
        type: 'createdao',
        ricardian_contract: '',
      },
      {
        name: 'createpaid',
        type: 'createpaid',
        ricardian_contract: '',
      },
      {
        name: 'delsession',
        type: 'delsession',
        ricardian_contract: '',
      },
      {
        name: 'enroll',
        type: 'enroll',
        ricardian_contract: '',
      },
      {
        name: 'enrollagent',
        type: 'enrollagent',
        ricardian_contract: '',
      },
      {
        name: 'finishram',
        type: 'finishram',
        ricardian_contract: '',
      },
      {
        name: 'fulfilram',
        type: 'fulfilram',
        ricardian_contract: '',
      },
      {
        name: 'govcreate',
        type: 'govcreate',
        ricardian_contract: '',
      },
      {
        name: 'govfees',
        type: 'govfees',
        ricardian_contract: '',
      },
      {
        name: 'govhosted',
        type: 'govhosted',
        ricardian_contract: '',
      },
      {
        name: 'govlist',
        type: 'govlist',
        ricardian_contract: '',
      },
      {
        name: 'govlock',
        type: 'govlock',
        ricardian_contract: '',
      },
      {
        name: 'govmodcopy',
        type: 'govmodcopy',
        ricardian_contract: '',
      },
      {
        name: 'govpayfees',
        type: 'govpayfees',
        ricardian_contract: '',
      },
      {
        name: 'govresources',
        type: 'govresources',
        ricardian_contract: '',
      },
      {
        name: 'govseatfee',
        type: 'govseatfee',
        ricardian_contract: '',
      },
      {
        name: 'govunlist',
        type: 'govunlist',
        ricardian_contract: '',
      },
      {
        name: 'govunlock',
        type: 'govunlock',
        ricardian_contract: '',
      },
      {
        name: 'grantcredit',
        type: 'grantcredit',
        ricardian_contract: '',
      },
      {
        name: 'grantkey',
        type: 'grantkey',
        ricardian_contract: '',
      },
      {
        name: 'guardpause',
        type: 'guardpause',
        ricardian_contract: '',
      },
      {
        name: 'guardrecover',
        type: 'guardrecover',
        ricardian_contract: '',
      },
      {
        name: 'guardrevoke',
        type: 'guardrevoke',
        ricardian_contract: '',
      },
      {
        name: 'init',
        type: 'init',
        ricardian_contract: '',
      },
      {
        name: 'initgov',
        type: 'initgov',
        ricardian_contract: '',
      },
      {
        name: 'initramobs',
        type: 'initramobs',
        ricardian_contract: '',
      },
      {
        name: 'linkevm',
        type: 'linkevm',
        ricardian_contract: '',
      },
      {
        name: 'linknative',
        type: 'linknative',
        ricardian_contract: '',
      },
      {
        name: 'listmod',
        type: 'listmod',
        ricardian_contract: '',
      },
      {
        name: 'modconfig',
        type: 'modconfig',
        ricardian_contract: '',
      },
      {
        name: 'ordercreate',
        type: 'ordercreate',
        ricardian_contract: '',
      },
      {
        name: 'orderfree',
        type: 'orderfree',
        ricardian_contract: '',
      },
      {
        name: 'orderram',
        type: 'orderram',
        ricardian_contract: '',
      },
      {
        name: 'payob',
        type: 'payob',
        ricardian_contract: '',
      },
      {
        name: 'putdoc',
        type: 'putdoc',
        ricardian_contract: '',
      },
      {
        name: 'putjson',
        type: 'putjson',
        ricardian_contract: '',
      },
      {
        name: 'ramadjust',
        type: 'ramadjust',
        ricardian_contract: '',
      },
      {
        name: 'rebindramobs',
        type: 'rebindramobs',
        ricardian_contract: '',
      },
      {
        name: 'reserve',
        type: 'reserve',
        ricardian_contract: '',
      },
      {
        name: 'resumecap',
        type: 'resumecap',
        ricardian_contract: '',
      },
      {
        name: 'revokecap',
        type: 'revokecap',
        ricardian_contract: '',
      },
      {
        name: 'rotateepoch',
        type: 'rotateepoch',
        ricardian_contract: '',
      },
      {
        name: 'rotatekey',
        type: 'rotatekey',
        ricardian_contract: '',
      },
      {
        name: 'setactive',
        type: 'setactive',
        ricardian_contract: '',
      },
      {
        name: 'setadmit',
        type: 'setadmit',
        ricardian_contract: '',
      },
      {
        name: 'setarchcfg',
        type: 'setarchcfg',
        ricardian_contract: '',
      },
      {
        name: 'setcapacity',
        type: 'setcapacity',
        ricardian_contract: '',
      },
      {
        name: 'setcreate',
        type: 'setcreate',
        ricardian_contract: '',
      },
      {
        name: 'setcredits',
        type: 'setcredits',
        ricardian_contract: '',
      },
      {
        name: 'setcrrate',
        type: 'setcrrate',
        ricardian_contract: '',
      },
      {
        name: 'setdaogov',
        type: 'setdaogov',
        ricardian_contract: '',
      },
      {
        name: 'setfees',
        type: 'setfees',
        ricardian_contract: '',
      },
      {
        name: 'setgov',
        type: 'setgov',
        ricardian_contract: '',
      },
      {
        name: 'sethosted',
        type: 'sethosted',
        ricardian_contract: '',
      },
      {
        name: 'setmeta',
        type: 'setmeta',
        ricardian_contract: '',
      },
      {
        name: 'setmodcopy',
        type: 'setmodcopy',
        ricardian_contract: '',
      },
      {
        name: 'setmodule',
        type: 'setmodule',
        ricardian_contract: '',
      },
      {
        name: 'setoracle',
        type: 'setoracle',
        ricardian_contract: '',
      },
      {
        name: 'setpolicy',
        type: 'setpolicy',
        ricardian_contract: '',
      },
      {
        name: 'setprofile',
        type: 'setprofile',
        ricardian_contract: '',
      },
      {
        name: 'setramcode',
        type: 'setramcode',
        ricardian_contract: '',
      },
      {
        name: 'setresources',
        type: 'setresources',
        ricardian_contract: '',
      },
      {
        name: 'setroles',
        type: 'setroles',
        ricardian_contract: '',
      },
      {
        name: 'submit',
        type: 'submit',
        ricardian_contract: '',
      },
      {
        name: 'submitevm',
        type: 'submitevm',
        ricardian_contract: '',
      },
      {
        name: 'submitnat',
        type: 'submitnat',
        ricardian_contract: '',
      },
      {
        name: 'submitsess',
        type: 'submitsess',
        ricardian_contract: '',
      },
      {
        name: 'unlinkevm',
        type: 'unlinkevm',
        ricardian_contract: '',
      },
      {
        name: 'unlinknat',
        type: 'unlinknat',
        ricardian_contract: '',
      },
      {
        name: 'unlistmod',
        type: 'unlistmod',
        ricardian_contract: '',
      },
      {
        name: 'unstake',
        type: 'unstake',
        ricardian_contract: '',
      },
      {
        name: 'withdraw',
        type: 'withdraw',
        ricardian_contract: '',
      },
    ],
    tables: [
      {
        name: 'actors',
        type: 'participant_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'admpolicies',
        type: 'admission_policy',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'archcfg',
        type: 'archive_policy',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'archives',
        type: 'archive_anchor',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'archpos',
        type: 'archive_position',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'budgets',
        type: 'budget_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'capcfg',
        type: 'hosted_policy',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'capreceipts',
        type: 'capacity_receipt',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'catalogue',
        type: 'catalogue_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'createcfg',
        type: 'creation_policy',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'createords',
        type: 'creation_order',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'daocaps',
        type: 'dao_capacity',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'daos',
        type: 'dao_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'documents',
        type: 'document_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'epochs',
        type: 'epoch_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'evidence',
        type: 'evidence_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'evmbindings',
        type: 'evm_binding_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'feecfg',
        type: 'fee_config',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'govlocks',
        type: 'governance_lock',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'govpolicies',
        type: 'gov_policy_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'guards',
        type: 'guardian_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'keygrants',
        type: 'key_grant_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'members',
        type: 'member_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'mktcfg',
        type: 'market_policy',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'modcopy',
        type: 'modcopy_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'modpays',
        type: 'modpay_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'modules',
        type: 'module_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'obligations',
        type: 'obligation_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'paycfg',
        type: 'payment_policy',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'profiles',
        type: 'profile_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'ramalloc',
        type: 'ram_allocation',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'ramcards',
        type: 'ram_card_receipt',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'ramintent',
        type: 'ram_payment_intent',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'ramobs',
        type: 'ram_observer_config',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'ramorders',
        type: 'ram_order',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'ramreserve',
        type: 'ram_operator_reserve',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'ramsources',
        type: 'ram_source',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'ramstats',
        type: 'ram_counter',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'receipts',
        type: 'finance_receipt',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'resourcecfg',
        type: 'resource_policy',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'seatcfg',
        type: 'seat_policy',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'sessions',
        type: 'session_record',
        index_type: 'i64',
        key_names: [],
        key_types: [],
      },
      {
        name: 'settings',
        type: 'settings',
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
