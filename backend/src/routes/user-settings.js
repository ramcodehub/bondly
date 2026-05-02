import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/user-settings - list user settings with pagination
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('user_settings')
    .select(`
      *,
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

// GET /api/user-settings/:id - get single user setting
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('user_settings')
    .select(`
      *,
      profiles(full_name, username)
    `)
    .eq('user_id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'User settings not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/user-settings - create new user settings
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const settingsData = req.body;
  
  // Basic validation
  if (!settingsData.user_id) {
    return res.status(400).json({ 
      success: false,
      message: 'User ID is required' 
    });
  }

  const { data, error } = await supabase
    .from('user_settings')
    .insert([{
      ...settingsData,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
}));

// PUT /api/user-settings/:id - update user settings
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const settingsData = req.body;

  const { data: existingSettings } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('user_id', id)
    .single();

  if (!existingSettings) {
    return res.status(404).json({ 
      success: false,
      message: 'User settings not found' 
    });
  }

  const { data, error } = await supabase
    .from('user_settings')
    .update({
      ...settingsData,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
}));

// DELETE /api/user-settings/:id - delete user settings
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingSettings } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('user_id', id)
    .single();

  if (!existingSettings) {
    return res.status(404).json({ 
      success: false,
      message: 'User settings not found' 
    });
  }

  const { error } = await supabase
    .from('user_settings')
    .delete()
    .eq('user_id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;