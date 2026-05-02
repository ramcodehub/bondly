-- Create about_features table
CREATE TABLE IF NOT EXISTS about_features (
    id SERIAL PRIMARY KEY,
    icon_name VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_about_features_order ON about_features("order");

-- Insert default features
INSERT INTO about_features (icon_name, title, description, "order") VALUES
    ('Users', 'Customer-Centric Approach', 'Built with the customer at the center of everything we do, ensuring your success is our priority.', 1),
    ('TrendingUp', 'Data-Driven Insights', 'Powerful analytics and reporting tools to help you make informed business decisions.', 2),
    ('Shield', 'Enterprise Security', 'Bank-level security with end-to-end encryption to keep your data safe and compliant.', 3)
ON CONFLICT DO NOTHING;