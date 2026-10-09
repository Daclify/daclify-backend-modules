// Retain these trusted source identities across later contract upgrades.
export const qualifiedResourceCheckpoint = {
  poll: {
    codeHash: 'feb9bb8b7abd222113971d8bd608e90b52827f9a2c34ebd438396428d34174c5',
    rawAbiHash: '52bb5b61fe685721a232eec5db9b52208de2490c3ac62450c4dd6a2dba46392b',
    schemaHash: 'c16a22001c0f8972d8ce4610bc4cb024f64497ef2af9e87aade69a4b6a8d59b7',
    rowType: 'vote_record',
  },
  document: {
    codeHash: '5a7d037c3e9557b123edfaedbc1248b9a01f8c27f85c11f99d1e63acd5dd3c1a',
    rawAbiHash: '67a145958f042b374192f68ffa0d3325248b5435adf429d2a8891b2091c707d3',
    schemaHash: '0924c9553b2fa609f255c85475b8835b111789e8d6abb88982775b0b06d1fed1',
    rowType: 'document_record',
  },
};

// Exact native-qualified document checkpoint preceding automatic allowances; row layout is unchanged.
export const documentReferencesIdentity = {
  codeHash: '0d55e35ffa98cadf8646a858228533ad8b53974f16a8776141b1d8bc6c412a99',
  rawAbiHash: 'ec269800f4772be31c95b5d236dc31970515d91a12e1ca8e8a33bc8ff90a0851',
  schemaHash: '265abe13cb27cf94717121aad1a5010c65598326327b870d9da771c75f4f173b',
};

export const documentReferencePollIdentity = {
  codeHash: 'f7d8333d7e71456668aa4a78ca8f2e7dac8a784b95cdcaa30ffe309e49ae7eb1',
  rawAbiHash: '809d5a2efc9f638f6e1eda00ebaf507490d074dcc129b933390913085c64e3d8',
  schemaHash: '0e4ee077734a195f9bbc3d337851d33eca1435b5f7aa43b3bcf859da7ed3f963',
};

// Native-qualified allocation/document recovery checkpoint; original document row layout is unchanged.
export const documentAllocationIdentity = {
  codeHash: '9d05dbedf1fd8b81eb312bc33a16f0449afa1c0e2b7127cfc3dd3feb774277e0',
  rawAbiHash: '4ac41f5aa0178b751675f1c7239580cf9984f141361eb82269f149ddf32e9e8c',
  schemaHash: '6079db548124d589855edf609cace967501b62c5356d69ac11a0f5f7e42eba39',
};

// Native-qualified fixed metadata checkpoint; document row serialization did not change.
export const documentPreallocatedIdentity = {
  codeHash: '9a6691b98cc168134625f9e76d812a670dc8085b2605c4dff6af9851cefe93ea',
  rawAbiHash: '4ac41f5aa0178b751675f1c7239580cf9984f141361eb82269f149ddf32e9e8c',
  schemaHash: '6079db548124d589855edf609cace967501b62c5356d69ac11a0f5f7e42eba39',
};

export const preallocatedPollIdentity = {
  codeHash: '2543f510a1a8a6a76ebab92e1856bb6c639c486d52d83547588fa2bd8e9fb8ba',
  rawAbiHash: '809d5a2efc9f638f6e1eda00ebaf507490d074dcc129b933390913085c64e3d8',
  schemaHash: '0e4ee077734a195f9bbc3d337851d33eca1435b5f7aa43b3bcf859da7ed3f963',
};

export const receiptHoldDocumentIdentity = {
  codeHash: 'd11d0da5de949014ec13c9cf4f4f9f7c8271dd9f05c0d84614e409adbef99b85',
  rawAbiHash: 'a0f3223045f4a9cd98ad99b4cb5a8fd8cb9aa7a57f1c1d462ad77dc94b36d6b2',
  schemaHash: '5094dc2ac6e2487b926b0bf7abbc10dce534e082cc31adbf01d81a9fb49b84e7',
};
export const receiptHoldPollIdentity = {
  codeHash: '8ce43efdf75bbc3a604be2085d7a79f964d855ac55baa0da2cab23025030b7a6',
  rawAbiHash: '809d5a2efc9f638f6e1eda00ebaf507490d074dcc129b933390913085c64e3d8',
  schemaHash: '0e4ee077734a195f9bbc3d337851d33eca1435b5f7aa43b3bcf859da7ed3f963',
};
export const completedHoldDocumentIdentity = {
  codeHash: 'd5f4af5867d38339cb6bbf08fc2ac9c5e90a275bfb050013efc26860d9eb2fb7',
  rawAbiHash: 'a0f3223045f4a9cd98ad99b4cb5a8fd8cb9aa7a57f1c1d462ad77dc94b36d6b2',
  schemaHash: '5094dc2ac6e2487b926b0bf7abbc10dce534e082cc31adbf01d81a9fb49b84e7',
};
export const completedHoldPollIdentity = {
  codeHash: '4cf20ecedac8994c55fd78804a9053a2bc5cb456a86cf4a5e4dbbd7e6e66d6a2',
  rawAbiHash: '51651c1542e9b8971509cf84f7c4180f7f7bc9d8bdb166584105fade245d1ef3',
  schemaHash: '2650fe6fe11af88b8a161e6bfed2b2ede8d1f59d503dcbd3a7c02cb9d8784871',
};

export const migrationKernelDocumentIdentity = {
  codeHash: '3b7b2d9f692bc019d442d217c4af0bacca385b4aa1d6e186e30ec29c7d442216',
  rawAbiHash: 'eaf5181a0d4b7241dca45573cc78a9af6fd3ad0acbbc11a019b32205ecbff219',
  schemaHash: '8b9358982109c78339ac7978144226f3884c26c788e44b11789f8faa78b3e2ae',
};
export const migrationKernelPollIdentity = {
  codeHash: '7d1c5b17097902d211b2c2e8a819ef8c856179e8079b87453c35c828f181bfda',
  rawAbiHash: 'f841368ff5fe76a1e7c7cedf5b680569067dc62cdbfb86e171817ce98cf568f6',
  schemaHash: 'eddce53bdf3c9373ff2f4fc844014eb0eb6a556534213f8f6eb10e450b6beea7',
};

export const migrationControllerDocumentIdentity = {
  codeHash: '1e3c9c7117098be1960e9d27596672a22c8595060c2bd09ef38be197f1f0a78f',
  rawAbiHash: '39ae39d2f412bf3623f4d53daea89193415cc6fcafb3a52f149c4337a196fac9',
  schemaHash: '5a7e4187cad00434817d16d9512ef3b2527876ad2c5a1b960eedd818a0e4c4cf',
};
export const migrationControllerPollIdentity = {
  codeHash: '3a5e0a411b9d0e6db15421ff091119c1b01d2bfbe3a484320df9fd0e5cf82d3c',
  rawAbiHash: 'ca0ba4033f95c6b47815464de3bf3b246e5dec7e6007322a8980b04e327d0e40',
  schemaHash: '98c193f78c6de82e2510a86e5c64469b2997061d8f4080993552279fb93ad3df',
};
