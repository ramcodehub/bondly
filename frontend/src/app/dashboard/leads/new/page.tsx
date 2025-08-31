import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadForm } from '../lead-form';

export const dynamic = 'force-dynamic';

export default function NewLeadPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
