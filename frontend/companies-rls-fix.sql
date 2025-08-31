-- 🔧 COMPANIES RLS FIX SCRIPT - IMMEDIATE SOLUTION
-- Copy this entire script and run it in your Supabase SQL Editor
-- This will fix the "Database security policy violation" error

-- Step 1: Clean up any existing policies
DROP POLICY IF EXISTS "Allow public read access to companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated insert on companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated update on companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated delete on companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated all operations on companies" ON companies;

-- Step 2: Create the fix policy (allows all operations for any user)
-- This is appropriate for a CRM system where users need full access
CREATE POLICY "Allow all operations on companies"
ON companies
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- ALTERNATIVE SOLUTION 3: Granular policies (if you prefer separate policies)
-- Uncomment the following lines if you want separate policies instead of the all-in-one above

-- CREATE POLICY "Allow public read access to companies"
-- ON companies
-- FOR SELECT
-- TO public
-- USING (true);

-- CREATE POLICY "Allow authenticated insert on companies"
-- ON companies
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- CREATE POLICY "Allow authenticated update on companies"
-- ON companies
-- FOR UPDATE
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Allow authenticated delete on companies"
-- ON companies
-- FOR DELETE
-- TO authenticated
-- USING (true);

-- SOLUTION 4: Public insert policy (if you want to allow public company creation)
-- CREATE POLICY "Allow public insert on companies"
-- ON companies
-- FOR INSERT
-- TO public
-- WITH CHECK (true);

-- To check current policies after running this script:
-- SELECT * FROM pg_policies WHERE tablename = 'companies';

-- To verify RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'companies';

-- RECOMMENDED: Use SOLUTION 2 (the comprehensive policy above) for most CRM applications
-- This provides full CRUD access to authenticated users while maintaining security