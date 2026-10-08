ALTER TABLE archive_exports
  ADD COLUMN provider_scope text CHECK(provider_scope IS NULL OR length(provider_scope) BETWEEN 1 AND 128),
  ADD COLUMN request jsonb,
  ADD COLUMN maximum_stored_bytes bigint CHECK(maximum_stored_bytes IS NULL OR maximum_stored_bytes>0),
  ADD COLUMN manifest_request_id uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE archive_chunks ADD COLUMN asset_request_id uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE archive_storage_holds ADD CONSTRAINT archive_hold_export FOREIGN KEY(id) REFERENCES archive_exports(id);
CREATE FUNCTION freeze_archive_transport() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(NEW.provider_scope,NEW.request,NEW.maximum_stored_bytes,NEW.manifest_request_id)
    IS DISTINCT FROM ROW(OLD.provider_scope,OLD.request,OLD.maximum_stored_bytes,OLD.manifest_request_id) THEN
    RAISE EXCEPTION 'ARCHIVE_DOMAIN_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  IF OLD.verified_at IS NOT NULL AND NEW.verified_at IS DISTINCT FROM OLD.verified_at THEN
    RAISE EXCEPTION 'ARCHIVE_VERIFICATION_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER archive_transport_immutable BEFORE UPDATE ON archive_exports FOR EACH ROW EXECUTE FUNCTION freeze_archive_transport();
CREATE FUNCTION freeze_archive_asset_request() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.asset_request_id IS DISTINCT FROM OLD.asset_request_id
    OR (OLD.verified_at IS NOT NULL AND NEW.verified_at IS DISTINCT FROM OLD.verified_at) THEN
    RAISE EXCEPTION 'ARCHIVE_CHUNK_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER archive_asset_request_immutable BEFORE UPDATE ON archive_chunks FOR EACH ROW EXECUTE FUNCTION freeze_archive_asset_request();
