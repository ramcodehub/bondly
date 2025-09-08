import express from 'express';
import supabase from '../../config/supabase.js';
import { asyncHandler, createValidationError, createNotFoundError } from '../../middleware/errorHandler.js';
import { sanitizeInput } from '../../middleware/validation.js';
import { optimizedQueries } from '../../middleware/databaseOptimizer.js';

const router = express.Router({ mergeParams: true });

// Lead Nurturing Routes
// GET /api/extended/leads/:id/nurturing - Get all nurturing actions for a lead
router.get('/:id/nurturing', asyncHandler(async (req, res) => {
  const leadId = req.params.id;
  
  // Validate lead exists
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id')
    .eq('id', leadId)
    .single();
    
  if (leadError || !lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found'
    });
  }
  
  // Get nurturing actions
  const { data, error } = await supabase
    .from('lead_nurturing')
    .select('*')
    .eq('lead_id', leadId)
    .order('action_date', { ascending: false });
    
  if (error) {
    throw new Error(`Failed to fetch nurturing actions: ${error.message}`);
  }
  
  res.json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}));

// POST /api/extended/leads/:id/nurturing - Create a new nurturing action for a lead
router.post('/:id/nurturing', sanitizeInput, asyncHandler(async (req, res) => {
  const leadId = req.params.id;
  const { action_type, notes, status } = req.body;
  
  // Validate lead exists
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id')
    .eq('id', leadId)
    .single();
    
  if (leadError || !lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found'
    });
  }
  
  // Validate required fields
  if (!action_type) {
    return res.status(400).json({
      success: false,
      message: 'Action type is required'
    });
  }
  
  // Create nurturing action
  const { data, error } = await supabase
    .from('lead_nurturing')
    .insert({
      lead_id: leadId,
      action_type,
      notes,
      status: status || 'pending'
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create nurturing action: ${error.message}`);
  }
  
  // Recalculate lead score
  await recalculateLeadScore(leadId);
  
  res.status(201).json({
    success: true,
    data,
    message: 'Nurturing action created successfully'
  });
}));

// PUT /api/extended/leads/nurturing/:id - Update a nurturing action
router.put('/nurturing/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const nurturingId = req.params.id;
  const { action_type, action_date, notes, status } = req.body;
  
  // Update nurturing action
  const { data, error } = await supabase
    .from('lead_nurturing')
    .update({
      action_type,
      action_date,
      notes,
      status
    })
    .eq('id', nurturingId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to update nurturing action: ${error.message}`);
  }
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Nurturing action not found'
    });
  }
  
  // Recalculate lead score
  await recalculateLeadScore(data.lead_id);
  
  res.json({
    success: true,
    data,
    message: 'Nurturing action updated successfully'
  });
}));

// Lead Scoring Routes
// PUT /api/extended/leads/:id/score - Recalculate lead score
router.put('/:id/score', asyncHandler(async (req, res) => {
  const leadId = req.params.id;
  
  // Validate lead exists
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id')
    .eq('id', leadId)
    .single();
    
  if (leadError || !lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found'
    });
  }
  
  // Recalculate score
  const score = await recalculateLeadScore(leadId);
  
  res.json({
    success: true,
    score,
    message: 'Lead score recalculated successfully'
  });
}));

// Lead Source Analytics Routes
// GET /api/extended/leads/analytics/sources - Get lead source distribution
router.get('/analytics/sources', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('leads')
    .select('source')
    .neq('source', null);
    
  if (error) {
    throw new Error(`Failed to fetch lead sources: ${error.message}`);
  }
  
  // Calculate distribution
  const sourceDistribution = {};
  data.forEach(lead => {
    const source = lead.source || 'Unknown';
    sourceDistribution[source] = (sourceDistribution[source] || 0) + 1;
  });
  
  res.json({
    success: true,
    data: sourceDistribution
  });
}));

// Helper function to recalculate lead score
async function recalculateLeadScore(leadId) {
  // Get lead with current score
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id, score')
    .eq('id', leadId)
    .single();
    
  if (leadError || !lead) {
    throw new Error('Lead not found for scoring');
  }
  
  let score = 0;
  
  // +10 points for each nurturing action
  const { count: nurturingCount, error: nurturingError } = await supabase
    .from('lead_nurturing')
    .select('*', { count: 'exact', head: true })
    .eq('lead_id', leadId);
    
  if (!nurturingError && nurturingCount) {
    score += (nurturingCount * 10);
  }
  
  // +20 points if email opened (placeholder for future integration)
  // +30 points if opportunity created (placeholder for future integration)
  
  // Update lead score
  const { data: updatedLead, error: updateError } = await supabase
    .from('leads')
    .update({ score })
    .eq('id', leadId)
    .select()
    .single();
    
  if (updateError) {
    throw new Error(`Failed to update lead score: ${updateError.message}`);
  }
  
  return score;
}

export default router;