-- Create opportunities table
CREATE TABLE opportunities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL,
  stage TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed opportunities table
INSERT INTO opportunities (title, description, value, stage)
VALUES 
  ('Group Tour Booking', '20-person group tour to Bali', 5000.00, 'Proposal'),
  ('Corporate Retreat', 'Company retreat planning services', 7500.00, 'Negotiation'),
  ('Family Vacation', 'Custom family vacation package', 3500.00, 'Closed Won');