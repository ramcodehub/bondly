"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"

export default function TestProfilePage() {
  const { user, profile, loading } = useUser()
  const [profileData, setProfileData] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setProfileData(data)
      } catch (err: unknown) {
        // Type guard to ensure err is an Error instance
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      }
    }

    if (user && !loading) {
      fetchProfile()
    }
  }, [user, loading])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in to view this page</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Test Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {profileData && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold mb-2">Profile API Response:</h2>
          <pre>{JSON.stringify(profileData, null, 2)}</pre>
        </div>
      )}
      
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        <h2 className="font-bold mb-2">Current User:</h2>
        <p>User ID: {user.id}</p>
        <p>Email: {user.email}</p>
        
        <h2 className="font-bold mt-4 mb-2">Current Profile:</h2>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </div>
  )
}