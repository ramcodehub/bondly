-- Part 10: Finance and Billing

-- 1. Tables
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price VARCHAR(20) NOT NULL,
    description TEXT,
    features TEXT[],
    is_current BOOLEAN DEFAULT false,
    recommended BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Performance
CREATE INDEX IF NOT EXISTS idx_transactions_company_id ON transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_billing_plans_name ON billing_plans(name);

-- 3. Security Enablement
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_plans ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Allow authenticated full access to transactions" ON transactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on billing_plans" ON billing_plans FOR SELECT TO authenticated USING (true);
