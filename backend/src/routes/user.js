import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/user/profile - Get user profile
router.get('/profile', asyncHandler(async (req, res) => {
  try {
    // In a real implementation, you would get the user ID from the authenticated user
    // For now, we'll use a mock user ID
    const userId = '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, email, avatar_url, initials')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: data || null
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message 
    });
  }
}));

// GET /api/user/notifications - Get user notifications
router.get('/notifications', asyncHandler(async (req, res) => {
  try {
    // In a real implementation, you would get the user ID from the authenticated user
    // For now, we'll use a mock user ID
    const userId = '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, description, time, read')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message 
    });
  }
}));

// PUT /api/user/notifications/:id - Mark notification as read
router.put('/notifications/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    
    // In a real implementation, you would verify the user owns this notification
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: read })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update notification',
      error: error.message 
    });
  }
}));

export default router;