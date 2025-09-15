"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/useUser"
import { useRoles } from "@/hooks/useRoles"
import { UserRoleBadge } from "@/app/dashboard/settings/roles/UserRoleBadge"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, profile, loading: userLoading } = useUser()
  const { myRoles, loading: rolesLoading } = useRoles()
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    avatar_url: '',
    location: ''
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)

  useEffect(() => {
    if (userLoading) return
    
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        location: profile.location || ''
      })
    } else if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: '',
        bio: '',
        avatar_url: user.user_metadata?.avatar_url || '',
        location: ''
      })
    }
    
    setLoading(false)
  }, [user, profile, userLoading])

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to update your profile')
      return
    }
    
    setSaving(true)
    try {
      console.log('Sending profile update request with data:', profileData)
      
      const response = await fetch('/api/profile-v3', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include' // Ensure cookies are sent
      })

      console.log('Profile update response status:', response.status)
      
      // Convert headers to a plain object for logging
      const headersObj: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headersObj[key] = value
      })
      console.log('Profile update response headers:', headersObj)
      
      // First check if the response is OK
      if (!response.ok) {
        // Try to get the error text
        const errorText = await response.text()
        console.log('Profile update error response text:', errorText)
        
        // Try to parse as JSON, but handle if it's not JSON
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (parseError) {
          // If it's not JSON, use the text as the error message
          errorData = { error: errorText || `HTTP error! status: ${response.status}` }
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      // Try to parse the response as JSON
      let responseData
      try {
        responseData = await response.json()
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError)
        throw new Error('Invalid response format from server')
      }
      
      console.log('Profile update response data:', responseData)
      
      toast.success('Profile updated successfully')
    } catch (error: unknown) {
      console.error('Error updating profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    // Implement password change logic
    toast.info('Password change functionality would be implemented here')
  }

  const handleDeleteAccount = async () => {
    // Implement account deletion logic
    toast.info('Account deletion functionality would be implemented here')
  }

  if (loading || userLoading || rolesLoading) {
    return <div className="p-8">Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and update your personal information
        </p>
      </div>

      {/* Profile Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
          <CardDescription>
            Your account information at a glance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profileData.avatar_url || '/avatars/01.png'} alt={profileData.full_name} />
              <AvatarFallback>{profileData.full_name ? profileData.full_name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{profileData.full_name || 'No name provided'}</h3>
              <p className="text-muted-foreground">{profileData.email || 'No email provided'}</p>
              {/* Role badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {myRoles && myRoles.length > 0 ? (
                  myRoles.map((role) => (
                    <UserRoleBadge key={role.id} role={role.name} />
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No roles assigned</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account's profile information and email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input 
                id="full_name" 
                value={profileData.full_name} 
                onChange={(e) => setProfileData(p => ({ ...p, full_name: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email} 
                onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={profileData.phone} 
                onChange={(e) => setProfileData(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={profileData.location} 
                onChange={(e) => setProfileData(p => ({ ...p, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Input 
                id="bio" 
                value={profileData.bio} 
                onChange={(e) => setProfileData(p => ({ ...p, bio: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button 
              disabled={saving} 
              onClick={handleSave}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Ensure your account is using a long, random password to stay secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword}>Update Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Once you delete your account, there is no going back. Please be certain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all of its contents.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}