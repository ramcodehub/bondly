import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/customer-service - list customer service records with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('customer_service')
    .select(`
      *,
      companies(name)
    `, { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`stage.ilike.%${search}%,details.ilike.%${search}%`);
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

// GET /api/customer-service/:id - get single customer service record
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('customer_service')
    .select(`
      *,
      companies(name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Customer service record not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/customer-service - create new customer service record
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const serviceData = req.body;
  
  // Basic validation
  if (!serviceData.company_id || !serviceData.stage) {
    return res.status(400).json({ 
      success: false,
      message: 'Company ID and stage are required' 
    });
  }

  const { data, error } = await supabase
    .from('customer_service')
    .insert([{
      ...serviceData,
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

// PUT /api/customer-service/:id - update customer service record
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const serviceData = req.body;

  const { data: existingService } = await supabase
    .from('customer_service')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingService) {
    return res.status(404).json({ 
      success: false,
      message: 'Customer service record not found' 
    });
  }

  const { data, error } = await supabase
    .from('customer_service')
    .update({
      ...serviceData,
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

// DELETE /api/customer-service/:id - delete customer service record
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingService } = await supabase
    .from('customer_service')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingService) {
    return res.status(404).json({ 
      success: false,
      message: 'Customer service record not found' 
    });
  }

  const { error } = await supabase
    .from('customer_service')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;