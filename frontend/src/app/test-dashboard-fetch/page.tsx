"use client"

import { useState, useEffect } from 'react'
import { request } from '@/services/apiService'

export default function TestDashboardFetch() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard stats...')
        const result = await request('/dashboard/stats')
        console.log('Dashboard stats result:', result)
        setData(result)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard Fetch</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Data Received:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}