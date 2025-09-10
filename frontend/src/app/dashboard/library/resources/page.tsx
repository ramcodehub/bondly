"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Image, FileText, Video } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground">
            Manage your marketing resources and media files
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resource
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Images
            </CardTitle>
            <CardDescription>
              Logo, banners, and other image assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Company Logo</span>
                <Badge variant="secondary">PNG</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Banner Image</span>
                <Badge variant="secondary">JPG</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Social Media Cover</span>
                <Badge variant="secondary">JPG</Badge>
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
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
            <CardDescription>
              PDFs, presentations, and other documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Product Brochure</span>
                <Badge variant="secondary">PDF</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Company Profile</span>
                <Badge variant="secondary">PDF</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Presentation Deck</span>
                <Badge variant="secondary">PPTX</Badge>
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
              <Video className="h-5 w-5" />
              Videos
            </CardTitle>
            <CardDescription>
              Marketing videos and promotional content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Product Demo</span>
                <Badge variant="secondary">MP4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Company Introduction</span>
                <Badge variant="secondary">MP4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Customer Testimonial</span>
                <Badge variant="secondary">MOV</Badge>
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