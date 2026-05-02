-- ========================================================================================
-- SUPABASE CRM COMPLETE SCHEMA (SUPPLEMENTARY)
-- Note: Uses IF NOT EXISTS to prevent breaking existing data flow.
-- Lifecycle Flow: lead -> contact -> account -> opportunity -> transaction
-- ========================================================================================

-- ==========================================
-- CRM CONFIGURATION (Seed Data Sources)
-- ==========================================

-- Lead Sources
CREATE TABLE IF NOT EXISTS lead_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE lead_sources IS 'Predefined sources for leads (e.g., Website, Referral).';

-- Opportunity Stages
CREATE TABLE IF NOT EXISTS opportunity_stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    probability_percent INTEGER CHECK (probability_percent >= 0 AND probability_percent <= 100),
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE opportunity_stages IS 'Sales pipeline stages (e.g., Prospecting, Closed Won).';

-- ==========================================
-- COMMERCE (Products, Pricebook, Transactions)
-- ==========================================

-- Products
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE products IS 'Catalog of available products or services.';

-- Pricebook
CREATE TABLE IF NOT EXISTS pricebook (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    unit_price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE pricebook IS 'Pricing history and current prices for products.';

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES deals(id) ON DELETE CASCADE,  -- Linking to existing 'deals' table
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE transactions IS 'Financial records for closed-won opportunities/deals.';
CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);

-- ==========================================
-- SYSTEM (Audit Logs, Notifications)
-- ==========================================

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    performed_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE audit_logs IS 'System-wide audit trail for critical changes.';
CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON audit_logs(table_name, record_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE notifications IS 'User-specific system notifications.';
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ==========================================
-- ACTIVITY RELATIONS (Linking existing tables)
-- ==========================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_type VARCHAR(50) NOT NULL, -- e.g., Call, Email, Meeting
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    activity_date TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE activities IS 'Log of interactions (Calls, Emails, Meetings).';

CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT notes_target_check CHECK (
        (lead_id IS NOT NULL)::int + 
        (contact_id IS NOT NULL)::int + 
        (account_id IS NOT NULL)::int + 
        (deal_id IS NOT NULL)::int > 0
    )
);
COMMENT ON TABLE notes IS 'General text notes attached to CRM records.';

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- SEED DATA
-- ==========================================

INSERT INTO lead_sources (name) VALUES 
('Website Form'), ('Cold Call'), ('Referral'), ('Trade Show'), ('LinkedIn')
ON CONFLICT (name) DO NOTHING;

INSERT INTO opportunity_stages (name, probability_percent, sequence_order) VALUES 
('Prospecting', 10, 1),
('Qualification', 20, 2),
('Proposal', 50, 3),
('Negotiation', 80, 4),
('Closed Won', 100, 5),
('Closed Lost', 0, 6)
ON CONFLICT (name) DO NOTHING;
