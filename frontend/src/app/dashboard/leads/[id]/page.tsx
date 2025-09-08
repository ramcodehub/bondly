import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadForm } from '../lead-form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NurturingTab } from './nurturing-tab';

export const dynamic = 'force-dynamic';

async function getLead(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/leads/${id}`, {
    next: { tags: ['lead'] },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch lead');
  }

  return res.json();
}

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lead = await getLead(params.id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {lead.first_name} {lead.last_name}
              </h1>
              <p className="text-muted-foreground">{lead.email}</p>
            </div>
            {lead.score !== undefined && (
              <Badge variant="default" className="text-lg py-2 px-4">
                Score: {lead.score}
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="nurturing">Nurturing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>
                  Edit Lead: {lead.first_name} {lead.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadForm initialData={lead} isEdit />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nurturing">
            <NurturingTab leadId={params.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}