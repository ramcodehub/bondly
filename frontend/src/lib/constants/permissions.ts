/**
 * 🛡️ PERMISSIONS CONSTANTS
 * Centralized enum-like structure for RBAC type safety.
 */
export const PERMISSIONS = {
  // Deals Module
  DEALS_READ: 'deals.read',
  DEALS_CREATE: 'deals.create',
  DEALS_UPDATE: 'deals.update',
  DEALS_DELETE: 'deals.delete',

  // Contacts Module
  CONTACTS_READ: 'contacts.read',
  CONTACTS_CREATE: 'contacts.create',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // User Management
  USERS_MANAGE: 'users.manage',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
