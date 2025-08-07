-- Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  lead_owner TEXT,
  lead_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO public.leads (name, company, email, phone, lead_owner, lead_source)
VALUES
  ('Christopher Maclead', 'Rangoni Of Florence', 'christopher@example.com', '9876543210', 'Hari Shankar', 'Website'),
  ('Carissa Kidman', 'Oh My Goodknits Inc', 'carissa@example.com', '9123456780', 'Hari Shankar', 'Referral'),
  ('James Merced', 'Kwik Kopy Printing', 'james@example.com', '9988776655', 'Hari Shankar', 'Google Ads'),
  ('Felix Hirpara', 'Chapman', 'felix@example.com', '9112233445', 'Hari Shankar', 'LinkedIn');