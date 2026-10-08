CREATE FUNCTION freeze_archive_anchor_binding() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.anchor_id IS NOT NULL AND ROW(NEW.anchor_id,NEW.anchor_transaction) IS DISTINCT FROM ROW(OLD.anchor_id,OLD.anchor_transaction) THEN
    RAISE EXCEPTION 'ARCHIVE_ANCHOR_IMMUTABLE' USING ERRCODE='23514';
  END IF;
  IF (NEW.anchor_id IS NULL) <> (NEW.anchor_transaction IS NULL) THEN
    RAISE EXCEPTION 'ARCHIVE_ANCHOR_BINDING' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER archive_anchor_binding BEFORE UPDATE ON archive_exports FOR EACH ROW EXECUTE FUNCTION freeze_archive_anchor_binding();
