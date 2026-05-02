"use client"

import { useState, useEffect } from 'react'
import { request } from '@/services/apiService'

interface DashboardStats {
  companies: number
  contacts: number
  leads: number
  deals: number
  tasks: number
  totalRevenue: number
  recentActivities: Array<{
    id: number
    type: string
    title: string
    description: string
    time: string
    icon: string
  }>
}

interface DashboardStatsState {
  stats: DashboardStats
  loading: boolean
  error: string | null
}

export function useDashboardStats() {
  const [state, setState] = useState<DashboardStatsState>({
    stats: {
      companies: 0,
      contacts: 0,
      leads: 0,
      deals: 0,
      tasks: 0,
      totalRevenue: 0,
      recentActivities: []
    },
    loading: true,
    error: null
  })

  const fetchDashboardStats = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      console.log('Fetching dashboard stats...')
      // Fetch from backend API using the proper API service
      const result = await request('/dashboard/stats')
      console.log('Dashboard stats result:', result)
      
      // Validate the result structure
      if (!result || !result.data) {
        throw new Error('Invalid response structure from dashboard API')
      }
      
      setState(prev => ({
        ...prev,
        stats: result.data,
        loading: false,
        error: null
      }))
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard statistics'
      }))
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  return {
    ...state,
    refresh: fetchDashboardStats
  }
}