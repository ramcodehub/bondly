-- Phase 1: Audit Trigger DELETE/Anon Fix
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.audit_logs(user_id, action, resource, metadata)
    VALUES (
        COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'),
        TG_OP,
        TG_TABLE_NAME,
        row_to_json(CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END)
    );

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Phase 3: Harden Service Role Check
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(current_setting('request.jwt.claim.role', true), '') = 'service_role';
END;
$$ LANGUAGE plpgsql;

-- Phase 4: Function Security Lockdown
REVOKE ALL ON FUNCTION public.has_permission(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_service_role() TO authenticated;

-- Phase 2: Fix RLS UPDATE Policy (Security Gap)
DROP POLICY IF EXISTS "Allow update deals with permission" ON public.deals;
CREATE POLICY "Allow update deals with permission"
ON public.deals FOR UPDATE TO authenticated
USING (public.is_service_role() OR public.has_permission('deals.update'))
WITH CHECK (public.is_service_role() OR public.has_permission('deals.update'));

-- Phase 5: Final Performance Indexes
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles(role_id);
