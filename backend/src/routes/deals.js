import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler, createValidationError, createNotFoundError } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';
import { optimizedQueries } from '../middleware/databaseOptimizer.js';

const router = express.Router();

// Validation rules for deals
const validateDeal = (req, res, next) => {
  const { name, amount, stage, probability } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Deal name is required' });
  }
  
  if (amount !== undefined && (isNaN(amount) || amount < 0)) {
    return res.status(400).json({ error: 'Amount must be a valid positive number' });
  }
  
  if (stage && !['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'].includes(stage)) {
    return res.status(400).json({ error: 'Invalid stage value' });
  }
  
  if (probability !== undefined && (isNaN(probability) || probability < 0 || probability > 100)) {
    return res.status(400).json({ error: 'Probability must be between 0 and 100' });
  }
  
  next();
};

// GET /api/deals - Get all deals
router.get('/', asyncHandler(async (req, res) => {
  const { stage, owner_id, limit = 100, offset = 0 } = req.query;
  
  let query = supabase
    .from('deals')
    .select(`
      *,
      leads(first_name, last_name, email, phone),
      contacts(name, email, phone),
      companies(name, industry)
    `)
    .order('created_at', { ascending: false });

  // Apply filters
  if (stage) {
    query = query.eq('stage', stage);
  }
  
  if (owner_id) {
    query = query.eq('owner_id', owner_id);
  }
  
  // Apply pagination
  query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch deals: ${error.message}`);
  }

  res.json({
    success: true,
    data: data || [],
    count: data?.length || 0,
    pagination: {
      offset: parseInt(offset),
      limit: parseInt(limit)
    }
  });
}));

// GET /api/deals/:id - Get single deal
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      leads(first_name, last_name, email, phone, company),
      contacts(name, email, phone),
      companies(name, industry),
      tasks(id, title, status, priority, due_date)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw createNotFoundError('Deal not found');
    }
    throw new Error(`Failed to fetch deal: ${error.message}`);
  }

  res.json({
    success: true,
    data
  });
}));

// POST /api/deals - Create new deal
router.post('/', sanitizeInput, validateDeal, asyncHandler(async (req, res) => {
  const { 
    name, 
    amount, 
    stage = 'lead', 
    probability = 0, 
    close_date, 
    description,
    lead_id,
    contact_id,
    company_id,
    owner_id,
    deal_source,
    competitors,
    next_step
  } = req.body;

  const dealData = {
    name: name.trim(),
    amount: amount || 0,
    stage,
    probability,
    close_date: close_date || null,
    description: description?.trim() || null,
    lead_id: lead_id || null,
    contact_id: contact_id || null,
    company_id: company_id || null,
    owner_id: owner_id || null,
    deal_source: deal_source?.trim() || null,
    competitors: competitors || null,
    next_step: next_step?.trim() || null
  };

  const { data, error } = await supabase
    .from('deals')
    .insert([dealData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create deal: ${error.message}`);
  }

  res.status(201).json({
    success: true,
    data,
    message: 'Deal created successfully'
  });
}));

// PUT /api/deals/:id - Update deal
router.put('/:id', sanitizeInput, validateDeal, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    amount, 
    stage, 
    probability, 
    close_date, 
    description,
    lead_id,
    contact_id,
    company_id,
    owner_id,
    deal_source,
    competitors,
    next_step
  } = req.body;

  const updateData = {
    name: name?.trim(),
    amount,
    stage,
    probability,
    close_date: close_date || null,
    description: description?.trim() || null,
    lead_id: lead_id || null,
    contact_id: contact_id || null,
    company_id: company_id || null,
    owner_id: owner_id || null,
    deal_source: deal_source?.trim() || null,
    competitors,
    next_step: next_step?.trim() || null
  };

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data, error } = await supabase
    .from('deals')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw createNotFoundError('Deal not found');
    }
    throw new Error(`Failed to update deal: ${error.message}`);
  }

  res.json({
    success: true,
    data,
    message: 'Deal updated successfully'
  });
}));

// DELETE /api/deals/:id - Delete deal
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete deal: ${error.message}`);
  }

  res.json({
    success: true,
    message: 'Deal deleted successfully'
  });
}));

// GET /api/deals/stats/summary - Get deals summary stats
router.get('/stats/summary', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('deals')
    .select('stage, amount');

  if (error) {
    throw new Error(`Failed to fetch deal stats: ${error.message}`);
  }

  const stats = {
    total_deals: data.length,
    total_value: data.reduce((sum, deal) => sum + (deal.amount || 0), 0),
    stages: {},
    won_deals: data.filter(d => d.stage === 'closed_won').length,
    lost_deals: data.filter(d => d.stage === 'closed_lost').length
  };

  // Calculate stage breakdown
  data.forEach(deal => {
    if (!stats.stages[deal.stage]) {
      stats.stages[deal.stage] = { count: 0, value: 0 };
    }
    stats.stages[deal.stage].count++;
    stats.stages[deal.stage].value += deal.amount || 0;
  });

  res.json({
    success: true,
    data: stats
  });
}));

export default router;