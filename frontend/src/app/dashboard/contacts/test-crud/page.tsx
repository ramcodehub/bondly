"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useContactLists } from "@/lib/hooks/useContactLists"
import { useContactSegments } from "@/lib/hooks/useContactSegments"
import { useContactTopics } from "@/lib/hooks/useContactTopics"
import { useLeadQualifications } from "@/lib/hooks/useLeadQualifications"

export default function TestCRUDContactsPage() {
  const { lists, createList, updateList, deleteList, fetchLists } = useContactLists()
  const { segments, createSegment, updateSegment, deleteSegment, fetchSegments } = useContactSegments()
  const { topics, createTopic, updateTopic, deleteTopic, fetchTopics } = useContactTopics()
  const { qualifications, createQualification, updateQualification, deleteQualification, fetchQualifications } = useLeadQualifications()
  
  const [testResults, setTestResults] = useState<Record<string, string>>({})

  // Test contact lists CRUD operations
  const testContactListsCRUD = async () => {
    try {
      // Create
      const newList = await createList({
        name: "Test List",
        description: "Test list for CRUD operations",
        contact_count: 0,
        is_active: true
      })
      
      if (!newList) {
        setTestResults(prev => ({ ...prev, lists: "Failed to create list" }))
        return
      }
      
      // Update
      const updatedList = await updateList(newList.id, {
        name: "Updated Test List",
        description: "Updated test list for CRUD operations"
      })
      
      if (!updatedList) {
        setTestResults(prev => ({ ...prev, lists: "Failed to update list" }))
        return
      }
      
      // Delete
      await deleteList(newList.id)
      
      setTestResults(prev => ({ ...prev, lists: "✅ All CRUD operations successful" }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      console.error("Error testing contact lists CRUD:", err);
      setTestResults(prev => ({ ...prev, lists: `❌ Error: ${errorMessage}` }))
    }
  }

  // Test contact segments CRUD operations
  const testContactSegmentsCRUD = async () => {
    try {
      // Create
      const newSegment = await createSegment({
        name: "Test Segment",
        description: "Test segment for CRUD operations",
        segment_type: "custom",
        contact_count: 0,
        is_active: true
      })
      
      if (!newSegment) {
        setTestResults(prev => ({ ...prev, segments: "Failed to create segment" }))
        return
      }
      
      // Update
      const updatedSegment = await updateSegment(newSegment.id, {
        name: "Updated Test Segment",
        description: "Updated test segment for CRUD operations"
      })
      
      if (!updatedSegment) {
        setTestResults(prev => ({ ...prev, segments: "Failed to update segment" }))
        return
      }
      
      // Delete
      await deleteSegment(newSegment.id)
      
      setTestResults(prev => ({ ...prev, segments: "✅ All CRUD operations successful" }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      console.error("Error testing contact segments CRUD:", err);
      setTestResults(prev => ({ ...prev, segments: `❌ Error: ${errorMessage}` }))
    }
  }

  // Test contact topics CRUD operations
  const testContactTopicsCRUD = async () => {
    try {
      // Create
      const newTopic = await createTopic({
        name: "Test Topic",
        description: "Test topic for CRUD operations",
        category: "Test",
        conversation_count: 0,
        is_trending: false,
        status: "active"
      })
      
      if (!newTopic) {
        setTestResults(prev => ({ ...prev, topics: "Failed to create topic" }))
        return
      }
      
      // Update
      const updatedTopic = await updateTopic(newTopic.id, {
        name: "Updated Test Topic",
        description: "Updated test topic for CRUD operations"
      })
      
      if (!updatedTopic) {
        setTestResults(prev => ({ ...prev, topics: "Failed to update topic" }))
        return
      }
      
      // Delete
      await deleteTopic(newTopic.id)
      
      setTestResults(prev => ({ ...prev, topics: "✅ All CRUD operations successful" }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      console.error("Error testing contact topics CRUD:", err);
      setTestResults(prev => ({ ...prev, topics: `❌ Error: ${errorMessage}` }))
    }
  }

  // Test lead qualifications CRUD operations
  const testLeadQualificationsCRUD = async () => {
    try {
      // Create
      const newQualification = await createQualification({
        lead_id: "test-lead-id",
        qualification_score: 75,
        status: "qualified",
        notes: "Test qualification"
      })
      
      if (!newQualification) {
        setTestResults(prev => ({ ...prev, qualifications: "Failed to create qualification" }))
        return
      }
      
      // Update
      const updatedQualification = await updateQualification(newQualification.id, {
        qualification_score: 85,
        notes: "Updated test qualification"
      })
      
      if (!updatedQualification) {
        setTestResults(prev => ({ ...prev, qualifications: "Failed to update qualification" }))
        return
      }
      
      // Delete
      await deleteQualification(newQualification.id)
      
      setTestResults(prev => ({ ...prev, qualifications: "✅ All CRUD operations successful" }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      console.error("Error testing lead qualifications CRUD:", err);
      setTestResults(prev => ({ ...prev, qualifications: `❌ Error: ${errorMessage}` }))
    }
  }

  // Test all CRUD operations
  const testAllCRUD = async () => {
    await testContactListsCRUD()
    await testContactSegmentsCRUD()
    await testContactTopicsCRUD()
    await testLeadQualificationsCRUD()
  }

  // Refresh all data
  const refreshAllData = () => {
    fetchLists()
    fetchSegments()
    fetchTopics()
    fetchQualifications()
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Dashboard CRUD Tests</h1>
        <p className="text-muted-foreground">Test all CRUD operations for contact dashboard components</p>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={testAllCRUD}>Test All CRUD Operations</Button>
        <Button variant="outline" onClick={refreshAllData}>Refresh Data</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Lists</CardTitle>
            <CardDescription>Test CRUD operations for contact lists</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={testContactListsCRUD} size="sm">Test CRUD</Button>
              <Button onClick={fetchLists} variant="outline" size="sm">Refresh</Button>
            </div>
            <div>
              <p className="text-sm font-medium">Test Result:</p>
              <p className="text-sm">{testResults.lists || "Not tested yet"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Lists ({lists.length}):</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {lists.slice(0, 3).map(list => (
                  <li key={list.id}>{list.name} ({list.contact_count} contacts)</li>
                ))}
                {lists.length > 3 && <li>... and {lists.length - 3} more</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Segments</CardTitle>
            <CardDescription>Test CRUD operations for contact segments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={testContactSegmentsCRUD} size="sm">Test CRUD</Button>
              <Button onClick={fetchSegments} variant="outline" size="sm">Refresh</Button>
            </div>
            <div>
              <p className="text-sm font-medium">Test Result:</p>
              <p className="text-sm">{testResults.segments || "Not tested yet"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Segments ({segments.length}):</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {segments.slice(0, 3).map(segment => (
                  <li key={segment.id}>{segment.name} ({segment.segment_type})</li>
                ))}
                {segments.length > 3 && <li>... and {segments.length - 3} more</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Topics</CardTitle>
            <CardDescription>Test CRUD operations for contact topics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={testContactTopicsCRUD} size="sm">Test CRUD</Button>
              <Button onClick={fetchTopics} variant="outline" size="sm">Refresh</Button>
            </div>
            <div>
              <p className="text-sm font-medium">Test Result:</p>
              <p className="text-sm">{testResults.topics || "Not tested yet"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Topics ({topics.length}):</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {topics.slice(0, 3).map(topic => (
                  <li key={topic.id}>{topic.name} ({topic.category})</li>
                ))}
                {topics.length > 3 && <li>... and {topics.length - 3} more</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lead Qualifications</CardTitle>
            <CardDescription>Test CRUD operations for lead qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={testLeadQualificationsCRUD} size="sm">Test CRUD</Button>
              <Button onClick={fetchQualifications} variant="outline" size="sm">Refresh</Button>
            </div>
            <div>
              <p className="text-sm font-medium">Test Result:</p>
              <p className="text-sm">{testResults.qualifications || "Not tested yet"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Qualifications ({qualifications.length}):</p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {qualifications.slice(0, 3).map(qualification => (
                  <li key={qualification.id}>Lead {qualification.lead_id} - {qualification.status} ({qualification.qualification_score})</li>
                ))}
                {qualifications.length > 3 && <li>... and {qualifications.length - 3} more</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}