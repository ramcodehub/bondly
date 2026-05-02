"use client"

import { useEffect, useState } from 'react'
import { request } from '@/services/apiService'

export default function TestApiClientPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await request('/dashboard/stats')
        setResult(data)
      } catch (err) {
        setError(err.message)
        console.error('API Error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Client Test</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}