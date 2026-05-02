-- Create hero_stats table
CREATE TABLE IF NOT EXISTS hero_stats (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    value VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_hero_stats_order ON hero_stats("order");

-- Insert default hero stats
INSERT INTO hero_stats (title, value, description, "order") VALUES
    ('Active Users', '10K+', 'Active Users', 1),
    ('Uptime', '99.9%', 'Uptime', 2),
    ('Support', '24/7', 'Support', 3),
    ('Security', '100%', 'Secure', 4)
ON CONFLICT DO NOTHING;