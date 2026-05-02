"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TestImports() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Imports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
          <Button className="mt-4">Test Button</Button>
          <Badge className="mt-4">Test Badge</Badge>
        </CardContent>
      </Card>
    </div>
  )
}