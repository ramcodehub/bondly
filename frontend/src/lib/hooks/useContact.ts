"use client";

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase-client';

// Define the Contact type
export interface Contact {
  id: string;
  name?: string;
  role?: string;
  email: string;
  phone?: string;
  image_url?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  lastContact?: string;
  status: "active" | "inactive" | "pending";
  company_id?: string;
}

interface UseContactResult {
  contact: Contact | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useContact(contactId: string | null): UseContactResult {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = async () => {
    if (!contactId) {
      setContact(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .single();

      if (error) {
        throw error;
      }

      setContact(data);
    } catch (err) {
      console.error('Error fetching contact:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contact');
      setContact(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();

    // Set up real-time subscription if we have a contactId
    if (contactId) {
      const channel = supabase
        .channel(`contact-${contactId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'contacts',
            filter: `id=eq.${contactId}`
          },
          (payload) => {
            setContact(payload.new as Contact);
          }
        )
        .subscribe();

      // Clean up subscription
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [contactId]);

  return {
    contact,
    loading,
    error,
    refresh: fetchContact
  };
}