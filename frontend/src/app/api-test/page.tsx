"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"

export default function ApiTestPage() {
  const { user, profile, loading: userLoading } = useUser()
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const testGetProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile')
      }
      
      setApiResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('API Test Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testUpdateProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: 'Test User Updated',
          phone: '+1234567890',
          bio: 'This is a test bio',
          location: 'Test Location'
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }
      
      setApiResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('API Test Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) {
    return <div>Loading user...</div>
  }

  if (!user) {
    return <div>Please log in to test the API</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Current User Info</h2>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {profile && (
          <>
            <p><strong>Profile ID:</strong> {profile.id}</p>
            <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={testGetProfile}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test GET /api/profile'}
        </button>
        
        <button
          onClick={testUpdateProfile}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Test PUT /api/profile'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {apiResponse && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold mb-2">API Response:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Debug Information:</h3>
        <p><strong>User Loading:</strong> {userLoading ? 'true' : 'false'}</p>
        <p><strong>User:</strong> {user ? 'Present' : 'Null'}</p>
        <p><strong>Profile:</strong> {profile ? 'Present' : 'Null'}</p>
      </div>
    </div>
  )
}