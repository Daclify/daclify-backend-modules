"""Independent standard-library vector for Archive descriptor/manifest v1."""
import base64
import hashlib
import json
from pathlib import Path
import struct

root = Path(__file__).parent
vector = json.loads((root / 'archive-v1.json').read_text())
domain = vector['domain']


def varuint(value):
    out = bytearray()
    while value >= 128:
        out.append((value & 127) | 128)
        value >>= 7
    out.append(value)
    return bytes(out)


def text(value):
    data = value.encode('utf-8')
    return varuint(len(data)) + data


def name(value):
    chars = '.12345abcdefghijklmnopqrstuvwxyz'
    result = 0
    for index in range(13):
        symbol = chars.index(value[index]) if index < len(value) else 0
        result |= symbol << (64 - 5 * (index + 1)) if index < 12 else symbol
    return struct.pack('<Q', result)


def domain_bytes(d):
    return (struct.pack('<H', 1) + bytes.fromhex(d['chain_id']) + name(d['runtime'])
            + struct.pack('<Q', int(d['dao_id'])) + name(d['source'])
            + bytes.fromhex(d['code_hash'] + d['abi_hash'] + d['schema_hash'])
            + name(d['table']) + struct.pack('<QII', int(d['scope']), d['chunk_ordinal'], d['leaf_count']))


packed_domain = domain_bytes(domain)
assert packed_domain.hex() == vector['domainHex']
chunk_bytes = packed_domain + varuint(len(vector['rows']))
for row in vector['rows']:
    packed = bytes.fromhex(row['packed'])
    chunk_bytes += struct.pack('<Q', int(row['primaryKey'])) + varuint(len(packed)) + packed
digest = hashlib.sha256(chunk_bytes).digest()
cid = 'b' + base64.b32encode(b'\x01\x55\x12\x20' + digest).decode().lower().rstrip('=')
chunk = dict(domain=domain, root=vector['root'], cid=cid, bytes=len(chunk_bytes), commitment=digest.hex(),
             firstKey=vector['rows'][0]['primaryKey'], lastKey=vector['rows'][-1]['primaryKey'])
family = dict(kind='ordinary-poll-votes', parentId='4', table='votes', scope=domain['scope'],
              schemaHash=domain['schema_hash'], records='3', chunks=[chunk])
manifest = dict(schemaVersion=1, dao=dict(chainId=domain['chain_id'], contract=domain['runtime'], daoId=domain['dao_id'], interfaceVersion=1),
                snapshot=dict(blockNumber=100, blockId='00000064' + 'ab' * 28, timestamp='2026-10-08T10:00:00Z'),
                source=dict(account=domain['source'], codeHash=domain['code_hash'], abiHash=domain['abi_hash']), families=[family], files=[])
packed = (struct.pack('<H', 1) + bytes.fromhex(domain['chain_id']) + name(domain['runtime'])
          + struct.pack('<Q', int(domain['dao_id'])) + name(domain['source'])
          + bytes.fromhex(domain['code_hash'] + domain['abi_hash']) + struct.pack('<I', 100)
          + bytes.fromhex(manifest['snapshot']['blockId']) + text(manifest['snapshot']['timestamp'])
          + varuint(1) + text(family['kind']) + struct.pack('<Q', 4) + name('votes')
          + struct.pack('<Q', int(domain['scope'])) + bytes.fromhex(domain['schema_hash'])
          + struct.pack('<Q', 3) + varuint(1) + packed_domain + bytes.fromhex(vector['root'])
          + text(cid) + struct.pack('<I', len(chunk_bytes)) + digest
          + struct.pack('<QQ', int(chunk['firstKey']), int(chunk['lastKey'])) + varuint(0))
manifest['descriptorCommitment'] = hashlib.sha256(packed).hexdigest()
manifest_bytes = json.dumps(manifest, separators=(',', ':'), ensure_ascii=False).encode()
native = dict(format_version=1, chain_id=domain['chain_id'], runtime=domain['runtime'], dao_id=domain['dao_id'], source=domain['source'],
              code_hash=domain['code_hash'], abi_hash=domain['abi_hash'], block_number=100,
              block_id=manifest['snapshot']['blockId'], timestamp=manifest['snapshot']['timestamp'],
              families=[dict(kind=family['kind'], parent_id='4', table='votes', scope=domain['scope'], schema_hash=domain['schema_hash'], records='3',
                             chunks=[dict(domain=domain, root=vector['root'], cid=cid, bytes=len(chunk_bytes), commitment=digest.hex(), first_key=chunk['firstKey'], last_key=chunk['lastKey'])])], files=[])
output = dict(generator='Python standard-library struct/hashlib/base64, descriptor packing v1', manifest=manifest,
              descriptorHex=packed.hex(), descriptorCommitment=manifest['descriptorCommitment'],
              manifestCommitment=hashlib.sha256(manifest_bytes).hexdigest(), nativeDescriptor=native)
(root / 'archive-manifest-v1.json').write_text(json.dumps(output, indent=2) + '\n')
