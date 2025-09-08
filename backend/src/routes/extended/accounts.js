import express from 'express';
import supabase from '../../config/supabase.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { sanitizeInput } from '../../middleware/validation.js';

const router = express.Router({ mergeParams: true });

// GET /api/extended/accounts/:id/transactions - Get all transactions for a company
router.get('/:id/transactions', asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  
  // Validate company exists
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id')
    .eq('id', companyId)
    .single();
    
  if (companyError || !company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }
  
  // Get transactions
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
  
  res.json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}));

// POST /api/extended/accounts/:id/transactions - Create a new transaction for a company
router.post('/:id/transactions', sanitizeInput, asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const { amount, type, description } = req.body;
  
  // Validate company exists
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id')
    .eq('id', companyId)
    .single();
    
  if (companyError || !company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }
  
  // Validate required fields
  if (!amount || !type) {
    return res.status(400).json({
      success: false,
      message: 'Amount and type are required'
    });
  }
  
  // Validate amount is a number
  if (isNaN(amount)) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a valid number'
    });
  }
  
  // Create transaction
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      company_id: companyId,
      amount: parseFloat(amount),
      type,
      description
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
  
  res.status(201).json({
    success: true,
    data,
    message: 'Transaction created successfully'
  });
}));

// PUT /api/extended/accounts/transactions/:id - Update a transaction
router.put('/transactions/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  const { amount, type, description } = req.body;
  
  // Validate amount is a number if provided
  if (amount && isNaN(amount)) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a valid number'
    });
  }
  
  // Update transaction
  const updateData = {};
  if (amount !== undefined) updateData.amount = parseFloat(amount);
  if (type) updateData.type = type;
  if (description !== undefined) updateData.description = description;
  
  const { data, error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', transactionId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found'
    });
  }
  
  res.json({
    success: true,
    data,
    message: 'Transaction updated successfully'
  });
}));

// DELETE /api/extended/accounts/transactions/:id - Delete a transaction
router.delete('/transactions/:id', asyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  
  // Delete transaction
  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Transaction deleted successfully'
  });
}));

export default router;