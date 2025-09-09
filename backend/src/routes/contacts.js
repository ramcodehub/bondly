import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/contacts - list contacts with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('contacts')
    .select(`
      *,
      companies(name)
    `, { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`);
  }

  // Add pagination
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) throw error;
  
  // Transform data to match expected interface
  const transformedData = (data || []).map(contact => ({
    ...contact,
    company_name: contact.companies?.name || contact.company_name || ''
  }));

  res.json({
    success: true,
    data: transformedData,
    count: data?.length || 0
  });
}));

// GET /api/contacts/:id - get single contact
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      companies(name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Contact not found' 
  });

  // Transform data to match expected interface
  const transformedData = {
    ...data,
    company_name: data.companies?.name || data.company_name || ''
  };

  res.json({
    success: true,
    data: transformedData
  });
}));

// POST /api/contacts - create new contact
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const contactData = req.body;
  
  const { data, error } = await supabase
    .from('contacts')
    .insert([{
      ...contactData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select(`
      *,
      companies(name)
    `)
    .single();

  if (error) throw error;

  // Transform data to match expected interface
  const transformedData = {
    ...data,
    company_name: data.companies?.name || data.company_name || ''
  };

  res.status(201).json({
    success: true,
    data: transformedData
  });
}));

// PUT /api/contacts/:id - update contact
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contactData = req.body;

  const { data: existingContact } = await supabase
    .from('contacts')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingContact) {
    return res.status(404).json({ 
      success: false,
      message: 'Contact not found' 
    });
  }

  const { data, error } = await supabase
    .from('contacts')
    .update({
      ...contactData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      companies(name)
    `)
    .single();

  if (error) throw error;

  // Transform data to match expected interface
  const transformedData = {
    ...data,
    company_name: data.companies?.name || data.company_name || ''
  };

  res.json({
    success: true,
    data: transformedData
  });
}));

// DELETE /api/contacts/:id - delete contact
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingContact } = await supabase
    .from('contacts')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingContact) {
    return res.status(404).json({ 
      success: false,
      message: 'Contact not found' 
    });
  }

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Contact deleted successfully'
  });
}));

export default router;