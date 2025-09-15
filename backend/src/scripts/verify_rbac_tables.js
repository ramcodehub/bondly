#!/usr/bin/env node

/**
 * Script to verify RBAC tables exist and have correct structure
 * Usage: node src/scripts/verify_rbac_tables.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for full access
);

async function verifyTables() {
  console.log('Verifying RBAC tables...');
  
  try {
    // Check if roles table exists
    const { data: rolesTable, error: rolesError } = await supabase
      .from('roles')
      .select('id, name, description')
      .limit(1);
    
    if (rolesError) {
      console.error('❌ Roles table verification failed:', rolesError.message);
      return false;
    }
    
    console.log('✅ Roles table exists and is accessible');
    
    // Check if user_roles table exists
    const { data: userRolesTable, error: userRolesError } = await supabase
      .from('user_roles')
      .select('id, user_id, role_id')
      .limit(1);
    
    if (userRolesError) {
      console.error('❌ User roles table verification failed:', userRolesError.message);
      return false;
    }
    
    console.log('✅ User roles table exists and is accessible');
    
    // Check if rbac_settings table exists
    const { data: settingsTable, error: rbacSettingsError } = await supabase
      .from('rbac_settings')
      .select('id, enforce_roles')
      .limit(1);
    
    if (rbacSettingsError) {
      console.error('❌ RBAC settings table verification failed:', rbacSettingsError.message);
      return false;
    }
    
    console.log('✅ RBAC settings table exists and is accessible');
    
    // Check if role_audit table exists
    const { data: auditTable, error: auditError } = await supabase
      .from('role_audit')
      .select('id, user_id, role_id, action')
      .limit(1);
    
    if (auditError) {
      console.error('❌ Role audit table verification failed:', auditError.message);
      return false;
    }
    
    console.log('✅ Role audit table exists and is accessible');
    
    // Check if baseline roles exist
    const { data: roles, error: rolesDataError } = await supabase
      .from('roles')
      .select('name')
      .order('name');
    
    if (rolesDataError) {
      console.error('❌ Failed to fetch roles:', rolesDataError.message);
      return false;
    }
    
    const expectedRoles = [
      'Admin',
      'Marketing Manager',
      'Marketing Agent',
      'Sales Manager',
      'Sales Representative'
    ];
    
    const existingRoles = roles.map(role => role.name);
    const missingRoles = expectedRoles.filter(role => !existingRoles.includes(role));
    
    if (missingRoles.length > 0) {
      console.warn('⚠️  Missing baseline roles:', missingRoles);
    } else {
      console.log('✅ All baseline roles exist');
    }
    
    console.log('\n📋 Current roles in database:');
    roles.forEach(role => {
      console.log(`  - ${role.name}`);
    });
    
    // Check RBAC settings
    const { data: settings, error: settingsConfigError } = await supabase
      .from('rbac_settings')
      .select('enforce_roles')
      .limit(1);
    
    if (!settingsConfigError && settings && settings.length > 0) {
      console.log(`\n🔧 RBAC Enforcement: ${settings[0].enforce_roles ? 'ENABLED' : 'DISABLED'}`);
    }
    
    console.log('\n✅ RBAC tables verification completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed with exception:', error.message);
    return false;
  }
}

// Run verification
verifyTables().then(success => {
  if (!success) {
    process.exit(1);
  }
});