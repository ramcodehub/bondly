"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContactsRealtime } from '@/lib/hooks/useContactsRealtime';

interface RecentContactsProps {
  limit?: number;
}

export function RecentContacts({ limit = 5 }: RecentContactsProps) {
  const { contacts: allContacts, loading } = useContactsRealtime();
  
  // Get the most recent contacts
  const contacts = allContacts.slice(0, limit);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
          <CardDescription>
            Recently added contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div>
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div className="h-3 w-16 bg-muted rounded mt-1"></div>
                  </div>
                </div>
                <div className="h-5 w-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Contacts</CardTitle>
        <CardDescription>
          Recently added contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {contact.image_url ? (
                  <img 
                    src={contact.image_url} 
                    alt={contact.name || "Contact"} 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                    {contact.name ? contact.name.charAt(0) : "?"}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-sm">{contact.name || "Unnamed Contact"}</h3>
                  <p className="text-xs text-muted-foreground">{contact.email}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}