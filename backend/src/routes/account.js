import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET /api/account - list accounts with pagination and search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('accounts')
      .select('*', { count: 'exact' });

    // Add search if provided
    if (search) {
      query = query.or(`account_name.ilike.%${search}%,account_number.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) throw error;
    
    res.json({
      data,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ message: 'Failed to fetch accounts', error: error.message });
  }
});

// GET /api/account/:id - get single account
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Account not found' });

    res.json(data);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ message: 'Failed to fetch account', error: error.message });
  }
});

// POST /api/account - create new account
router.post('/', async (req, res) => {
  try {
    const accountData = req.body;
    
    // Basic validation
    if (!accountData.account_name) {
      return res.status(400).json({ message: 'Account name is required' });
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert([{
        ...accountData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Failed to create account', error: error.message });
  }
});

// PUT /api/account/:id - update account
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const accountData = req.body;

    const { data: existingAccount } = await supabase
      .from('accounts')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const { data, error } = await supabase
      .from('accounts')
      .update({
        ...accountData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ message: 'Failed to update account', error: error.message });
  }
});

// DELETE /api/account/:id - delete account
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existingAccount } = await supabase
      .from('accounts')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Failed to delete account', error: error.message });
  }
});

export default router;





