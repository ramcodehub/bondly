import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Fetch all leads
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, company, email, phone, lead_owner, lead_source } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([{ name, company, email, phone, lead_owner, lead_source }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
});

// PUT /api/leads/:id - update lead
router.put('/:id', async (req, res) => {
  try {
    const leadId = req.params.id;
    const { name, company, email, phone, lead_owner, lead_source } = req.body;
    const { data, error } = await supabase
      .from('leads')
      .update({ name, company, email, phone, lead_owner, lead_source })
      .eq('id', leadId)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Failed to update lead', error: error.message });
  }
});

// DELETE /api/leads/:id - delete lead
router.delete('/:id', async (req, res) => {
  try {
    const leadId = req.params.id;
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Failed to delete lead', error: error.message });
  }
});

export default router;