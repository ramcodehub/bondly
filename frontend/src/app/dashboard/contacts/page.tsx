"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Filter, Search, MoreHorizontal } from "lucide-react"

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contact database
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search contacts..."
            className="w-full rounded-lg bg-background pl-8 py-2 text-sm border"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
          <CardDescription>
            Your complete contact database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  AJ
                </div>
                <div>
                  <h3 className="font-medium">Alex Johnson</h3>
                  <p className="text-sm text-muted-foreground">alex@techcorp.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">VIP</Badge>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  SW
                </div>
                <div>
                  <h3 className="font-medium">Sarah Williams</h3>
                  <p className="text-sm text-muted-foreground">sarah@startupxyz.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Lead</Badge>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  MC
                </div>
                <div>
                  <h3 className="font-medium">Michael Chen</h3>
                  <p className="text-sm text-muted-foreground">michael@innovateco.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Customer</Badge>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  ED
                </div>
                <div>
                  <h3 className="font-medium">Emma Davis</h3>
                  <p className="text-sm text-muted-foreground">emma@globalinc.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Prospect</Badge>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  RJ
                </div>
                <div>
                  <h3 className="font-medium">Robert Johnson</h3>
                  <p className="text-sm text-muted-foreground">robert@megacorp.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">VIP</Badge>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}