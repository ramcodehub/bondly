-- Create homepage_carousel table
CREATE TABLE IF NOT EXISTS public.homepage_carousel (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  cta_link TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activities (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_homepage_carousel_order ON public.homepage_carousel("order") WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON public.activities(created_at DESC);

-- Insert sample carousel data (optional)
INSERT INTO public.homepage_carousel (title, description, image_url, cta_link, "order")
VALUES 
  ('Welcome to Our CRM', 'Manage your customer relationships efficiently', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', '/about', 1),
  ('Track Your Leads', 'Never miss an opportunity with our lead tracking system', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', '/leads', 2),
  ('Boost Your Sales', 'Convert more leads into customers with our tools', 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', '/opportunities', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample activities (optional)
INSERT INTO public.activities (type, description, metadata)
VALUES 
  ('user', 'New user registered', '{"username": "admin"}'),
  ('lead', 'New lead added', '{"lead_id": 1, "name": "John Doe"}'),
  ('opportunity', 'New opportunity created', '{"opportunity_id": 1, "value": 5000}'),
  ('account', 'New account added', '{"account_id": 1, "name": "Acme Inc"}')
ON CONFLICT (id) DO NOTHING;
