import { supabase } from '../supabase-client';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  last_active: string;
  created_at: string;
  updated_at: string;
};

export type BillingPlan = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  is_current: boolean;
  recommended: boolean;
  created_at: string;
  updated_at: string;
};

export const settingsService = {
  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  async createTeamMember(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  async deleteTeamMember(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },

  // Billing Plans
  async getBillingPlans(): Promise<BillingPlan[]> {
    try {
      const { data, error } = await supabase
        .from('billing_plans')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching billing plans:', error);
      throw error;
    }
  },

  async updateBillingPlan(id: string, updates: Partial<BillingPlan>): Promise<BillingPlan> {
    try {
      const { data, error } = await supabase
        .from('billing_plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating billing plan:', error);
      throw error;
    }
  },

  // User Profile
  async updateUserProfile(userId: string, updates: { name?: string; email?: string; bio?: string }) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Notifications
  async updateNotificationSettings(userId: string, settings: {
    email_notifications: boolean;
    push_notifications: boolean;
    marketing_emails: boolean;
  }) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert(
          { user_id: userId, ...settings, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // Get user notification settings
  async getNotificationSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      return data || {
        email_notifications: true,
        push_notifications: true,
        marketing_emails: false,
      };
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }
};
