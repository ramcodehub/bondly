-- Create accounts table
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  account_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  contact_email TEXT,
  logo_url TEXT
);

-- Seed accounts table
INSERT INTO accounts (account_name, industry, website, contact_email, logo_url)
VALUES 
  ('Adventure Tours Inc', 'Travel', 'https://adventure-tours.com', 'contact@adventure-tours.com', 'https://example.com/logo1.png'),
  ('Global Getaways', 'Hospitality', 'https://globalgetaways.com', 'info@globalgetaways.com', 'https://example.com/logo2.png');