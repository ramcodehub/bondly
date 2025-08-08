import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Executing SQL from ${filePath}...`);
    
    const { data, error } = await supabase.rpc('pg_read_file', {
      file_path: filePath
    });

    if (error) {
      console.error('Error executing SQL:', error);
      return false;
    }
    
    console.log('SQL executed successfully');
    return true;
  } catch (error) {
    console.error('Error running SQL file:', error);
    return false;
  }
}

async function setupHomepageTables() {
  console.log('Setting up homepage tables...');
  
  // Get the path to the SQL file
  const sqlFilePath = path.join(process.cwd(), 'src', 'create_homepage_tables.sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`SQL file not found at: ${sqlFilePath}`);
    process.exit(1);
  }
  
  const success = await runSqlFile(sqlFilePath);
  
  if (success) {
    console.log('✅ Homepage tables setup completed successfully!');
  } else {
    console.error('❌ Failed to setup homepage tables');
    process.exit(1);
  }
}

// Run the setup
setupHomepageTables();
