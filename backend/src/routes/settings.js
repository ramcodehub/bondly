import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET /api/settings - Fetch all settings including logo and navigation
router.get('/', async (req, res) => {
  try {
    // Fetch logo URL from settings table
    const { data: logoData, error: logoError } = await supabase
      .from('settings')
      .select('logo_url')
      .single();

    // Fetch navigation links from navigation_links table
    const { data: navData, error: navError } = await supabase
      .from('navigation_links')
      .select('title, path, order')
      .order('order');

    if (logoError && navError) {
      // If both tables don't exist, return default data
      return res.json({
        logo_url: null,
        navigation_links: [
          { title: 'Home', path: '/', order: 1 },
          { title: 'Leads', path: '/leads', order: 2 },
          { title: 'Opportunities', path: '/opportunities', order: 3 },
          { title: 'Account', path: '/account', order: 4 },
          { title: 'Contact', path: '/contact', order: 5 }
        ]
      });
    }

    const logo_url = logoData?.logo_url || null;
    const navigation_links = navData || [
      { title: 'Home', path: '/', order: 1 },
      { title: 'Leads', path: '/leads', order: 2 },
      { title: 'Opportunities', path: '/opportunities', order: 3 },
      { title: 'Account', path: '/account', order: 4 },
      { title: 'Contact', path: '/contact', order: 5 }
    ];

    res.json({
      logo_url,
      navigation_links
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch settings',
      error: error.message 
    });
  }
});

export default router;








