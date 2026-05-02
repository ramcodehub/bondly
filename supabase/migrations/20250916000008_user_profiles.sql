-- Part 08: User Profiles and Team

-- 1. Tables
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    email TEXT,
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(50),
    avatar TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Performance
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

-- 3. Security Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage their own profile." ON profiles FOR ALL TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can manage their own settings." ON user_settings FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teams are viewable by authenticated users." ON team_members FOR SELECT TO authenticated USING (true);
