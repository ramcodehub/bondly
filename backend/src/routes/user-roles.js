import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/user-roles - list user roles with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('user_roles')
    .select(`
      *,
      roles(name),
      profiles(full_name, username)
    `, { count: 'exact' });

  // Add pagination
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) throw error;
  
  res.json({
    success: true,
    data,
    count: data?.length || 0
  });
}));

// GET /api/user-roles/:id - get single user role
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      *,
      roles(name),
      profiles(full_name, username)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'User role not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/user-roles - create new user role
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const userRoleData = req.body;
  
  // Basic validation
  if (!userRoleData.user_id || !userRoleData.role_id) {
    return res.status(400).json({ 
      success: false,
      message: 'User ID and Role ID are required' 
    });
  }

  // Check if user role already exists
  const { data: existing } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userRoleData.user_id)
    .eq('role_id', userRoleData.role_id)
    .single();

  if (existing) {
    return res.status(400).json({ 
      success: false,
      message: 'User role already exists' 
    });
  }

  const { data, error } = await supabase
    .from('user_roles')
    .insert([{
      ...userRoleData,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
}));

// DELETE /api/user-roles/:id - delete user role
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingUserRole } = await supabase
    .from('user_roles')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingUserRole) {
    return res.status(404).json({ 
      success: false,
      message: 'User role not found' 
    });
  }

  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;