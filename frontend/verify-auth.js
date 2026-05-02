#!/usr/bin/env node

// Script to verify authentication setup
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Authentication Setup...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file found');
  
  // Read the file and check for required variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasAnonKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY');
  
  console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${hasUrl ? 'SET' : 'MISSING'}`);
  console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${hasAnonKey ? 'SET' : 'MISSING'}`);
  console.log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${hasServiceKey ? 'SET' : 'MISSING'}`);
  
  if (hasUrl && hasAnonKey) {
    console.log('\n✅ Authentication environment variables are properly configured');
  } else {
    console.log('\n❌ Missing required authentication environment variables');
  }
} else {
  console.log('❌ .env.local file not found');
  console.log('   Please create a .env.local file with your Supabase credentials');
}

// Check if required files exist
const requiredFiles = [
  'src/lib/supabase-client.ts',
  'src/utils/supabase/middleware.ts',
  'src/middleware.ts'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (MISSING)`);
  }
});

console.log('\n✅ Verification complete!');
console.log('\nTo test authentication:');
console.log('1. Visit http://localhost:3000/test-auth to test login/logout');
console.log('2. Visit http://localhost:3000/api/test-connection to test Supabase connection');