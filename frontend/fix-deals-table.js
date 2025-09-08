// This is a documentation script that explains how to fix the deals table issue
// Since we can't directly modify the database schema through code, this provides
// the SQL commands that need to be run in the Supabase SQL editor

console.log(`
FIX FOR DEALS TABLE ISSUE
=========================

The issue is that the deals table has a foreign key constraint referencing the 'accounts' table,
but that table doesn't exist. We need to update the foreign key to reference the 'companies' table instead.

RUN THESE SQL COMMANDS IN THE SUPABASE SQL EDITOR:

1. First, drop the existing foreign key constraint:
   (Note: The exact constraint name may be different, you can check it with \\d deals)

ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_company_id_fkey;

2. Then add the new foreign key constraint referencing companies:
   (Note: companies.id is a UUID, but deals.company_id is an INTEGER, so we need to handle this)

-- If companies.id is UUID and deals.company_id is INTEGER, we have a type mismatch
-- We need to either:
--   A. Change deals.company_id to UUID to match companies.id, OR
--   B. Create an accounts table with SERIAL id to match deals.company_id

OPTION A: Change deals.company_id to UUID (recommended)
======================================================

-- Add a new column with the correct type
ALTER TABLE deals ADD COLUMN company_id_uuid UUID REFERENCES companies(id) ON DELETE SET NULL;

-- Copy data if any (this is tricky since types don't match)
-- You would need to map the integer IDs to UUIDs manually

-- Drop the old column
ALTER TABLE deals DROP COLUMN company_id;

-- Rename the new column
ALTER TABLE deals RENAME COLUMN company_id_uuid TO company_id;

OPTION B: Create accounts table with SERIAL id (simpler)
=======================================================

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  account_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  contact_email TEXT,
  logo_url TEXT
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_accounts_name ON accounts(account_name);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all accounts" ON accounts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert accounts" ON accounts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update accounts" ON accounts
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete accounts" ON accounts
    FOR DELETE USING (true);

-- Insert sample data
INSERT INTO accounts (account_name, industry, website, contact_email, logo_url)
VALUES 
  ('Adventure Tours Inc', 'Travel', 'https://adventure-tours.com', 'contact@adventure-tours.com', 'https://example.com/logo1.png'),
  ('Global Getaways', 'Hospitality', 'https://globalgetaways.com', 'info@globalgetaways.com', 'https://example.com/logo2.png')
ON CONFLICT DO NOTHING;

AFTER FIXING THE DATABASE STRUCTURE
===================================

1. Update the frontend code to use the correct table relationships:
   - In useDealsRealtime.ts, change companies query to accounts if using Option B
   - In deals API route, change companies query to accounts if using Option B

2. Restart the development server to clear any cached schema information

3. Test the realtime subscription again
`)