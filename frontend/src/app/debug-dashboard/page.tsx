"use client"

import { useDashboardStats } from "@/lib/hooks/useDashboardStats"

export default function DebugDashboard() {
  const { stats, loading, error, refresh } = useDashboardStats()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Dashboard</h1>
      <div className="mb-4">
        <button 
          onClick={refresh}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Refresh Data
        </button>
      </div>
      
      {loading && <p className="text-blue-500">Loading dashboard data...</p>}
      
      {error && (
        <div className="text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={refresh}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Dashboard Stats:</h2>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}