import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/team-members - list team members with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('team_members')
    .select('*', { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,role.ilike.%${search}%`);
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

// GET /api/team-members/:id - get single team member
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Team member not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/team-members - create new team member
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const memberData = req.body;
  
  // Basic validation
  if (!memberData.name || !memberData.email) {
    return res.status(400).json({ 
      success: false,
      message: 'Team member name and email are required' 
    });
  }

  const { data, error } = await supabase
    .from('team_members')
    .insert([{
      ...memberData,
      created_at: new Date().toISOString(),
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

// PUT /api/team-members/:id - update team member
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberData = req.body;

  const { data: existingMember } = await supabase
    .from('team_members')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingMember) {
    return res.status(404).json({ 
      success: false,
      message: 'Team member not found' 
    });
  }

  const { data, error } = await supabase
    .from('team_members')
    .update({
      ...memberData,
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

// DELETE /api/team-members/:id - delete team member
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingMember } = await supabase
    .from('team_members')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingMember) {
    return res.status(404).json({ 
      success: false,
      message: 'Team member not found' 
    });
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;