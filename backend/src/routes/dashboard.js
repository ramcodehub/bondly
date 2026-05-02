import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    // Fetch counts for various entities using head:true for efficiency
    const [companiesResult, contactsResult, leadsResult, dealsResult, tasksResult] = await Promise.all([
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('deals').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true })
    ]);

    // Get recent activities (simplified mockup or fetch from audit logs)
    const recentActivities = [
      {
        id: 1,
        type: 'deal',
        title: 'New deal created',
        description: 'Acme Corp - $50,000',
        time: '2 minutes ago',
        icon: 'DollarSign'
      },
      {
        id: 2,
        type: 'task',
        title: 'Task completed',
        description: 'Follow up with lead',
        time: '5 minutes ago', 
        icon: 'CheckCircle'
      },
      {
        id: 3,
        type: 'contact',
        title: 'New contact added',
        description: 'John Smith from Tech Inc',
        time: '10 minutes ago',
        icon: 'Users'
      }
    ];

    res.json({
      success: true,
      data: {
        companies: companiesResult?.count || 0,
        contacts: contactsResult?.count || 0,
        leads: leadsResult?.count || 0,
        deals: dealsResult?.count || 0,
        tasks: tasksResult?.count || 0,
        totalRevenue: 0,
        recentActivities: recentActivities || []
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return safe data structure even on failure
    res.json({
      success: false,
      data: {
        companies: 0,
        contacts: 0,
        leads: 0,
        deals: 0,
        tasks: 0,
        totalRevenue: 0,
        recentActivities: []
      }
    });
  }
}));

// GET /api/dashboard/features - Get feature data
router.get('/features', asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('features')
      .select('id, icon, title, description, color')
      .eq('enabled', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching features:', error);
    res.json({
      success: false,
      data: []
    });
  }
}));

export default router;