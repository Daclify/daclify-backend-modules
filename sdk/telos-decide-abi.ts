// Action subset derived from the live Telos Decide ABI, 11 October 2026.
// Signing still requires configured deployed code/ABI hash pins.
export const telosDecideAbi = {
  version: 'eosio::abi/1.1',
  types: [],
  structs: [
    {
      name: 'castvote',
      base: '',
      fields: [
        {
          name: 'voter',
          type: 'name',
        },
        {
          name: 'ballot_name',
          type: 'name',
        },
        {
          name: 'options',
          type: 'name[]',
        },
      ],
    },
    {
      name: 'regvoter',
      base: '',
      fields: [
        {
          name: 'voter',
          type: 'name',
        },
        {
          name: 'treasury_symbol',
          type: 'symbol',
        },
        {
          name: 'referrer',
          type: 'name?',
        },
      ],
    },
  ],
  actions: [
    {
      name: 'castvote',
      type: 'castvote',
      ricardian_contract: '',
    },
    {
      name: 'regvoter',
      type: 'regvoter',
      ricardian_contract: '',
    },
  ],
  tables: [],
  ricardian_clauses: [],
  variants: [],
};
