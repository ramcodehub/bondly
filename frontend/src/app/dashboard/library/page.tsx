"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, FolderOpen } from "lucide-react"

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Library</h1>
        <p className="text-muted-foreground">
          Manage your templates, resources, and content library
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Templates
            </CardTitle>
            <CardDescription>
              Email templates, SMS templates, and other communication templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Email</Badge>
              <Badge variant="secondary">SMS</Badge>
              <Badge variant="secondary">Push</Badge>
            </div>
            <Button className="w-full" variant="outline">
              Manage Templates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Resources
            </CardTitle>
            <CardDescription>
              Documents, images, and other marketing resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Images</Badge>
              <Badge variant="secondary">Documents</Badge>
              <Badge variant="secondary">Videos</Badge>
            </div>
            <Button className="w-full" variant="outline">
              View Resources
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Chat Review
            </CardTitle>
            <CardDescription>
              Review and manage chat conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Reviews</Badge>
              <Badge variant="secondary">Feedback</Badge>
            </div>
            <Button className="w-full" variant="outline">
              Review Chats
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}