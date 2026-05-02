-- Create navigation_links table
CREATE TABLE IF NOT EXISTS navigation_links (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_navigation_links_order ON navigation_links("order");

-- Insert default navigation links
INSERT INTO navigation_links (title, path, "order") VALUES
    ('Home', '/', 1),
    ('Leads', '/leads', 2),
    ('Opportunities', '/opportunities', 3),
    ('Account', '/account', 4),
    ('Contact', '/contact', 5)
ON CONFLICT DO NOTHING;