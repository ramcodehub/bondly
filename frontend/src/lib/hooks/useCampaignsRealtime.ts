import { useEffect, useState } from 'react';
import { useCampaignsStore } from '../stores/use-campaigns-store';
import { Campaign } from '@/app/dashboard/campaigns/types';

export function useCampaignsRealtime() {
  const { campaigns, loading, error, fetchCampaigns } = useCampaignsStore();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initializeCampaigns = async () => {
      try {
        setLocalLoading(true);
        setLocalError(null);
        await fetchCampaigns();
      } catch (err) {
        if (isMounted) {
          setLocalError('Failed to load campaigns');
        }
      } finally {
        if (isMounted) {
          setLocalLoading(false);
        }
      }
    };

    initializeCampaigns();

    return () => {
      isMounted = false;
    };
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading: localLoading || loading,
    error: localError || error,
  };
}