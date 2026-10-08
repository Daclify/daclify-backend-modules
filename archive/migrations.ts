// Packaged SQL is applied by the host's existing hash-checked migration coordinator.
export const ArchiveMigrations = Object.freeze([
  {
    namespace: 'archive',
    name: '001_exports.sql',
    url: new URL('../../migrations/archive/001_exports.sql', import.meta.url),
  },
  {
    namespace: 'archive',
    name: '002_transport.sql',
    url: new URL('../../migrations/archive/002_transport.sql', import.meta.url),
  },
]);
