import supabase from '../config/supabase.js';
import NodeCache from 'node-cache';

// Phase 4: Cache Version Control
const CACHE_VERSION = process.env.RBAC_CACHE_VERSION || 'v1';
const permissionCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * 🛡️ PRODUCTION-GRADE PERMISSION MIDDLEWARE (MICRO-HARDENED)
 */
const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    const userId = req.user?.id;
    const cacheKey = `${userId}:rbac:${CACHE_VERSION}`;

    try {
      // Phase 6: Always validate user before RBAC
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      let rbac = permissionCache.get(cacheKey);

      if (!rbac) {
        const { data, error } = await Promise.race([
          supabase
            .from('profiles')
            .select(`
              role:roles!role_id (
                name,
                role_permissions (
                  permission:permissions (name)
                )
              )
            `)
            .eq('id', userId)
            .single(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
        ]);

        if (!data || !data.role) {
          return res.status(403).json({ success: false, message: 'RBAC not initialized' });
        }

        rbac = {
          role: data.role.name,
          permissions: (data.role.role_permissions || [])
            .map(rp => rp.permission?.name)
            .filter(Boolean)
        };

        permissionCache.set(cacheKey, rbac);
      }

      if (process.env.RBAC_DEBUG === 'true') {
        console.log(`[RBAC] User: ${userId} | Required: ${requiredPermission}`);
      }

      // Phase 3: Remove Role String Dependency (Use users.manage permission)
      // Phase 6: Ensure Admin/Management check is robust
      const hasAccess = 
        rbac.permissions.includes('users.manage') || 
        rbac.permissions.includes(requiredPermission);

      if (!hasAccess) {
        return res.status(403).json({ 
          success: false, 
          message: `Insufficient permissions: ${requiredPermission}` 
        });
      }

      req.permissions = rbac.permissions;
      next();
    } catch (error) {
      console.error(`[RBAC] Critical Error:`, error);
      res.status(500).json({ success: false, message: 'Authorization unavailable' });
    }
  };
};

/**
 * ⚡ REALTIME STABILITY
 */
const invalidateCache = (userId) => {
  if (userId) {
    permissionCache.del(`${userId}:rbac:${CACHE_VERSION}`);
  } else {
    permissionCache.flushAll();
  }
};

supabase
  .channel('rbac-micro-sync')
  // Phase 5: Flush all on role/permission definition changes
  .on('postgres_changes', { event: '*', schema: 'public', table: 'role_permissions' }, () => invalidateCache())
  .on('postgres_changes', { event: '*', schema: 'public', table: 'permissions' }, () => invalidateCache())
  // Phase 5: Delete user cache on profile update
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
    invalidateCache(payload.new.id);
  })
  .subscribe();

export { requirePermission };
