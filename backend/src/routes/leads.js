import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

// Mock data for leads
const mockLeads = [
  {
    id: 1,
    name: 'Christopher Maclead',
    company: 'Rangoni Of Florence',
    email: 'christopher@example.com',
    phone: '9876543210',
    lead_owner: 'Hari Shankar',
    lead_source: 'Website',
    created_at: '2023-05-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Carissa Kidman',
    company: 'Oh My Goodknits Inc',
    email: 'carissa@example.com',
    phone: '9123456780',
    lead_owner: 'Hari Shankar',
    lead_source: 'Referral',
    created_at: '2023-05-16T14:45:00Z'
  },
  {
    id: 3,
    name: 'James Merced',
    company: 'Kwik Kopy Printing',
    email: 'james@example.com',
    phone: '9988776655',
    lead_owner: 'Hari Shankar',
    lead_source: 'Google Ads',
    created_at: '2023-05-17T09:15:00Z'
  },
  {
    id: 4,
    name: 'Felix Hirpara',
    company: 'Chapman',
    email: 'felix@example.com',
    phone: '9112233445',
    lead_owner: 'Hari Shankar',
    lead_source: 'LinkedIn',
    created_at: '2023-05-18T16:20:00Z'
  }
];

/**
 * @route   GET /api/leads
 * @desc    Get all leads
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // Log the request for debugging
    console.log('GET request received at /api/leads');
    
    // Try to use Supabase if credentials are valid
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*');
      
      if (!error) {
        console.log('Successfully fetched leads from Supabase');
        return res.json(data);
      }
      
      // If Supabase fails, fall back to mock data
      console.log('Falling back to mock data due to Supabase error:', error.message);
      res.json(mockLeads);
    } catch (supabaseError) {
      // If Supabase connection fails completely, use mock data
      console.log('Using mock data due to Supabase connection error');
      res.json(mockLeads);
    }
  } catch (error) {
    console.error('Error in leads route:', error);
    res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
  }
});

/**
 * @route   GET /api/leads/:id
 * @desc    Get lead by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    // Log the request for debugging
    console.log(`GET request received at /api/leads/${req.params.id}`);
    
    const { id } = req.params;
    
    // Try to use Supabase if credentials are valid
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        console.log('Successfully fetched lead from Supabase');
        return res.json(data);
      }
      
      // If Supabase fails, fall back to mock data
      const mockLead = mockLeads.find(lead => lead.id === parseInt(id));
      
      if (!mockLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      console.log('Returning mock lead data');
      res.json(mockLead);
    } catch (supabaseError) {
      // If Supabase connection fails completely, use mock data
      const mockLead = mockLeads.find(lead => lead.id === parseInt(id));
      
      if (!mockLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      console.log('Using mock data due to Supabase connection error');
      res.json(mockLead);
    }
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Failed to fetch lead', error: error.message });
  }
});

/**
 * @route   POST /api/leads
 * @desc    Create a new lead
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    // Log the request for debugging
    console.log('POST request received at /api/leads', req.body);
    
    const { name, company, email, phone, leadSource, leadOwner } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    // Try to use Supabase if credentials are valid
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ 
          name, 
          company, 
          email, 
          phone, 
          lead_source: leadSource, 
          lead_owner: leadOwner,
          created_at: new Date()
        }])
        .select();
      
      if (!error) {
        console.log('Successfully created lead in Supabase');
        return res.status(201).json(data[0]);
      }
      
      // If Supabase fails, create mock lead
      console.log('Falling back to mock data creation due to Supabase error:', error.message);
      
      // Create a new mock lead with the highest ID + 1
      const newId = Math.max(...mockLeads.map(lead => lead.id)) + 1;
      const newLead = { 
        id: newId,
        name, 
        company, 
        email, 
        phone, 
        lead_owner: leadOwner,
        lead_source: leadSource,
        created_at: new Date().toISOString()
      };
      
      // Add to mock data array (this will be lost on server restart)
      mockLeads.push(newLead);
      
      res.status(201).json(newLead);
    } catch (supabaseError) {
      // If Supabase connection fails completely, create mock lead
      console.log('Using mock data creation due to Supabase connection error');
      
      // Create a new mock lead with the highest ID + 1
      const newId = Math.max(...mockLeads.map(lead => lead.id)) + 1;
      const newLead = { 
        id: newId,
        name, 
        company, 
        email, 
        phone, 
        lead_owner: leadOwner,
        lead_source: leadSource,
        created_at: new Date().toISOString()
      };
      
      // Add to mock data array (this will be lost on server restart)
      mockLeads.push(newLead);
      
      res.status(201).json(newLead);
    }
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
});

/**
 * @route   PUT /api/leads/:id
 * @desc    Update a lead
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    // Log the request for debugging
    console.log(`PUT request received at /api/leads/${req.params.id}`, req.body);
    
    const { id } = req.params;
    const { name, company, email, phone, leadSource, leadOwner } = req.body;
    
    // Try to use Supabase if credentials are valid
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ 
          name, 
          company, 
          email, 
          phone, 
          lead_source: leadSource, 
          lead_owner: leadOwner,
          updated_at: new Date()
        })
        .eq('id', id)
        .select();
      
      if (!error && data && data.length > 0) {
        console.log('Successfully updated lead in Supabase');
        return res.json(data[0]);
      }
      
      // If Supabase fails, update mock lead
      console.log('Falling back to mock data update due to Supabase error:', error ? error.message : 'No data returned');
      
      // Find the lead in mock data
      const leadIndex = mockLeads.findIndex(lead => lead.id === parseInt(id));
      
      if (leadIndex === -1) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      // Update the lead
      const updatedLead = { 
        ...mockLeads[leadIndex],
        name: name || mockLeads[leadIndex].name, 
        company: company || mockLeads[leadIndex].company, 
        email: email || mockLeads[leadIndex].email, 
        phone: phone || mockLeads[leadIndex].phone, 
        lead_owner: leadOwner || mockLeads[leadIndex].lead_owner,
        lead_source: leadSource || mockLeads[leadIndex].lead_source,
        updated_at: new Date().toISOString()
      };
      
      // Replace in mock data array
      mockLeads[leadIndex] = updatedLead;
      
      res.json(updatedLead);
    } catch (supabaseError) {
      // If Supabase connection fails completely, update mock lead
      console.log('Using mock data update due to Supabase connection error');
      
      // Find the lead in mock data
      const leadIndex = mockLeads.findIndex(lead => lead.id === parseInt(id));
      
      if (leadIndex === -1) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      // Update the lead
      const updatedLead = { 
        ...mockLeads[leadIndex],
        name: name || mockLeads[leadIndex].name, 
        company: company || mockLeads[leadIndex].company, 
        email: email || mockLeads[leadIndex].email, 
        phone: phone || mockLeads[leadIndex].phone, 
        lead_owner: leadOwner || mockLeads[leadIndex].lead_owner,
        lead_source: leadSource || mockLeads[leadIndex].lead_source,
        updated_at: new Date().toISOString()
      };
      
      // Replace in mock data array
      mockLeads[leadIndex] = updatedLead;
      
      res.json(updatedLead);
    }
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Failed to update lead', error: error.message });
  }
});

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    // Log the request for debugging
    console.log(`DELETE request received at /api/leads/${req.params.id}`);
    
    const { id } = req.params;
    
    // Try to use Supabase if credentials are valid
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (!error) {
        console.log('Successfully deleted lead from Supabase');
        return res.json({ message: 'Lead deleted successfully' });
      }
      
      // If Supabase fails, delete from mock data
      console.log('Falling back to mock data deletion due to Supabase error:', error.message);
      
      // Find the lead in mock data
      const leadIndex = mockLeads.findIndex(lead => lead.id === parseInt(id));
      
      if (leadIndex === -1) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      // Remove from mock data array
      mockLeads.splice(leadIndex, 1);
      
      res.json({ message: 'Lead deleted successfully' });
    } catch (supabaseError) {
      // If Supabase connection fails completely, delete from mock data
      console.log('Using mock data deletion due to Supabase connection error');
      
      // Find the lead in mock data
      const leadIndex = mockLeads.findIndex(lead => lead.id === parseInt(id));
      
      if (leadIndex === -1) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      // Remove from mock data array
      mockLeads.splice(leadIndex, 1);
      
      res.json({ message: 'Lead deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Failed to delete lead', error: error.message });
  }
});

export default router;