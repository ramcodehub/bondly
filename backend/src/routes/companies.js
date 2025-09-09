import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/companies - list companies with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('companies')
    .select('*', { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%,industry.ilike.%${search}%,website.ilike.%${search}%`);
  }

  // Add pagination
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) throw error;
  
  res.json({
    data,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  });
}));

// GET /api/companies/:id - get single company
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ message: 'Company not found' });

  res.json(data);
}));

// POST /api/companies - create new company
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const companyData = req.body;
  
  // Basic validation
  if (!companyData.name) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  const { data, error } = await supabase
    .from('companies')
    .insert([{
      ...companyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json(data);
}));

// PUT /api/companies/:id - update company
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const companyData = req.body;

  const { data: existingCompany } = await supabase
    .from('companies')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingCompany) {
    return res.status(404).json({ message: 'Company not found' });
  }

  const { data, error } = await supabase
    .from('companies')
    .update({
      ...companyData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json(data);
}));

// DELETE /api/companies/:id - delete company
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingCompany } = await supabase
    .from('companies')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingCompany) {
    return res.status(404).json({ message: 'Company not found' });
  }

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;