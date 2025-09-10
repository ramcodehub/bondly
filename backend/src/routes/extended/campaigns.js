import express from 'express';
import supabase from '../../config/supabase.js';
import { asyncHandler, createValidationError, createNotFoundError } from '../../middleware/errorHandler.js';
import { sanitizeInput } from '../../middleware/validation.js';
import { optimizedQueries } from '../../middleware/databaseOptimizer.js';

const router = express.Router({ mergeParams: true });

// GET /api/extended/campaigns - List all campaigns
router.get('/', asyncHandler(async (req, res) => {
  // Use optimized query with caching
  const result = await optimizedQueries.getAll('marketing_campaign', {
    orderBy: 'created_at',
    ascending: false
  });

  if (result.error) {
    throw new Error(`Failed to fetch campaigns: ${result.error.message}`);
  }

  res.json({
    success: true,
    data: result.data || [],
    count: result.data?.length || 0
  });
}));

// POST /api/extended/campaigns - Create campaign
router.post('/', sanitizeInput, asyncHandler(async (req, res) => {
  const { 
    campaign_name, 
    type, 
    status, 
    start_date, 
    end_date, 
    budgeted_cost, 
    actual_cost, 
    expected_revenue 
  } = req.body;

  // Validate required fields
  if (!campaign_name || !type || !status || !start_date) {
    return res.status(400).json({
      success: false,
      message: 'Campaign name, type, status, and start date are required'
    });
  }

  // Validate type
  const validTypes = ['Email', 'Social Media', 'Webinar', 'Event', 'Other'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid campaign type'
    });
  }

  // Validate status
  const validStatuses = ['Planned', 'In Progress', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid campaign status'
    });
  }

  // Create campaign
  const { data, error } = await supabase
    .from('marketing_campaign')
    .insert({
      campaign_name,
      type,
      status,
      start_date,
      end_date,
      budgeted_cost,
      actual_cost,
      expected_revenue
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create campaign: ${error.message}`);
  }

  res.status(201).json({
    success: true,
    data,
    message: 'Campaign created successfully'
  });
}));

// GET /api/extended/campaigns/:id - Get campaign details
router.get('/:id', asyncHandler(async (req, res) => {
  const campaignId = req.params.id;
  
  // Get campaign
  const { data, error } = await supabase
    .from('marketing_campaign')
    .select('*')
    .eq('campaign_id', campaignId)
    .single();
    
  if (error) {
    throw new Error(`Failed to fetch campaign: ${error.message}`);
  }
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found'
    });
  }
  
  res.json({
    success: true,
    data
  });
}));

// PUT /api/extended/campaigns/:id - Update campaign
router.put('/:id', sanitizeInput, asyncHandler(async (req, res) => {
  const campaignId = req.params.id;
  const { 
    campaign_name, 
    type, 
    status, 
    start_date, 
    end_date, 
    budgeted_cost, 
    actual_cost, 
    expected_revenue 
  } = req.body;

  // Validate type if provided
  if (type) {
    const validTypes = ['Email', 'Social Media', 'Webinar', 'Event', 'Other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid campaign type'
      });
    }
  }

  // Validate status if provided
  if (status) {
    const validStatuses = ['Planned', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid campaign status'
      });
    }
  }

  // Update campaign
  const { data, error } = await supabase
    .from('marketing_campaign')
    .update({
      campaign_name,
      type,
      status,
      start_date,
      end_date,
      budgeted_cost,
      actual_cost,
      expected_revenue,
      updated_at: new Date()
    })
    .eq('campaign_id', campaignId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to update campaign: ${error.message}`);
  }
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found'
    });
  }
  
  res.json({
    success: true,
    data,
    message: 'Campaign updated successfully'
  });
}));

// DELETE /api/extended/campaigns/:id - Delete campaign
router.delete('/:id', asyncHandler(async (req, res) => {
  const campaignId = req.params.id;
  
  // Delete campaign
  const { error } = await supabase
    .from('marketing_campaign')
    .delete()
    .eq('campaign_id', campaignId);
    
  if (error) {
    throw new Error(`Failed to delete campaign: ${error.message}`);
  }
  
  res.json({
    success: true,
    message: 'Campaign deleted successfully'
  });
}));

// GET /api/extended/campaigns/:id/leads - Get leads tied to campaign
router.get('/:id/leads', asyncHandler(async (req, res) => {
  const campaignId = req.params.id;
  
  // Get leads for campaign
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('campaign_id', campaignId);
    
  if (error) {
    throw new Error(`Failed to fetch leads for campaign: ${error.message}`);
  }
  
  res.json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}));

export default router;