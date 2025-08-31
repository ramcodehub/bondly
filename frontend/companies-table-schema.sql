-- Companies Table Schema for Supabase
-- This creates a companies table with all necessary fields for CRM functionality

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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_size ON companies(size);

-- Add RLS (Row Level Security) policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for lead capture forms, etc.)
CREATE POLICY "Allow public read access to companies"
ON companies
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert companies
CREATE POLICY "Allow authenticated insert on companies"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update companies
CREATE POLICY "Allow authenticated update on companies"
ON companies
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete companies
CREATE POLICY "Allow authenticated delete on companies"
ON companies
FOR DELETE
TO authenticated
USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO companies (name, industry, size, revenue, website, status, phone, email, description) VALUES
('Acme Corporation', 'Manufacturing', '201-500', '$12M', 'acme.com', 'active', '+1-555-0123', 'contact@acme.com', 'Leading manufacturer of quality products'),
('Globex Corporation', 'Technology', '51-200', '$4.5M', 'globex.com', 'prospect', '+1-555-0456', 'info@globex.com', 'Innovative technology solutions provider'),
('Initech', 'Finance', '11-50', '$1.2M', 'initech.io', 'inactive', '+1-555-0789', 'hello@initech.io', 'Financial services and consulting'),
('Stark Industries', 'Technology', '1000+', '$50B', 'starkindustries.com', 'active', '+1-555-1000', 'contact@starkindustries.com', 'Advanced technology and defense contractor'),
('Wayne Enterprises', 'Conglomerate', '1000+', '$31.3B', 'wayneenterprises.com', 'active', '+1-555-2000', 'info@wayneenterprises.com', 'Diversified multinational conglomerate');