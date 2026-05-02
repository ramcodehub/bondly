"use client";

import { useEffect, useState, useCallback } from 'react';
import supabase from '@/lib/supabase-client';

interface LeadQualification {
  id: string;
  lead_id: string;
  qualification_score: number;
  bant_score: any;
  status: string;
  notes: string;
  qualified_by: string;
  qualified_at: string;
  created_at: string;
  updated_at: string;
  leads?: {
    name: string;
    email: string;
    phone: string;
    status: string;
  };
}

interface LeadQualificationsState {
  qualifications: LeadQualification[];
  loading: boolean;
  error: string | null;
}

export function useLeadQualifications() {
  const [state, setState] = useState<LeadQualificationsState>({
    qualifications: [],
    loading: true,
    error: null
  });

  const fetchQualifications = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('lead_qualifications')
        .select(`
          *,
          leads(name, email, phone, status)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        qualifications: data || [],
        loading: false,
        error: null
      }));

    } catch (error) {
      console.error('Error fetching lead qualifications:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch lead qualifications'
      }));
    }
  }, []);

  // Create a new lead qualification
  const createQualification = useCallback(async (qualificationData: Partial<LeadQualification>) => {
    try {
      const { data, error } = await supabase
        .from('lead_qualifications')
        .insert([qualificationData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        qualifications: [data, ...prev.qualifications]
      }));

      return data;
    } catch (error) {
      console.error('Error creating lead qualification:', error);
      throw error;
    }
  }, []);

  // Update an existing lead qualification
  const updateQualification = useCallback(async (id: string, updates: Partial<LeadQualification>) => {
    try {
      const { data, error } = await supabase
        .from('lead_qualifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        qualifications: prev.qualifications.map(qualification => qualification.id === id ? data : qualification)
      }));

      return data;
    } catch (error) {
      console.error('Error updating lead qualification:', error);
      throw error;
    }
  }, []);

  // Delete a lead qualification
  const deleteQualification = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('lead_qualifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        qualifications: prev.qualifications.filter(qualification => qualification.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting lead qualification:', error);
      throw error;
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    // Initial fetch
    fetchQualifications();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('lead-qualifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_qualifications'
        },
        (payload) => {
          console.log('Lead qualifications change received:', payload);
          fetchQualifications(); // Refetch to get updated data
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQualifications]);

  return {
    ...state,
    fetchQualifications,
    createQualification,
    updateQualification,
    deleteQualification
  };
}