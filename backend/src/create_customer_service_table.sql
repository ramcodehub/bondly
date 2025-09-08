-- Create customer_service table for service lifecycle tracking
CREATE TABLE IF NOT EXISTS public.customer_service (
  id SERIAL PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  stage TEXT NOT NULL, -- onboarding, engagement, retention, advocacy
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);