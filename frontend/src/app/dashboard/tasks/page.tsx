"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your marketing and sales tasks
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              To Do
            </CardTitle>
            <CardDescription>
              Tasks that need to be completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Prepare Q3 Campaign Brief</h3>
                  <Badge variant="outline">High</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Due tomorrow</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Assign</Button>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Review Customer Feedback</h3>
                  <Badge variant="outline">Medium</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Due in 3 days</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Assign</Button>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Update Product Documentation</h3>
                  <Badge variant="outline">Low</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Due in 1 week</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Assign</Button>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
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
              <Clock className="h-5 w-5" />
              In Progress
            </CardTitle>
            <CardDescription>
              Tasks currently being worked on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Create Social Media Content</h3>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Assigned to Sarah</p>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Update</Button>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Design Email Templates</h3>
                  <Badge variant="secondary">High</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Assigned to Michael</p>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Update</Button>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Analyze Campaign Performance</h3>
                  <Badge variant="secondary">High</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Assigned to Emma</p>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Update</Button>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
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
              <CheckCircle className="h-5 w-5" />
              Completed
            </CardTitle>
            <CardDescription>
              Recently completed tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Launch Spring Campaign</h3>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Completed yesterday</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Update CRM Data</h3>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Completed 2 days ago</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Prepare Sales Report</h3>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Completed 3 days ago</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
