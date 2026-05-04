"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Megaphone, Play, Pause, TrendingUp, Loader2 } from "lucide-react"
import { useCampaignsRealtime } from "@/lib/hooks/useCampaignsRealtime"
import ProtectedRoute from "@/components/auth/protected-route"
import { CampaignForm } from "./campaign-form"

export default function CampaignsPage() {
  return (
    <ProtectedRoute>
      <CampaignsContent />
    </ProtectedRoute>
  )
}

function CampaignsContent() {
  const { campaigns, loading, error, stats, createCampaign } = useCampaignsRealtime()
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  // Calculate ROI percentage
  const calculateROI = (budget: number, revenue: number) => {
    if (budget === 0) return 0
    return ((revenue - budget) / budget) * 100
  }
  
  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
      case 'In Progress':
        return 'default'
      case 'Completed':
        return 'secondary'
      case 'Paused':
      case 'Planned':
        return 'outline'
      case 'Cancelled':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      await createCampaign(campaignData)
      setShowCreateForm(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      console.error("Error:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading campaigns...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">Error loading campaigns: {error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showCreateForm && (
        <CampaignForm 
          onSubmit={handleCreateCampaign}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.campaign_id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                {campaign.campaign_name}
              </CardTitle>
              <CardDescription>
                {campaign.type} campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">
                  {campaign.expected_revenue ? formatCurrency(campaign.expected_revenue) : '$0'}
                </span>
                <Badge variant={getStatusVariant(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget</span>
                  <span>{campaign.budgeted_cost ? formatCurrency(campaign.budgeted_cost) : '$0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Actual Cost</span>
                  <span>{campaign.actual_cost ? formatCurrency(campaign.actual_cost) : '$0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ROI</span>
                  <span>
                    {campaign.budgeted_cost && campaign.expected_revenue 
                      ? `${calculateROI(campaign.budgeted_cost, campaign.expected_revenue).toFixed(1)}%` 
                      : '0%'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="icon">
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Campaign Performance
          </CardTitle>
          <CardDescription>
            Metrics across all campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Total Campaigns</h3>
                <p className="text-sm text-muted-foreground">Active and completed campaigns</p>
              </div>
              <span className="text-2xl font-bold">{stats.totalCampaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Total Budget</h3>
                <p className="text-sm text-muted-foreground">Budget allocated to campaigns</p>
              </div>
              <span className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Expected Revenue</h3>
                <p className="text-sm text-muted-foreground">Projected revenue from campaigns</p>
              </div>
              <span className="text-2xl font-bold">{formatCurrency(stats.totalExpectedRevenue)}</span>
            </div>
            <Button className="w-full" variant="outline">
              View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}