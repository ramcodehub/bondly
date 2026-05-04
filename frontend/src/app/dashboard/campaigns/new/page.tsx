'use client';

import { useRouter } from 'next/navigation';
import { CampaignForm } from '../campaign-form';

export default function NewCampaignPage() {
  const router = useRouter();

  const handleCreateCampaign = async (data: any) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "");
      const response = await fetch(`${API_BASE}/extended/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create campaign');
      }
      
      router.push('/dashboard/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/campaigns');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">
          Create a new marketing campaign.
        </p>
      </div>
      
      <CampaignForm 
        onSubmit={handleCreateCampaign}
        onCancel={handleCancel}
      />
    </div>
  );
}