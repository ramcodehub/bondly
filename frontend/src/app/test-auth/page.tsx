"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabase-client"

export default function TestAuthPage() {
  const { user, profile, loading: userLoading } = useUser()
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const testAuth = async () => {
    setLoading(true)
    setError(null)
    try {
      const results: any = {}
      
      // Test 1: Check user session from hook
      results.hookUser = {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email
      }
      
      // Test 2: Check profile from hook
      results.hookProfile = profile
      
      // Test 3: Check session directly from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      results.directSession = {
        hasSession: !!session,
        sessionId: session?.user?.id,
        sessionEmail: session?.user?.email,
        error: sessionError?.message
      }
      
      // Test 4: Check if we can access cookies (this is just for debugging)
      // Note: We can't directly access cookies in the browser for security reasons
      // But we can check if the Supabase client has them
      
      setAuthInfo(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Auth Test Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testApiCall = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        credentials: 'include' // This ensures cookies are sent with the request
      })
      
      const data = await response.json()
      
      // Convert headers to a plain object for logging
      const headersObj: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headersObj[key] = value
      })
      
      setAuthInfo((prev: any) => ({
        ...prev,
        apiTest: {
          status: response.status,
          data: data,
          headers: headersObj
        }
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && !userLoading) {
      testAuth()
    }
  }, [user, userLoading])

  if (userLoading) {
    return <div className="p-8">Loading user...</div>
  }

  if (!user) {
    return <div className="p-8">Please log in to test authentication</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={testAuth}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Authentication'}
        </button>
        
        <button
          onClick={testApiCall}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test API Call
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {authInfo && (
        <div className="space-y-6">
          {Object.entries(authInfo).map(([key, value]) => (
            <div key={key} className="p-4 bg-white border rounded">
              <h3 className="font-bold mb-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}