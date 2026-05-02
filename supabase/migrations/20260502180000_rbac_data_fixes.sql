-- 1. Ensure Roles Exist
INSERT INTO public.roles (name, description)
VALUES 
    ('Admin', 'Full system access'),
    ('Sales Manager', 'Managerial access to sales data'),
    ('Sales Rep', 'Standard sales access')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 2. Foreign Key Fixes for Leads Integration
-- Ensure deals can be linked to leads
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL;

-- Ensure tasks can be linked to leads
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL;

-- 3. Cleanup duplicate role assignment function if any
DROP FUNCTION IF EXISTS public.assign_default_role(UUID);
