-- Diagnostic script to identify schema issues
-- Run this in your Supabase SQL Editor to understand the current state

-- Check table structures
\d leads
\d deals
\d tasks
\d contacts
\d companies

-- Check column data types
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('leads', 'deals', 'tasks', 'contacts', 'companies') 
    AND column_name IN ('id', 'lead_id', 'deal_id', 'company_id')
ORDER BY table_name, column_name;

-- Check foreign key constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('leads', 'deals', 'tasks', 'contacts', 'companies')
ORDER BY tc.table_name;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('leads', 'deals', 'tasks', 'contacts', 'companies')
ORDER BY tablename;

-- Check for data in tables
SELECT 'leads' as table_name, COUNT(*) as row_count FROM leads
UNION ALL
SELECT 'deals' as table_name, COUNT(*) as row_count FROM deals
UNION ALL
SELECT 'tasks' as table_name, COUNT(*) as row_count FROM tasks
UNION ALL
SELECT 'contacts' as table_name, COUNT(*) as row_count FROM contacts
UNION ALL
SELECT 'companies' as table_name, COUNT(*) as row_count FROM companies;

-- Test simple queries
SELECT 'leads query' as test, COUNT(*) as result FROM leads LIMIT 1;
SELECT 'deals query' as test, COUNT(*) as result FROM deals LIMIT 1;
SELECT 'tasks query' as test, COUNT(*) as result FROM tasks LIMIT 1;
SELECT 'contacts query' as test, COUNT(*) as result FROM contacts LIMIT 1;
SELECT 'companies query' as test, COUNT(*) as result FROM companies LIMIT 1;