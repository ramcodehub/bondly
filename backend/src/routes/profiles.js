import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/profiles - list profiles with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%,email.ilike.%${search}%`);
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

// GET /api/profiles/:id - get single profile
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Profile not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/profiles - create new profile
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const profileData = req.body;
  
  // Basic validation
  if (!profileData.id) {
    return res.status(400).json({ 
      success: false,
      message: 'Profile ID is required' 
    });
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      ...profileData,
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

// PUT /api/profiles/:id - update profile
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const profileData = req.body;

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingProfile) {
    return res.status(404).json({ 
      success: false,
      message: 'Profile not found' 
    });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
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

// DELETE /api/profiles/:id - delete profile
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingProfile) {
    return res.status(404).json({ 
      success: false,
      message: 'Profile not found' 
    });
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;