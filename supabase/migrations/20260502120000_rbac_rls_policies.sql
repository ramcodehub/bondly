-- RBAC Security Policies & Access Control
-- Tables: profiles, roles, user_roles

-- 1. Enable RLS
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Helper Functions
-- Unified Admin check with case-insensitivity and secure execution context
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND LOWER(r.name) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Profiles Policies
DO $$ BEGIN
    -- View own profile
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles
        FOR SELECT TO authenticated USING (auth.uid() = id);
    END IF;

    -- Update own profile
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
        FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
    END IF;

    -- Insert profile on signup (Critical for triggering handle_new_user and client-side fallbacks)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow profile insertion on signup' AND tablename = 'profiles') THEN
        CREATE POLICY "Allow profile insertion on signup" ON public.profiles
        FOR INSERT TO anon, authenticated 
        WITH CHECK (true);
    END IF;
END $$;

-- 4. Roles Policies
DO $$ BEGIN
    -- View roles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view roles' AND tablename = 'roles') THEN
        CREATE POLICY "Authenticated users can view roles" ON public.roles
        FOR SELECT TO authenticated USING (true);
    END IF;

    -- Protect roles from modification
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users cannot modify roles' AND tablename = 'roles') THEN
        CREATE POLICY "Authenticated users cannot modify roles" ON public.roles
        FOR ALL TO authenticated USING (false) WITH CHECK (false);
    END IF;
END $$;

-- 5. User Roles Policies
DO $$ BEGIN
    -- View own roles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own roles' AND tablename = 'user_roles') THEN
        CREATE POLICY "Users can view own roles" ON public.user_roles
        FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;

    -- Admin management (Insert, Update, Delete)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all user roles' AND tablename = 'user_roles') THEN
        CREATE POLICY "Admins can manage all user roles" ON public.user_roles
        FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
    END IF;
END $$;
