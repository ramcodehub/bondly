-- Create interactions table for contact history
CREATE TABLE IF NOT EXISTS public.interactions (
  id SERIAL PRIMARY KEY,
  contact_id INT REFERENCES contacts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- call, email, meeting, note
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);