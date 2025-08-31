import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// Get carousel data
router.get('/carousel', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('homepage_carousel')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching carousel data:', error);
    res.status(500).json({ error: 'Failed to fetch carousel data' });
  }
});

// Get homepage stats
router.get('/stats', async (req, res) => {
  try {
    // Example stats - adjust based on your actual data structure
    const stats = {
      totalLeads: 0,
      openOpportunities: 0,
      totalRevenue: 0,
      activeUsers: 0
    };
    
    // You can fetch actual stats from your database here
    // For example:
    // const { count: totalLeads } = await supabase
    //   .from('leads')
    //   .select('*', { count: 'exact', head: true });
    // stats.totalLeads = totalLeads;
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
