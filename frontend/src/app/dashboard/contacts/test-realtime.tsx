"use client"

import { useEffect } from "react"
import { useContactLists } from "@/lib/hooks/useContactLists"
import { useContactSegments } from "@/lib/hooks/useContactSegments"
import { useContactTopics } from "@/lib/hooks/useContactTopics"
import { useLeadQualifications } from "@/lib/hooks/useLeadQualifications"

// This is a test component to verify real-time functionality for contact dashboard
export function TestRealtimeContacts() {
  const { lists, loading: listsLoading, error: listsError } = useContactLists()
  const { segments, loading: segmentsLoading, error: segmentsError } = useContactSegments()
  const { topics, loading: topicsLoading, error: topicsError } = useContactTopics()
  const { qualifications, loading: qualificationsLoading, error: qualificationsError } = useLeadQualifications()

  useEffect(() => {
    console.log("Lists updated:", lists)
  }, [lists])

  useEffect(() => {
    console.log("Segments updated:", segments)
  }, [segments])

  useEffect(() => {
    console.log("Topics updated:", topics)
  }, [topics])

  useEffect(() => {
    console.log("Qualifications updated:", qualifications)
  }, [qualifications])

  const loading = listsLoading || segmentsLoading || topicsLoading || qualificationsLoading
  const error = listsError || segmentsError || topicsError || qualificationsError

  if (loading) return <div>Loading contact dashboard data...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Real-time Contact Dashboard Test</h2>
      
      <div>
        <h3 className="text-xl font-semibold">Contact Lists</h3>
        <p>Number of lists: {lists.length}</p>
        <ul className="list-disc pl-5">
          {lists.map(list => (
            <li key={list.id}>
              {list.name} - {list.contact_count} contacts
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold">Contact Segments</h3>
        <p>Number of segments: {segments.length}</p>
        <ul className="list-disc pl-5">
          {segments.map(segment => (
            <li key={segment.id}>
              {segment.name} ({segment.segment_type}) - {segment.contact_count} contacts
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold">Contact Topics</h3>
        <p>Number of topics: {topics.length}</p>
        <ul className="list-disc pl-5">
          {topics.map(topic => (
            <li key={topic.id}>
              {topic.name} ({topic.category}) - {topic.conversation_count} conversations
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold">Lead Qualifications</h3>
        <p>Number of qualifications: {qualifications.length}</p>
        <ul className="list-disc pl-5">
          {qualifications.map(qualification => (
            <li key={qualification.id}>
              Lead {qualification.lead_id} - Score: {qualification.qualification_score} - Status: {qualification.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}