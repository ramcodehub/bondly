CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    color VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX idx_features_sort_order ON features(sort_order);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON features
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- Public can view only enabled features
CREATE POLICY "Public can view enabled features" 
ON features FOR SELECT 
USING (enabled = TRUE);

-- Optional admin policy
-- CREATE POLICY "Admins can manage features"
-- ON features FOR ALL
-- USING (auth.jwt()->>'role' = 'admin');
