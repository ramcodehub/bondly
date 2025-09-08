import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionsTab } from '../components/transactions-tab';
import { ServiceLifecycleTab } from '../components/service-lifecycle-tab';

export const dynamic = 'force-dynamic';

async function getCompany(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/account/${id}`, {
    next: { tags: ['company'] },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch company');
  }

  return res.json();
}

export default async function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const company = await getCompany(params.id);

  if (!company) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {company.account_name}
              </h1>
              <p className="text-muted-foreground">{company.industry || 'Industry not specified'}</p>
            </div>
            <Badge variant="default" className="text-lg py-2 px-4">
              Company
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="service">Service Lifecycle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
                    <p>{company.account_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                    <p>{company.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                    <p>{company.website || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Email</h3>
                    <p>{company.contact_email || 'Not provided'}</p>
                  </div>
                </div>
                {company.logo_url && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Company Logo</h3>
                    <img 
                      src={company.logo_url} 
                      alt={company.account_name} 
                      className="mt-2 max-w-xs h-auto"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionsTab companyId={params.id} />
          </TabsContent>
          
          <TabsContent value="service">
            <ServiceLifecycleTab companyId={params.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}