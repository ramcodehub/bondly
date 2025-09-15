"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign,
  Calendar,
  Star,
  Filter
} from 'lucide-react'

// Define types for our data structures
interface Lead {
  id: string
  name: string
  email: string
  company: string
  status: string
  lead_source?: string
  industry?: string
  location?: string
  company_size?: string
  email_opens?: number
  website_visits?: number
  downloads?: number
  social_engagement?: boolean
  avg_session_duration?: number
  pages_per_session?: number
  form_submissions?: number
  product_page_views?: number
  annual_revenue?: number
  employee_count?: number
  uses_compatible_tech?: boolean
  last_activity?: string
  created_at: string
  requested_demo?: boolean
  contacted_sales?: boolean
  pricing_page_views?: number
  competitor_research?: boolean
  deal_value?: number
  demo_requested?: boolean // Add this missing property
}

interface SourceStats {
  count: number
  totalScore: number
  converted: number
  revenue: number
}

interface SourcePerformance {
  source: string
  count: number
  avgScore: number
  conversionRate: number
  revenue: number
  roi: number
}

interface FunnelStats {
  total: number
  qualified: number
  warm: number
  hot: number
  converted: number
  qualificationRate: number
  warmRate: number
  hotRate: number
  conversionRate: number
}

// Lead scoring algorithm
export class LeadScoring {
  // Scoring weights (total should equal 100)
  private static readonly WEIGHTS = {
    demographics: 20,    // Company size, industry, location
    engagement: 30,      // Email opens, website visits, downloads
    behavioral: 25,      // Pages viewed, time spent, actions taken
    firmographics: 15,   // Company revenue, employee count
    intent: 10          // Recent activity, urgency indicators
  }

  // Calculate lead score (0-100)
  static calculateScore(lead: Lead): number {
    const scores = {
      demographics: this.calculateDemographicsScore(lead),
      engagement: this.calculateEngagementScore(lead),
      behavioral: this.calculateBehavioralScore(lead),
      firmographics: this.calculateFirmographicsScore(lead),
      intent: this.calculateIntentScore(lead)
    }

    return Math.round(
      Object.entries(scores).reduce((total, [key, score]) => {
        const weight = this.WEIGHTS[key as keyof typeof this.WEIGHTS]
        return total + (score * weight / 100)
      }, 0)
    )
  }

  private static calculateDemographicsScore(lead: Lead): number {
    let score = 0
    
    // Industry scoring
    const highValueIndustries = ['technology', 'finance', 'healthcare', 'manufacturing']
    if (lead.industry && highValueIndustries.includes(lead.industry.toLowerCase())) {
      score += 40
    } else if (lead.industry) {
      score += 20
    }

    // Location scoring (example: proximity to major cities)
    if (lead.location && ['new york', 'san francisco', 'london', 'tokyo'].includes(lead.location.toLowerCase())) {
      score += 30
    } else if (lead.location) {
      score += 15
    }

    // Company size
    if (lead.company_size === 'enterprise') score += 30
    else if (lead.company_size === 'medium') score += 20
    else if (lead.company_size === 'small') score += 10

    return Math.min(score, 100)
  }

  private static calculateEngagementScore(lead: Lead): number {
    let score = 0
    
    // Email engagement
    if (lead.email_opens && lead.email_opens > 5) score += 30
    else if (lead.email_opens && lead.email_opens > 2) score += 20
    else if (lead.email_opens && lead.email_opens > 0) score += 10

    // Website visits
    if (lead.website_visits && lead.website_visits > 10) score += 25
    else if (lead.website_visits && lead.website_visits > 5) score += 15
    else if (lead.website_visits && lead.website_visits > 0) score += 5

    // Content downloads
    if (lead.downloads && lead.downloads > 3) score += 25
    else if (lead.downloads && lead.downloads > 1) score += 15
    else if (lead.downloads && lead.downloads > 0) score += 10

    // Social media engagement
    if (lead.social_engagement) score += 20

    return Math.min(score, 100)
  }

  private static calculateBehavioralScore(lead: Lead): number {
    let score = 0
    
    // Time on site
    if (lead.avg_session_duration && lead.avg_session_duration > 300) score += 25 // 5+ minutes
    else if (lead.avg_session_duration && lead.avg_session_duration > 120) score += 15 // 2+ minutes
    else if (lead.avg_session_duration && lead.avg_session_duration > 60) score += 10 // 1+ minute

    // Pages per session
    if (lead.pages_per_session && lead.pages_per_session > 5) score += 25
    else if (lead.pages_per_session && lead.pages_per_session > 3) score += 15
    else if (lead.pages_per_session && lead.pages_per_session > 1) score += 10

    // Form submissions
    if (lead.form_submissions && lead.form_submissions > 2) score += 30
    else if (lead.form_submissions && lead.form_submissions > 0) score += 20

    // Product page views
    if (lead.product_page_views && lead.product_page_views > 3) score += 20
    else if (lead.product_page_views && lead.product_page_views > 0) score += 10

    return Math.min(score, 100)
  }

