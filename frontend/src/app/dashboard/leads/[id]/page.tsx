import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadForm } from '../lead-form';

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
      </div>
    </div>
  );
}
