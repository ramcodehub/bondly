"use client";

import { useEffect, useState, useCallback } from 'react';
import supabase from '@/lib/supabase-client';

interface ContactSegment {
  id: string;
  name: string;
  description: string;
  criteria: any;
  contact_count: number;
  segment_type: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ContactSegmentsState {
  segments: ContactSegment[];
  loading: boolean;
  error: string | null;
}

export function useContactSegments() {
  const [state, setState] = useState<ContactSegmentsState>({
    segments: [],
    loading: true,
    error: null
  });

  const fetchSegments = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('contact_segments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        segments: data || [],
        loading: false,
        error: null
      }));

    } catch (error) {
      console.error('Error fetching contact segments:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contact segments'
      }));
    }
  }, []);

  // Create a new contact segment
  const createSegment = useCallback(async (segmentData: Partial<ContactSegment>) => {
    try {
      const { data, error } = await supabase
        .from('contact_segments')
        .insert([segmentData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        segments: [data, ...prev.segments]
      }));

      return data;
    } catch (error) {
      console.error('Error creating contact segment:', error);
      throw error;
    }
  }, []);

  // Update an existing contact segment
  const updateSegment = useCallback(async (id: string, updates: Partial<ContactSegment>) => {
    try {
      const { data, error } = await supabase
        .from('contact_segments')
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
        segments: prev.segments.map(segment => segment.id === id ? data : segment)
      }));

      return data;
    } catch (error) {
      console.error('Error updating contact segment:', error);
      throw error;
    }
  }, []);

  // Delete a contact segment
  const deleteSegment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_segments')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        segments: prev.segments.filter(segment => segment.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting contact segment:', error);
      throw error;
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    // Initial fetch
    fetchSegments();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('contact-segments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_segments'
        },
        (payload) => {
          console.log('Contact segments change received:', payload);
          fetchSegments(); // Refetch to get updated data
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSegments]);

  return {
    ...state,
    fetchSegments,
    createSegment,
    updateSegment,
    deleteSegment
  };
}