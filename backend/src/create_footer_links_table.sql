-- Create footer_links table
CREATE TABLE IF NOT EXISTS footer_links (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_footer_links_category ON footer_links(category);
CREATE INDEX IF NOT EXISTS idx_footer_links_order ON footer_links("order");

-- Insert default footer links
INSERT INTO footer_links (category, title, path, "order") VALUES
    -- Product links
    ('product', 'Features', '/crm#services', 1),
    ('product', 'Bondly', '/crm', 2),
    ('product', 'Pricing', '#', 3),
    ('product', 'Demo', '#', 4),
    
    -- Resources links
    ('resources', 'Documentation', '#', 1),
    ('resources', 'Guides', '#', 2),
    ('resources', 'Blog', '#', 3),
    ('resources', 'Support', '#', 4),
    
    -- Company links
    ('company', 'About', '/crm#about', 1),
    ('company', 'Careers', '#', 2),
    ('company', 'Partners', '#', 3),
    ('company', 'Contact', '/crm#contact', 4)
ON CONFLICT DO NOTHING;