-- Create contacts table
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  image_url TEXT
);

-- Create contact_form_submissions table
CREATE TABLE contact_form_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Seed contacts table
INSERT INTO contacts (name, role, email, phone, image_url)
VALUES 
  ('Sarah Johnson', 'Sales Manager', 'sarah@example.com', '111-222-3333', 'https://example.com/sarah.jpg'),
  ('Michael Chen', 'Support Specialist', 'michael@example.com', '444-555-6666', 'https://example.com/michael.jpg');