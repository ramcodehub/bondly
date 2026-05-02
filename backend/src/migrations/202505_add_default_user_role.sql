-- Migration: Add default user role
-- Description: Add the default 'user' role that is assigned to new users

-- Insert the default 'user' role
INSERT INTO public.roles (name, description)
VALUES
  ('user', 'Default role for all authenticated users')
ON CONFLICT (name) DO NOTHING;

-- Grant permissions for authenticated users
GRANT SELECT ON public.roles TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;