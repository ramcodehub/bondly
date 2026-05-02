"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, TrendingUp, Users } from "lucide-react"
import { useLeadQualifications } from "@/lib/hooks/useLeadQualifications"
import { useState, useMemo } from "react"
import { QualificationModal } from "./qualification-modal"

export default function ContactQualificationPage() {
  const { qualifications, loading, error, fetchQualifications } = useLeadQualifications()
  const [searchTerm, setSearchTerm] = useState("")

  // Calculate statistics
  const stats = useMemo(() => {
    const newLeads = qualifications.length
    const qualifiedLeads = qualifications.filter(q => q.status === 'qualified').length
    const conversionRate = newLeads > 0 ? Math.round((qualifiedLeads / newLeads) * 100) : 0
    const avgScore = qualifications.length > 0 
      ? Math.round(qualifications.reduce((sum, q) => sum + (q.qualification_score || 0), 0) / qualifications.length)
      : 0

    return {
      newLeads,
      qualifiedLeads,
      conversionRate,
      avgScore
    }
  }, [qualifications])

  // Group qualifications by status
  const groupedByStatus = useMemo(() => {
    const groups: Record<string, any[]> = {}
    
    qualifications.forEach(qualification => {
      const status = qualification.status || 'new'
      if (!groups[status]) {
        groups[status] = []
      }
      groups[status].push(qualification)
    })
    
    return groups
  }, [qualifications])

  // Filter qualifications based on search term
  const filteredQualifications = useMemo(() => {
    if (!searchTerm) return qualifications
    return qualifications.filter(qualification => 
      (qualification.leads?.name && qualification.leads?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (qualification.leads?.email && qualification.leads?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (qualification.status && qualification.status?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [qualifications, searchTerm])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Qualification</h1>
          <p className="text-muted-foreground">
            Manage and track lead qualification process
          </p>
        </div>
        <div>Loading lead qualifications...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Qualification</h1>
          <p className="text-muted-foreground">
            Manage and track lead qualification process
          </p>
        </div>
        <div className="text-red-500">Error loading lead qualifications: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Qualification</h1>
        <p className="text-muted-foreground">
          Manage and track lead qualification process
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Scoring Criteria</CardTitle>
            <CardDescription>
              Factors used to score leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Company Size</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Budget</span>
                  <span>20%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Authority</span>
                  <span>20%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Timeline</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Need</span>
                  <span>20%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Qualification Stages</CardTitle>
            <CardDescription>
              Track leads through qualification process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">New Lead</p>
                  <p className="text-sm text-muted-foreground">Initial contact made</p>
                </div>
                <div className="ml-auto text-sm font-medium">{groupedByStatus.new?.length || 0}</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Contacted</p>
                  <p className="text-sm text-muted-foreground">First conversation completed</p>
                </div>
                <div className="ml-auto text-sm font-medium">{groupedByStatus.contacted?.length || 0}</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Qualified</p>
                  <p className="text-sm text-muted-foreground">Meets basic criteria</p>
                </div>
                <div className="ml-auto text-sm font-medium">{groupedByStatus.qualified?.length || 0}</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Proposal Sent</p>
                  <p className="text-sm text-muted-foreground">Solution presented</p>
                </div>
                <div className="ml-auto text-sm font-medium">{groupedByStatus.proposal_sent?.length || 0}</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Closed Won</p>
                  <p className="text-sm text-muted-foreground">Deal completed</p>
                </div>
                <div className="ml-auto text-sm font-medium">{groupedByStatus.closed_won?.length || 0}</div>
              </div>
              <QualificationModal onCreateQualification={fetchQualifications} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}