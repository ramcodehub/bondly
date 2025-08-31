"use client"

import { useEffect, useState } from "react"

export default function TestClientPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const testClientApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/test-client', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      setTestResult({
        status: response.status,
        data: data
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('API Test Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Supabase Client Test</h1>
      
      <div className="mb-6">
        <button
          onClick={testClientApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Supabase Client'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {testResult && (
        <div className="p-4 bg-white border rounded">
          <h3 className="font-bold mb-2">Test Result</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">Information</h3>
        <p>This test checks which Supabase client is being used by the API routes:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>Server (Service Role)</strong>: Uses the service role key for full access</li>
          <li><strong>Fallback (Anon Key)</strong>: Uses the anonymous key with limited access</li>
        </ul>
      </div>
    </div>
  )
}