-- Phase 1: Enhanced Audit Logging (Old vs New)
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.audit_logs(user_id, action, resource, metadata)
    VALUES (
        COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'),
        TG_OP,
        TG_TABLE_NAME,
        jsonb_build_object(
            'old', CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) ELSE NULL END,
            'new', CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END
        )
    );

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Phase 2: Complete RLS Coverage (INSERT + SELECT)
DROP POLICY IF EXISTS "Allow insert deals with permission" ON public.deals;
CREATE POLICY "Allow insert deals with permission"
ON public.deals FOR INSERT TO authenticated
WITH CHECK (public.is_service_role() OR public.has_permission('deals.create'));

DROP POLICY IF EXISTS "Allow read deals with permission" ON public.deals;
CREATE POLICY "Allow read deals with permission"
ON public.deals FOR SELECT TO authenticated
USING (public.is_service_role() OR public.has_permission('deals.read'));

DROP POLICY IF EXISTS "Allow update deals with permission" ON public.deals;
CREATE POLICY "Allow update deals with permission"
ON public.deals FOR UPDATE TO authenticated
USING (public.is_service_role() OR public.has_permission('deals.update'))
WITH CHECK (public.is_service_role() OR public.has_permission('deals.update'));

DROP POLICY IF EXISTS "Allow delete deals with permission" ON public.deals;
CREATE POLICY "Allow delete deals with permission"
ON public.deals FOR DELETE TO authenticated
USING (public.is_service_role() OR public.has_permission('deals.delete'));
