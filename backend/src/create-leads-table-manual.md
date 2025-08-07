# Manual Steps to Create Leads Table in Supabase

Since the programmatic approach to create the leads table failed, follow these manual steps to create the table in the Supabase dashboard:

1. Log in to your Supabase account at https://app.supabase.com/
2. Select your project (with URL: https://vknqythzsdpwyycfmujz.supabase.co)
3. Navigate to the SQL Editor in the left sidebar
4. Create a new query
5. Paste the following SQL code:

```sql
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
```

6. Click "Run" to execute the SQL query
7. Verify the table was created by checking the "Table Editor" in the left sidebar

## Verification

To verify the table was created successfully, you can run the following SQL query in the SQL Editor:

```sql
SELECT * FROM public.leads;
```

This should return the 4 sample records you inserted.