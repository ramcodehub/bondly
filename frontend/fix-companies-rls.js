#!/usr/bin/env node

/**
 * Quick RLS Fix Script for Companies Table
 * 
 * This script applies the necessary RLS policies to allow company creation.
 * Run this if you're getting "Database security policy violation" errors.
 */

console.log('🔧 Companies RLS Fix Script');
console.log('=============================');
console.log('');
console.log('⚠️  You are getting RLS (Row Level Security) errors when creating companies.');
console.log('');
console.log('📋 To fix this issue:');
console.log('');
console.log('1. Go to your Supabase Dashboard: https://supabase.com');
console.log('2. Navigate to "SQL Editor"');
console.log('3. Click "New Query"');
console.log('4. Copy and paste the contents of "companies-rls-fix.sql"');
console.log('5. Click "Run" to execute the script');
console.log('');
console.log('✅ After running the script, company creation should work properly.');
console.log('');
console.log('🔍 Alternative: Quick fix for development (less secure):');
console.log('   Run this SQL command to disable RLS temporarily:');
console.log('   ALTER TABLE companies DISABLE ROW LEVEL SECURITY;');
console.log('');
console.log('📁 The RLS fix script is located at: companies-rls-fix.sql');
console.log('');