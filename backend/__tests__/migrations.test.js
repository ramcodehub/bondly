import fs from 'fs';
import path from 'path';

describe('Database Migrations', () => {
  const migrationsDir = path.join(__dirname, '..', 'src', 'migrations');
  
  test('Migration directory exists', () => {
    expect(fs.existsSync(migrationsDir)).toBe(true);
  });
  
  test('Required migration files exist', () => {
    const requiredFiles = [
      '202501_create_roles_user_roles.sql',
      '202502_create_rls_policies_roles.sql',
      '202503_alter_auth_users_table.sql',
      '202504_add_rbac_settings_and_audit.sql'
    ];
    
    requiredFiles.forEach(file => {
      const filePath = path.join(migrationsDir, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
  
  test('Migration files have proper structure', () => {
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'));
    
    migrationFiles.forEach(file => {
      const filePath = path.join(migrationsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check that file is not empty
      expect(content.length).toBeGreaterThan(0);
      
      // Check that file contains SQL comments
      expect(content).toMatch(/--/);
      
      // Check that file contains CREATE TABLE or ALTER TABLE statements
      expect(content).toMatch(/CREATE TABLE|ALTER TABLE/);
      
      // For the new migration, check for specific tables
      if (file === '202504_add_rbac_settings_and_audit.sql') {
        expect(content).toMatch(/rbac_settings/);
        expect(content).toMatch(/role_audit/);
        expect(content).toMatch(/enforce_roles/);
        expect(content).toMatch(/action/);
      }
    });
  });
  
  test('README.md exists and has content', () => {
    const readmePath = path.join(migrationsDir, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
    
    const content = fs.readFileSync(readmePath, 'utf8');
    expect(content.length).toBeGreaterThan(0);
    
    // Check for key sections
    expect(content).toMatch(/# Database Migrations/);
    expect(content).toMatch(/Migration Order/);
    expect(content).toMatch(/RBAC Tables/);
  });
});