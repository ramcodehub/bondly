"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";

// Define the Contact type
interface Contact {
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

interface ContactListProps {
  contacts: Contact[];
  onContactSelect?: (contact: Contact) => void;
  onContactEdit?: (contact: Contact) => void;
}

export function ContactList({ contacts, onContactSelect, onContactEdit }: ContactListProps) {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div 
          key={contact.id} 
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          onClick={() => onContactSelect?.(contact)}
        >
          <div className="flex items-center gap-3">
            {contact.image_url ? (
              <img 
                src={contact.image_url} 
                alt={contact.name || "Contact"} 
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {contact.name ? contact.name.charAt(0) : "?"}
              </div>
            )}
            <div>
              <h3 className="font-medium">{contact.name || "Unnamed Contact"}</h3>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={contact.status === "active" ? "secondary" : contact.status === "pending" ? "outline" : "destructive"}>
              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
            </Badge>
            {onContactEdit && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onContactEdit(contact);
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}