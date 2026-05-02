-- Part 13: Seed Data (Sample Records)

-- 1. Roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access'),
('user', 'Regular user with standard access'),
('viewer', 'Read-only access')
ON CONFLICT (name) DO NOTHING;

-- 2. Companies
INSERT INTO companies (name, industry, size, website, status, description) VALUES
('Acme Corporation', 'Manufacturing', '201-500', 'acme.com', 'active', 'Leading manufacturer of quality products'),
('Globex Corporation', 'Technology', '51-200', 'globex.com', 'prospect', 'Innovative technology solutions provider'),
('Initech', 'Finance', '11-50', 'initech.io', 'inactive', 'Financial services and consulting')
ON CONFLICT DO NOTHING;

-- 3. CRM Data
INSERT INTO contacts (first_name, last_name, email, phone, position, status) VALUES
('John', 'Doe', 'john.doe@acme.com', '+1-555-0123', 'CTO', 'active'),
('Jane', 'Smith', 'jane.smith@globex.com', '+1-555-0456', 'Marketing Director', 'active'),
('Bob', 'Johnson', 'bob.johnson@initech.com', '+1-555-0789', 'CEO', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO marketing_campaign (name, type, status) VALUES
('Summer Promotion', 'Email', 'active'),
('Social Media Campaign', 'Social', 'active'),
('Webinar Series', 'Event', 'planning')
ON CONFLICT DO NOTHING;

-- 4. Billing Plans
INSERT INTO billing_plans (name, price, description, features, is_current, recommended) VALUES
('Starter', '$29/month', 'Perfect for small teams', ARRAY['Up to 5 users', 'Basic features', 'Email support'], true, false),
('Professional', '$79/month', 'Great for growing businesses', ARRAY['Up to 20 users', 'Advanced features', 'Priority support', 'Analytics'], false, true),
('Enterprise', '$199/month', 'For large organizations', ARRAY['Unlimited users', 'All features', '24/7 support', 'Custom integrations', 'Dedicated account manager'], false, false)
ON CONFLICT DO NOTHING;
