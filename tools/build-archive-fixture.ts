import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
// Owned native fixture only: age already-finalized rows before restoring the exact production WASM.
const directory = '.artifacts/archive-aged';
mkdirSync(directory, { recursive: true });
const source = readFileSync('contracts/decide/decide.cpp', 'utf8')
  .replace(
    ' ACTION markpoll(',
    ` ACTION ageterm(name runtime,uint64_t ballot_id){
 require_auth(get_self());ballots rows(get_self(),runtime.value);const auto& b=rows.get(ballot_id);check(b.status!=0,"BALLOT_OPEN");
 const uint32_t end=current_time_point().sec_since_epoch()-100*86400;
 rows.modify(b,same_payer,[&](auto& r){r.closes=end-1;});poll_ends ends(get_self(),runtime.value);ends.modify(ends.get(ballot_id),same_payer,[&](auto& r){r.completed_at=end;});
 }
 ACTION markpoll(`,
  )
  .replace('(markpoll)(prunevotes)', '(markpoll)(ageterm)(prunevotes)');
writeFileSync(directory + '/decide.cpp', source);
execFileSync(
  'docker',
  [
    'run',
    '--rm',
    '--platform',
    'linux/amd64',
    '-v',
    resolve('.') + ':/work',
    'daclify-v2-toolchain:4.1.1-spring1.2.2',
    'cdt-cpp',
    directory + '/decide.cpp',
    '-I',
    'node_modules/@daclify/core-protocol/contracts/common',
    '-I',
    'contracts/common',
    '-I',
    'contracts/vendor',
    '-o',
    directory + '/decide.wasm',
    '--abigen',
    '-contract',
    'decide',
  ],
  { stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024 },
);
