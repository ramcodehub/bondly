-- Migration: Create RLS policies for roles and user_roles tables
-- Description: Set up Row Level Security policies for RBAC tables

-- RLS policies for roles table
-- Allow authenticated users to read roles
CREATE POLICY "Allow authenticated users to read roles" 
ON public.roles 
FOR SELECT 
TO authenticated 
USING (true);

-- RLS policies for user_roles table
-- Allow users to read their own roles
CREATE POLICY "Allow users to read their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Allow admin users to manage all user roles
CREATE POLICY "Allow admin users to manage all user roles" 
ON public.user_roles 
FOR ALL 
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

-- Allow users to read roles of users they have access to
CREATE POLICY "Allow users to read roles of accessible users" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.role_id = ur2.role_id
    WHERE ur1.user_id = auth.uid()
  )
);

-- Grant necessary permissions
GRANT ALL ON public.roles TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;