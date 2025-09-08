import { createClient } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your deployment settings.');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please check your deployment settings.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Lead Service
export const leadService = {
  // Get all leads with sorting by creation date
  getLeads: async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('creation_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Get a single lead by ID
  getLead: async (id) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('lead_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error);
      return null;
    }
  },

  // Create a new lead
  createLead: async (leadData) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  // Update an existing lead
  updateLead: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...updates,
          last_updated_date: new Date().toISOString().split('T')[0],
          last_updated_by: null // TODO: Set to current user ID
        })
        .eq('lead_id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating lead ${id}:`, error);
      throw error;
    }
  },

  // Delete a lead
  deleteLead: async (id) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('lead_id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting lead ${id}:`, error);
      throw error;
    }
  }
};

export default supabase;