const { createClient } = require('@supabase/supabase-js');

// Get these from your Supabase project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixProfilesTable() {
  try {
    console.log('Starting profiles table fix...');
    
    // Check if profiles table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_name', 'profiles');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
      return;
    }
    
    if (tables.length > 0) {
      console.log('Profiles table already exists');
      return;
    }
    
    // Create profiles table
    const { error: createError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          bio TEXT,
          phone TEXT,
          location TEXT,
          role TEXT DEFAULT 'user',
          status TEXT DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, full_name, email, avatar_url, role, status)
          VALUES (
            NEW.id, 
            NEW.raw_user_meta_data->>'full_name', 
            NEW.email,
            NEW.raw_user_meta_data->>'avatar_url',
            'user',
            'active'
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
          
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own profile"
          ON profiles FOR SELECT
          USING (auth.uid() = id);
          
        CREATE POLICY "Users can update their own profile"
          ON profiles FOR UPDATE
          USING (auth.uid() = id);
          
        CREATE POLICY "Users can insert their own profile"
          ON profiles FOR INSERT
          WITH CHECK (auth.uid() = id);
          
        GRANT ALL ON TABLE profiles TO authenticated;
        GRANT USAGE ON SCHEMA public TO authenticated;
        
        CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
      `
    });
    
    if (createError) {
      console.error('Error creating profiles table:', createError);
      return;
    }
    
    console.log('Profiles table created successfully');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixProfilesTable();