-- Fix foreign key relationship issues
-- Run this in your Supabase SQL Editor

-- 1. Drop all foreign key constraints first
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_lead_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_deal_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_lead_id_fkey;
ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_company_id_fkey;

-- 2. Check data types and fix mismatches
DO $$
DECLARE
    leads_id_type TEXT;
    deals_lead_id_type TEXT;
    deals_id_type TEXT;
    tasks_deal_id_type TEXT;
    tasks_lead_id_type TEXT;
    companies_id_type TEXT;
    contacts_company_id_type TEXT;
BEGIN
    -- Get data types
    SELECT data_type INTO leads_id_type FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'id';
    SELECT data_type INTO deals_lead_id_type FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'lead_id';
    SELECT data_type INTO deals_id_type FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'id';
    SELECT data_type INTO tasks_deal_id_type FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'deal_id';
    SELECT data_type INTO tasks_lead_id_type FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'lead_id';
    SELECT data_type INTO companies_id_type FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'id';
    SELECT data_type INTO contacts_company_id_type FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'company_id';
    
    -- Report current types
    RAISE NOTICE 'leads.id: %', leads_id_type;
    RAISE NOTICE 'deals.lead_id: %', deals_lead_id_type;
    RAISE NOTICE 'deals.id: %', deals_id_type;
    RAISE NOTICE 'tasks.deal_id: %', tasks_deal_id_type;
    RAISE NOTICE 'tasks.lead_id: %', tasks_lead_id_type;
    RAISE NOTICE 'companies.id: %', companies_id_type;
    RAISE NOTICE 'contacts.company_id: %', contacts_company_id_type;
    
    -- Fix data type mismatches if needed
    -- For deals.lead_id and leads.id
    IF leads_id_type != deals_lead_id_type THEN
        RAISE NOTICE 'Fixing deals.lead_id data type mismatch';
        IF leads_id_type = 'uuid' THEN
            ALTER TABLE deals ALTER COLUMN lead_id TYPE uuid USING lead_id::uuid;
        ELSIF leads_id_type = 'integer' OR leads_id_type = 'smallint' OR leads_id_type = 'bigint' THEN
            ALTER TABLE deals ALTER COLUMN lead_id TYPE integer USING lead_id::integer;
        END IF;
    END IF;
    
    -- For tasks.deal_id and deals.id
    IF deals_id_type != tasks_deal_id_type THEN
        RAISE NOTICE 'Fixing tasks.deal_id data type mismatch';
        IF deals_id_type = 'uuid' THEN
            ALTER TABLE tasks ALTER COLUMN deal_id TYPE uuid USING deal_id::uuid;
        ELSIF deals_id_type = 'integer' OR deals_id_type = 'smallint' OR deals_id_type = 'bigint' THEN
            ALTER TABLE tasks ALTER COLUMN deal_id TYPE integer USING deal_id::integer;
        END IF;
    END IF;
    
    -- For tasks.lead_id and leads.id
    IF leads_id_type != tasks_lead_id_type THEN
        RAISE NOTICE 'Fixing tasks.lead_id data type mismatch';
        IF leads_id_type = 'uuid' THEN
            ALTER TABLE tasks ALTER COLUMN lead_id TYPE uuid USING lead_id::uuid;
        ELSIF leads_id_type = 'integer' OR leads_id_type = 'smallint' OR leads_id_type = 'bigint' THEN
            ALTER TABLE tasks ALTER COLUMN lead_id TYPE integer USING lead_id::integer;
        END IF;
    END IF;
    
    -- For contacts.company_id and companies.id
    IF companies_id_type != contacts_company_id_type THEN
        RAISE NOTICE 'Fixing contacts.company_id data type mismatch';
        IF companies_id_type = 'uuid' THEN
            ALTER TABLE contacts ALTER COLUMN company_id TYPE uuid USING company_id::uuid;
        ELSIF companies_id_type = 'integer' OR companies_id_type = 'smallint' OR companies_id_type = 'bigint' THEN
            ALTER TABLE contacts ALTER COLUMN company_id TYPE integer USING company_id::integer;
        END IF;
    END IF;
END $$;

-- 3. Recreate foreign key constraints with proper error handling
DO $$
BEGIN
    -- Add deals to leads constraint
    BEGIN
        ALTER TABLE deals ADD CONSTRAINT deals_lead_id_fkey 
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added deals_lead_id_fkey constraint';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'deals_lead_id_fkey constraint already exists';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding deals_lead_id_fkey: %', SQLERRM;
    END;
    
    -- Add tasks to deals constraint
    BEGIN
        ALTER TABLE tasks ADD CONSTRAINT tasks_deal_id_fkey 
        FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added tasks_deal_id_fkey constraint';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'tasks_deal_id_fkey constraint already exists';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding tasks_deal_id_fkey: %', SQLERRM;
    END;
    
    -- Add tasks to leads constraint
    BEGIN
        ALTER TABLE tasks ADD CONSTRAINT tasks_lead_id_fkey 
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added tasks_lead_id_fkey constraint';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'tasks_lead_id_fkey constraint already exists';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding tasks_lead_id_fkey: %', SQLERRM;
    END;
    
    -- Add contacts to companies constraint
    BEGIN
        ALTER TABLE contacts ADD CONSTRAINT contacts_company_id_fkey 
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added contacts_company_id_fkey constraint';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'contacts_company_id_fkey constraint already exists';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding contacts_company_id_fkey: %', SQLERRM;
    END;
END $$;

-- 4. Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- 5. Test the relationships
DO $$
BEGIN
    -- Test deals to leads join
    PERFORM * FROM deals d LEFT JOIN leads l ON d.lead_id = l.id LIMIT 1;
    RAISE NOTICE 'Deals to leads join test passed';
    
    -- Test tasks to deals join
    PERFORM * FROM tasks t LEFT JOIN deals d ON t.deal_id = d.id LIMIT 1;
    RAISE NOTICE 'Tasks to deals join test passed';
    
    -- Test contacts to companies join
    PERFORM * FROM contacts c LEFT JOIN companies co ON c.company_id = co.id LIMIT 1;
    RAISE NOTICE 'Contacts to companies join test passed';
    
    -- Test tasks to leads join
    PERFORM * FROM tasks t LEFT JOIN leads l ON t.lead_id = l.id LIMIT 1;
    RAISE NOTICE 'Tasks to leads join test passed';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Join test failed: %', SQLERRM;
END $$;