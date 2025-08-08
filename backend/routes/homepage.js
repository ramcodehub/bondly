import express from 'express';
import supabase from '../src/config/supabase.js';

const router = express.Router();

/**
 * @route GET /api/homepage/carousel
 * @desc Get carousel items for homepage
 * @access Public
 */
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
    console.error('Error fetching carousel items:', error);
    res.status(500).json({ error: 'Failed to fetch carousel items' });
  }
});

/**
 * @route GET /api/homepage/stats
 * @desc Get statistics for homepage
 * @access Public
 */
router.get('/stats', async (req, res) => {
  try {
    // Get counts from different tables in parallel
    const [
      { count: leadsCount },
      { count: opportunitiesCount },
      { count: accountsCount },
      { count: contactsCount }
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('opportunities').select('*', { count: 'exact', head: true }),
      supabase.from('accounts').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true })
    ]);

    res.json({
      totalLeads: leadsCount || 0,
      totalOpportunities: opportunitiesCount || 0,
      totalAccounts: accountsCount || 0,
      totalContacts: contactsCount || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * @route GET /api/homepage/activities
 * @desc Get recent activities for homepage
 * @access Public
 */
router.get('/activities', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

export default router;
