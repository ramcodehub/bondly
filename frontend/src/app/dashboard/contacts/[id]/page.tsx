import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractionsTab } from '../components/interactions-tab';

export const dynamic = 'force-dynamic';

async function getContact(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/contact/${id}`, {
    next: { tags: ['contact'] },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch contact');
  }

  const result = await res.json();
  return result.team?.find((contact: any) => contact.id === parseInt(id));
}

export default async function ContactDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const contact = await getContact(params.id);

  if (!contact) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {contact.name}
              </h1>
              <p className="text-muted-foreground">{contact.email || 'No email provided'}</p>
            </div>
            <Badge variant="default" className="text-lg py-2 px-4">
              Contact
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
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
                    <p>{contact.name}</p>
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
                </div>
                {contact.image_url && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Profile Image</h3>
                    <img 
                      src={contact.image_url} 
                      alt={contact.name} 
                      className="mt-2 w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="interactions">
            <InteractionsTab contactId={params.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}