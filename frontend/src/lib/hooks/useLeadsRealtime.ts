"use client"

import { useEffect, useState, useCallback } from 'react'
import { Lead } from '@/app/dashboard/leads/types'
import realtimeManager from '@/lib/realtime'
import supabase from '@/lib/supabase-client'
import { notifications } from '@/lib/notifications'

interface LeadsRealtimeState {
  leads: Lead[]
  loading: boolean
  error: string | null
  stats: {
    totalLeads: number
    statusBreakdown: Record<string, number>
    recentLeads: Lead[]
    leadsBySource: Record<string, number>
  }
}

export function useLeadsRealtime() {
  const [state, setState] = useState<LeadsRealtimeState>({
    leads: [],
    loading: true,
    error: null,
    stats: {
      totalLeads: 0,
      statusBreakdown: {},
      recentLeads: [],
      leadsBySource: {}
    }
  })

  // Calculate stats from leads array
  const calculateStats = useCallback((leads: Lead[]) => {
    const stats = {
      totalLeads: leads.length,
      statusBreakdown: {} as Record<string, number>,
      recentLeads: leads.slice(0, 5),
      leadsBySource: {} as Record<string, number>
    }

    // Calculate breakdowns
    leads.forEach(lead => {
      // Status breakdown
      const status = lead.status || 'unknown'
      stats.statusBreakdown[status] = (stats.statusBreakdown[status] || 0) + 1
      
      // Source breakdown
      const source = lead.source || 'unknown'
      stats.leadsBySource[source] = (stats.leadsBySource[source] || 0) + 1
    })

    return stats
  }, [])

  // Fetch initial leads data
  const fetchLeads = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const stats = calculateStats(data || [])

      setState(prev => ({
        ...prev,
        leads: data || [],
        stats,
        loading: false,
        error: null
      }))

    } catch (error) {
      console.error('Error fetching leads:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch leads'
      }))
    }
  }, [calculateStats])

  // Optimistic update for creating lead
  const createLead = useCallback(async (leadData: Partial<Lead>) => {
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticLead: Lead = {
        id: tempId,
        first_name: leadData.first_name || '',
        last_name: leadData.last_name || '',
        email: leadData.email || '',
        status: leadData.status || 'new',
        ...leadData
      } as Lead

      setState(prev => {
        const newLeads = [optimisticLead, ...prev.leads]
        return {
          ...prev,
          leads: newLeads,
          stats: calculateStats(newLeads)
        }
      })

      // Actual API call
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })

      if (!response.ok) {
        throw new Error('Failed to create lead')
      }

      const result = await response.json()
      
      // Replace optimistic update with real data
      setState(prev => {
        const newLeads = prev.leads.map(lead => 
          lead.id === tempId ? result.data : lead
        )
        return {
          ...prev,
          leads: newLeads,
          stats: calculateStats(newLeads)
        }
      })

      notifications.success('Lead created successfully')
      return result.data

    } catch (error) {
      // Remove optimistic update on error
      setState(prev => {
        const newLeads = prev.leads.filter(lead => !lead.id.startsWith('temp-'))
        return {
          ...prev,
          leads: newLeads,
          stats: calculateStats(newLeads)
        }
      })
      
      notifications.error('Failed to create lead')
      throw error
    }
  }, [calculateStats])

  // Optimistic update for updating lead
  const updateLead = useCallback(async (leadId: string, updates: Partial<Lead>) => {
    try {
      // Optimistic update
      setState(prev => {
        const newLeads = prev.leads.map(lead => 
          lead.id === leadId ? { ...lead, ...updates } : lead
        )
        return {
          ...prev,
          leads: newLeads,
          stats: calculateStats(newLeads)
        }
      })

      // Actual API call
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update lead')
      }

      const result = await response.json()
      
      // Update with real data
      setState(prev => {
        const newLeads = prev.leads.map(lead => 
          lead.id === leadId ? result.data : lead
        )
        return {
          ...prev,
          leads: newLeads,
          stats: calculateStats(newLeads)
        }
      })

      notifications.success('Lead updated successfully')
      return result.data

    } catch (error) {
      // Revert optimistic update on error
      fetchLeads()
      notifications.error('Failed to update lead')
      throw error
    }
  }, [calculateStats, fetchLeads])

  // Optimistic update for deleting lead
  const deleteLead = useCallback(async (leadId: string) => {
    // Save current state for rollback
    const originalLeads = state.leads
    
    try {
      // Optimistic update
      setState(prev => {
        const newLeads = prev.leads.filter(lead => lead.id !== leadId)
        return {
          ...prev,
          leads: newLeads,
          stats: calculateStats(newLeads)
        }
      })

      // Actual API call
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete lead')
      }

      notifications.success('Lead deleted successfully')

    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        leads: originalLeads,
        stats: calculateStats(originalLeads)
      }))
      
      notifications.error('Failed to delete lead')
      throw error
    }
  }, [state.leads, calculateStats])

  // Set up realtime subscription
  useEffect(() => {
    // Initial fetch
    fetchLeads()

    // Subscribe to realtime changes
    const unsubscribe = realtimeManager.subscribe({
      table: 'leads',
      onChange: (event) => {
        console.log('Leads realtime event:', event)
        
        if (event.eventType === 'INSERT') {
          setState(prev => {
            // Avoid duplicates from optimistic updates
            if (prev.leads.find(lead => lead.id === event.new.id)) {
              return prev
            }
            const newLeads = [event.new, ...prev.leads]
            return {
              ...prev,
              leads: newLeads,
              stats: calculateStats(newLeads)
            }
          })
          notifications.info('New lead added', {
            description: `${event.new.first_name} ${event.new.last_name}`
          })
        } else if (event.eventType === 'UPDATE') {
          setState(prev => {
            const newLeads = prev.leads.map(lead => 
              lead.id === event.new.id ? event.new : lead
            )
            return {
              ...prev,
              leads: newLeads,
              stats: calculateStats(newLeads)
            }
          })
          notifications.info('Lead updated', {
            description: `${event.new.first_name} ${event.new.last_name}`
          })
        } else if (event.eventType === 'DELETE') {
          setState(prev => {
            const newLeads = prev.leads.filter(lead => lead.id !== event.old.id)
            return {
              ...prev,
              leads: newLeads,
              stats: calculateStats(newLeads)
            }
          })
          notifications.info('Lead deleted', {
            description: `${event.old.first_name} ${event.old.last_name}`
          })
        }
      }
    })

    return unsubscribe
  }, [fetchLeads, calculateStats])

  return {
    ...state,
    refetch: fetchLeads,
    createLead,
    updateLead,
    deleteLead
  }
}