-- Phase 1: Create Permission Tables
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated read on permissions" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on role_permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);

-- Phase 2: Seed Default Permissions
INSERT INTO public.permissions (name, module, action)
VALUES 
    ('deals.read', 'deals', 'read'),
    ('deals.create', 'deals', 'create'),
    ('deals.update', 'deals', 'update'),
    ('deals.delete', 'deals', 'delete'),
    ('contacts.read', 'contacts', 'read'),
    ('contacts.create', 'contacts', 'create'),
    ('dashboard.view', 'dashboard', 'view'),
    ('users.manage', 'users', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Phase 3: Map Roles to Permissions
DO $$
DECLARE
    admin_id UUID;
    sales_rep_id UUID;
    sales_manager_id UUID;
    perm_id UUID;
BEGIN
    -- Get Role IDs
    SELECT id INTO admin_id FROM public.roles WHERE name = 'Admin' LIMIT 1;
    SELECT id INTO sales_rep_id FROM public.roles WHERE name = 'Sales Rep' LIMIT 1;
    SELECT id INTO sales_manager_id FROM public.roles WHERE name = 'Sales Manager' LIMIT 1;

    -- If Sales Manager doesn't exist, create it (safe fallback)
    IF sales_manager_id IS NULL THEN
        INSERT INTO public.roles (name, description) VALUES ('Sales Manager', 'Sales management access') RETURNING id INTO sales_manager_id;
    END IF;

    -- 1. Admin Permissions (ALL)
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT admin_id, id FROM public.permissions
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- 2. Sales Rep Permissions
    -- deals.read, deals.create, contacts.read
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT sales_rep_id, id FROM public.permissions WHERE name IN ('deals.read', 'deals.create', 'contacts.read')
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- 3. Sales Manager Permissions
    -- deals.read, deals.update, contacts.read
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT sales_manager_id, id FROM public.permissions WHERE name IN ('deals.read', 'deals.update', 'contacts.read')
    ON CONFLICT (role_id, permission_id) DO NOTHING;

END $$;
