-- Migration: Alter auth.users table for RBAC
-- Description: Add any necessary columns to auth.users table for RBAC functionality

-- Add a metadata column to auth.users if it doesn't exist
-- This is typically not needed as Supabase auth.users already has a raw_user_meta_data column
-- But we can ensure it exists for our RBAC implementation

-- Note: In Supabase, we typically don't alter the auth.users table directly
-- Instead, we use the user_roles table to manage roles
-- This migration is kept for completeness but may not be needed

-- If you need to add custom columns to auth.users, you would do it like this:
-- ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS department VARCHAR(255);
-- ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS position VARCHAR(255);

-- However, for RBAC, we recommend using the user_roles table approach
-- which is already implemented in the previous migrations

-- Grant usage on auth schema to authenticated users
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Grant select on auth.users to authenticated users
GRANT SELECT ON auth.users TO authenticated;