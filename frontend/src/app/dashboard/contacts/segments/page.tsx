"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, PieChart, Filter } from "lucide-react"

export default function ContactSegmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Segments</h1>
          <p className="text-muted-foreground">
            Create and manage contact segments based on criteria
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Demographics
            </CardTitle>
            <CardDescription>
              Segments based on age, location, etc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Age 18-30</span>
                <Badge variant="secondary">2,483</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Age 31-50</span>
                <Badge variant="secondary">5,742</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Age 51+</span>
                <Badge variant="secondary">4,258</Badge>
              </div>
              <Button className="w-full" variant="outline">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Behavior
            </CardTitle>
            <CardDescription>
              Segments based on user behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Frequent Visitors</span>
                <Badge variant="secondary">1,842</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Recent Signups</span>
                <Badge variant="secondary">2,148</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Inactive Users</span>
                <Badge variant="secondary">3,241</Badge>
              </div>
              <Button className="w-full" variant="outline">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Engagement
            </CardTitle>
            <CardDescription>
              Segments based on engagement level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Highly Engaged</span>
                <Badge variant="secondary">3,742</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Moderately Engaged</span>
                <Badge variant="secondary">4,841</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Low Engagement</span>
                <Badge variant="secondary">3,900</Badge>
              </div>
              <Button className="w-full" variant="outline">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Custom Segments
          </CardTitle>
          <CardDescription>
            Segments created with custom criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Premium Subscribers</h3>
                <p className="text-sm text-muted-foreground">Subscribers with premium plans</p>
              </div>
              <Badge variant="secondary">1,248</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Cart Abandoners</h3>
                <p className="text-sm text-muted-foreground">Users who left items in cart</p>
              </div>
              <Badge variant="secondary">842</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Product Enthusiasts</h3>
                <p className="text-sm text-muted-foreground">Users who viewed product pages</p>
              </div>
              <Badge variant="secondary">2,148</Badge>
            </div>
            <Button className="w-full" variant="outline">
              Create New Segment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}