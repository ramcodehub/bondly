"use client"

import { useEffect, useState } from "react"

export default function TestEnvApiPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const testEnvApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/test-env', {
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
      <h1 className="text-3xl font-bold mb-6">Environment Variables API Test</h1>
      
      <div className="mb-6">
        <button
          onClick={testEnvApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Environment Variables'}
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
        <h3 className="font-bold mb-2">Instructions</h3>
        <p className="mb-2">If the service role key is not set, you need to:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Get your Supabase Service Role Key from your Supabase dashboard</li>
          <li>Add it to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file as:</li>
          <pre className="bg-gray-100 p-2 rounded mt-2">SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here</pre>
          <li>Restart your development server</li>
        </ol>
      </div>
    </div>
  )
}