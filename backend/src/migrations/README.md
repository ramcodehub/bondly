# Database Migrations

This directory contains SQL migration files for the Bondly CRM application.

## Migration Order

1. `202501_create_roles_user_roles.sql` - Create core RBAC tables and seed baseline roles
2. `202502_create_rls_policies_roles.sql` - Set up Row Level Security policies for RBAC tables
3. `202503_alter_auth_users_table.sql` - Add necessary columns to auth.users table (if needed)
4. `202504_add_rbac_settings_and_audit.sql` - Add RBAC settings feature flag and audit trail

## How to Apply Migrations

### Using Supabase SQL Editor

1. Log in to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file in order
4. Run each query

### Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db reset
```

Or to apply specific migrations:

```bash
supabase db push
```

## Migration Guidelines

- Each migration should be idempotent (safe to run multiple times)
- Use `IF NOT EXISTS` clauses where appropriate
- Use `ON CONFLICT` clauses for INSERT statements
- Include appropriate indexes for performance
- Enable RLS (Row Level Security) on all tables
- Define clear RLS policies for data access control

## RBAC Tables

### roles
- `id` - Unique identifier
- `name` - Role name (unique)
- `description` - Role description
- `created_at` - Timestamp

### user_roles
- `id` - Unique identifier
- `user_id` - Foreign key to auth.users
- `role_id` - Foreign key to roles
- `assigned_by` - User who assigned the role
- `assigned_at` - Timestamp
- `UNIQUE(user_id, role_id)` - Prevents duplicate role assignments

### rbac_settings
- `id` - Unique identifier
- `enforce_roles` - Boolean flag to enable/disable RBAC enforcement (default: false)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### role_audit
- `id` - Unique identifier
- `user_id` - Foreign key to auth.users
- `role_id` - Foreign key to roles
- `action` - Type of action (ASSIGNED, UNASSIGNED, MODIFIED)
- `assigned_by` - User who performed the action
- `assigned_at` - Timestamp of the action
- `notes` - Optional notes about the action
- `ip_address` - IP address of the requester
- `user_agent` - User agent of the requester

## Seeded Roles

1. Admin - Full administrative access
2. Marketing Manager - Manage campaigns and marketing reports
3. Marketing Agent - Execute marketing tasks and campaigns
4. Sales Manager - Oversee sales team and pipelines
5. Sales Representative - Manage leads and deals