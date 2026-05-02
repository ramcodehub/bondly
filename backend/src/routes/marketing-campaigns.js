import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/marketing-campaigns - list marketing campaigns with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('marketing_campaign')
    .select('*', { count: 'exact' });

  // Add search if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%,type.ilike.%${search}%`);
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

// GET /api/marketing-campaigns/:id - get single marketing campaign
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('marketing_campaign')
    .select('*')
    .eq('campaign_id', id)
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ 
    success: false,
    message: 'Marketing campaign not found' 
  });

  res.json({
    success: true,
    data
  });
}));

// POST /api/marketing-campaigns - create new marketing campaign
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const campaignData = req.body;
  
  // Basic validation
  if (!campaignData.name) {
    return res.status(400).json({ 
      success: false,
      message: 'Campaign name is required' 
    });
  }

  const { data, error } = await supabase
    .from('marketing_campaign')
    .insert([{
      ...campaignData,
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

// PUT /api/marketing-campaigns/:id - update marketing campaign
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campaignData = req.body;

  const { data: existingCampaign } = await supabase
    .from('marketing_campaign')
    .select('campaign_id')
    .eq('campaign_id', id)
    .single();

  if (!existingCampaign) {
    return res.status(404).json({ 
      success: false,
      message: 'Marketing campaign not found' 
    });
  }

  const { data, error } = await supabase
    .from('marketing_campaign')
    .update({
      ...campaignData
    })
    .eq('campaign_id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
}));

// DELETE /api/marketing-campaigns/:id - delete marketing campaign
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existingCampaign } = await supabase
    .from('marketing_campaign')
    .select('campaign_id')
    .eq('campaign_id', id)
    .single();

  if (!existingCampaign) {
    return res.status(404).json({ 
      success: false,
      message: 'Marketing campaign not found' 
    });
  }

  const { error } = await supabase
    .from('marketing_campaign')
    .delete()
    .eq('campaign_id', id);

  if (error) throw error;

  res.status(204).send();
}));

export default router;