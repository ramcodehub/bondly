"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"

export default function TestApiAuthPage() {
  const { user, loading: userLoading } = useUser()
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const testAuthApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/test-auth', {
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

  if (userLoading) {
    return <div className="p-8">Loading user...</div>
  }

  if (!user) {
    return <div className="p-8">Please log in to test API authentication</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Authentication Test</h1>
      
      <div className="mb-6">
        <button
          onClick={testAuthApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Authentication'}
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
        <h3 className="font-bold mb-2">Current User</h3>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  )
}