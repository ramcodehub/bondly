"use client"

import { useEffect, useState } from 'react'
import realtimeManager from '@/lib/realtime'
import supabase from '@/lib/supabase-client'

export default function TestRealtimeComponent() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('TestRealtimeComponent: useEffect called')
    
    // Fetch initial data
    const fetchData = async () => {
      try {
        console.log('TestRealtimeComponent: Fetching initial data')
        setLoading(true)
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        console.log('TestRealtimeComponent: Initial data fetched', data)
        setDeals(data || [])
        setLoading(false)
      } catch (err) {
        console.error('TestRealtimeComponent: Error fetching data', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        setLoading(false)
      }
    }

    fetchData()

    // Subscribe to realtime changes
    console.log('TestRealtimeComponent: Setting up realtime subscription')
    const unsubscribe = realtimeManager.subscribe({
      table: 'deals',
      onChange: (event) => {
        console.log('TestRealtimeComponent: Received realtime event', event)
        // Handle realtime events
        if (event.eventType === 'INSERT') {
          setDeals(prev => [event.new, ...prev])
        } else if (event.eventType === 'UPDATE') {
          setDeals(prev => prev.map(deal => 
            deal.id === event.new.id ? event.new : deal
          ))
        } else if (event.eventType === 'DELETE') {
          setDeals(prev => prev.filter(deal => deal.id !== event.old.id))
        }
      }
    })

    console.log('TestRealtimeComponent: Realtime subscription set up')

    // Cleanup subscription on unmount
    return () => {
      console.log('TestRealtimeComponent: Cleaning up subscription')
      unsubscribe()
    }
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Realtime Test Component</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div>
        <h3 className="text-lg font-semibold mb-2">Deals ({deals.length})</h3>
        {deals.map(deal => (
          <div key={deal.id} className="border p-2 mb-2">
            <p><strong>Name:</strong> {deal.name}</p>
            <p><strong>Amount:</strong> ${deal.amount?.toLocaleString()}</p>
            <p><strong>Stage:</strong> {deal.stage}</p>
          </div>
        ))}
      </div>
    </div>
  )
}