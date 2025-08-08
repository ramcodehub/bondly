import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q, stage, sort = 'created_at', order = 'desc' } = req.query;

    let query = supabase.from('opportunities').select('*');

    if (q) {
      // Basic text search on title/description
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (stage) {
      query = query.eq('stage', stage);
    }

    const isAscending = String(order).toLowerCase() === 'asc';
    query = query.order(sort, { ascending: isAscending });

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ message: 'Failed to fetch opportunities', error: error.message });
  }
});

export default router;