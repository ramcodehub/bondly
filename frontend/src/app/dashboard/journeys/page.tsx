"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Map, Play, Pause, Users } from "lucide-react"

export default function JourneysPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Journeys</h1>
          <p className="text-muted-foreground">
            Design and manage customer journey workflows
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Journey
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Onboarding Journey
            </CardTitle>
            <CardDescription>
              Guide new users through your product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">2,483</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>72%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg. Time</span>
                <span>3.2 days</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" variant="outline">
                <Play className="h-4 w-4 mr-1" />
                Start
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
              <Map className="h-5 w-5" />
              Re-engagement Journey
            </CardTitle>
            <CardDescription>
              Win back inactive users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">1,248</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reactivation Rate</span>
                <span>34%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg. Time</span>
                <span>5.7 days</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" variant="outline">
                <Play className="h-4 w-4 mr-1" />
                Start
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
              <Map className="h-5 w-5" />
              Upsell Journey
            </CardTitle>
            <CardDescription>
              Promote premium features to existing users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">842</span>
              <Badge variant="outline">Paused</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversion Rate</span>
                <span>18%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg. Time</span>
                <span>7.1 days</span>
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
            <Users className="h-5 w-5" />
            Journey Performance
          </CardTitle>
          <CardDescription>
            Metrics across all active journeys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Total Participants</h3>
                <p className="text-sm text-muted-foreground">Users currently in journeys</p>
              </div>
              <span className="text-2xl font-bold">4,283</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Completed Journeys</h3>
                <p className="text-sm text-muted-foreground">Successfully finished journeys</p>
              </div>
              <span className="text-2xl font-bold">1,842</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Avg. Completion Time</h3>
                <p className="text-sm text-muted-foreground">Average time to complete journeys</p>
              </div>
              <span className="text-2xl font-bold">5.1 days</span>
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