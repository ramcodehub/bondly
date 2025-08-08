-- Create leads table
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed leads table
INSERT INTO leads (name, email, phone, status)
VALUES 
  ('John Doe', 'john@example.com', '123-456-7890', 'New'),
  ('Jane Smith', 'jane@example.com', '987-654-3210', 'Contacted'),
  ('Bob Johnson', 'bob@example.com', '555-123-4567', 'Qualified');