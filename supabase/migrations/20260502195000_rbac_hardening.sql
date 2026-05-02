-- Phase 1 & 4: Helper Function, Enhanced RLS, and Audit Logs
CREATE OR REPLACE FUNCTION public.has_permission(p_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.role_permissions rp ON p.role_id = rp.role_id
        JOIN public.permissions perm ON rp.permission_id = perm.id
        WHERE p.id = auth.uid()
        AND perm.name = p_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Hardening Deals table RLS
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read deals with permission" ON public.deals;
CREATE POLICY "Allow read deals with permission"
ON public.deals FOR SELECT TO authenticated
USING (public.has_permission('deals.read'));

DROP POLICY IF EXISTS "Allow create deals with permission" ON public.deals;
CREATE POLICY "Allow create deals with permission"
ON public.deals FOR INSERT TO authenticated
WITH CHECK (public.has_permission('deals.create'));

DROP POLICY IF EXISTS "Allow update deals with permission" ON public.deals;
CREATE POLICY "Allow update deals with permission"
ON public.deals FOR UPDATE TO authenticated
USING (public.has_permission('deals.update'));

DROP POLICY IF EXISTS "Allow delete deals with permission" ON public.deals;
CREATE POLICY "Allow delete deals with permission"
ON public.deals FOR DELETE TO authenticated
USING (public.has_permission('deals.delete'));

-- Phase 2: Performance Indexes
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON public.permissions(name);
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles(role_id);

-- Phase 4: Audit Log System
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS on audit_logs (Only admins can read)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read audit logs" ON public.audit_logs
FOR SELECT TO authenticated USING (public.has_permission('users.manage'));
