import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler, createValidationError, createNotFoundError } from '../middleware/errorHandler.js';
import { leadValidation, sanitizeInput } from '../middleware/validation.js';
import { optimizedQueries } from '../middleware/databaseOptimizer.js';
import { handleCampaignOnLeadCreate, handleCampaignOnLeadUpdate } from '../middleware/campaignHandler.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  // Use optimized query with caching
  const result = await optimizedQueries.getAll('leads', {
    orderBy: 'created_at',
    ascending: false
  });

  if (result.error) {
    throw new Error(`Failed to fetch leads: ${result.error.message}`);
  }

  res.json({
    success: true,
    data: result.data || [],
    count: result.data?.length || 0
  });
}));

router.post('/', sanitizeInput, leadValidation.create, handleCampaignOnLeadCreate, asyncHandler(async (req, res) => {
  const { first_name, last_name, email, phone, company, job_title, source, status, notes, campaign_id } = req.body;

  const result = await optimizedQueries.create('leads', {
    first_name, last_name, email, phone, company, job_title, source, status, notes, campaign_id
  });

  if (result.error) {
    throw new Error(`Failed to create lead: ${result.error.message}`);
  }

  res.status(201).json({
    success: true,
    data: result.data[0],
    message: 'Lead created successfully'
  });
}));

// PUT /api/leads/:id - update lead
router.put('/:id', handleCampaignOnLeadUpdate, async (req, res) => {
  try {
    const leadId = req.params.id;
    const { first_name, last_name, email, phone, company, job_title, source, status, notes, campaign_id } = req.body;
    const { data, error } = await supabase
      .from('leads')
      .update({ first_name, last_name, email, phone, company, job_title, source, status, notes, campaign_id })
      .eq('id', leadId)
      .select();

    if (error) throw error;
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update lead', 
      error: error.message 
    });
  }
});

// DELETE /api/leads/:id - delete lead
router.delete('/:id', async (req, res) => {
  try {
    const leadId = req.params.id;
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) throw error;
    res.json({ 
      success: true,
      message: 'Lead deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete lead', 
      error: error.message 
    });
  }
});

export default router;