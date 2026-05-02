"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Calendar, Phone } from "lucide-react"
import { useDashboardStats } from "@/lib/hooks/useDashboardStats"
import { useEffect, useState } from "react"

export default function ContactDashboardPage() {
  const { stats, loading, error, refresh } = useDashboardStats()
  
  // State for contact distribution data
  const [contactDistribution, setContactDistribution] = useState([
    { source: 'Website Forms', percentage: 42, color: 'bg-blue-500' },
    { source: 'Social Media', percentage: 28, color: 'bg-green-500' },
    { source: 'Referrals', percentage: 18, color: 'bg-purple-500' },
    { source: 'Events', percentage: 12, color: 'bg-orange-500' }
  ])
  
  // State for recent activities
  const [recentActivities, setRecentActivities] = useState([
    { name: 'Alex Johnson', action: 'Updated contact information', time: '2 min ago' },
    { name: 'Sarah Williams', action: 'Added to marketing list', time: '1 hour ago' },
    { name: 'Michael Chen', action: 'Contacted via email', time: '3 hours ago' },
    { name: 'Emma Davis', action: 'Converted to customer', time: '1 day ago' }
  ])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your contact management metrics
          </p>
        </div>
        <div>Loading dashboard data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your contact management metrics
          </p>
        </div>
        <div className="text-red-500">Error loading dashboard: {error}</div>
        <Button onClick={refresh}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your contact management metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Contacts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(stats.contacts * 0.1)}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(stats.contacts * 0.7)}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks}</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Distribution</CardTitle>
            <CardDescription>
              Contacts by source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contactDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span>{item.source}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest contact interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}