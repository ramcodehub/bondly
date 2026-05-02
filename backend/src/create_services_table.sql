-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    icon_name VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");

-- Insert default services
INSERT INTO services (icon_name, title, description, "order") VALUES
    ('Target', 'Lead Management', 'Capture, track, and nurture leads through your sales pipeline with automated workflows.', 1),
    ('DollarSign', 'Deal Tracking', 'Monitor deals at every stage with forecasting tools and pipeline visibility.', 2),
    ('CheckSquare', 'Task Management', 'Assign, track, and complete tasks with priority levels and deadline reminders.', 3),
    ('Users', 'Contact Management', 'Store and organize all your customer information in one centralized location.', 4),
    ('BarChart3', 'Analytics & Reporting', 'Gain insights with customizable dashboards and detailed performance reports.', 5),
    ('Zap', 'Automation', 'Streamline repetitive tasks with powerful automation and workflow features.', 6)
ON CONFLICT DO NOTHING;