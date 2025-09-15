-- Migration: Create roles and user_roles tables
-- Description: Create core RBAC tables and seed baseline roles

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL, -- e.g., 'Admin', 'Marketing Agent'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

-- Enable RLS (Row Level Security) on both tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Seed baseline roles
INSERT INTO public.roles (name, description)
VALUES
  ('Admin', 'Full administrative access'),
  ('Marketing Manager', 'Manage campaigns and marketing reports'),
  ('Marketing Agent', 'Execute marketing tasks and campaigns'),
  ('Sales Manager', 'Oversee sales team and pipelines'),
  ('Sales Representative', 'Manage leads and deals')
ON CONFLICT (name) DO NOTHING;

-- Grant permissions for authenticated users
GRANT SELECT ON public.roles TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;