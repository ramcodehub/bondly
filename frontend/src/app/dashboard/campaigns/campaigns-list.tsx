'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { campaignColumns } from './columns';
import { Campaign } from './types';
import { useCampaignsRealtime } from '@/lib/hooks/useCampaignsRealtime';

export function CampaignsList() {
  const router = useRouter();
  const { campaigns, loading, error } = useCampaignsRealtime();
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setFilteredCampaigns(campaigns);
  }, [campaigns]);

  const handleCreateCampaign = () => {
    router.push('/dashboard/campaigns/new');
  };

  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading campaigns: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
        <Button onClick={handleCreateCampaign}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      
      <DataTable 
        columns={campaignColumns} 
        data={filteredCampaigns} 
        searchKey="campaign_name"
        onRowClick={(row: Campaign) => router.push(`/dashboard/campaigns/${row.campaign_id}`)}
      />
    </div>
  );
}