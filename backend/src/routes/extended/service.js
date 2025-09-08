import express from 'express';
import supabase from '../../config/supabase.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { sanitizeInput } from '../../middleware/validation.js';

const router = express.Router({ mergeParams: true });

// GET /api/extended/service/:companyId - Get service lifecycle data for a company
router.get('/:companyId', asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;
  
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
  
  // Get service lifecycle data
  const { data, error } = await supabase
    .from('customer_service')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(`Failed to fetch service lifecycle data: ${error.message}`);
  }
  
  res.json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}));

// POST /api/extended/service/:companyId - Add new stage entry for a company
router.post('/:companyId', sanitizeInput, asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;
  const { stage, details } = req.body;
  
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
  if (!stage) {
    return res.status(400).json({
      success: false,
      message: 'Stage is required'
    });
  }
  
  // Validate stage is one of the allowed values
  const validStages = ['onboarding', 'engagement', 'retention', 'advocacy'];
  if (!validStages.includes(stage)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid stage. Must be one of: onboarding, engagement, retention, advocacy'
    });
  }
  
  // Check if this stage already exists for this company
  const { data: existingStage, error: existingError } = await supabase
    .from('customer_service')
    .select('id')
    .eq('company_id', companyId)
    .eq('stage', stage)
    .single();
    
  if (existingStage && !existingError) {
    return res.status(400).json({
      success: false,
      message: `Stage ${stage} already exists for this company`
    });
  }
  
  // Create service stage entry
  const { data, error } = await supabase
    .from('customer_service')
    .insert({
      company_id: companyId,
      stage,
      details
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create service stage: ${error.message}`);
  }
  
  res.status(201).json({
    success: true,
    data,
    message: 'Service stage created successfully'
  });
}));

// PUT /api/extended/service/:companyId/:stage - Update stage details for a company
router.put('/:companyId/:stage', sanitizeInput, asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;
  const stage = req.params.stage;
  const { details } = req.body;
  
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
  
  // Validate stage is one of the allowed values
  const validStages = ['onboarding', 'engagement', 'retention', 'advocacy'];
  if (!validStages.includes(stage)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid stage. Must be one of: onboarding, engagement, retention, advocacy'
    });
  }
  
  // Update service stage details
  const { data, error } = await supabase
    .from('customer_service')
    .update({
      details,
      updated_at: new Date().toISOString()
    })
    .eq('company_id', companyId)
    .eq('stage', stage)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to update service stage: ${error.message}`);
  }
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: `Service stage ${stage} not found for this company`
    });
  }
  
  res.json({
    success: true,
    data,
    message: 'Service stage updated successfully'
  });
}));

export default router;