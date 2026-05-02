"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageCircle, TrendingUp } from "lucide-react"
import { useContactTopics } from "@/lib/hooks/useContactTopics"
import { useState, useMemo } from "react"
import { TopicModal } from "./topic-modal"

export default function ContactTopicsPage() {
  const { topics, loading, error, fetchTopics } = useContactTopics()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter topics based on search term
  const filteredTopics = useMemo(() => {
    if (!searchTerm) return topics
    return topics.filter(topic => 
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [topics, searchTerm])

  // Group topics by category
  const groupedTopics = useMemo(() => {
    const groups: Record<string, any[]> = {}
    
    topics.forEach(topic => {
      const category = topic.category || 'uncategorized'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(topic)
    })
    
    return groups
  }, [topics])

  // Get trending topics
  const trendingTopics = useMemo(() => {
    return topics.filter(topic => topic.is_trending).slice(0, 3)
  }, [topics])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Contact Topics</h1>
            <p className="text-muted-foreground">
              Manage conversation topics and interests
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </div>
        <div>Loading topics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Contact Topics</h1>
            <p className="text-muted-foreground">
              Manage conversation topics and interests
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </div>
        <div className="text-red-500">Error loading topics: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Topics</h1>
          <p className="text-muted-foreground">
            Manage conversation topics and interests
          </p>
        </div>
        <TopicModal onCreateTopic={fetchTopics} />
      </div>

      {filteredTopics.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No contact topics found.</p>
          <TopicModal onCreateTopic={fetchTopics} />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.slice(0, 3).map((topic) => (
              <Card key={topic.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {topic.name}
                  </CardTitle>
                  <CardDescription>
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">{topic.conversation_count || 0}</span>
                    <Badge variant="secondary">
                      {topic.status === 'active' ? '+12%' : '0%'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Positive</span>
                      <span>{Math.floor((topic.conversation_count || 0) * 0.67)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Negative</span>
                      <span>{Math.floor((topic.conversation_count || 0) * 0.19)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Neutral</span>
                      <span>{Math.floor((topic.conversation_count || 0) * 0.14)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Conversations
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </CardTitle>
              <CardDescription>
                Most discussed topics this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground">Discussed by {topic.conversation_count || 0} contacts</p>
                    </div>
                    <Badge variant={topic.is_trending ? "secondary" : "outline"}>
                      {topic.is_trending ? "Hot" : "New"}
                    </Badge>
                  </div>
                ))}
                <TopicModal onCreateTopic={fetchTopics} />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}