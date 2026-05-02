-- Create navigation_items table
CREATE TABLE navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    path VARCHAR(255) NOT NULL,
    shortcut VARCHAR(20),
    category VARCHAR(50) DEFAULT 'pages',
    sort_order INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster lookups
CREATE INDEX idx_navigation_items_category ON navigation_items(category);

-- Create index on sort_order for proper ordering
CREATE INDEX idx_navigation_items_sort_order ON navigation_items(sort_order);

-- Enable RLS
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (navigation items are generally public)
CREATE POLICY "Public can view navigation items" 
ON navigation_items FOR SELECT 
USING (enabled = TRUE);

-- Insert sample data for pages
INSERT INTO navigation_items (name, icon, path, shortcut, category, sort_order) VALUES
('Dashboard', 'Search', '/dashboard', '⌘1', 'pages', 1),
('Contacts', 'User', '/contacts', '⌘2', 'pages', 2),
('Companies', 'Briefcase', '/companies', '⌘3', 'pages', 3),
('Deals', 'FileText', '/deals', '⌘4', 'pages', 4),
('Tasks', 'Calendar', '/tasks', '⌘5', 'pages', 5),
('Settings', 'Settings', '/settings', '⌘,', 'pages', 6);

-- Insert sample data for actions
INSERT INTO navigation_items (name, icon, path, shortcut, category, sort_order) VALUES
('New Contact', 'Plus', '/contacts/new', '⌘N C', 'actions', 1),
('New Company', 'Plus', '/companies/new', '⌘N B', 'actions', 2),
('New Task', 'Plus', '/tasks/new', '⌘N T', 'actions', 3);

-- Insert sample data for preferences
INSERT INTO navigation_items (name, icon, path, shortcut, category, sort_order) VALUES
('Toggle Theme', 'Sun', '/theme/toggle', '⌘J', 'preferences', 1);