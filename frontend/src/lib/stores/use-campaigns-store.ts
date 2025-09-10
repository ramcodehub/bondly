import { create } from 'zustand';
import { Campaign } from '@/app/dashboard/campaigns/types';
import { get as apiGet, post, put, del } from '@/lib/api/client';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

interface CampaignsState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaign: Omit<Campaign, 'campaign_id'>) => Promise<void>;
  updateCampaign: (id: number, campaign: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: number) => Promise<void>;
  getCampaignById: (id: number) => Campaign | undefined;
}

export const useCampaignsStore = create<CampaignsState>((set, getStore) => ({
  campaigns: [],
  loading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ loading: true, error: null });
    try {
      const response: ApiResponse<Campaign[]> = await apiGet('/api/extended/campaigns');
      
      if (response.success) {
        set({ campaigns: response.data || [], loading: false });
      } else {
        set({ error: response.message || 'Failed to fetch campaigns', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch campaigns', loading: false });
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response: ApiResponse<Campaign> = await post('/api/extended/campaigns', campaignData);
      
      if (response.success) {
        const { campaigns } = getStore();
        set({ campaigns: [...campaigns, response.data!], error: null });
      } else {
        set({ error: response.message || 'Failed to create campaign' });
      }
    } catch (error) {
      set({ error: 'Failed to create campaign' });
    }
  },

  updateCampaign: async (id, campaignData) => {
    try {
      const response: ApiResponse<Campaign> = await put(`/api/extended/campaigns/${id}`, campaignData);
      
      if (response.success) {
        const { campaigns } = getStore();
        set({
          campaigns: campaigns.map(campaign => 
            campaign.campaign_id === id ? { ...campaign, ...response.data } : campaign
          ),
          error: null
        });
      } else {
        set({ error: response.message || 'Failed to update campaign' });
      }
    } catch (error) {
      set({ error: 'Failed to update campaign' });
    }
  },

  deleteCampaign: async (id) => {
    try {
      const response: ApiResponse<null> = await del(`/api/extended/campaigns/${id}`);
      
      if (response.success) {
        const { campaigns } = getStore();
        set({ campaigns: campaigns.filter(campaign => campaign.campaign_id !== id), error: null });
      } else {
        set({ error: response.message || 'Failed to delete campaign' });
      }
    } catch (error) {
      set({ error: 'Failed to delete campaign' });
    }
  },

  getCampaignById: (id) => {
    const { campaigns } = getStore();
    return campaigns.find(campaign => campaign.campaign_id === id);
  },
}));