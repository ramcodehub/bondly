"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Filter, Search } from "lucide-react"

export default function ContactListsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Lists</h1>
          <p className="text-muted-foreground">
            Manage your contact lists and segments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create List
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search lists..."
            className="w-full rounded-lg bg-background pl-8 py-2 text-sm border"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Contacts
            </CardTitle>
            <CardDescription>
              Your complete contact database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">12,483</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subscribed</span>
                <span>9,842</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Unsubscribed</span>
                <span>1,241</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bounced</span>
                <span>1,400</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Contacts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              VIP Customers
            </CardTitle>
            <CardDescription>
              High-value customers and prospects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">1,248</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active</span>
                <span>1,102</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inactive</span>
                <span>146</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Contacts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Newsletter Subscribers
            </CardTitle>
            <CardDescription>
              Contacts subscribed to newsletters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">8,742</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly</span>
                <span>3,241</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly</span>
                <span>5,501</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Contacts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}