import { useEffect, useState } from 'react';
import { Campaign } from '@/app/dashboard/campaigns/types';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/extended/campaigns`);
        const data = await response.json();
        
        if (data.success) {
          setCampaigns(data.data);
        } else {
          setError(data.message || 'Failed to fetch campaigns');
        }
      } catch (err) {
        setError('Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return { campaigns, loading, error };
}