-- Create transactions table for company history
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL, -- invoice, payment, refund
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);