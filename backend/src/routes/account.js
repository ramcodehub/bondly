import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/account - list accounts with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('accounts')
    .select('*', { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`account_name.ilike.%${search}%,account_number.ilike.%${search}%,phone.ilike.%${search}%`);
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

// GET /api/account/:id - get single account
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Account not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/account - create new account
router.post('/', asyncHandler(async (req, res) => {
  const accountData = req.body;
  
  // Basic validation
  if (!accountData.account_name) {
    return res.status(400).json({ 
      success: false,
      message: 'Account name is required' 
    });
  }

  const { data, error } = await supabase
    .from('accounts')
    .insert([{
      ...accountData,
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

// PUT /api/account/:id - update account
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const accountData = req.body;

  const { data: existingAccount } = await supabase
    .from('accounts')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingAccount) {
    return res.status(404).json({ 
      success: false,
      message: 'Account not found' 
    });
  }

  const { data, error } = await supabase
    .from('accounts')
    .update({
      ...accountData,
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

// DELETE /api/account/:id - delete account
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingAccount } = await supabase
    .from('accounts')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingAccount) {
    return res.status(404).json({ 
      success: false,
      message: 'Account not found' 
    });
  }

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

export default router;