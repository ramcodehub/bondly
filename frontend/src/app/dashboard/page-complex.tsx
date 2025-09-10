"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Bondly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-100 text-green-800 rounded-md">
              <strong>Success:</strong> The dashboard page is rendering correctly.
            </div>
            
            <p>
              If you can see this page, the main dashboard component is working. 
              The issue might be with one of the complex components or data fetching hooks 
              in the original dashboard implementation.
            </p>
            
            <div>
              <h3 className="font-medium mb-2">Navigation:</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/dashboard/test-navigation">
                  <Button>Test Navigation</Button>
                </Link>
                <Link href="/dashboard/simple-test">
                  <Button variant="outline">Simple Dashboard Test</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
