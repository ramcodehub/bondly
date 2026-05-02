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
CREATE INDEX IF NOT EXISTS idx_about_testimonials_order ON about_testimonials("order");
CREATE INDEX IF NOT EXISTS idx_about_testimonials_rating ON about_testimonials(rating);

-- Insert default testimonials
INSERT INTO about_testimonials (initials, name, title, company, content, rating, "order") VALUES
    ('JS', 'John Smith', 'CEO', 'TechCorp', 'This platform has transformed how we manage customer relationships. The automation features alone have saved us countless hours.', 5, 1),
    ('MJ', 'Maria Johnson', 'Marketing Director', 'GrowthInc', 'The analytics and reporting capabilities provide insights we never had before. Highly recommended for any growing business.', 5, 2),
    ('DR', 'David Rodriguez', 'Sales Manager', 'Enterprise Solutions', 'The lead management and deal tracking features have significantly improved our conversion rates.', 4, 3)
ON CONFLICT DO NOTHING;