import supabase from '../config/supabase.js';

// Middleware to handle campaign-related logic when leads are created or updated
export async function handleCampaignOnLeadCreate(req, res, next) {
  const { campaign_id } = req.body;
  
  // If a lead is being created with a campaign_id, increment number_of_leads for that campaign
  if (campaign_id) {
    try {
      // Get current campaign data
      const { data: campaign, error: campaignError } = await supabase
        .from('marketing_campaign')
        .select('number_of_leads')
        .eq('campaign_id', campaign_id)
        .single();
        
      if (campaignError) {
        console.error('Error fetching campaign:', campaignError);
        // Don't block lead creation if campaign update fails
      } else if (campaign) {
        // Increment number_of_leads
        const newLeadCount = (campaign.number_of_leads || 0) + 1;
        
        const { error: updateError } = await supabase
          .from('marketing_campaign')
          .update({ number_of_leads: newLeadCount })
          .eq('campaign_id', campaign_id);
          
        if (updateError) {
          console.error('Error updating campaign lead count:', updateError);
          // Don't block lead creation if campaign update fails
        }
      }
    } catch (error) {
      console.error('Error in campaign handler:', error);
      // Don't block lead creation if campaign update fails
    }
  }
  
  next();
}

// Middleware to handle campaign-related logic when leads are updated
export async function handleCampaignOnLeadUpdate(req, res, next) {
  const leadId = req.params.id;
  const { campaign_id, status } = req.body;
  
  try {
    // Get the current lead data to check if campaign_id or status is changing
    const { data: currentLead, error: leadError } = await supabase
      .from('leads')
      .select('campaign_id, status')
      .eq('id', leadId)
      .single();
      
    if (leadError) {
      console.error('Error fetching current lead:', leadError);
      return next();
    }
    
    // Check if campaign_id is changing
    if (campaign_id && campaign_id !== currentLead.campaign_id) {
      // Decrement lead count for old campaign if it exists
      if (currentLead.campaign_id) {
        await updateCampaignLeadCount(currentLead.campaign_id, -1);
      }
      
      // Increment lead count for new campaign
      await updateCampaignLeadCount(campaign_id, 1);
    }
    
    // Check if status is changing to Qualified/Converted
    const qualifiedStatuses = ['qualified', 'Qualified', 'converted', 'Converted'];
    if (status && qualifiedStatuses.includes(status) && 
        (!currentLead.status || !qualifiedStatuses.includes(currentLead.status))) {
      // Increment number_of_responses for the campaign
      if (currentLead.campaign_id) {
        await updateCampaignResponseCount(currentLead.campaign_id, 1);
      }
    }
  } catch (error) {
    console.error('Error in campaign update handler:', error);
  }
  
  next();
}

// Helper function to update campaign lead count
async function updateCampaignLeadCount(campaignId, delta) {
  try {
    // Get current campaign data
    const { data: campaign, error: campaignError } = await supabase
      .from('marketing_campaign')
      .select('number_of_leads')
      .eq('campaign_id', campaignId)
      .single();
      
    if (campaignError) {
      console.error('Error fetching campaign:', campaignError);
      return;
    }
    
    if (campaign) {
      // Update number_of_leads
      const newLeadCount = Math.max(0, (campaign.number_of_leads || 0) + delta);
      
      const { error: updateError } = await supabase
        .from('marketing_campaign')
        .update({ number_of_leads: newLeadCount })
        .eq('campaign_id', campaignId);
        
      if (updateError) {
        console.error('Error updating campaign lead count:', updateError);
      }
    }
  } catch (error) {
    console.error('Error updating campaign lead count:', error);
  }
}

// Helper function to update campaign response count
async function updateCampaignResponseCount(campaignId, delta) {
  try {
    // Get current campaign data
    const { data: campaign, error: campaignError } = await supabase
      .from('marketing_campaign')
      .select('number_of_responses')
      .eq('campaign_id', campaignId)
      .single();
      
    if (campaignError) {
      console.error('Error fetching campaign:', campaignError);
      return;
    }
    
    if (campaign) {
      // Update number_of_responses
      const newResponseCount = Math.max(0, (campaign.number_of_responses || 0) + delta);
      
      const { error: updateError } = await supabase
        .from('marketing_campaign')
        .update({ number_of_responses: newResponseCount })
        .eq('campaign_id', campaignId);
        
      if (updateError) {
        console.error('Error updating campaign response count:', updateError);
      }
    }
  } catch (error) {
    console.error('Error updating campaign response count:', error);
  }
}