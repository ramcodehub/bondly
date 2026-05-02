-- Migration to add the default 'user' role
-- This role is assigned to all authenticated users by default

INSERT INTO public.roles (name, description)
VALUES ('user', 'Default role for all authenticated users')
ON CONFLICT (name) DO NOTHING;