"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Megaphone, Play, Pause, TrendingUp } from "lucide-react"

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Summer Promotion
            </CardTitle>
            <CardDescription>
              Seasonal discount campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">$45.2K</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reach</span>
                <span>124.8K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Engagement</span>
                <span>8.4%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conversion</span>
                <span>3.2%</span>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Product Launch
            </CardTitle>
            <CardDescription>
              New product announcement campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">$78.6K</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reach</span>
                <span>89.4K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Engagement</span>
                <span>12.1%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conversion</span>
                <span>5.7%</span>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Newsletter Campaign
            </CardTitle>
            <CardDescription>
              Monthly newsletter distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">$12.4K</span>
              <Badge variant="outline">Paused</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reach</span>
                <span>45.2K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Engagement</span>
                <span>24.8%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conversion</span>
                <span>1.8%</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" variant="outline">
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
              <Button variant="outline" size="icon">
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
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
              <span className="text-2xl font-bold">24</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Total Spend</h3>
                <p className="text-sm text-muted-foreground">Budget allocated to campaigns</p>
              </div>
              <span className="text-2xl font-bold">$248.6K</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Avg. ROI</h3>
                <p className="text-sm text-muted-foreground">Return on investment</p>
              </div>
              <span className="text-2xl font-bold">3.2x</span>
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