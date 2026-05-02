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

-- Create about_testimonials table
CREATE TABLE IF NOT EXISTS about_testimonials (
    id SERIAL PRIMARY KEY,
    initials VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_about_features_order ON about_features("order");
CREATE INDEX IF NOT EXISTS idx_about_testimonials_order ON about_testimonials("order");

-- Insert default about features
INSERT INTO about_features (icon_name, title, description, "order") VALUES
    ('Users', 'Customer-Centric Approach', 'Built with the customer at the center of everything we do, ensuring seamless relationship management.', 1),
    ('TrendingUp', 'Data-Driven Insights', 'Powerful analytics and reporting tools to help you make informed business decisions.', 2),
    ('Shield', 'Enterprise Security', 'Bank-level security with end-to-end encryption to keep your data safe and compliant.', 3)
ON CONFLICT DO NOTHING;

-- Insert default testimonials
INSERT INTO about_testimonials (initials, name, title, company, content, rating, "order") VALUES
    ('JD', 'John Doe', 'CEO', 'TechCorp', 'Bondly transformed how we manage customer relationships. Our sales team is 40% more productive!', 5, 1),
    ('AS', 'Alice Smith', 'Marketing Director', 'GrowthInc', 'The analytics dashboard alone is worth the investment. We''ve increased our conversion rate by 25%.', 5, 2),
    ('RJ', 'Robert Johnson', 'CTO', 'InnovateCo', 'Implementation was seamless and the support team is exceptional. Highly recommended!', 5, 3)
ON CONFLICT DO NOTHING;