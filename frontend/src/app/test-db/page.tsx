"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { useUser } from "@/hooks/useUser"

export default function TestDbPage() {
  const { user, profile, loading: userLoading } = useUser()
  const [dbInfo, setDbInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const testDatabase = async () => {
    setLoading(true)
    setError(null)
    try {
      // Test 1: Check profiles table structure
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'profiles')
        .order('ordinal_position')

      if (columnsError) throw new Error(`Columns error: ${columnsError.message}`)

      // Test 2: Check if handle_new_user function exists
      // We'll check this differently since the previous approach was incorrect
      const { data: functions, error: functionsError } = await supabase
        .from('pg_proc')
        .select('proname')
        .eq('proname', 'handle_new_user')

      // Test 3: Check sample profile data
      const { data: sampleProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)

      if (profilesError) throw new Error(`Profiles error: ${profilesError.message}`)

      // Test 4: Check current user's profile
      let currentUserProfile = null
      if (user?.id) {
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userError && userError.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw new Error(`User profile error: ${userError.message}`)
        }
        currentUserProfile = userProfile
      }

      setDbInfo({
        columns,
        sampleProfiles,
        currentUserProfile,
        functionExists: functions && functions.length > 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Database Test Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && !userLoading) {
      testDatabase()
    }
  }, [user, userLoading])

  if (userLoading) {
    return <div className="p-8">Loading user...</div>
  }

  if (!user) {
    return <div className="p-8">Please log in to test the database</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Test Page</h1>
      
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

      <button
        onClick={testDatabase}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing Database...' : 'Run Database Tests'}
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {dbInfo && (
        <div className="space-y-6">
          <div className="p-4 bg-white border rounded">
            <h3 className="font-bold mb-2">Profiles Table Schema</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nullable</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dbInfo.columns.map((col: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{col.column_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{col.data_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{col.is_nullable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-white border rounded">
            <h3 className="font-bold mb-2">Sample Profiles</h3>
            {dbInfo.sampleProfiles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dbInfo.sampleProfiles.map((profile: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.id.substring(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.full_name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No profiles found in the database</p>
            )}
          </div>

          <div className="p-4 bg-white border rounded">
            <h3 className="font-bold mb-2">Current User Profile</h3>
            {dbInfo.currentUserProfile ? (
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
                {JSON.stringify(dbInfo.currentUserProfile, null, 2)}
              </pre>
            ) : (
              <p>No profile found for current user</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}