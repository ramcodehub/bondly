import fs from 'fs';
import path from 'path';

describe('RBAC Settings and Audit Migration', () => {
  const migrationFile = path.join(__dirname, '..', 'src', 'migrations', '202504_add_rbac_settings_and_audit.sql');
  
  test('Migration file exists', () => {
    expect(fs.existsSync(migrationFile)).toBe(true);
  });
  
  test('Migration file has content', () => {
    const content = fs.readFileSync(migrationFile, 'utf8');
    expect(content.length).toBeGreaterThan(0);
  });
  
  test('Migration creates rbac_settings table', () => {
    const content = fs.readFileSync(migrationFile, 'utf8');
    expect(content).toMatch(/CREATE TABLE IF NOT EXISTS public.rbac_settings/);
  });
  
  test('Migration creates role_audit table', () => {
    const content = fs.readFileSync(migrationFile, 'utf8');
    expect(content).toMatch(/CREATE TABLE IF NOT EXISTS public.role_audit/);
  });
  
  test('rbac_settings table has correct columns', () => {
    const content = fs.readFileSync(migrationFile, 'utf8');
    expect(content).toMatch(/enforce_roles BOOLEAN NOT NULL DEFAULT false/);
    expect(content).toMatch(/created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW/);
    expect(content).toMatch(/updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW/);
  });
  
  test('role_audit table has correct columns', () => {
    const content = fs.readFileSync(migrationFile, 'utf8');
    expect(content).toMatch(/action VARCHAR\(20\) NOT NULL CHECK \(action IN \('ASSIGNED', 'UNASSIGNED', 'MODIFIED'\)\)/);
    expect(content).toMatch(/assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW/);
    expect(content).toMatch(/notes TEXT/);
    expect(content).toMatch(/ip_address INET/);
    expect(content).toMatch(/user_agent TEXT/);
  });
  
  test('Migration includes proper indexes', () => {
    const content = fs.readFileSync(migrationFile, 'utf8');
    expect(content).toMatch(/CREATE INDEX IF NOT EXISTS idx_rbac_settings_enforce/);
    expect(content).toMatch(/CREATE INDEX IF NOT EXISTS idx_role_audit_user_id/);
    expect(content).toMatch(/CREATE INDEX IF NOT EXISTS idx_role_audit_role_id/);
    expect(content).toMatch(/CREATE INDEX IF NOT EXISTS idx_role_audit_action/);
  });
  
  test('Migration includes RLS policies', () => {
    const content = fs.readFileSync(migrationFile, 'utf8');
    expect(content).toMatch(/ALTER TABLE public.rbac_settings ENABLE ROW LEVEL SECURITY/);
    expect(content).toMatch(/ALTER TABLE public.role_audit ENABLE ROW LEVEL SECURITY/);
  });
  
  test('Migration includes default settings', () => {
    const content = fs.readFileSync(migrationFile, 'utf8');
    expect(content).toMatch(/INSERT INTO public.rbac_settings \(enforce_roles\)/);
    expect(content).toMatch(/SELECT false/);
    expect(content).toMatch(/WHERE NOT EXISTS/);
  });
});