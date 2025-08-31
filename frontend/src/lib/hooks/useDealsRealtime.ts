"use client"

import { useEffect, useState, useCallback } from 'react'
import { Deal, DealStage } from '@/app/dashboard/deals/types'
import realtimeManager from '@/lib/realtime'
import supabase from '@/lib/supabase-client'
import { notifications } from '@/lib/notifications'

interface DealsRealtimeState {
  deals: Deal[]
  loading: boolean
  error: string | null
  stats: {
    totalDeals: number
    totalValue: number
    stageBreakdown: Record<DealStage, { count: number; value: number }>
    recentDeals: Deal[]
  }
}

export function useDealsRealtime() {
  const [state, setState] = useState<DealsRealtimeState>({
    deals: [],
    loading: true,
    error: null,
    stats: {
      totalDeals: 0,
      totalValue: 0,
      stageBreakdown: {
        lead: { count: 0, value: 0 },
        qualified: { count: 0, value: 0 },
        proposal: { count: 0, value: 0 },
        negotiation: { count: 0, value: 0 },
        closed_won: { count: 0, value: 0 },
        closed_lost: { count: 0, value: 0 }
      },
      recentDeals: []
    }
  })

  // Transform Supabase data to Deal interface
  const transformDeal = useCallback((dealData: any): Deal => {
    return {
      id: dealData.id,
      name: dealData.name,
      amount: dealData.amount || 0,
      company: dealData.leads?.company || dealData.companies?.name || 'Unknown Company',
      contact: dealData.contacts?.name || 
               (dealData.leads ? `${dealData.leads.first_name || ''} ${dealData.leads.last_name || ''}`.trim() : '') || 
               'Unknown Contact',
      stage: dealData.stage,
      probability: dealData.probability || 0,
      closeDate: dealData.close_date || '',
      close_date: dealData.close_date || '',
      description: dealData.description || '',
      companyIndustry: dealData.companies?.industry || '',
      contactEmail: dealData.contacts?.email || dealData.leads?.email || '',
      contactPhone: dealData.contacts?.phone || dealData.leads?.phone || '',
      lead_id: dealData.lead_id,
      contact_id: dealData.contact_id,
      account_id: dealData.company_id,
      owner_id: dealData.owner_id,
      deal_source: dealData.deal_source,
      competitors: dealData.competitors,
      next_step: dealData.next_step,
      created_at: dealData.created_at,
      updated_at: dealData.updated_at,
      created_by: dealData.created_by
    }
  }, [])

  // Calculate stats from deals array
  const calculateStats = useCallback((deals: Deal[]) => {
    const stats = {
      totalDeals: deals.length,
      totalValue: deals.reduce((sum, deal) => sum + deal.amount, 0),
      stageBreakdown: {
        lead: { count: 0, value: 0 },
        qualified: { count: 0, value: 0 },
        proposal: { count: 0, value: 0 },
        negotiation: { count: 0, value: 0 },
        closed_won: { count: 0, value: 0 },
        closed_lost: { count: 0, value: 0 }
      } as Record<DealStage, { count: number; value: number }>,
      recentDeals: deals.slice(0, 5)
    }

    // Calculate stage breakdown
    deals.forEach(deal => {
      const stage = deal.stage as DealStage
      if (stats.stageBreakdown[stage]) {
        stats.stageBreakdown[stage].count++
        stats.stageBreakdown[stage].value += deal.amount
      }
    })

    return stats
  }, [])

  // Fetch initial deals data
  const fetchDeals = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          leads(first_name, last_name, email, phone, company),
          contacts(name, email, phone),
          companies(name, industry)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const transformedDeals = (data || []).map(transformDeal)
      const stats = calculateStats(transformedDeals)

      setState(prev => ({
        ...prev,
        deals: transformedDeals,
        stats,
        loading: false,
        error: null
      }))

    } catch (error) {
      console.error('Error fetching deals:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch deals'
      }))
    }
  }, [transformDeal, calculateStats])

  // Optimistic update for creating deal
  const createDeal = useCallback(async (dealData: Partial<Deal>) => {
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticDeal: Deal = {
        id: tempId,
        name: dealData.name || '',
        amount: dealData.amount || 0,
        stage: dealData.stage || 'lead',
        probability: dealData.probability || 0,
        closeDate: dealData.closeDate || '',
        close_date: dealData.close_date || '',
        ...dealData
      } as Deal

      setState(prev => {
        const newDeals = [optimisticDeal, ...prev.deals]
        return {
          ...prev,
          deals: newDeals,
          stats: calculateStats(newDeals)
        }
      })

      // Actual API call
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dealData.name,
          amount: dealData.amount || 0,
          stage: dealData.stage || 'lead',
          probability: dealData.probability || 0,
          close_date: dealData.close_date || null,
          description: dealData.description || null,
          lead_id: dealData.lead_id || null,
          contact_id: dealData.contact_id || null,
          company_id: dealData.account_id || null,
          owner_id: dealData.owner_id || null,
          deal_source: dealData.deal_source || null,
          competitors: dealData.competitors || null,
          next_step: dealData.next_step || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create deal')
      }

      const result = await response.json()
      
      // Replace optimistic update with real data
      setState(prev => {
        const newDeals = prev.deals.map(deal => 
          deal.id === tempId ? transformDeal(result.data) : deal
        )
        return {
          ...prev,
          deals: newDeals,
          stats: calculateStats(newDeals)
        }
      })

      notifications.success('Deal created successfully')
      return result.data

    } catch (error) {
      // Remove optimistic update on error
      setState(prev => {
        const newDeals = prev.deals.filter(deal => !deal.id.startsWith('temp-'))
        return {
          ...prev,
          deals: newDeals,
          stats: calculateStats(newDeals)
        }
      })
      
      notifications.error('Failed to create deal')
      throw error
    }
  }, [transformDeal, calculateStats])

  // Optimistic update for updating deal
  const updateDeal = useCallback(async (dealId: string, updates: Partial<Deal>) => {
    try {
      // Optimistic update
      setState(prev => {
        const newDeals = prev.deals.map(deal => 
          deal.id === dealId ? { ...deal, ...updates } : deal
        )
        return {
          ...prev,
          deals: newDeals,
          stats: calculateStats(newDeals)
        }
      })

      // Actual API call
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update deal')
      }

      const result = await response.json()
      
      // Update with real data
      setState(prev => {
        const newDeals = prev.deals.map(deal => 
          deal.id === dealId ? transformDeal(result.data) : deal
        )
        return {
          ...prev,
          deals: newDeals,
          stats: calculateStats(newDeals)
        }
      })

      notifications.success('Deal updated successfully')
      return result.data

    } catch (error) {
      // Revert optimistic update on error
      fetchDeals()
      notifications.error('Failed to update deal')
      throw error
    }
  }, [transformDeal, calculateStats, fetchDeals])

  // Optimistic update for deleting deal
  const deleteDeal = useCallback(async (dealId: string) => {
    // Store original for potential rollback
    let originalDealsState: Deal[] = [];
    
    try {
      // Store original for potential rollback
      originalDealsState = state.deals;

      // Optimistic update
      setState(prev => {
        const newDeals = prev.deals.filter(deal => deal.id !== dealId)
        return {
          ...prev,
          deals: newDeals,
          stats: calculateStats(newDeals)
        }
      })

      // Actual API call
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete deal')
      }

      notifications.success('Deal deleted successfully')

    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        deals: originalDealsState,
        stats: calculateStats(originalDealsState)
      }))
      
      notifications.error('Failed to delete deal')
      throw error
    }
  }, [state.deals, calculateStats])

  // Set up realtime subscription
  useEffect(() => {
    // Initial fetch
    fetchDeals()

    // Subscribe to realtime changes
    const unsubscribe = realtimeManager.subscribe({
      table: 'deals',
      onChange: (event) => {
        console.log('Deals realtime event:', event)
        
        if (event.eventType === 'INSERT') {
          const newDeal = transformDeal(event.new)
          setState(prev => {
            // Avoid duplicates from optimistic updates
            if (prev.deals.find(deal => deal.id === newDeal.id)) {
              return prev
            }
            const newDeals = [newDeal, ...prev.deals]
            return {
              ...prev,
              deals: newDeals,
              stats: calculateStats(newDeals)
            }
          })
          notifications.info('New deal added', {
            description: `${event.new.name} - $${event.new.amount?.toLocaleString() || 0}`
          })
        } else if (event.eventType === 'UPDATE') {
          const updatedDeal = transformDeal(event.new)
          setState(prev => {
            const newDeals = prev.deals.map(deal => 
              deal.id === updatedDeal.id ? updatedDeal : deal
            )
            return {
              ...prev,
              deals: newDeals,
              stats: calculateStats(newDeals)
            }
          })
          notifications.info('Deal updated', {
            description: `${event.new.name} - ${event.new.stage}`
          })
        } else if (event.eventType === 'DELETE') {
          setState(prev => {
            const newDeals = prev.deals.filter(deal => deal.id !== event.old.id)
            return {
              ...prev,
              deals: newDeals,
              stats: calculateStats(newDeals)
            }
          })
          notifications.info('Deal deleted', {
            description: event.old.name
          })
        }
      }
    })

    return unsubscribe
  }, [fetchDeals, transformDeal, calculateStats])

  return {
    ...state,
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal
  }
}