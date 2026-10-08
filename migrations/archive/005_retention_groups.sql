-- Backfill complete verified transports after the host ledger exists.
INSERT INTO hosted_archive_members(dao_key,provider_scope,bundle_key,object_id)
SELECT e.dao_key,e.provider_scope,'export:'||e.id::text,u.storage_object_id
FROM archive_exports e JOIN asset_uploads u ON u.account_id=e.requested_by AND u.request_id=e.manifest_request_id
WHERE e.state IN ('verified','approved','pruning','completed') AND u.storage_object_id IS NOT NULL
UNION
SELECT e.dao_key,e.provider_scope,'export:'||e.id::text,c.storage_object_id
FROM archive_exports e JOIN archive_chunks c ON c.export_id=e.id
WHERE e.state IN ('verified','approved','pruning','completed') AND c.state='verified' AND c.storage_object_id IS NOT NULL;
