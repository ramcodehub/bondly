-- Minimal fix script - Focus on critical issues only
-- Run this in your Supabase SQL Editor

-- 1. Drop problematic foreign key constraints
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_lead_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_deal_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_lead_id_fkey;

-- 2. Fix RLS policies to be more permissive for testing
DROP POLICY IF EXISTS "Allow all operations on leads" ON leads;
CREATE POLICY "Allow all operations on leads"
ON leads
FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on deals" ON deals;
CREATE POLICY "Allow all operations on deals"
ON deals
FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on tasks" ON tasks;
CREATE POLICY "Allow all operations on tasks"
ON tasks
FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on contacts" ON contacts;
CREATE POLICY "Allow all operations on contacts"
ON contacts
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 3. Grant necessary permissions
GRANT ALL ON leads TO authenticated;
GRANT ALL ON deals TO authenticated;
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON contacts TO authenticated;
GRANT ALL ON companies TO authenticated;

-- 4. Refresh schema cache
NOTIFY pgrst, 'reload schema';