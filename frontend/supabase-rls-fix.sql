-- Supabase RLS Fix for Leads Table
-- Choose ONE of the following solutions:

-- SOLUTION 1: Disable RLS (Quick fix for development)
-- WARNING: This removes all security restrictions
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- SOLUTION 2: Create permissive INSERT policy (Recommended for CRM)
-- This allows anyone to insert leads (good for lead capture forms)
CREATE POLICY "Allow public insert on leads"
ON leads
FOR INSERT
TO public
WITH CHECK (true);

-- SOLUTION 3: Create authenticated user policy
-- Only allows authenticated users to insert leads
CREATE POLICY "Allow authenticated insert on leads"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- SOLUTION 4: Create user-specific policy
-- Only allows users to insert leads assigned to them
CREATE POLICY "Allow user insert on leads"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = assigned_to);

-- SOLUTION 5: Enable all operations for authenticated users
-- Allows full CRUD operations for authenticated users
CREATE POLICY "Allow authenticated all operations"
ON leads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- To check current policies:
-- SELECT * FROM pg_policies WHERE tablename = 'leads';

-- To remove a policy (if needed):
-- DROP POLICY "policy_name" ON leads;

-- RECOMMENDED: For a CRM system, use SOLUTION 2 or SOLUTION 5
-- depending on whether you want public lead submission or authenticated-only access