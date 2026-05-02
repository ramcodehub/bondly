"use client";

import { useEffect, useState, useCallback } from 'react';
import supabase from '@/lib/supabase-client';

interface ContactTopic {
  id: string;
  name: string;
  description: string;
  category: string;
  conversation_count: number;
  is_trending: boolean;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ContactTopicsState {
  topics: ContactTopic[];
  loading: boolean;
  error: string | null;
}

export function useContactTopics() {
  const [state, setState] = useState<ContactTopicsState>({
    topics: [],
    loading: true,
    error: null
  });

  const fetchTopics = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('contact_topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        topics: data || [],
        loading: false,
        error: null
      }));

    } catch (error) {
      console.error('Error fetching contact topics:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contact topics'
      }));
    }
  }, []);

  // Create a new contact topic
  const createTopic = useCallback(async (topicData: Partial<ContactTopic>) => {
    try {
      const { data, error } = await supabase
        .from('contact_topics')
        .insert([topicData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        topics: [data, ...prev.topics]
      }));

      return data;
    } catch (error) {
      console.error('Error creating contact topic:', error);
      throw error;
    }
  }, []);

  // Update an existing contact topic
  const updateTopic = useCallback(async (id: string, updates: Partial<ContactTopic>) => {
    try {
      const { data, error } = await supabase
        .from('contact_topics')
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
        topics: prev.topics.map(topic => topic.id === id ? data : topic)
      }));

      return data;
    } catch (error) {
      console.error('Error updating contact topic:', error);
      throw error;
    }
  }, []);

  // Delete a contact topic
  const deleteTopic = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_topics')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        topics: prev.topics.filter(topic => topic.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting contact topic:', error);
      throw error;
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    // Initial fetch
    fetchTopics();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('contact-topics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_topics'
        },
        (payload) => {
          console.log('Contact topics change received:', payload);
          fetchTopics(); // Refetch to get updated data
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTopics]);

  return {
    ...state,
    fetchTopics,
    createTopic,
    updateTopic,
    deleteTopic
  };
}