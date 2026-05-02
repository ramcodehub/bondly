import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/interactions - list interactions with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('interactions')
    .select(`
      *,
      contacts(first_name, last_name)
    `, { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`type.ilike.%${search}%,description.ilike.%${search}%`);
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

// GET /api/interactions/:id - get single interaction
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('interactions')
    .select(`
      *,
      contacts(first_name, last_name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Interaction not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/interactions - create new interaction
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const interactionData = req.body;
  
  // Basic validation
  if (!interactionData.contact_id || !interactionData.type) {
    return res.status(400).json({ 
      success: false,
      message: 'Contact ID and type are required' 
    });
  }

  const { data, error } = await supabase
    .from('interactions')
    .insert([{
      ...interactionData,
      created_at: new Date().toISOString(),
      created_by: req.user?.id // Assuming you have user info in req.user
    }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
}));

// PUT /api/interactions/:id - update interaction
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const interactionData = req.body;

  const { data: existingInteraction } = await supabase
    .from('interactions')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingInteraction) {
    return res.status(404).json({ 
      success: false,
      message: 'Interaction not found' 
    });
  }

  const { data, error } = await supabase
    .from('interactions')
    .update({
      ...interactionData
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

// DELETE /api/interactions/:id - delete interaction
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingInteraction } = await supabase
    .from('interactions')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingInteraction) {
    return res.status(404).json({ 
      success: false,
      message: 'Interaction not found' 
    });
  }

  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;