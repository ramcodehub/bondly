'use client'

import { useState } from 'react'

export default function TestRoleDebug() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const runTest = async (testName: string, url: string, method: string = 'GET') => {
    setLoading(prev => ({ ...prev, [testName]: true }))
    try {
      const response = await fetch(url, { method })
      const data = await response.json()
      setResults(prev => ({ ...prev, [testName]: data }))
      console.log(`${testName} result:`, data)
    } catch (error) {
      console.error(`Error in ${testName}:`, error)
      setResults(prev => ({ ...prev, [testName]: { error: error.message } }))
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }))
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Role Debugging Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Check User Role Exists</h2>
          <button 
            onClick={() => runTest('checkUserRole', '/api/check-user-role')}
            disabled={loading.checkUserRole}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading.checkUserRole ? 'Checking...' : 'Check User Role'}
          </button>
          {results.checkUserRole && (
            <div className="mt-3">
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(results.checkUserRole, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Assign User Role</h2>
          <button 
            onClick={() => runTest('assignUserRole', '/api/assign-user-role', 'POST')}
            disabled={loading.assignUserRole}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {loading.assignUserRole ? 'Assigning...' : 'Assign User Role'}
          </button>
          {results.assignUserRole && (
            <div className="mt-3">
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(results.assignUserRole, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Check Current User Roles</h2>
          <button 
            onClick={() => runTest('currentUserRoles', '/api/extended/roles/me')}
            disabled={loading.currentUserRoles}
            className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
          >
            {loading.currentUserRoles ? 'Checking...' : 'Check My Roles'}
          </button>
          {results.currentUserRoles && (
            <div className="mt-3">
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(results.currentUserRoles, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Assign Default Role</h2>
          <button 
            onClick={() => runTest('assignDefaultRole', '/api/assign-default-role', 'POST')}
            disabled={loading.assignDefaultRole}
            className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
          >
            {loading.assignDefaultRole ? 'Assigning...' : 'Assign Default Role'}
          </button>
          {results.assignDefaultRole && (
            <div className="mt-3">
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(results.assignDefaultRole, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Debug Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click "Check User Role" to verify the 'user' role exists in the database</li>
          <li>Click "Check My Roles" to see what roles are currently assigned to you</li>
          <li>If you have no roles, click "Assign User Role" to manually assign the user role</li>
          <li>Click "Check My Roles" again to verify the role was assigned</li>
          <li>Refresh the dashboard page to see if the sidebar updates</li>
        </ol>
      </div>
    </div>
  )
}