  private static calculateFirmographicsScore(lead: Lead): number {
    let score = 0
    
    // Annual revenue
    if (lead.annual_revenue && lead.annual_revenue > 10000000) score += 40 // $10M+
    else if (lead.annual_revenue && lead.annual_revenue > 1000000) score += 30 // $1M+
    else if (lead.annual_revenue && lead.annual_revenue > 100000) score += 20 // $100K+
    else if (lead.annual_revenue && lead.annual_revenue > 0) score += 10

    // Employee count
    if (lead.employee_count && lead.employee_count > 1000) score += 30
    else if (lead.employee_count && lead.employee_count > 100) score += 25
    else if (lead.employee_count && lead.employee_count > 50) score += 20
    else if (lead.employee_count && lead.employee_count > 10) score += 15
    else if (lead.employee_count && lead.employee_count > 0) score += 10

    // Technology stack compatibility
    if (lead.uses_compatible_tech) score += 30

    return Math.min(score, 100)
  }

  private static calculateIntentScore(lead: Lead): number {
    let score = 0
    const now = new Date()
    const lastActivity = new Date(lead.last_activity || lead.created_at)
    const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    
    // Recent activity (higher score for more recent activity)
    if (daysSinceActivity < 1) score += 40
    else if (daysSinceActivity < 7) score += 30
    else if (daysSinceActivity < 30) score += 20
    else if (daysSinceActivity < 90) score += 10

    // Urgency indicators
    if (lead.requested_demo) score += 30
    if (lead.contacted_sales) score += 25
    if (lead.pricing_page_views && lead.pricing_page_views > 0) score += 20
    if (lead.competitor_research) score += 15

    return Math.min(score, 100)
  }

  // Get score category
  static getScoreCategory(score: number): {
    label: string
    color: string
    priority: 'hot' | 'warm' | 'cold'
  } {
    if (score >= 80) return { label: 'Hot Lead', color: 'destructive', priority: 'hot' }
    if (score >= 60) return { label: 'Warm Lead', color: 'warning', priority: 'warm' }
    if (score >= 40) return { label: 'Qualified Lead', color: 'default', priority: 'warm' }
    return { label: 'Cold Lead', color: 'secondary', priority: 'cold' }
  }

  // Get recommendations for improving lead score
  static getRecommendations(lead: Lead): string[] {
    const recommendations: string[] = []
    const score = this.calculateScore(lead)
    
    if (score < 80) {
      if (!lead.email_opens || lead.email_opens < 3) {
        recommendations.push('Send targeted email campaigns to increase engagement')
      }
      
      if (!lead.website_visits || lead.website_visits < 5) {
        recommendations.push('Drive more website traffic through targeted ads')
      }
      
      if (!lead.form_submissions) {
        recommendations.push('Encourage form submissions with valuable content offers')
      }
      
      if (!lead.demo_requested) {
        recommendations.push('Invite for a product demonstration')
      }
      
      if (!lead.annual_revenue || lead.annual_revenue < 100000) {
        recommendations.push('Qualify budget and decision-making authority')
      }
    }
    
    return recommendations
  }
}

// Analytics calculations
export class LeadAnalytics {
  static calculateConversionFunnel(leads: Lead[]): FunnelStats {
    const total = leads.length
    const qualified = leads.filter(l => LeadScoring.calculateScore(l) >= 40).length
    const warm = leads.filter(l => LeadScoring.calculateScore(l) >= 60).length
    const hot = leads.filter(l => LeadScoring.calculateScore(l) >= 80).length
    const converted = leads.filter(l => l.status === 'converted').length

    return {
      total,
      qualified,
      warm,
      hot,
      converted,
      qualificationRate: total > 0 ? (qualified / total) * 100 : 0,
      warmRate: qualified > 0 ? (warm / qualified) * 100 : 0,
      hotRate: warm > 0 ? (hot / warm) * 100 : 0,
      conversionRate: hot > 0 ? (converted / hot) * 100 : 0
    }
  }

  static calculateSourcePerformance(leads: Lead[]): SourcePerformance[] {
    const sourceStats = leads.reduce((acc, lead) => {
      const source = lead.lead_source || 'Unknown'
      const score = LeadScoring.calculateScore(lead)
      
      if (!acc[source]) {
        acc[source] = {
          count: 0,
          totalScore: 0,
          converted: 0,
          revenue: 0
        }
      }
      
      acc[source].count++
      acc[source].totalScore += score
      if (lead.status === 'converted') {
        acc[source].converted++
        acc[source].revenue += lead.deal_value || 0
      }
      
      return acc
    }, {} as Record<string, SourceStats>)

    return Object.entries(sourceStats).map(([source, stats]) => ({
      source,
      count: stats.count,
      avgScore: Math.round(stats.totalScore / stats.count),
      conversionRate: (stats.converted / stats.count) * 100,
      revenue: stats.revenue,
      roi: stats.revenue / (stats.count * 100) // Assuming $100 cost per lead
    }))
  }

