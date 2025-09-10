"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, CheckCircle } from "lucide-react"

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketing Planner</h1>
          <p className="text-muted-foreground">
            Plan and schedule your marketing activities
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Activities
            </CardTitle>
            <CardDescription>
              Scheduled marketing activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Product Launch Webinar</h3>
                  <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                </div>
                <Badge variant="secondary">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Social Media Campaign</h3>
                  <p className="text-sm text-muted-foreground">Jun 15, 9:00 AM</p>
                </div>
                <Badge variant="secondary">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Email Newsletter</h3>
                  <p className="text-sm text-muted-foreground">Jun 18, 10:00 AM</p>
                </div>
                <Badge variant="outline">Draft</Badge>
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
              Activities currently running
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Summer Promotion</h3>
                  <p className="text-sm text-muted-foreground">Ends in 3 days</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Content Creation</h3>
                  <p className="text-sm text-muted-foreground">Blog posts and videos</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Customer Surveys</h3>
                  <p className="text-sm text-muted-foreground">Collecting responses</p>
                </div>
                <Badge variant="secondary">Active</Badge>
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
              Recently completed activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Q2 Campaign</h3>
                  <p className="text-sm text-muted-foreground">Completed May 31</p>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Product Demo Series</h3>
                  <p className="text-sm text-muted-foreground">Completed May 28</p>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Lead Generation</h3>
                  <p className="text-sm text-muted-foreground">Completed May 25</p>
                </div>
                <Badge variant="outline">Completed</Badge>
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
            <Calendar className="h-5 w-5" />
            Monthly Overview
          </CardTitle>
          <CardDescription>
            June 2023 marketing calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center">
              <div className="text-sm font-medium">Sun</div>
              <div className="text-sm font-medium">Mon</div>
              <div className="text-sm font-medium">Tue</div>
              <div className="text-sm font-medium">Wed</div>
              <div className="text-sm font-medium">Thu</div>
              <div className="text-sm font-medium">Fri</div>
              <div className="text-sm font-medium">Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {/* Calendar days would go here in a real implementation */}
              <div className="h-10 flex items-center justify-center">1</div>
              <div className="h-10 flex items-center justify-center">2</div>
              <div className="h-10 flex items-center justify-center">3</div>
              <div className="h-10 flex items-center justify-center">4</div>
              <div className="h-10 flex items-center justify-center">5</div>
              <div className="h-10 flex items-center justify-center">6</div>
              <div className="h-10 flex items-center justify-center">7</div>
              <div className="h-10 flex items-center justify-center">8</div>
              <div className="h-10 flex items-center justify-center">9</div>
              <div className="h-10 flex items-center justify-center bg-primary text-primary-foreground rounded">10</div>
              <div className="h-10 flex items-center justify-center">11</div>
              <div className="h-10 flex items-center justify-center">12</div>
              <div className="h-10 flex items-center justify-center">13</div>
              <div className="h-10 flex items-center justify-center">14</div>
              <div className="h-10 flex items-center justify-center bg-secondary rounded">15</div>
              <div className="h-10 flex items-center justify-center">16</div>
              <div className="h-10 flex items-center justify-center">17</div>
              <div className="h-10 flex items-center justify-center bg-secondary rounded">18</div>
              <div className="h-10 flex items-center justify-center">19</div>
              <div className="h-10 flex items-center justify-center">20</div>
              <div className="h-10 flex items-center justify-center">21</div>
              <div className="h-10 flex items-center justify-center">22</div>
              <div className="h-10 flex items-center justify-center">23</div>
              <div className="h-10 flex items-center justify-center">24</div>
              <div className="h-10 flex items-center justify-center">25</div>
              <div className="h-10 flex items-center justify-center">26</div>
              <div className="h-10 flex items-center justify-center">27</div>
              <div className="h-10 flex items-center justify-center">28</div>
              <div className="h-10 flex items-center justify-center">29</div>
              <div className="h-10 flex items-center justify-center">30</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Product Launch Webinar</Badge>
              <Badge variant="secondary">Social Media Campaign</Badge>
              <Badge variant="secondary">Email Newsletter</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}