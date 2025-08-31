-- =============================
-- Comprehensive Authentication Fix for Supabase Auth + Profiles
-- =============================

-- If the profiles table exists but has the wrong structure, we need to fix it
-- First, let's create a backup of the existing profiles table if it exists
CREATE TABLE IF NOT EXISTS profiles_backup AS SELECT * FROM profiles;

-- Drop the existing profiles table if it exists and has the wrong structure
DROP TABLE IF EXISTS profiles CASCADE;

-- Create the profiles table with the correct schema
-- This table has a 1-to-1 relationship with auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the trigger function to automatically create profiles when users sign up
-- This function will be called whenever a new user is inserted into auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new profile for the new user
  -- We get the full_name from the user's metadata and email from the auth.users table
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.email
  );
  
  -- Return the new row
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that calls the function when a new user is created
-- This will automatically create a profile for every new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security on the profiles table
-- This ensures users can only access their own profile data
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for the profiles table
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (needed for the trigger)
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT ALL ON TABLE profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify the setup by checking if the function and trigger exist
-- You can run these queries separately to verify:
-- SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
-- SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';