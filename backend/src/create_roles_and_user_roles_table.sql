-- create_roles_and_user_roles_table.sql
CREATE TABLE IF NOT EXISTS public.roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL, -- e.g., 'Admin', 'Marketing Agent'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Seed baseline roles
INSERT INTO public.roles (name, description)
VALUES
  ('Admin', 'Full administrative access'),
  ('Marketing Manager', 'Manage campaigns and marketing reports'),
  ('Marketing Agent', 'Execute marketing tasks and campaigns'),
  ('Sales Manager', 'Oversee sales team and pipelines'),
  ('Sales Representative', 'Manage leads and deals')
ON CONFLICT (name) DO NOTHING;