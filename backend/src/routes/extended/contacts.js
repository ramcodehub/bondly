import express from 'express';
import supabase from '../../config/supabase.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { sanitizeInput } from '../../middleware/validation.js';

const router = express.Router({ mergeParams: true });

// GET /api/extended/contacts/:id/interactions - Get all interactions for a contact
router.get('/:id/interactions', asyncHandler(async (req, res) => {
  const contactId = req.params.id;
  
  // Validate contact exists
  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('id')
    .eq('id', contactId)
    .single();
    
  if (contactError || !contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }
  
  // Get interactions
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(`Failed to fetch interactions: ${error.message}`);
  }
  
  res.json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}));

// POST /api/extended/contacts/:id/interactions - Create a new interaction for a contact
router.post('/:id/interactions', sanitizeInput, asyncHandler(async (req, res) => {
  const contactId = req.params.id;
  const { type, description } = req.body;
  
  // Validate contact exists
  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .select('id')
    .eq('id', contactId)
    .single();
    
  if (contactError || !contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }
  
  // Validate required fields
  if (!type) {
    return res.status(400).json({
      success: false,
      message: 'Interaction type is required'
    });
  }
  
  // Create interaction
  const { data, error } = await supabase
    .from('interactions')
    .insert({
      contact_id: contactId,
      type,
      description,
      created_by: req.user?.id // Assuming user is attached to request by auth middleware
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create interaction: ${error.message}`);
  }
  
  res.status(201).json({
    success: true,
    data,
    message: 'Interaction created successfully'
  });
}));

// PUT /api/extended/contacts/interactions/:id - Update an interaction
router.put('/interactions/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const interactionId = req.params.id;
  const { type, description } = req.body;
  
  // Update interaction
  const { data, error } = await supabase
    .from('interactions')
    .update({
      type,
      description,
      updated_at: new Date().toISOString()
    })
    .eq('id', interactionId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to update interaction: ${error.message}`);
  }
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Interaction not found'
    });
  }
  
  res.json({
    success: true,
    data,
    message: 'Interaction updated successfully'
  });
}));

// DELETE /api/extended/contacts/interactions/:id - Delete an interaction
router.delete('/interactions/:id', asyncHandler(async (req, res) => {
  const interactionId = req.params.id;
  
  // Delete interaction
  const { data, error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', interactionId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to delete interaction: ${error.message}`);
  }
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Interaction not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Interaction deleted successfully'
  });
}));

export default router;