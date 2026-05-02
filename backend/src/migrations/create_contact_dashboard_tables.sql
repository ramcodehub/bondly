-- Create Contact Lists Table
CREATE TABLE IF NOT EXISTS contact_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  contact_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact Segments Table
CREATE TABLE IF NOT EXISTS contact_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB, -- Store segment criteria as JSON
  contact_count INTEGER DEFAULT 0,
  segment_type VARCHAR(50) DEFAULT 'custom' CHECK (segment_type IN ('demographics', 'behavior', 'engagement', 'custom')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact Topics Table
CREATE TABLE IF NOT EXISTS contact_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  conversation_count INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Lead Qualifications Table
CREATE TABLE IF NOT EXISTS lead_qualifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  qualification_score INTEGER DEFAULT 0,
  bant_score JSONB, -- Budget, Authority, Need, Timeline
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost')),
  notes TEXT,
  qualified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  qualified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact List Memberships Table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS contact_list_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  list_id UUID REFERENCES contact_lists(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contact_id, list_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_lists_name ON contact_lists(name);
CREATE INDEX IF NOT EXISTS idx_contact_lists_created_by ON contact_lists(created_by);
CREATE INDEX IF NOT EXISTS idx_contact_segments_name ON contact_segments(name);
CREATE INDEX IF NOT EXISTS idx_contact_segments_type ON contact_segments(segment_type);
CREATE INDEX IF NOT EXISTS idx_contact_segments_created_by ON contact_segments(created_by);
CREATE INDEX IF NOT EXISTS idx_contact_topics_name ON contact_topics(name);
CREATE INDEX IF NOT EXISTS idx_contact_topics_category ON contact_topics(category);
CREATE INDEX IF NOT EXISTS idx_contact_topics_trending ON contact_topics(is_trending);
CREATE INDEX IF NOT EXISTS idx_lead_qualifications_lead_id ON lead_qualifications(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_qualifications_status ON lead_qualifications(status);
CREATE INDEX IF NOT EXISTS idx_lead_qualifications_score ON lead_qualifications(qualification_score);
CREATE INDEX IF NOT EXISTS idx_contact_list_memberships_contact_id ON contact_list_memberships(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_list_memberships_list_id ON contact_list_memberships(list_id);

-- Enable Row Level Security
ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_list_memberships ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Contact Lists Policies
CREATE POLICY "Users can view their own contact lists" ON contact_lists
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can insert their own contact lists" ON contact_lists
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own contact lists" ON contact_lists
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own contact lists" ON contact_lists
  FOR DELETE USING (created_by = auth.uid());

-- Contact Segments Policies
CREATE POLICY "Users can view their own contact segments" ON contact_segments
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can insert their own contact segments" ON contact_segments
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own contact segments" ON contact_segments
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own contact segments" ON contact_segments
  FOR DELETE USING (created_by = auth.uid());

-- Contact Topics Policies
CREATE POLICY "Users can view contact topics" ON contact_topics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert contact topics" ON contact_topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own contact topics" ON contact_topics
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own contact topics" ON contact_topics
  FOR DELETE USING (created_by = auth.uid());

-- Lead Qualifications Policies
CREATE POLICY "Users can view lead qualifications" ON lead_qualifications
  FOR SELECT USING (true);

CREATE POLICY "Users can insert lead qualifications" ON lead_qualifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update lead qualifications" ON lead_qualifications
  FOR UPDATE USING (qualified_by = auth.uid() OR auth.role() = 'authenticated');

CREATE POLICY "Users can delete lead qualifications" ON lead_qualifications
  FOR DELETE USING (qualified_by = auth.uid() OR auth.role() = 'authenticated');

-- Contact List Memberships Policies
CREATE POLICY "Users can view contact list memberships" ON contact_list_memberships
  FOR SELECT USING (true);

CREATE POLICY "Users can insert contact list memberships" ON contact_list_memberships
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete contact list memberships" ON contact_list_memberships
  FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON contact_lists TO authenticated;
GRANT ALL ON contact_segments TO authenticated;
GRANT ALL ON contact_topics TO authenticated;
GRANT ALL ON lead_qualifications TO authenticated;
GRANT ALL ON contact_list_memberships TO authenticated;

-- Insert sample data to match the static UI
-- Contact Lists
INSERT INTO contact_lists (name, description, contact_count, is_active, created_by) VALUES
('All Contacts', 'Your complete contact database', 12483, true, NULL),
('VIP Customers', 'High-value customers and prospects', 1248, true, NULL),
('Newsletter Subscribers', 'Contacts subscribed to newsletters', 8742, true, NULL)
ON CONFLICT DO NOTHING;

-- Contact Segments
INSERT INTO contact_segments (name, description, contact_count, segment_type, is_active, created_by) VALUES
('Age 18-30', 'Segments based on age demographics', 2483, 'demographics', true, NULL),
('Age 31-50', 'Segments based on age demographics', 5742, 'demographics', true, NULL),
('Age 51+', 'Segments based on age demographics', 4258, 'demographics', true, NULL),
('Frequent Visitors', 'Segments based on user behavior', 1842, 'behavior', true, NULL),
('Recent Signups', 'Segments based on user behavior', 2148, 'behavior', true, NULL),
('Inactive Users', 'Segments based on user behavior', 3241, 'behavior', true, NULL),
('Highly Engaged', 'Segments based on engagement level', 3742, 'engagement', true, NULL),
('Moderately Engaged', 'Segments based on engagement level', 4841, 'engagement', true, NULL),
('Low Engagement', 'Segments based on engagement level', 3900, 'engagement', true, NULL),
('Premium Subscribers', 'Subscribers with premium plans', 1248, 'custom', true, NULL),
('Cart Abandoners', 'Users who left items in cart', 842, 'custom', true, NULL),
('Product Enthusiasts', 'Users who viewed product pages', 2148, 'custom', true, NULL)
ON CONFLICT DO NOTHING;

-- Contact Topics
INSERT INTO contact_topics (name, description, category, conversation_count, is_trending, status, created_by) VALUES
('Product Feedback', 'Customer feedback about products', 'feedback', 1248, false, 'active', NULL),
('Support Requests', 'Customer support related topics', 'support', 2483, false, 'active', NULL),
('Feature Requests', 'Customer requested features', 'features', 842, false, 'active', NULL),
('New Product Launch', 'Discussed by 1,248 contacts', 'announcements', 1248, true, 'active', NULL),
('Pricing Changes', 'Discussed by 842 contacts', 'pricing', 842, true, 'active', NULL),
('Mobile App Updates', 'Discussed by 641 contacts', 'product', 641, false, 'active', NULL)
ON CONFLICT DO NOTHING;

-- Lead Qualifications (sample data would require actual leads to exist)