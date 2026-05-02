-- Phase 1: Ensure RLS Active
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Phase 2: Function Hardening
ALTER FUNCTION public.has_permission(TEXT) SET search_path = public;

REVOKE ALL ON FUNCTION public.is_service_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_service_role() TO authenticated;

-- Phase 3: Ensure Audit Trigger Exists
DROP TRIGGER IF EXISTS audit_deals ON public.deals;
CREATE TRIGGER audit_deals
AFTER INSERT OR UPDATE OR DELETE ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.log_audit();

-- Phase 4: Performance Index
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);

-- Phase 5: Audit Log Access Control
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT TO authenticated
USING (public.has_permission('users.manage'));
