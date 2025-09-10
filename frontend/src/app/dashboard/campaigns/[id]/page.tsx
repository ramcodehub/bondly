'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CampaignForm } from '../campaign-form';
import { Campaign } from '../types';
import { get, put } from '@/lib/api/client';

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const data = await get(`/api/extended/campaigns/${params.id}`);
      
      if (data.success) {
        setCampaign(data.data);
      } else {
        console.error('Failed to fetch campaign:', data.message);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampaign = async (data: any) => {
    try {
      const result = await put(`/api/extended/campaigns/${params.id}`, data);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update campaign');
      }
      
      router.push('/dashboard/campaigns');
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/campaigns');
  };

  if (loading) {
    return <div>Loading campaign...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Campaign</h1>
        <p className="text-muted-foreground">
          Update the marketing campaign details.
        </p>
      </div>
      
      <CampaignForm 
        initialData={campaign}
        onSubmit={handleUpdateCampaign}
        onCancel={handleCancel}
      />
    </div>
  );
}