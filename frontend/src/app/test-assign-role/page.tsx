'use client'

import { useState } from 'react'

export default function TestAssignRole() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const assignRole = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/assign-default-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      setResult(data)
      console.log('Assign role result:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      console.error('Error assigning role:', err);
      setResult({ error: errorMessage });
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Role Assignment</h1>
      
      <button 
        onClick={assignRole}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Assigning...' : 'Assign Default Role'}
      </button>
      
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}