import supabase from '../config/supabase.js';

/**
 * Middleware to check if user has required roles
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get user ID from request (set by auth middleware)
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Fetch user roles from database
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select(`
          roles(name)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Extract role names
      const roleNames = userRoles.map(userRole => userRole.roles.name);

      // Check if user has any of the allowed roles
      const hasPermission = roleNames.some(roleName => 
        allowedRoles.includes(roleName)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      // User has permission, proceed to next middleware
      next();
    } catch (error) {
      console.error('Error checking user roles:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify permissions',
        error: error.message
      });
    }
  };
};

export { requireRole };