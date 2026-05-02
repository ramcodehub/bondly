import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/transactions - list transactions with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('transactions')
    .select(`
      *,
      companies(name)
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

// GET /api/transactions/:id - get single transaction
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      companies(name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Transaction not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/transactions - create new transaction
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const transactionData = req.body;
  
  // Basic validation
  if (!transactionData.company_id || !transactionData.amount || !transactionData.type) {
    return res.status(400).json({ 
      success: false,
      message: 'Company ID, amount, and type are required' 
    });
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      ...transactionData,
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

// PUT /api/transactions/:id - update transaction
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transactionData = req.body;

  const { data: existingTransaction } = await supabase
    .from('transactions')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingTransaction) {
    return res.status(404).json({ 
      success: false,
      message: 'Transaction not found' 
    });
  }

  const { data, error } = await supabase
    .from('transactions')
    .update({
      ...transactionData
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

// DELETE /api/transactions/:id - delete transaction
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingTransaction } = await supabase
    .from('transactions')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingTransaction) {
    return res.status(404).json({ 
      success: false,
      message: 'Transaction not found' 
    });
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;