-- Detailed diagnostic script to identify specific schema issues
-- Run this in your Supabase SQL Editor

-- 1. Check table structures and data types
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('leads', 'deals', 'tasks', 'contacts', 'companies') 
    AND column_name IN ('id', 'lead_id', 'deal_id', 'company_id')
ORDER BY table_name, column_name;

-- 2. Check foreign key constraints in detail
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.is_deferrable,
    tc.initially_deferred
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

-- 3. Check for data type mismatches
SELECT 
    tc.table_name,
    kcu.column_name,
    c1.data_type AS local_data_type,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    c2.data_type AS foreign_data_type
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.columns AS c1
    ON c1.table_name = tc.table_name 
    AND c1.column_name = kcu.column_name
JOIN information_schema.columns AS c2
    ON c2.table_name = ccu.table_name 
    AND c2.column_name = ccu.column_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('leads', 'deals', 'tasks', 'contacts', 'companies')
    AND c1.data_type != c2.data_type
ORDER BY tc.table_name;

-- 4. Check RLS policies
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

-- 5. Test specific joins that are failing
-- Test tasks to deals join
SELECT 'tasks to deals join test' as test_name,
       COUNT(*) as result
FROM tasks t
LEFT JOIN deals d ON t.deal_id = d.id
LIMIT 1;

-- Test contacts to companies join
SELECT 'contacts to companies join test' as test_name,
       COUNT(*) as result
FROM contacts c
LEFT JOIN companies co ON c.company_id = co.id
LIMIT 1;

-- Test deals to leads join
SELECT 'deals to leads join test' as test_name,
       COUNT(*) as result
FROM deals d
LEFT JOIN leads l ON d.lead_id = l.id
LIMIT 1;

-- 6. Check for NULL values in foreign key columns
SELECT 'tasks with NULL deal_id' as check_name, COUNT(*) as count
FROM tasks WHERE deal_id IS NULL
UNION ALL
SELECT 'tasks with NULL lead_id' as check_name, COUNT(*) as count
FROM tasks WHERE lead_id IS NULL
UNION ALL
SELECT 'deals with NULL lead_id' as check_name, COUNT(*) as count
FROM deals WHERE lead_id IS NULL
UNION ALL
SELECT 'contacts with NULL company_id' as check_name, COUNT(*) as count
FROM contacts WHERE company_id IS NULL;

-- 7. Check data types of specific columns
SELECT 'leads.id data type' as column_info, 
       (SELECT data_type FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'id') as data_type
UNION ALL
SELECT 'deals.lead_id data type' as column_info,
       (SELECT data_type FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'lead_id') as data_type
UNION ALL
SELECT 'tasks.deal_id data type' as column_info,
       (SELECT data_type FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'deal_id') as data_type
UNION ALL
SELECT 'tasks.lead_id data type' as column_info,
       (SELECT data_type FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'lead_id') as data_type
UNION ALL
SELECT 'contacts.company_id data type' as column_info,
       (SELECT data_type FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'company_id') as data_type
UNION ALL
SELECT 'companies.id data type' as column_info,
       (SELECT data_type FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'id') as data_type;