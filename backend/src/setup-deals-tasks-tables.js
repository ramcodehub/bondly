import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDealsAndTasksTables() {
  try {
    console.log('Setting up Deals and Tasks tables...');

    // Read and execute deals table SQL
    const dealsSQL = fs.readFileSync(path.join(process.cwd(), 'src', 'create_deals_table.sql'), 'utf8');
    console.log('Creating deals table...');
    const dealsResult = await supabase.rpc('exec_sql', { sql: dealsSQL });
    
    if (dealsResult.error) {
      console.error('Error creating deals table:', dealsResult.error);
    } else {
      console.log('✅ Deals table created successfully');
    }

    // Read and execute tasks table SQL  
    const tasksSQL = fs.readFileSync(path.join(process.cwd(), 'src', 'create_tasks_table.sql'), 'utf8');
    console.log('Creating tasks table...');
    const tasksResult = await supabase.rpc('exec_sql', { sql: tasksSQL });
    
    if (tasksResult.error) {
      console.error('Error creating tasks table:', tasksResult.error);
    } else {
      console.log('✅ Tasks table created successfully');
    }

    // Alternative approach: Execute SQL directly
    if (dealsResult.error || tasksResult.error) {
      console.log('\n📋 Manual setup required:');
      console.log('1. Go to your Supabase SQL Editor');
      console.log('2. Execute the contents of create_deals_table.sql');
      console.log('3. Execute the contents of create_tasks_table.sql');
      console.log('\nOr run these commands manually in your Supabase SQL editor.');
    }

    console.log('\n🎉 Setup complete! You can now use Deals and Tasks functionality.');
    
  } catch (error) {
    console.error('Setup failed:', error);
    console.log('\n📋 Manual setup required:');
    console.log('1. Go to your Supabase SQL Editor');
    console.log('2. Execute the contents of create_deals_table.sql');
    console.log('3. Execute the contents of create_tasks_table.sql');
  }
}

setupDealsAndTasksTables();