-- Fix database schema issues - CORRECTED VERSION
-- Run this in your Supabase SQL Editor

-- SAFELY fix the schema issues without dropping tables

-- 1. First, drop all problematic foreign key constraints
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_lead_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_deal_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_lead_id_fkey;

-- 2. Check if contacts table has company_id column, if not add it
DO $$ 
BEGIN
    -- Check if company_id column exists in contacts table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'company_id') THEN
        -- Add company_id column
        ALTER TABLE contacts ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Check if contacts table has company_id constraint, if not add it
DO $$ 
BEGIN
    -- Check if company_id constraint exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc 
                   JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
                   WHERE tc.table_name = 'contacts' AND tc.constraint_type = 'FOREIGN KEY' AND ccu.column_name = 'company_id') THEN
        -- Add foreign key constraint only if it doesn't exist
        BEGIN
            ALTER TABLE contacts ADD CONSTRAINT contacts_company_id_fkey 
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
        EXCEPTION WHEN duplicate_object THEN
            -- Constraint already exists, do nothing
            NULL;
        END;
    END IF;
END $$;

-- 4. Check if leads table has the correct structure
DO $$ 
BEGIN
    -- Check if first_name column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_name') THEN
        -- Add missing columns
        ALTER TABLE leads ADD COLUMN first_name TEXT;
        ALTER TABLE leads ADD COLUMN last_name TEXT;
        ALTER TABLE leads ADD COLUMN job_title TEXT;
        ALTER TABLE leads ADD COLUMN source TEXT;
        ALTER TABLE leads ADD COLUMN notes TEXT;
        ALTER TABLE leads ADD COLUMN assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL;
        ALTER TABLE leads ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        -- Migrate existing name data if needed
        UPDATE leads SET first_name = split_part(name, ' ', 1) WHERE first_name IS NULL AND name IS NOT NULL;
        UPDATE leads SET last_name = substring(name from position(' ' in name) + 1) WHERE last_name IS NULL AND name IS NOT NULL AND position(' ' in name) > 0;
        
        -- Make first_name required if name column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'name') THEN
            ALTER TABLE leads ALTER COLUMN first_name SET NOT NULL;
        END IF;
    END IF;
END $$;

-- 5. Add missing indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_lead_id ON tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);

-- 6. Fix RLS policies to be more permissive for testing
-- Enable RLS for all tables if not already enabled
ALTER TABLE IF EXISTS leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for testing
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

-- Grant necessary permissions
GRANT ALL ON leads TO authenticated;
GRANT ALL ON deals TO authenticated;
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON contacts TO authenticated;
GRANT ALL ON companies TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Test queries to verify fixes
-- SELECT * FROM leads LIMIT 1;
-- SELECT * FROM deals LIMIT 1;
-- SELECT * FROM tasks LIMIT 1;
-- SELECT * FROM contacts LIMIT 1;
-- SELECT * FROM companies LIMIT 1;