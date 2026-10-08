CREATE TABLE archive_exports (
  id uuid PRIMARY KEY,
  request_id uuid NOT NULL,
  requested_by uuid NOT NULL REFERENCES accounts(id),
  request_hash bytea NOT NULL CHECK(octet_length(request_hash)=32),
  dao_key text NOT NULL,
  dao jsonb NOT NULL,
  source text NOT NULL,
  source_code_hash text NOT NULL CHECK(source_code_hash ~ '^[a-f0-9]{64}$'),
  source_abi_hash text NOT NULL CHECK(source_abi_hash ~ '^[a-f0-9]{64}$'),
  snapshot_number bigint NOT NULL CHECK(snapshot_number BETWEEN 1 AND 4294967295),
  snapshot_id text NOT NULL CHECK(snapshot_id ~ '^[a-f0-9]{64}$'),
  snapshot_time timestamptz NOT NULL,
  plan jsonb NOT NULL,
  state text NOT NULL DEFAULT 'planned' CHECK(state IN ('planned','exporting','pinned','verified','approved','pruning','completed','failed','review')),
  manifest jsonb,
  manifest_cid text,
  manifest_bytes integer CHECK(manifest_bytes BETWEEN 1 AND 5242880),
  manifest_commitment text CHECK(manifest_commitment ~ '^[a-f0-9]{64}$'),
  descriptor_commitment text CHECK(descriptor_commitment ~ '^[a-f0-9]{64}$'),
  verified_at timestamptz,
  backup_verified_at timestamptz,
  anchor_id text CHECK(anchor_id ~ '^[1-9][0-9]{0,19}$'),
  anchor_transaction text CHECK(anchor_transaction ~ '^[a-f0-9]{64}$'),
  last_error_code text CHECK(last_error_code ~ '^[A-Z_]+$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(requested_by,request_id),
  CHECK(dao ?& ARRAY['chainId','contract','daoId','interfaceVersion'] AND dao->>'interfaceVersion'='1'),
  CHECK(dao_key='["' || (dao->>'chainId') || '","' || (dao->>'contract') || '","' || (dao->>'daoId') || '"]'),
  CHECK(manifest_cid IS NULL OR (manifest IS NOT NULL AND manifest_bytes IS NOT NULL AND manifest_commitment IS NOT NULL AND descriptor_commitment IS NOT NULL)),
  CHECK(state NOT IN ('pinned','verified','approved','pruning','completed') OR manifest_cid IS NOT NULL),
  CHECK(state NOT IN ('verified','approved','pruning','completed') OR verified_at IS NOT NULL),
  CHECK(state NOT IN ('approved','pruning','completed') OR (backup_verified_at IS NOT NULL AND anchor_id IS NOT NULL AND anchor_transaction IS NOT NULL))
);
CREATE INDEX archive_exports_dao ON archive_exports(dao_key,created_at,id);
CREATE TABLE archive_chunks (
  export_id uuid NOT NULL REFERENCES archive_exports(id),
  family integer NOT NULL CHECK(family BETWEEN 0 AND 63),
  ordinal integer NOT NULL CHECK(ordinal BETWEEN 0 AND 1023),
  domain jsonb NOT NULL,
  root text NOT NULL CHECK(root ~ '^[a-f0-9]{64}$'),
  first_key numeric(20,0) NOT NULL CHECK(first_key BETWEEN 0 AND 18446744073709551615),
  last_key numeric(20,0) NOT NULL CHECK(last_key BETWEEN first_key AND 18446744073709551615),
  rows integer NOT NULL CHECK(rows BETWEEN 1 AND 65536),
  expected_bytes integer NOT NULL CHECK(expected_bytes BETWEEN 188 AND 5242880),
  commitment text NOT NULL CHECK(commitment ~ '^[a-f0-9]{64}$'),
  state text NOT NULL DEFAULT 'planned' CHECK(state IN ('planned','uploading','pinned','verified','review')),
  cid text,
  storage_object_id uuid REFERENCES hosted_objects(id),
  verified_at timestamptz,
  PRIMARY KEY(export_id,family,ordinal),
  CHECK(state NOT IN ('pinned','verified') OR (cid IS NOT NULL AND storage_object_id IS NOT NULL)),
  CHECK(state<>'verified' OR verified_at IS NOT NULL)
);
CREATE FUNCTION freeze_archive_export_domain() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(NEW.id,NEW.request_id,NEW.requested_by,NEW.request_hash,NEW.dao_key,NEW.dao,NEW.source,NEW.source_code_hash,NEW.source_abi_hash,NEW.snapshot_number,NEW.snapshot_id,NEW.snapshot_time,NEW.plan)
    IS DISTINCT FROM ROW(OLD.id,OLD.request_id,OLD.requested_by,OLD.request_hash,OLD.dao_key,OLD.dao,OLD.source,OLD.source_code_hash,OLD.source_abi_hash,OLD.snapshot_number,OLD.snapshot_id,OLD.snapshot_time,OLD.plan) THEN
    RAISE EXCEPTION 'ARCHIVE_DOMAIN_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  IF OLD.manifest_cid IS NOT NULL AND ROW(NEW.manifest,NEW.manifest_cid,NEW.manifest_bytes,NEW.manifest_commitment,NEW.descriptor_commitment)
    IS DISTINCT FROM ROW(OLD.manifest,OLD.manifest_cid,OLD.manifest_bytes,OLD.manifest_commitment,OLD.descriptor_commitment) THEN
    RAISE EXCEPTION 'ARCHIVE_MANIFEST_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER archive_export_domain_immutable BEFORE UPDATE ON archive_exports FOR EACH ROW EXECUTE FUNCTION freeze_archive_export_domain();
CREATE FUNCTION freeze_archive_chunk_domain() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(NEW.export_id,NEW.family,NEW.ordinal,NEW.domain,NEW.root,NEW.first_key,NEW.last_key,NEW.rows,NEW.expected_bytes,NEW.commitment)
    IS DISTINCT FROM ROW(OLD.export_id,OLD.family,OLD.ordinal,OLD.domain,OLD.root,OLD.first_key,OLD.last_key,OLD.rows,OLD.expected_bytes,OLD.commitment) THEN
    RAISE EXCEPTION 'ARCHIVE_CHUNK_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  IF OLD.cid IS NOT NULL AND ROW(NEW.cid,NEW.storage_object_id) IS DISTINCT FROM ROW(OLD.cid,OLD.storage_object_id) THEN
    RAISE EXCEPTION 'ARCHIVE_CHUNK_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER archive_chunk_domain_immutable BEFORE UPDATE ON archive_chunks FOR EACH ROW EXECUTE FUNCTION freeze_archive_chunk_domain();
