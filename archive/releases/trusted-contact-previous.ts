// Frozen row schemas and identities from core alpha.29 / modules alpha.39, before contact recovery.
export const previousContactArchiveReleases = {
  'ordinary-poll-votes': {
    identity: {
      codeHash: 'f30ab36ed65a71b308c7cd641606cc14ae9469c933d4a884e1b9c6b1ff10f06c',
      rawAbiHash: '2268cd779edfda686b5b5533ea1a9f8b771952b43c2628cdda28ac5e30e44511',
      schemaHash: '9699cf43a51a515f89dc8ef08d161efbbe70ac999332292980bf7dfa007b9917',
      rowType: 'vote_record',
    },
    abi: {
      version: 'eosio::abi/1.2',
      types: [],
      structs: [
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
      ],
      actions: [],
      tables: [],
      variants: [],
    },
  },
  'document-versions': {
    identity: {
      codeHash: 'e40c7854b7354df2147097ccf2e63a4e8b6cd94f10d90427865a62458b484843',
      rawAbiHash: '9fdcb373b35afe51db8447604e19866ce43d1783db992a018e5f59481e999038',
      schemaHash: '58269638867165b22224dbaa58ce502a2bb08178d4949ee685c6eaf738473ed3',
      rowType: 'document_record',
    },
    abi: {
      version: 'eosio::abi/1.2',
      types: [],
      structs: [
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
      ],
      actions: [],
      tables: [],
      variants: [],
    },
  },
  'quick-ballot-responses': {
    identity: {
      codeHash: 'c54fb4ff71c159c60d6d0bc461d8f5a1185d564995f9cf07590fb48a27fb75dd',
      rawAbiHash: 'f259cd6b5925a8467308fae2509457b45b8e77187360ea3d7a985edbd09f5ab5',
      schemaHash: 'df124c69715167a4e3d14994f0547d4365294005a11496bb553e9bdf4ed2e010',
      rowType: 'quick_response',
    },
    abi: {
      version: 'eosio::abi/1.2',
      types: [],
      structs: [
        {
          name: 'quick_response',
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
              name: 'ballot_id',
              type: 'uint64',
            },
            {
              name: 'identity',
              type: 'checksum256',
            },
            {
              name: 'revision',
              type: 'uint64',
            },
            {
              name: 'active',
              type: 'bool',
            },
            {
              name: 'ciphertext',
              type: 'bytes',
            },
            {
              name: 'proof',
              type: 'bytes',
            },
            {
              name: 'receipt',
              type: 'bytes',
            },
            {
              name: 'updated_at',
              type: 'uint32',
            },
          ],
        },
      ],
      actions: [],
      tables: [],
      variants: [],
    },
  },
  'quick-ballot-grants': {
    identity: {
      codeHash: 'c54fb4ff71c159c60d6d0bc461d8f5a1185d564995f9cf07590fb48a27fb75dd',
      rawAbiHash: 'f259cd6b5925a8467308fae2509457b45b8e77187360ea3d7a985edbd09f5ab5',
      schemaHash: 'b4002d24c3ca57af2189677753afccb9c23910dc93bceb60f4e654f91cbe1f48',
      rowType: 'quick_grant',
    },
    abi: {
      version: 'eosio::abi/1.2',
      types: [],
      structs: [
        {
          name: 'quick_grant',
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
              name: 'grants',
              type: 'bytes[]',
            },
          ],
        },
      ],
      actions: [],
      tables: [],
      variants: [],
    },
  },
};
