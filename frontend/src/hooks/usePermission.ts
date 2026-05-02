import { useMemo, useCallback } from 'react';
import { useRoleStore } from '@/lib/stores/roleStore';
import { PERMISSIONS, Permission } from '@/lib/constants/permissions';

/**
 * 🛡️ PRODUCTION-GRADE PERMISSION HOOK (FINAL HARDENING)
 */
export function usePermission() {
  const { permissions, loading, myRoles } = useRoleStore();

  /**
   * can(permission)
   */
  const can = useCallback((permission: Permission | string): boolean => {
    try {
      const safePermissions = permissions || [];
      const safeRoles = myRoles || [];

      if (!permission) return true;
      
      // 1. Admin/Management Bypass
      if (
        safeRoles.some(r => r.name?.toLowerCase() === 'admin') ||
        safePermissions.includes(PERMISSIONS.USERS_MANAGE)
      ) return true;
      
      // 2. Direct Permission Check
      if (safePermissions.includes(permission)) return true;
      
      // 3. Fallback Support
      if (permission === PERMISSIONS.DEALS_READ) {
        return safeRoles.some(r => ['sales rep', 'sales manager'].includes(r.name?.toLowerCase() || ''));
      }

      return false;
    } catch (err) {
      console.error('[RBAC Hook] Error:', err);
      return false;
    }
  }, [permissions, myRoles]);

  const canAny = useCallback((perms: (Permission | string)[]): boolean => {
    return (perms || []).some(p => can(p));
  }, [can]);

  // Phase 8: Fix undefined variable bug and return memoized object
  return useMemo(() => ({
    can,
    canAny,
    loading: loading || false,
    permissions: permissions || [],
    PERMISSIONS
  }), [can, canAny, loading, permissions]);
}
