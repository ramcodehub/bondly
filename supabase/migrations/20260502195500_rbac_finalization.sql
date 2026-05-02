-- Phase 1, 2, 3: Hardened Helper Functions and service_role Bypass
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN current_setting('request.jwt.claim.role', true) = 'service_role';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.has_permission(p_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.role_permissions rp ON p.role_id = rp.role_id
        JOIN public.permissions perm ON rp.permission_id = perm.id
        WHERE p.id = auth.uid()
        AND p.role_id IS NOT NULL -- Phase 2: Null-safe check
        AND perm.name = p_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Phase 1: Function Security Hardening
REVOKE ALL ON FUNCTION public.has_permission(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_service_role() TO authenticated;

-- Phase 3: Update RLS Policies with service_role bypass
DROP POLICY IF EXISTS "Allow read deals with permission" ON public.deals;
CREATE POLICY "Allow read deals with permission"
ON public.deals FOR SELECT TO authenticated
USING (public.is_service_role() OR public.has_permission('deals.read'));

DROP POLICY IF EXISTS "Allow create deals with permission" ON public.deals;
CREATE POLICY "Allow create deals with permission"
ON public.deals FOR INSERT TO authenticated
WITH CHECK (public.is_service_role() OR public.has_permission('deals.create'));

DROP POLICY IF EXISTS "Allow update deals with permission" ON public.deals;
CREATE POLICY "Allow update deals with permission"
ON public.deals FOR UPDATE TO authenticated
USING (public.is_service_role() OR public.has_permission('deals.update'));

DROP POLICY IF EXISTS "Allow delete deals with permission" ON public.deals;
CREATE POLICY "Allow delete deals with permission"
ON public.deals FOR DELETE TO authenticated
USING (public.is_service_role() OR public.has_permission('deals.delete'));

-- Phase 6: DB-level Audit Log Trigger
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS trigger AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    INSERT INTO public.audit_logs(user_id, action, resource, metadata)
    VALUES (
        v_user_id,
        TG_OP,
        TG_TABLE_NAME,
        row_to_json(CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END)
    );
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS audit_deals ON public.deals;
CREATE TRIGGER audit_deals
AFTER INSERT OR UPDATE OR DELETE ON public.deals
FOR EACH ROW EXECUTE FUNCTION public.log_audit();
