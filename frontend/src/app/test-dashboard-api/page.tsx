"use client"

import { useState, useEffect } from 'react'

export default function TestDashboardAPI() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const result = await response.json()
        setData(result)
        setLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);
        console.error("Error:", err);
        setLoading(false);
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard API</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">API Response:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}