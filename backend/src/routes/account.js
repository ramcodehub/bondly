import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

// GET /api/account - list accounts
router.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ message: 'Failed to fetch accounts', error: error.message });
  }
});

// GET /api/account/:id - single account with optional activity log if exists
router.get('/:id', async (req, res) => {
  try {
    const accountId = req.params.id;
    const { data: account, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error) throw error;

    // Optional: join activity_log if a table exists; otherwise return account only
    res.json({ account });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ message: 'Failed to fetch account', error: error.message });
  }
});

export default router;



