"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ThumbsUp, ThumbsDown, Reply } from "lucide-react"

export default function ChatReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chat Review</h1>
        <p className="text-muted-foreground">
          Review and analyze customer chat conversations
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Recent Conversations
            </CardTitle>
            <CardDescription>
              Review recent customer interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Product Inquiry</h3>
                    <p className="text-sm text-muted-foreground">Customer asked about pricing details</p>
                  </div>
                  <Badge variant="secondary">Resolved</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Positive
                  </Button>
                  <Button size="sm" variant="outline">
                    <Reply className="h-4 w-4 mr-1" />
                    Follow Up
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Technical Support</h3>
                    <p className="text-sm text-muted-foreground">Customer having issues with login</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Negative
                  </Button>
                  <Button size="sm" variant="outline">
                    <Reply className="h-4 w-4 mr-1" />
                    Respond
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Feature Request</h3>
                    <p className="text-sm text-muted-foreground">Customer suggested new functionality</p>
                  </div>
                  <Badge variant="secondary">Noted</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Positive
                  </Button>
                  <Button size="sm" variant="outline">
                    <Reply className="h-4 w-4 mr-1" />
                    Acknowledge
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}