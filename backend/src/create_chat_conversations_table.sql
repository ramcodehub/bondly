-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_category ON chat_conversations(category);

-- Insert default chat conversations
INSERT INTO chat_conversations (question, answer, category) VALUES
    ('How do I add a new lead?', 'Go to Dashboard → Leads → Add Lead button. Fill in name, email, phone, and source, then click Save.', 'leads'),
    ('How do I view lead nurturing actions?', 'Navigate to Dashboard → Leads, select a lead, and click on the ''Nurturing'' tab to see all nurturing actions and activities.', 'leads'),
    ('How do I check opportunity pipeline?', 'Go to Dashboard → Deals to view your opportunity pipeline. You can filter by stage, owner, or date range to see specific opportunities.', 'deals'),
    ('How do I add an interaction to a contact?', 'Go to Dashboard → Contacts, select a contact, and click ''Add Interaction''. Choose the type (call, email, meeting), add details, and save.', 'contacts'),
    ('How do I track company transactions?', 'Navigate to Dashboard → Companies, select a company, and view the ''Transactions'' tab to see all financial activities and payment history.', 'companies'),
    ('How do I view service lifecycle stages?', 'Go to Dashboard → Services to see all services and their lifecycle stages. You can filter by status or service type to find specific information.', 'services'),
    ('How do I generate lead source analytics report?', 'Go to Dashboard → Reports → Lead Analytics. Select date range and lead sources to generate a detailed report on lead performance by source.', 'reports'),
    ('How do I update account details?', 'Navigate to Dashboard → Companies, select the company account, and click ''Edit''. Update the required fields and save your changes.', 'companies'),
    ('How do I view team performance dashboard?', 'Go to Dashboard → Reports → Team Performance to see metrics on deals closed, revenue generated, and tasks completed by team members.', 'reports'),
    ('How do I get system help?', 'Click on the chat assistant icon in the bottom-right corner for instant help, or go to Dashboard → Settings → Help for documentation and support.', 'general')
ON CONFLICT DO NOTHING;