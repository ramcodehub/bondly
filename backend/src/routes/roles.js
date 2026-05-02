import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/roles - list roles with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('roles')
    .select('*', { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

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

// GET /api/roles/:id - get single role
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Role not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/roles - create new role
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const roleData = req.body;
  
  // Basic validation
  if (!roleData.name) {
    return res.status(400).json({ 
      success: false,
      message: 'Role name is required' 
    });
  }

  const { data, error } = await supabase
    .from('roles')
    .insert([{
      ...roleData,
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

// PUT /api/roles/:id - update role
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const roleData = req.body;

  const { data: existingRole } = await supabase
    .from('roles')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingRole) {
    return res.status(404).json({ 
      success: false,
      message: 'Role not found' 
    });
  }

  const { data, error } = await supabase
    .from('roles')
    .update({
      ...roleData,
      created_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
}));

// DELETE /api/roles/:id - delete role
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingRole } = await supabase
    .from('roles')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingRole) {
    return res.status(404).json({ 
      success: false,
      message: 'Role not found' 
    });
  }

  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;