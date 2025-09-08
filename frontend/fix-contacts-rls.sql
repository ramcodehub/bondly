-- Fix RLS policies for contacts table
-- Run this in your Supabase SQL Editor

-- First, check existing policies
-- SELECT * FROM pg_policies WHERE tablename = 'contacts';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated insert" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated read" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated update" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated delete" ON contacts;

-- Create new policies that allow all operations for authenticated users
CREATE POLICY "Allow authenticated insert" ON contacts
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON contacts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update" ON contacts
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON contacts
    FOR DELETE TO authenticated USING (true);

-- Grant necessary permissions
GRANT ALL ON contacts TO authenticated;

-- If you want to allow public read access (for contact forms, etc.)
-- CREATE POLICY "Allow public read" ON contacts
--     FOR SELECT TO public USING (true);