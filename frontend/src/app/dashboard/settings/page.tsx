"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, User, Users, Bell, Loader2, Check, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { settingsService, type TeamMember, type BillingPlan } from "@/lib/services/settingsService"
import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabase-client"

export default function SettingsPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [billingPlans, setBillingPlans] = useState<BillingPlan[]>([])
  const [activeTab, setActiveTab] = useState("profile")
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
  })
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load team members
        const members = await settingsService.getTeamMembers()
        setTeamMembers(members)
        
        // Load billing plans
        const plans = await settingsService.getBillingPlans()
        setBillingPlans(plans)
        
        // Load notification settings if user is logged in
        if (user?.id) {
          const settings = await settingsService.getNotificationSettings(user.id)
          setNotificationSettings(settings)
          
          // Load user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            
          if (profile) {
            setProfileData({
              name: profile.full_name || '',
              email: user.email || '',
              bio: profile.bio || '',
            })
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        toast.error("Failed to load settings. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  // Handle form submissions
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    
    try {
      setSaving(true)
      await settingsService.updateUserProfile(user.id, profileData)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    
    try {
      setSaving(true)
      await settingsService.updateNotificationSettings(user.id, notificationSettings)
      toast.success("Notification settings updated")
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast.error("Failed to update notification settings")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePlan = async (planId: string) => {
    if (!user?.id) return
    
    try {
      setSaving(true)
      // Reset all plans to not current
      const updatedPlans = billingPlans.map(plan => ({
        ...plan,
        is_current: plan.id === planId
      }))
      
      // Update in database
      await Promise.all(
        updatedPlans.map(plan => 
          settingsService.updateBillingPlan(plan.id, { is_current: plan.is_current })
        )
      )
      
      setBillingPlans(updatedPlans)
      toast.success("Billing plan updated successfully")
    } catch (error) {
      console.error("Error updating billing plan:", error)
      toast.error("Failed to update billing plan")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself" 
                    className="min-h-[100px]"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={saving}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your team members and their permissions
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Last active: {new Date(member.last_active).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                      <Button variant="ghost" size="sm" disabled={saving}>
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Plans</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {billingPlans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative overflow-hidden ${plan.recommended ? 'border-2 border-primary' : ''}`}
                  >
                    {plan.recommended && (
                      <div className="absolute right-0 top-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-md">
                        Recommended
                      </div>
                    )}
                    <CardHeader className="pt-8">
                      <CardTitle className="text-2xl">
                        {plan.name}
                      </CardTitle>
                      <div className="text-3xl font-bold">{plan.price}</div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={plan.recommended ? 'default' : 'outline'}
                        disabled={plan.is_current || saving}
                        onClick={() => handleUpdatePlan(plan.id)}
                      >
                        {saving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : plan.is_current ? (
                          'Current Plan'
                        ) : plan.recommended ? (
                          'Get Started'
                        ) : (
                          'Upgrade'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleNotificationSubmit}>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.email_notifications}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotificationSettings({...notificationSettings, email_notifications: e.target.checked})}
                    disabled={saving}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.push_notifications}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotificationSettings({...notificationSettings, push_notifications: e.target.checked})}
                    disabled={saving}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive our newsletter and promotional content
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketing_emails}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotificationSettings({...notificationSettings, marketing_emails: e.target.checked})}
                    disabled={saving}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save preferences
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
