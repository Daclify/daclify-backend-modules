CREATE TABLE archive_backups (
  export_id uuid PRIMARY KEY REFERENCES archive_exports(id),
  receipt jsonb NOT NULL,
  CHECK(receipt ?& ARRAY['formatVersion','storeId','keyId','commitment','manifestCommitment','bytes','verifiedAt']),
  CHECK(receipt->>'formatVersion'='1'),
  CHECK(receipt->>'commitment' ~ '^[a-f0-9]{64}$' AND receipt->>'manifestCommitment' ~ '^[a-f0-9]{64}$'),
  CHECK(receipt->>'storeId' ~ '^[A-Za-z0-9_.:-]{1,128}$' AND receipt->>'keyId' ~ '^[A-Za-z0-9_.:-]{1,128}$'),
  CHECK(receipt->>'bytes' ~ '^[1-9][0-9]{0,8}$' AND (receipt->>'bytes')::bigint <= 134217728),
  CHECK(jsonb_typeof(receipt->'verifiedAt')='string')
);
CREATE FUNCTION freeze_archive_backup() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'ARCHIVE_BACKUP_IMMUTABLE' USING ERRCODE='23514';
END;
$$;
CREATE TRIGGER archive_backup_immutable BEFORE UPDATE OR DELETE ON archive_backups FOR EACH ROW EXECUTE FUNCTION freeze_archive_backup();
CREATE FUNCTION bind_archive_backup() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  manifest_hash text;
BEGIN
  SELECT manifest_commitment INTO manifest_hash FROM archive_exports WHERE id=NEW.export_id;
  IF manifest_hash IS NULL OR manifest_hash IS DISTINCT FROM NEW.receipt->>'manifestCommitment' THEN
    RAISE EXCEPTION 'ARCHIVE_BACKUP_DOMAIN' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER archive_backup_domain BEFORE INSERT ON archive_backups FOR EACH ROW EXECUTE FUNCTION bind_archive_backup();
CREATE FUNCTION freeze_archive_backup_verification() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.backup_verified_at IS NOT NULL AND NEW.backup_verified_at IS DISTINCT FROM OLD.backup_verified_at THEN
    RAISE EXCEPTION 'ARCHIVE_BACKUP_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  IF NEW.backup_verified_at IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM archive_backups WHERE export_id=NEW.id
      AND receipt->>'manifestCommitment'=NEW.manifest_commitment
      AND (receipt->>'verifiedAt')::timestamptz=NEW.backup_verified_at
  ) THEN
    RAISE EXCEPTION 'ARCHIVE_BACKUP_REQUIRED' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER archive_backup_verification BEFORE UPDATE ON archive_exports FOR EACH ROW EXECUTE FUNCTION freeze_archive_backup_verification();
