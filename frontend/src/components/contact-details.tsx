"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import supabase from '@/lib/supabase-client';

// Define the Contact type
interface Contact {
  id: string;
  name?: string;  // Made name optional
  role?: string;
  email?: string;
  phone?: string;
  image_url?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  lastContact?: string;
  status: "active" | "inactive" | "pending";
  company_id?: string;
}

interface ContactDetailsProps {
  contactId: string;
}

export function ContactDetails({ contactId }: ContactDetailsProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
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
        setError('Failed to load contact details');
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time subscription
    const channel = supabase
      .channel('contact-changes')
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

    fetchContact();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [contactId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <h3 className="font-medium text-destructive">Error loading contact</h3>
        <p className="text-sm text-destructive/80">{error}</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <h3 className="font-medium text-destructive">Contact not found</h3>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p>{contact.name || "Unnamed Contact"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
            <p>{contact.role || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p>{contact.email || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
            <p>{contact.phone || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
            <p>{contact.company_name || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <Badge variant={contact.status === "active" ? "secondary" : contact.status === "pending" ? "outline" : "destructive"}>
              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
            </Badge>
          </div>
          {contact.lastContact && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Last Contact</h3>
              <p>{new Date(contact.lastContact).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p>{contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        {contact.image_url && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Profile Image</h3>
            <img 
              src={contact.image_url} 
              alt={contact.name || "Contact"} 
              className="mt-2 w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}