"use client";

import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractionsTab } from '../components/interactions-tab';
import { ContactDetails } from '@/components/contact-details';
import { useContact } from '@/lib/hooks/useContact';
import { Loader2 } from 'lucide-react';

export default function ContactDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { contact, loading, error } = useContact(params.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <h3 className="font-medium text-destructive">Error loading contact</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    notFound();
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {contact.name || "Unnamed Contact"}
              </h1>
              <p className="text-muted-foreground">{contact.email || 'No email provided'}</p>
            </div>
            <Badge variant="default" className="text-lg py-2 px-4">
              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ContactDetails contactId={params.id} />
          </TabsContent>
          
          <TabsContent value="interactions">
            <InteractionsTab contactId={params.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
