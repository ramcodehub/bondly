-- =============================
-- Migration script for profiles table
-- =============================

-- Drop the backup table if it already exists
DROP TABLE IF EXISTS profiles_backup CASCADE;

-- Create a backup of the existing profiles table
CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- Add new columns to existing profiles table (if they don't exist)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role, status)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    'user',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing profiles to ensure they have all fields
UPDATE profiles 
SET 
  avatar_url = COALESCE(avatar_url, ''),
  bio = COALESCE(bio, ''),
  phone = COALESCE(phone, ''),
  location = COALESCE(location, ''),
  updated_at = NOW()
WHERE updated_at IS NULL OR avatar_url IS NULL OR bio IS NULL OR phone IS NULL OR location IS NULL;

-- Verify the migration
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;