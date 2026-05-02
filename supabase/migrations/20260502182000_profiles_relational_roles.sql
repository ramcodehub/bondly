-- 1. Ensure Roles Exist (Pre-check for migration safety)
INSERT INTO public.roles (name, description)
VALUES 
    ('Admin', 'Full system access'),
    ('Sales Rep', 'Standard sales access')
ON CONFLICT (name) DO NOTHING;

-- 2. Schema Migration: Transition Profiles to Relational Roles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL;

-- 3. Data Migration: Map existing to role_id
DO $$ 
DECLARE 
    sales_rep_id UUID;
BEGIN
    -- Get default role ID
    SELECT id INTO sales_rep_id FROM public.roles WHERE name = 'Sales Rep' LIMIT 1;
    
    -- If still null, create it (failsafe)
    IF sales_rep_id IS NULL THEN
        INSERT INTO public.roles (name, description) VALUES ('Sales Rep', 'Standard sales access') RETURNING id INTO sales_rep_id;
    END IF;

    -- Update profiles based on text 'role' column if it exists
    -- Wrap in exception block in case 'role' column is already gone
    BEGIN
        EXECUTE 'UPDATE public.profiles p SET role_id = r.id FROM public.roles r WHERE LOWER(p.role) = LOWER(r.name)';
    EXCEPTION WHEN undefined_column THEN
        -- Column already dropped or doesn't exist, ignore
    END;

    -- Ensure all profiles have a role_id
    UPDATE public.profiles SET role_id = sales_rep_id WHERE role_id IS NULL;
END $$;

-- 4. Finalize Schema
-- Only drop 'role' if 'role_id' was successfully populated
ALTER TABLE public.profiles ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 5. Updated RBAC Policy for Admin Role Management
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6. Trigger Update: Relational role_id support
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role_id UUID;
BEGIN
  SELECT id INTO default_role_id FROM public.roles WHERE name = 'Sales Rep' LIMIT 1;

  INSERT INTO public.profiles (id, full_name, email, avatar_url, role_id, status)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), 
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(default_role_id, (SELECT id FROM public.roles WHERE name = 'Sales Rep' LIMIT 1)),
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