  static calculateTrendAnalysis(leads: Lead[], days: number) {
    const recentLeads = leads.filter(lead => {
      const leadDate = new Date(lead.created_at)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      return leadDate >= cutoffDate
    })
    
    const dailyStats: Record<string, { count: number; avgScore: number; hotLeads: number }> = {}
    
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayLeads = recentLeads.filter(lead => 
        lead.created_at.startsWith(dateStr)
      )
      
      dailyStats[dateStr] = {
        count: dayLeads.length,
        avgScore: dayLeads.length > 0 
          ? dayLeads.reduce((sum, lead) => sum + LeadScoring.calculateScore(lead), 0) / dayLeads.length
          : 0,
        hotLeads: dayLeads.filter(lead => LeadScoring.calculateScore(lead) >= 80).length
      }
    }
    
    return dailyStats
  }
}

// Lead Analytics Dashboard Component
export default function LeadAnalyticsDashboard({ leads = [] }: { leads: Lead[] }) {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedSource, setSelectedSource] = useState('all')

  // Calculate analytics
  const analytics = useMemo(() => {
    const funnel = LeadAnalytics.calculateConversionFunnel(leads)
    const sources = LeadAnalytics.calculateSourcePerformance(leads)
    const trends = LeadAnalytics.calculateTrendAnalysis(leads, 30)
    
    return { funnel, sources, trends }
  }, [leads])

  // Enhanced leads with scores
  const scoredLeads = useMemo(() => {
    return leads.map(lead => ({
      ...lead,
      score: LeadScoring.calculateScore(lead),
      category: LeadScoring.getScoreCategory(LeadScoring.calculateScore(lead)),
      recommendations: LeadScoring.getRecommendations(lead)
    }))
  }, [leads])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Analytics</h2>
          <p className="text-muted-foreground">
            Advanced insights and scoring for your leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scoring">Lead Scoring</TabsTrigger>
          <TabsTrigger value="sources">Source Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{analytics.funnel.total}</div>
                  <div className="text-sm text-muted-foreground">Total Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.funnel.qualified}</div>
                  <div className="text-sm text-muted-foreground">Qualified</div>
                  <div className="text-xs text-blue-600">
                    {analytics.funnel.qualificationRate.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{analytics.funnel.warm}</div>
                  <div className="text-sm text-muted-foreground">Warm</div>
                  <div className="text-xs text-yellow-600">
                    {analytics.funnel.warmRate.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{analytics.funnel.hot}</div>
                  <div className="text-sm text-muted-foreground">Hot</div>
                  <div className="text-xs text-red-600">
                    {analytics.funnel.hotRate.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.funnel.converted}</div>
                  <div className="text-sm text-muted-foreground">Converted</div>
                  <div className="text-xs text-green-600">
                    {analytics.funnel.conversionRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Avg Lead Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {scoredLeads.length > 0 
                    ? Math.round(scoredLeads.reduce((sum, lead) => sum + lead.score, 0) / scoredLeads.length)
                    : 0
                  }
                </div>
                <Progress 
                  value={scoredLeads.length > 0 
                    ? scoredLeads.reduce((sum, lead) => sum + lead.score, 0) / scoredLeads.length
                    : 0
                  } 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Hot Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {scoredLeads.filter(lead => lead.score >= 80).length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {scoredLeads.length > 0 
                    ? ((scoredLeads.filter(lead => lead.score >= 80).length / scoredLeads.length) * 100).toFixed(1)
                    : 0
                  }% of total leads
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Potential Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${(scoredLeads.filter(lead => lead.score >= 60).length * 5000).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Based on warm & hot leads
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4">
          {/* Top Scored Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Top Scored Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoredLeads
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 10)
                  .map((lead, index) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">#{index + 1}</div>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={lead.category.color as any}>
                          {lead.category.label}
                        </Badge>
                        <div className="text-right">
                          <div className="font-bold">{lead.score}</div>
                          <Progress value={lead.score} className="w-20" />
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          {/* Source Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.sources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{source.source}</div>
                      <div className="text-sm text-muted-foreground">
                        {source.count} leads • Avg Score: {source.avgScore}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{source.conversionRate.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">
                        ${source.revenue.toLocaleString()} revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Trends (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                Chart visualization would be implemented here with a charting library like Recharts
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}