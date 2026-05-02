import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/billing-plans - list billing plans with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('billing_plans')
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

// GET /api/billing-plans/:id - get single billing plan
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('billing_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Billing plan not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/billing-plans - create new billing plan
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const billingPlanData = req.body;
  
  // Basic validation
  if (!billingPlanData.name || !billingPlanData.price) {
    return res.status(400).json({ 
      success: false,
      message: 'Billing plan name and price are required' 
    });
  }

  const { data, error } = await supabase
    .from('billing_plans')
    .insert([{
      ...billingPlanData,
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

// PUT /api/billing-plans/:id - update billing plan
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const billingPlanData = req.body;

  const { data: existingBillingPlan } = await supabase
    .from('billing_plans')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingBillingPlan) {
    return res.status(404).json({ 
      success: false,
      message: 'Billing plan not found' 
    });
  }

  const { data, error } = await supabase
    .from('billing_plans')
    .update({
      ...billingPlanData,
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

// DELETE /api/billing-plans/:id - delete billing plan
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingBillingPlan } = await supabase
    .from('billing_plans')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingBillingPlan) {
    return res.status(404).json({ 
      success: false,
      message: 'Billing plan not found' 
    });
  }

  const { error } = await supabase
    .from('billing_plans')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;