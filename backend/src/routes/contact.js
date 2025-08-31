import express from 'express';
import supabase from '../config/supabase.js';

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
    const { name, email, subject, companyType, company, location, message } = req.body;
    
    // Validation
    if (!name || name.length < 2) {
      return res.status(400).json({ message: 'Name is required and must be at least 2 characters' });
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    
    if (!message || message.length < 10) {
      return res.status(400).json({ message: 'Message is required and must be at least 10 characters' });
    }
    
    // Prepare data for insertion
    const contactData = {
      full_name: name,
      email: email,
      subject: subject || null,
      message: message,
      company_type: companyType || 'individual',
      company_name: companyType === 'company' ? company : null,
      location: location || null
    };

    console.log('Inserting contact data:', contactData);

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([contactData])
      .select();

    if (error) {
      console.error('Error submitting contact form:', error);
      return res.status(500).json({ 
        message: 'Failed to submit contact form', 
        error: error.message 
      });
    }
    
    res.status(201).json({
      message: `Thank you Dear ${name}, your message has been received! Our team will contact you very soon.`,
      data: data[0]
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      message: 'Failed to submit contact form', 
      error: error.message 
    });
  }
});

export default router;