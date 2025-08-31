"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabase-client"

export default function DebugProfilePage() {
  const { user, profile, loading: userLoading } = useUser()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const runDebugTests = async () => {
    setLoading(true)
    setError(null)
    try {
      const results: any = {}
      
      // Test 1: Check user session
      results.userSession = {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        userMetadata: user?.user_metadata
      }
      
      // Test 2: Check profile from hook
      results.hookProfile = profile
      
      // Test 3: Direct Supabase query for profile
      if (user?.id) {
        const { data: directProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          
        results.directProfileQuery = {
          data: directProfile,
          error: profileError?.message
        }
        
        // Test 4: Try to create/update profile directly
        if (directProfile) {
          // Profile exists, try to update
          const updateData = {
            full_name: 'Debug Test User',
            updated_at: new Date().toISOString()
          }
          
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single()
            
          results.directUpdate = {
            data: updatedProfile,
            error: updateError?.message
          }
        } else {
          // Profile doesn't exist, try to create
          const insertData = {
            id: user.id,
            email: user.email,
            full_name: 'Debug Test User',
            role: 'user',
            status: 'active'
          }
          
          const { data: createdProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([insertData])
            .select()
            .single()
            
          results.directInsert = {
            data: createdProfile,
            error: insertError?.message
          }
        }
      }
      
      // Test 5: Check table structure
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'profiles')
        .order('ordinal_position')
        
      results.tableStructure = {
        columns: columns,
        error: columnsError?.message
      }
      
      setDebugInfo(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Debug Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testHookUpdate = async () => {
    setLoading(true)
    try {
      const result = await updateProfile({
        full_name: 'Hook Update Test',
        phone: '+1234567890',
        bio: 'Test bio from hook'
      })
      
      setDebugInfo((prev: any) => ({
        ...prev,
        hookUpdateResult: result
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  // This is a local version of updateProfile for testing
  const updateProfile = async (updates: any) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      return { success: true, data }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    if (user && !userLoading) {
      runDebugTests()
    }
  }, [user, userLoading])

  if (userLoading) {
    return <div className="p-8">Loading user...</div>
  }

  if (!user) {
    return <div className="p-8">Please log in to debug profile functionality</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Debug Page</h1>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={runDebugTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Debug Tests'}
        </button>
        
        <button
          onClick={testHookUpdate}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Hook Update
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {debugInfo && (
        <div className="space-y-6">
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key} className="p-4 bg-white border rounded">
              <h3 className="font-bold mb-2 text-lg">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
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