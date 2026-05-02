"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, PieChart, Filter } from "lucide-react"
import { useContactSegments } from "@/lib/hooks/useContactSegments"
import { useState, useMemo } from "react"
import { SegmentModal } from "./segment-modal"

export default function ContactSegmentsPage() {
  const { segments, loading, error, fetchSegments } = useContactSegments()
  const [searchTerm, setSearchTerm] = useState("")

  // Group segments by type
  const groupedSegments = useMemo(() => {
    const groups: Record<string, any[]> = {
      demographics: [],
      behavior: [],
      engagement: [],
      custom: []
    }
    
    segments.forEach(segment => {
      const type = segment.segment_type || 'custom'
      if (groups[type]) {
        groups[type].push(segment)
      }
    })
    
    return groups
  }, [segments])

  // Filter segments based on search term
  const filteredSegments = useMemo(() => {
    if (!searchTerm) return segments
    return segments.filter(segment => 
      segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (segment.description && segment.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [segments, searchTerm])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Contact Segments</h1>
            <p className="text-muted-foreground">
              Create and manage contact segments based on criteria
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Segment
          </Button>
        </div>
        <div>Loading segments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Contact Segments</h1>
            <p className="text-muted-foreground">
              Create and manage contact segments based on criteria
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Segment
          </Button>
        </div>
        <div className="text-red-500">Error loading segments: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Segments</h1>
          <p className="text-muted-foreground">
            Create and manage contact segments based on criteria
          </p>
        </div>
        <SegmentModal onCreateSegment={fetchSegments} />
      </div>

      {filteredSegments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No contact segments found.</p>
          <SegmentModal onCreateSegment={fetchSegments} />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Demographics
                </CardTitle>
                <CardDescription>
                  Segments based on age, location, etc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedSegments.demographics.map(segment => (
                    <div key={segment.id} className="flex items-center justify-between">
                      <span>{segment.name}</span>
                      <Badge variant="secondary">{segment.contact_count || 0}</Badge>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Behavior
                </CardTitle>
                <CardDescription>
                  Segments based on user behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedSegments.behavior.map(segment => (
                    <div key={segment.id} className="flex items-center justify-between">
                      <span>{segment.name}</span>
                      <Badge variant="secondary">{segment.contact_count || 0}</Badge>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Engagement
                </CardTitle>
                <CardDescription>
                  Segments based on engagement level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedSegments.engagement.map(segment => (
                    <div key={segment.id} className="flex items-center justify-between">
                      <span>{segment.name}</span>
                      <Badge variant="secondary">{segment.contact_count || 0}</Badge>
                    </div>
                  ))}
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
                <Filter className="h-5 w-5" />
                Custom Segments
              </CardTitle>
              <CardDescription>
                Segments created with custom criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedSegments.custom.map(segment => (
                  <div key={segment.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{segment.name}</h3>
                      <p className="text-sm text-muted-foreground">{segment.description}</p>
                    </div>
                    <Badge variant="secondary">{segment.contact_count || 0}</Badge>
                  </div>
                ))}
                <SegmentModal onCreateSegment={fetchSegments} />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}