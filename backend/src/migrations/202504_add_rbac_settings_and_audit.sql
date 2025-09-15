-- Migration: Add RBAC settings and audit trail
-- Description: Add feature flag for RBAC and audit trail for role assignments

-- Create rbac_settings table for feature flag control
CREATE TABLE IF NOT EXISTS public.rbac_settings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  enforce_roles BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to table for documentation
COMMENT ON TABLE public.rbac_settings IS 'RBAC feature flag settings - controls whether roles are enforced';

-- Create role_audit table for tracking role assignments/unassignments
CREATE TABLE IF NOT EXISTS public.role_audit (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL CHECK (action IN ('ASSIGNED', 'UNASSIGNED', 'MODIFIED')),
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Add comment to table for documentation
COMMENT ON TABLE public.role_audit IS 'Audit trail for role assignments and changes';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rbac_settings_enforce ON public.rbac_settings(enforce_roles);
CREATE INDEX IF NOT EXISTS idx_role_audit_user_id ON public.role_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_role_id ON public.role_audit(role_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_action ON public.role_audit(action);
CREATE INDEX IF NOT EXISTS idx_role_audit_assigned_at ON public.role_audit(assigned_at);

-- Enable RLS (Row Level Security) on both tables
ALTER TABLE public.rbac_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_audit ENABLE ROW LEVEL SECURITY;

-- Insert default RBAC settings (only if no settings exist)
INSERT INTO public.rbac_settings (enforce_roles)
SELECT false
WHERE NOT EXISTS (SELECT 1 FROM public.rbac_settings);

-- RLS policies for rbac_settings table
-- Allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read rbac settings" 
ON public.rbac_settings 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow admin users to update settings
CREATE POLICY "Allow admin users to update rbac settings" 
ON public.rbac_settings 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'Admin'
  )
);

-- RLS policies for role_audit table
-- Allow users to read their own audit records
CREATE POLICY "Allow users to read their own audit records" 
ON public.role_audit 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Allow admin users to read all audit records
CREATE POLICY "Allow admin users to read all audit records" 
ON public.role_audit 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name = 'Admin'
  )
);

-- Grant permissions
GRANT SELECT ON public.rbac_settings TO authenticated;
GRANT SELECT, UPDATE ON public.rbac_settings TO authenticated;
GRANT SELECT ON public.role_audit TO authenticated;