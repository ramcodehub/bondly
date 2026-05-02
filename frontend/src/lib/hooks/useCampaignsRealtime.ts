"use client"

import { useEffect, useState, useCallback } from 'react'
import { Campaign } from '@/app/dashboard/campaigns/types'
import realtimeManager from '@/lib/realtime'
import supabase from '@/lib/supabase-client'
import { notifications } from '@/lib/notifications'

interface CampaignsRealtimeState {
  campaigns: Campaign[]
  loading: boolean
  error: string | null
  stats: {
    totalCampaigns: number
    statusBreakdown: Record<string, number>
    typeBreakdown: Record<string, number>
    recentCampaigns: Campaign[]
    totalBudget: number
    totalActualCost: number
    totalExpectedRevenue: number
  }
}

export function useCampaignsRealtime() {
  const [state, setState] = useState<CampaignsRealtimeState>({
    campaigns: [],
    loading: true,
    error: null,
    stats: {
      totalCampaigns: 0,
      statusBreakdown: {},
      typeBreakdown: {},
      recentCampaigns: [],
      totalBudget: 0,
      totalActualCost: 0,
      totalExpectedRevenue: 0
    }
  })

  // Calculate stats from campaigns array
  const calculateStats = useCallback((campaigns: Campaign[]) => {
    const stats = {
      totalCampaigns: campaigns.length,
      statusBreakdown: {} as Record<string, number>,
      typeBreakdown: {} as Record<string, number>,
      recentCampaigns: campaigns.slice(0, 5),
      totalBudget: 0,
      totalActualCost: 0,
      totalExpectedRevenue: 0
    }

    // Calculate breakdowns and totals
    campaigns.forEach(campaign => {
      // Status breakdown
      const status = campaign.status || 'unknown'
      stats.statusBreakdown[status] = (stats.statusBreakdown[status] || 0) + 1
      
      // Type breakdown
      const type = campaign.type || 'unknown'
      stats.typeBreakdown[type] = (stats.typeBreakdown[type] || 0) + 1
      
      // Totals
      stats.totalBudget += campaign.budgeted_cost || 0
      stats.totalActualCost += campaign.actual_cost || 0
      stats.totalExpectedRevenue += campaign.expected_revenue || 0
    })

    return stats
  }, [])

  // Fetch initial campaigns data
  const fetchCampaigns = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('marketing_campaign')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const stats = calculateStats(data || [])

      setState(prev => ({
        ...prev,
        campaigns: data || [],
        stats,
        loading: false,
        error: null
      }))

    } catch (error) {
      console.error('Error fetching campaigns:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch campaigns'
      }))
    }
  }, [calculateStats])

  // Optimistic update for creating campaign
  const createCampaign = useCallback(async (campaignData: Partial<Campaign>) => {
    try {
      // Optimistic update with temporary negative ID
      const tempId = -(Date.now())
      const optimisticCampaign: any = {
        campaign_id: tempId,
        campaign_name: campaignData.campaign_name || '',
        type: campaignData.type || 'Email',
        status: campaignData.status || 'Planned',
        start_date: campaignData.start_date || new Date().toISOString(),
        ...campaignData
      }

      setState(prev => {
        const newCampaigns = [optimisticCampaign, ...prev.campaigns]
        return {
          ...prev,
          campaigns: newCampaigns,
          stats: calculateStats(newCampaigns)
        }
      })

      // Actual API call
      const response = await fetch('/api/extended/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_name: campaignData.campaign_name,
          type: campaignData.type,
          status: campaignData.status,
          start_date: campaignData.start_date,
          end_date: campaignData.end_date,
          budgeted_cost: campaignData.budgeted_cost,
          actual_cost: campaignData.actual_cost,
          expected_revenue: campaignData.expected_revenue
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create campaign')
      }

      const result = await response.json()
      
      // Replace optimistic update with real data
      setState(prev => {
        const newCampaigns = prev.campaigns.map(campaign => 
          campaign.campaign_id === tempId ? result.data : campaign
        )
        return {
          ...prev,
          campaigns: newCampaigns,
          stats: calculateStats(newCampaigns)
        }
      })

      notifications.success('Campaign created successfully')
      return result.data

    } catch (error) {
      // Remove optimistic update on error
      setState(prev => {
        const newCampaigns = prev.campaigns.filter(campaign => campaign.campaign_id > 0)
        return {
          ...prev,
          campaigns: newCampaigns,
          stats: calculateStats(newCampaigns)
        }
      })
      
      notifications.error('Failed to create campaign')
      throw error
    }
  }, [calculateStats])

  // Optimistic update for updating campaign
  const updateCampaign = useCallback(async (campaignId: number, updates: Partial<Campaign>) => {
    try {
      // Optimistic update
      setState(prev => {
        const newCampaigns = prev.campaigns.map(campaign => 
          campaign.campaign_id === campaignId ? { ...campaign, ...updates } : campaign
        )
        return {
          ...prev,
          campaigns: newCampaigns,
          stats: calculateStats(newCampaigns)
        }
      })

      // Actual API call
      const response = await fetch(`/api/extended/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update campaign')
      }

      const result = await response.json()
      
      // Update with real data
      setState(prev => {
        const newCampaigns = prev.campaigns.map(campaign => 
          campaign.campaign_id === campaignId ? result.data : campaign
        )
        return {
          ...prev,
          campaigns: newCampaigns,
          stats: calculateStats(newCampaigns)
        }
      })

      notifications.success('Campaign updated successfully')
      return result.data

    } catch (error) {
      // Revert optimistic update on error
      fetchCampaigns()
      notifications.error('Failed to update campaign')
      throw error
    }
  }, [calculateStats, fetchCampaigns])

  // Optimistic update for deleting campaign
  const deleteCampaign = useCallback(async (campaignId: number) => {
    // Save current state for rollback
    let originalCampaignsState: Campaign[] = []
    
    try {
      // Save current state for rollback
      originalCampaignsState = state.campaigns;

      // Optimistic update
      setState(prev => {
        const newCampaigns = prev.campaigns.filter(campaign => campaign.campaign_id !== campaignId)
        return {
          ...prev,
          campaigns: newCampaigns,
          stats: calculateStats(newCampaigns)
        }
      })

      // Actual API call
      const response = await fetch(`/api/extended/campaigns/${campaignId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete campaign')
      }

      notifications.success('Campaign deleted successfully')

    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        campaigns: originalCampaignsState,
        stats: calculateStats(originalCampaignsState)
      }))
      
      notifications.error('Failed to delete campaign')
      throw error
    }
  }, [state.campaigns, calculateStats])

  // Set up realtime subscription
  useEffect(() => {
    // Initial fetch
    fetchCampaigns()

    // Subscribe to realtime changes
    const unsubscribe = realtimeManager.subscribe({
      table: 'marketing_campaign',
      onChange: (event) => {
        console.log('Campaigns realtime event:', event)
        
        if (event.eventType === 'INSERT') {
          const newCampaign = event.new
          setState(prev => {
            // Avoid duplicates from optimistic updates
            if (prev.campaigns.find(campaign => campaign.campaign_id === newCampaign.campaign_id)) {
              return prev
            }
            const newCampaigns = [newCampaign, ...prev.campaigns]
            return {
              ...prev,
              campaigns: newCampaigns,
              stats: calculateStats(newCampaigns)
            }
          })
          notifications.info('New campaign added', {
            description: event.new.campaign_name
          })
        } else if (event.eventType === 'UPDATE') {
          const updatedCampaign = event.new
          setState(prev => {
            const newCampaigns = prev.campaigns.map(campaign => 
              campaign.campaign_id === updatedCampaign.campaign_id ? updatedCampaign : campaign
            )
            return {
              ...prev,
              campaigns: newCampaigns,
              stats: calculateStats(newCampaigns)
            }
          })
          notifications.info('Campaign updated', {
            description: event.new.campaign_name
          })
        } else if (event.eventType === 'DELETE') {
          setState(prev => {
            const newCampaigns = prev.campaigns.filter(campaign => campaign.campaign_id !== event.old.campaign_id)
            return {
              ...prev,
              campaigns: newCampaigns,
              stats: calculateStats(newCampaigns)
            }
          })
          notifications.info('Campaign deleted', {
            description: event.old.campaign_name
          })
        }
      }
    })

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [fetchCampaigns, calculateStats])

  return {
    ...state,
    refetch: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign
  }
}