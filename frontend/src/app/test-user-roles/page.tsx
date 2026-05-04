'use client'

import { useState, useEffect } from 'react'

export default function TestUserRoles() {
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/extended/roles/me')
        const data = await response.json()
        console.log('Roles API response:', data)
        
        if (data.success) {
          setRoles(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);
        console.error("Error fetching roles:", err);
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  if (loading) {
    return <div className="p-4">Loading roles...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Roles</h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Roles</h2>
        {roles.length > 0 ? (
          <ul className="list-disc pl-5">
            {roles.map((role, index) => (
              <li key={index} className="mb-1">
                <strong>{role.name}</strong> - {role.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No roles assigned</p>
        )}
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Raw Data</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(roles, null, 2)}
        </pre>
      </div>
    </div>
  )
}