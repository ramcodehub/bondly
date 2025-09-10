"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageCircle, TrendingUp } from "lucide-react"

export default function ContactTopicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Topics</h1>
          <p className="text-muted-foreground">
            Manage conversation topics and interests
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Topic
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Product Feedback
            </CardTitle>
            <CardDescription>
              Customer feedback about products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">1,248</span>
              <Badge variant="secondary">+12%</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Positive</span>
                <span>842</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Negative</span>
                <span>241</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Neutral</span>
                <span>165</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Conversations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Support Requests
            </CardTitle>
            <CardDescription>
              Customer support related topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">2,483</span>
              <Badge variant="secondary">+8%</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Resolved</span>
                <span>2,142</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending</span>
                <span>341</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Requests
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Feature Requests
            </CardTitle>
            <CardDescription>
              Customer requested features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">842</span>
              <Badge variant="secondary">+15%</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Implemented</span>
                <span>241</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>In Progress</span>
                <span>148</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Planned</span>
                <span>453</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Requests
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
          <CardDescription>
            Most discussed topics this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">New Product Launch</h3>
                <p className="text-sm text-muted-foreground">Discussed by 1,248 contacts</p>
              </div>
              <Badge variant="secondary">Hot</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pricing Changes</h3>
                <p className="text-sm text-muted-foreground">Discussed by 842 contacts</p>
              </div>
              <Badge variant="secondary">Trending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mobile App Updates</h3>
                <p className="text-sm text-muted-foreground">Discussed by 641 contacts</p>
              </div>
              <Badge variant="outline">New</Badge>
            </div>
            <Button className="w-full" variant="outline">
              View All Topics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}