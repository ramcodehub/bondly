"use client"

import { useEffect, useState, useCallback } from 'react'
import realtimeManager from '@/lib/realtime'
import supabase from '@/lib/supabase-client'
import { notifications } from '@/lib/notifications'
import type { Company as CompanyType } from '@/lib/stores/types'

interface Company {
  id: string
  name: string
  industry: string
  size: string
  website?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface CompaniesRealtimeState {
  companies: Company[]
  loading: boolean
  error: string | null
  stats: {
    totalCompanies: number
    industryBreakdown: Record<string, number>
    sizeBreakdown: Record<string, number>
    recentCompanies: Company[]
  }
}

export function useCompaniesRealtime() {
  const [state, setState] = useState<CompaniesRealtimeState>({
    companies: [],
    loading: true,
    error: null,
    stats: {
      totalCompanies: 0,
      industryBreakdown: {},
      sizeBreakdown: {},
      recentCompanies: []
    }
  })

  // Calculate stats from companies array
  const calculateStats = useCallback((companies: Company[]) => {
    const stats = {
      totalCompanies: companies.length,
      industryBreakdown: {} as Record<string, number>,
      sizeBreakdown: {} as Record<string, number>,
      recentCompanies: companies.slice(0, 5)
    }

    // Calculate breakdowns
    companies.forEach(company => {
      // Industry breakdown
      const industry = company.industry || 'unknown'
      stats.industryBreakdown[industry] = (stats.industryBreakdown[industry] || 0) + 1
      
      // Size breakdown
      const size = company.size || 'unknown'
      stats.sizeBreakdown[size] = (stats.sizeBreakdown[size] || 0) + 1
    })

    return stats
  }, [])

  // Fetch initial companies data
  const fetchCompanies = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const stats = calculateStats(data || [])

      setState(prev => ({
        ...prev,
        companies: data || [],
        stats,
        loading: false,
        error: null
      }))

    } catch (error) {
      console.error('Error fetching companies:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch companies'
      }))
    }
  }, [calculateStats])

  // Optimistic update for creating company
  const createCompany = useCallback(async (companyData: Partial<Company>) => {
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticCompany: Company = {
        id: tempId,
        name: companyData.name || '',
        industry: companyData.industry || '',
        size: companyData.size || '',
        website: companyData.website || '',
        email: companyData.email || '',
        phone: companyData.phone || '',
        address: companyData.address || '',
        notes: companyData.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...companyData
      } as Company

      setState(prev => {
        const newCompanies = [optimisticCompany, ...prev.companies]
        return {
          ...prev,
          companies: newCompanies,
          stats: calculateStats(newCompanies)
        }
      })

      // Actual API call
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      })

      if (!response.ok) {
        throw new Error('Failed to create company')
      }

      const result = await response.json()
      
      // Replace optimistic update with real data
      setState(prev => {
        const newCompanies = prev.companies.map(company => 
          company.id === tempId ? result.data : company
        )
        return {
          ...prev,
          companies: newCompanies,
          stats: calculateStats(newCompanies)
        }
      })

      notifications.success('Company created successfully')
      return result.data

    } catch (error) {
      // Remove optimistic update on error
      setState(prev => {
        const newCompanies = prev.companies.filter(company => !company.id.startsWith('temp-'))
        return {
          ...prev,
          companies: newCompanies,
          stats: calculateStats(newCompanies)
        }
      })
      
      notifications.error('Failed to create company')
      throw error
    }
  }, [calculateStats])

  // Optimistic update for updating company
  const updateCompany = useCallback(async (companyId: string, updates: Partial<Company>) => {
    try {
      // Optimistic update
      setState(prev => {
        const newCompanies = prev.companies.map(company => 
          company.id === companyId ? { ...company, ...updates } : company
        )
        return {
          ...prev,
          companies: newCompanies,
          stats: calculateStats(newCompanies)
        }
      })

      // Actual API call
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update company')
      }

      const result = await response.json()
      
      // Update with real data
      setState(prev => {
        const newCompanies = prev.companies.map(company => 
          company.id === companyId ? result.data : company
        )
        return {
          ...prev,
          companies: newCompanies,
          stats: calculateStats(newCompanies)
        }
      })

      notifications.success('Company updated successfully')
      return result.data

    } catch (error) {
      // Revert optimistic update on error
      fetchCompanies()
      notifications.error('Failed to update company')
      throw error
    }
  }, [calculateStats, fetchCompanies])

  // Optimistic update for deleting company
  const deleteCompany = useCallback(async (companyId: string) => {
    // Store original for potential rollback
    let originalCompaniesState: Company[] = []
    
    try {
      // Store original for potential rollback
      originalCompaniesState = state.companies;

      // Optimistic update
      setState(prev => {
        const newCompanies = prev.companies.filter(company => company.id !== companyId)
        return {
          ...prev,
          companies: newCompanies,
          stats: calculateStats(newCompanies)
        }
      })

      // Actual API call
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete company')
      }

      notifications.success('Company deleted successfully')

    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        companies: originalCompaniesState,
        stats: calculateStats(originalCompaniesState)
      }))
      
      notifications.error('Failed to delete company')
      throw error
    }
  }, [state.companies, calculateStats])

  // Set up realtime subscription
  useEffect(() => {
    // Initial fetch
    fetchCompanies()

    // Subscribe to realtime changes
    const unsubscribe = realtimeManager.subscribe({
      table: 'companies',
      onChange: (event) => {
        console.log('Companies realtime event:', event)
        
        if (event.eventType === 'INSERT') {
          const newCompany = event.new
          setState(prev => {
            // Avoid duplicates from optimistic updates
            if (prev.companies.find(company => company.id === newCompany.id)) {
              return prev
            }
            const newCompanies = [newCompany, ...prev.companies]
            return {
              ...prev,
              companies: newCompanies,
              stats: calculateStats(newCompanies)
            }
          })
          notifications.info('New company added', {
            description: event.new.name
          })
        } else if (event.eventType === 'UPDATE') {
          const updatedCompany = event.new
          setState(prev => {
            const newCompanies = prev.companies.map(company => 
              company.id === updatedCompany.id ? updatedCompany : company
            )
            return {
              ...prev,
              companies: newCompanies,
              stats: calculateStats(newCompanies)
            }
          })
          notifications.info('Company updated', {
            description: event.new.name
          })
        } else if (event.eventType === 'DELETE') {
          setState(prev => {
            const newCompanies = prev.companies.filter(company => company.id !== event.old.id)
            return {
              ...prev,
              companies: newCompanies,
              stats: calculateStats(newCompanies)
            }
          })
          notifications.info('Company deleted', {
            description: event.old.name
          })
        }
      }
    })

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [fetchCompanies, calculateStats])

  return {
    ...state,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany
  }
}