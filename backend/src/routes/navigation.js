import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/navigation/items - Get all navigation items grouped by category
router.get('/items', asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('id, name, icon, path, shortcut, category, sort_order')
      .eq('enabled', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    // Group items by category
    const groupedItems = data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedItems
    });
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch navigation items',
      error: error.message 
    });
  }
}));

export default router;