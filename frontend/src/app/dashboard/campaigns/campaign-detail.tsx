'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Campaign, CampaignWithStats } from './types';
import { useCampaignsRealtime } from '@/lib/hooks/useCampaignsRealtime';
import { get, del } from '@/lib/api/client';

interface CampaignDetailProps {
  campaignId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function CampaignDetail({ campaignId }: CampaignDetailProps) {
  const router = useRouter();
  const { campaigns, loading, error } = useCampaignsRealtime();
  const [campaign, setCampaign] = useState<CampaignWithStats | null>(null);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    if (campaigns.length > 0) {
      const foundCampaign = campaigns.find((c: Campaign) => c.campaign_id.toString() === campaignId);
      if (foundCampaign) {
        // Calculate additional stats
        const campaignWithStats: CampaignWithStats = {
          ...foundCampaign,
          roi: foundCampaign.actual_cost && foundCampaign.expected_revenue 
            ? ((foundCampaign.expected_revenue - foundCampaign.actual_cost) / foundCampaign.actual_cost) * 100 
            : undefined,
          cost_per_lead: foundCampaign.actual_cost && foundCampaign.number_of_leads 
            ? foundCampaign.actual_cost / foundCampaign.number_of_leads 
            : undefined,
          response_rate: foundCampaign.number_of_leads && foundCampaign.number_of_responses 
            ? (foundCampaign.number_of_responses / foundCampaign.number_of_leads) * 100 
            : undefined
        };
        setCampaign(campaignWithStats);
        
        // Fetch leads for this campaign
        fetchLeadsForCampaign(foundCampaign.campaign_id);
      }
    }
  }, [campaigns, campaignId]);

  const fetchLeadsForCampaign = async (campaignId: number) => {
    try {
      const data = await get(`/api/extended/campaigns/${campaignId}/leads`);
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/campaigns/${campaignId}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        const response = await del(`/api/extended/campaigns/${campaignId}`);
        if (response.success) {
          router.push('/dashboard/campaigns');
        } else {
          alert('Failed to delete campaign');
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Error deleting campaign');
      }
    }
  };

  if (loading) {
    return <div>Loading campaign details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading campaign: {error}</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  // Prepare data for charts
  const roiData = [
    { name: 'Budgeted', value: campaign.budgeted_cost || 0 },
    { name: 'Actual', value: campaign.actual_cost || 0 },
    { name: 'Revenue', value: campaign.expected_revenue || 0 }
  ];

  const performanceData = [
    { name: 'Leads', value: campaign.number_of_leads },
    { name: 'Responses', value: campaign.number_of_responses }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/dashboard/campaigns')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{campaign.campaign_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Campaign Details</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Type</dt>
                    <dd className="font-medium">
                      <Badge>{campaign.type}</Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="font-medium">
                      <Badge 
                        className={
                          campaign.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          campaign.status === 'Planned' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Start Date</dt>
                    <dd className="font-medium">
                      {new Date(campaign.start_date).toLocaleDateString()}
                    </dd>
                  </div>
                  {campaign.end_date && (
                    <div>
                      <dt className="text-sm text-muted-foreground">End Date</dt>
                      <dd className="font-medium">
                        {new Date(campaign.end_date).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              
              <div>
                <h3 className="font-semibold">Performance Metrics</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Leads Generated</dt>
                    <dd className="text-2xl font-bold">{campaign.number_of_leads}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Responses</dt>
                    <dd className="text-2xl font-bold">{campaign.number_of_responses}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Response Rate</dt>
                    <dd className="text-2xl font-bold">
                      {campaign.response_rate !== undefined ? `${campaign.response_rate.toFixed(2)}%` : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">ROI</dt>
                    <dd className="text-2xl font-bold">
                      {campaign.roi !== undefined ? (
                        <span className={campaign.roi >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {campaign.roi.toFixed(2)}%
                        </span>
                      ) : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads from this Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead: any) => (
                        <tr key={lead.id} className="border-b hover:bg-muted/50">
                          <td className="py-2">
                            {lead.first_name} {lead.last_name}
                          </td>
                          <td className="py-2">{lead.email}</td>
                          <td className="py-2">
                            <Badge variant="outline">{lead.status || 'New'}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No leads associated with this campaign yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}