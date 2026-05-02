-- Part 03: CRM Core (Companies and Accounts)

-- 1. Tables
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(20) CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
    revenue VARCHAR(50),
    website VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    description TEXT,
    logo_url VARCHAR(500),
    founded_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    contact_email TEXT,
    logo_url TEXT
);

-- 2. Performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

-- 3. Security Enablement
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Allow public read access to companies" ON companies FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated insert on companies" ON companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on companies" ON companies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete on companies" ON companies FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated full access to accounts" ON accounts FOR ALL TO authenticated USING (true);
