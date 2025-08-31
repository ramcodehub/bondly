# Authentication Setup

This document describes the authentication implementation for the CRM Dashboard application.

## Overview

The authentication system uses Supabase Auth for handling user signup and login, with a custom profiles table that has a 1-to-1 relationship with the `auth.users` table.

## Database Schema

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Authentication Flow

### Signup Process

1. User fills out the signup form with first name, last name, email, and password
2. Supabase Auth creates a new user in `auth.users`
3. A Postgres trigger automatically creates a corresponding profile in the `profiles` table
4. User is redirected to the login page to sign in

### Login Process

1. User provides email and password
2. Supabase Auth validates credentials
3. On successful authentication, user is redirected to the Dashboard
4. User session is persisted using localStorage

## Realtime Updates

The authentication system uses Supabase's realtime capabilities to track user session state. The `useUser` hook listens for auth state changes and updates the application accordingly.

## Role-Based Access Control (RBAC)

The profiles table includes a `role` column that can be used for future RBAC implementation. Currently, all users are assigned the default role of 'user'.

## Security

- Passwords are securely hashed and stored by Supabase Auth
- Row Level Security (RLS) policies ensure users can only access their own profile data
- Session tokens are automatically refreshed
- Sessions are persisted in localStorage for a seamless user experience

## Setup Instructions

1. Run the `auth-setup.sql` script in your Supabase database
2. Ensure the frontend environment variables are properly configured:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. The authentication system will automatically handle user creation and profile management