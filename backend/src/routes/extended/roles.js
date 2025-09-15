import express from 'express';
import { body, param, validationResult } from 'express-validator';
import supabase from '../../config/supabase.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';

const router = express.Router();

// GET /api/extended/roles/me — get current user's roles
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id; // From auth middleware
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        roles(id, name, description)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const roles = data.map(item => item.roles);

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error fetching my roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message
    });
  }
});

// GET /api/extended/roles/settings — get RBAC settings (Admin only)
router.get('/settings',
  requireAuth,
  requireRole('Admin'),
  async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('rbac_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      // If no settings exist, return default values
      const settings = data || { enforce_roles: false };

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error fetching RBAC settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch RBAC settings',
        error: error.message
      });
    }
  }
);

// PUT /api/extended/roles/settings — update RBAC settings (Admin only)
router.put('/settings',
  requireAuth,
  requireRole('Admin'),
  [
    body('enforce_roles').isBoolean().withMessage('enforce_roles must be a boolean')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { enforce_roles } = req.body;

      // Check if settings already exist
      const { data: existingSettings, error: fetchError } = await supabase
        .from('rbac_settings')
        .select('*')
        .limit(1);

      if (fetchError) throw fetchError;

      let data, error;
      
      if (existingSettings && existingSettings.length > 0) {
        // Update existing settings
        ({ data, error } = await supabase
          .from('rbac_settings')
          .update({ enforce_roles })
          .eq('id', existingSettings[0].id)
          .select()
          .single());
      } else {
        // Create new settings
        ({ data, error } = await supabase
          .from('rbac_settings')
          .insert([{ enforce_roles }])
          .select()
          .single());
      }

      if (error) throw error;

      res.json({
        success: true,
        message: 'RBAC settings updated successfully',
        data
      });
    } catch (error) {
      console.error('Error updating RBAC settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update RBAC settings',
        error: error.message
      });
    }
  }
);

// GET /api/extended/roles — list roles
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message
    });
  }
});

// POST /api/extended/roles — create role (Admin-only)
router.post('/', 
  requireAuth,
  requireRole('Admin'),
  [
    body('name').notEmpty().withMessage('Role name is required'),
    body('description').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, description } = req.body;

      const { data, error } = await supabase
        .from('roles')
        .insert([{ name, description }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data
      });
    } catch (error) {
      console.error('Error creating role:', error);
      
      // Handle duplicate role name
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create role',
        error: error.message
      });
    }
  }
);

// GET /api/extended/roles/:id — get role details
router.get('/:id',
  requireAuth,
  requireRole('Admin'),
  [
    param('id').isInt().withMessage('Invalid role ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;

      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch role',
        error: error.message
      });
    }
  }
);

// PUT /api/extended/roles/:id — update role (Admin-only)
router.put('/:id',
  requireAuth,
  requireRole('Admin'),
  [
    param('id').isInt().withMessage('Invalid role ID'),
    body('name').optional().notEmpty().withMessage('Role name cannot be empty'),
    body('description').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { name, description } = req.body;

      // Check if role exists
      const { data: existingRole, error: fetchError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (!existingRole) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      // Update role
      const { data, error } = await supabase
        .from('roles')
        .update({ name, description })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        message: 'Role updated successfully',
        data
      });
    } catch (error) {
      console.error('Error updating role:', error);
      
      // Handle duplicate role name
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update role',
        error: error.message
      });
    }
  }
);

// DELETE /api/extended/roles/:id — delete role (Admin-only)
router.delete('/:id',
  requireAuth,
  requireRole('Admin'),
  [
    param('id').isInt().withMessage('Invalid role ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;

      // Check if role is assigned to any users
      const { data: assignedUsers, error: checkError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role_id', id)
        .limit(1);

      if (checkError) throw checkError;

      if (assignedUsers && assignedUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete role that is assigned to users. Unassign users first.'
        });
      }

      const { data, error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Role deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete role',
        error: error.message
      });
    }
  }
);

// GET /api/extended/roles/users/:userId — get roles for a user
router.get('/users/:userId',
  requireAuth,
  requireRole('Admin'),
  [
    param('userId').isUUID().withMessage('Invalid user ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { userId } = req.params;

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles(id, name, description)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const roles = data.map(item => item.roles);

      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      console.error('Error fetching user roles:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user roles',
        error: error.message
      });
    }
  }
);

// POST /api/extended/roles/users/:userId — assign role to user (Admin-only)
router.post('/users/:userId',
  requireAuth,
  requireRole('Admin'),
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
    body('role_id').isInt().withMessage('Invalid role ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { userId } = req.params;
      const { role_id } = req.body;
      const assigned_by = req.user?.id; // From auth middleware

      const { data, error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: userId,
          role_id: role_id,
          assigned_by: assigned_by
        }])
        .select(`
          id,
          roles(id, name, description)
        `)
        .single();

      if (error) throw error;

      // Log audit event
      await logAuditEvent(userId, role_id, 'ASSIGNED', assigned_by, null, req);

      res.status(201).json({
        success: true,
        message: 'Role assigned successfully',
        data: data.roles
      });
    } catch (error) {
      console.error('Error assigning role:', error);
      
      // Handle duplicate assignment
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'User already has this role assigned'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to assign role',
        error: error.message
      });
    }
  }
);

// DELETE /api/extended/roles/users/:userId/:roleId — remove role from user (Admin-only)
router.delete('/users/:userId/:roleId',
  requireAuth,
  requireRole('Admin'),
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
    param('roleId').isInt().withMessage('Invalid role ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { userId, roleId } = req.params;
      const assigned_by = req.user?.id; // From auth middleware

      const { data, error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) throw error;

      // Log audit event
      await logAuditEvent(userId, roleId, 'UNASSIGNED', assigned_by, null, req);

      res.json({
        success: true,
        message: 'Role removed successfully'
      });
    } catch (error) {
      console.error('Error removing role:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove role',
        error: error.message
      });
    }
  }
);

// GET /api/extended/roles/users — get all users with their roles (Admin-only)
router.get('/users',
  requireAuth,
  requireRole('Admin'),
  async (req, res) => {
    try {
      // Get all users from profiles table
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('full_name');

      if (usersError) throw usersError;

      // Get all user roles
      const { data: allUserRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles(id, name)
        `);

      if (rolesError) throw rolesError;

      // Combine users with their roles
      const usersWithRoles = users.map(user => {
        const userRoles = allUserRoles
          .filter(ur => ur.user_id === user.id)
          .map(ur => ur.roles);
        
        return {
          ...user,
          roles: userRoles
        };
      });

      res.json({
        success: true,
        data: usersWithRoles
      });
    } catch (error) {
      console.error('Error fetching users with roles:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users with roles',
        error: error.message
      });
    }
  }
);

// Audit logging function
async function logAuditEvent(userId, roleId, action, assignedBy, notes, req) {
  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    const { error } = await supabase
      .from('role_audit')
      .insert([{
        user_id: userId,
        role_id: roleId,
        action: action,
        assigned_by: assignedBy,
        ip_address: ipAddress,
        user_agent: req.headers['user-agent'],
        notes: notes
      }]);

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Error in audit logging:', error);
  }
}

export default router;