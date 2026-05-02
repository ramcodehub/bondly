"use client";

import { useEffect, useState, useCallback } from 'react';
import supabase from '@/lib/supabase-client';

interface ContactList {
  id: string;
  name: string;
  description: string;
  contact_count: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ContactListsState {
  lists: ContactList[];
  loading: boolean;
  error: string | null;
}

export function useContactLists() {
  const [state, setState] = useState<ContactListsState>({
    lists: [],
    loading: true,
    error: null
  });

  const fetchLists = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('contact_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        lists: data || [],
        loading: false,
        error: null
      }));

    } catch (error) {
      console.error('Error fetching contact lists:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contact lists'
      }));
    }
  }, []);

  // Create a new contact list
  const createList = useCallback(async (listData: Partial<ContactList>) => {
    try {
      const { data, error } = await supabase
        .from('contact_lists')
        .insert([listData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        lists: [data, ...prev.lists]
      }));

      return data;
    } catch (error) {
      console.error('Error creating contact list:', error);
      throw error;
    }
  }, []);

  // Update an existing contact list
  const updateList = useCallback(async (id: string, updates: Partial<ContactList>) => {
    try {
      const { data, error } = await supabase
        .from('contact_lists')
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
        lists: prev.lists.map(list => list.id === id ? data : list)
      }));

      return data;
    } catch (error) {
      console.error('Error updating contact list:', error);
      throw error;
    }
  }, []);

  // Delete a contact list
  const deleteList = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_lists')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        lists: prev.lists.filter(list => list.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting contact list:', error);
      throw error;
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    // Initial fetch
    fetchLists();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('contact-lists-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_lists'
        },
        (payload) => {
          console.log('Contact lists change received:', payload);
          fetchLists(); // Refetch to get updated data
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLists]);

  return {
    ...state,
    fetchLists,
    createList,
    updateList,
    deleteList
  };
}