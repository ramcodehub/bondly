# RBAC Database Migration Guide

This document provides instructions for setting up the Role-Based Access Control (RBAC) system in the Bondly CRM application.

## Overview

The RBAC system consists of four core database tables:
1. `roles` - Defines available roles in the system
2. `user_roles` - Maps users to their assigned roles
3. `rbac_settings` - Controls RBAC feature flag (enforce_roles)
4. `role_audit` - Tracks all role assignment/unassignment actions for accountability

## Migration Files

The following migration files have been created:

1. `202501_create_roles_user_roles.sql` - Creates the core RBAC tables and seeds baseline roles
2. `202502_create_rls_policies_roles.sql` - Sets up Row Level Security policies for RBAC tables
3. `202503_alter_auth_users_table.sql` - Adds necessary columns to auth.users table (if needed)
4. `202504_add_rbac_settings_and_audit.sql` - Adds RBAC settings feature flag and audit trail

## Applying Migrations

### Method 1: Using Supabase SQL Editor

1. Log in to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file in order:
   - First: `202501_create_roles_user_roles.sql`
   - Second: `202502_create_rls_policies_roles.sql`
   - Third: `202503_alter_auth_users_table.sql`
   - Fourth: `202504_add_rbac_settings_and_audit.sql`
4. Run each query

### Method 2: Using psql or other SQL client

Connect to your Supabase database and run each migration file in order.

## Verifying Migration

After applying the migrations, you can verify the setup:

1. Check that the tables exist:
   ```sql
   SELECT * FROM public.roles LIMIT 5;
   SELECT * FROM public.user_roles LIMIT 5;
   SELECT * FROM public.rbac_settings LIMIT 5;
   SELECT * FROM public.role_audit LIMIT 5;
   ```

2. Verify baseline roles:
   ```sql
   SELECT name, description FROM public.roles ORDER BY name;
   ```

3. Run the verification script:
   ```bash
   cd backend
   npm run verify:rbac
   ```

## Baseline Roles

The following roles are seeded by default:

1. **Admin** - Full administrative access
2. **Marketing Manager** - Manage campaigns and marketing reports
3. **Marketing Agent** - Execute marketing tasks and campaigns
4. **Sales Manager** - Oversee sales team and pipelines
5. **Sales Representative** - Manage leads and deals

## Security Considerations

- All tables have Row Level Security (RLS) enabled
- Appropriate RLS policies are defined to control data access
- Only authenticated users can access role information
- Admin users have extended permissions for role management

## Troubleshooting

### Common Issues

1. **Table already exists errors**
   - The migrations use `IF NOT EXISTS` clauses to prevent this
   - If you encounter issues, you can drop the tables and re-run the migrations

2. **Permission denied errors**
   - Ensure you're using a user with appropriate privileges
   - For Supabase, use the service role key for migrations

3. **RLS policy conflicts**
   - Review existing policies on the tables
   - Drop conflicting policies before applying new ones

### Rollback

To rollback the RBAC setup:

1. Drop the RLS policies:
   ```sql
   DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.roles;
   DROP POLICY IF EXISTS "Allow users to read their own roles" ON public.user_roles;
   DROP POLICY IF EXISTS "Allow admin users to manage all user roles" ON public.user_roles;
   ```

2. Drop the tables:
   ```sql
   DROP TABLE IF EXISTS public.role_audit;
   DROP TABLE IF EXISTS public.rbac_settings;
   DROP TABLE IF EXISTS public.user_roles;
   DROP TABLE IF EXISTS public.roles;
   ```

## Next Steps

After applying the migrations:

1. Implement the backend API endpoints for role management
2. Create frontend components for role assignment
3. Integrate role checking middleware in your application
4. Implement RBAC settings management (toggle enforcement on/off)
5. Add audit logging to role assignment/unassignment operations
6. Create audit trail viewing interface for Admin users
7. Test the RBAC system with different user roles