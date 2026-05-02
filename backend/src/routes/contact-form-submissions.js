import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/contact-form-submissions - list contact form submissions with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('contact_form_submissions')
    .select('*', { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
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

// GET /api/contact-form-submissions/:id - get single contact form submission
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('contact_form_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Contact form submission not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/contact-form-submissions - create new contact form submission
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const submissionData = req.body;
  
  // Basic validation
  if (!submissionData.full_name || !submissionData.email) {
    return res.status(400).json({ 
      success: false,
      message: 'Full name and email are required' 
    });
  }

  const { data, error } = await supabase
    .from('contact_form_submissions')
    .insert([{
      ...submissionData,
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

// PUT /api/contact-form-submissions/:id - update contact form submission
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submissionData = req.body;

  const { data: existingSubmission } = await supabase
    .from('contact_form_submissions')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingSubmission) {
    return res.status(404).json({ 
      success: false,
      message: 'Contact form submission not found' 
    });
  }

  const { data, error } = await supabase
    .from('contact_form_submissions')
    .update({
      ...submissionData
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

// DELETE /api/contact-form-submissions/:id - delete contact form submission
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingSubmission } = await supabase
    .from('contact_form_submissions')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingSubmission) {
    return res.status(404).json({ 
      success: false,
      message: 'Contact form submission not found' 
    });
  }

  const { error } = await supabase
    .from('contact_form_submissions')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;