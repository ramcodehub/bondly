import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

// GET /api/contact - list team members
router.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*');

    if (error) throw error;
    res.json({ team: data });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
});

// POST /api/contact/submit - submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const { data, error } = await supabase
      .from('contact_form_submissions')
      .insert([{ name, email, message }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Failed to submit contact form', error: error.message });
  }
});

export default router;



