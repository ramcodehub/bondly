"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function TestProfileUpdatePage() {
  const { user, loading: userLoading } = useUser()
  const [testData, setTestData] = useState({
    full_name: 'Test User',
    phone: '+1234567890',
    bio: 'This is a test bio for profile update',
    avatar_url: '',
    location: 'Test Location'
  })
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const testProfileUpdate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch('/api/test-profile-update', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult({
          status: response.status,
          data: data
        })
        toast.success('Profile update test successful!')
      } else {
        throw new Error(data.error || 'Profile update failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      toast.error(`Error: ${errorMessage}`)
      console.error('Profile Update Test Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) {
    return <div className="p-8">Loading user...</div>
  }

  if (!user) {
    return <div className="p-8">Please log in to test profile update</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Update Test Page</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Data</CardTitle>
          <CardDescription>
            Enter test data for profile update
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input 
                id="full_name" 
                value={testData.full_name} 
                onChange={(e) => setTestData({...testData, full_name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={testData.phone} 
                onChange={(e) => setTestData({...testData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Input 
                id="bio" 
                value={testData.bio} 
                onChange={(e) => setTestData({...testData, bio: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={testData.location} 
                onChange={(e) => setTestData({...testData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input 
                id="avatar_url" 
                value={testData.avatar_url} 
                onChange={(e) => setTestData({...testData, avatar_url: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <Button
          onClick={testProfileUpdate}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Profile Update'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-white border rounded">
          <h3 className="font-bold mb-2">Test Result:</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}