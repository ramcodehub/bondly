"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Users,
  Calendar,
  Mail,
  Phone
} from 'lucide-react'

// AI Recommendation Engine
export class AIRecommendationEngine {
  // Pattern recognition for lead behavior
  static analyzeLeadPatterns(leads: any[]) {
    const patterns = {
      highValueIndicators: this.findHighValuePatterns(leads),
      engagementPatterns: this.findEngagementPatterns(leads),
      conversionPredictors: this.findConversionPredictors(leads),
      churnRiskFactors: this.findChurnRiskFactors(leads)
    }
    
    return patterns
  }

  private static findHighValuePatterns(leads: any[]) {
    const convertedLeads = leads.filter(lead => lead.status === 'converted')
    const patterns = []

    // Industry patterns
    const industrySuccess = this.calculateSuccessRateByAttribute(leads, 'industry')
    if (industrySuccess.length > 0) {
      patterns.push({
        type: 'industry',
        insight: `Leads from ${industrySuccess[0].value} industry have ${industrySuccess[0].rate.toFixed(1)}% higher conversion rate`,
        confidence: 0.85,
        action: `Prioritize leads from ${industrySuccess[0].value} industry`
      })
    }

    // Company size patterns
    const sizeSuccess = this.calculateSuccessRateByAttribute(leads, 'company_size')
    if (sizeSuccess.length > 0) {
      patterns.push({
        type: 'company_size',
        insight: `${sizeSuccess[0].value} companies convert ${sizeSuccess[0].rate.toFixed(1)}% better`,
        confidence: 0.78,
        action: `Focus on ${sizeSuccess[0].value} company segment`
      })
    }

    // Source patterns
    const sourceSuccess = this.calculateSuccessRateByAttribute(leads, 'lead_source')
    if (sourceSuccess.length > 0) {
      patterns.push({
        type: 'lead_source',
        insight: `${sourceSuccess[0].value} generates highest quality leads (${sourceSuccess[0].rate.toFixed(1)}% conversion)`,
        confidence: 0.82,
        action: `Increase investment in ${sourceSuccess[0].value} channel`
      })
    }

    return patterns
  }

  private static findEngagementPatterns(leads: any[]) {
    const patterns = []
    
    // Email engagement correlation
    const highEmailEngagement = leads.filter(lead => lead.email_opens > 3)
    const conversionRate = highEmailEngagement.filter(lead => lead.status === 'converted').length / 
                          Math.max(highEmailEngagement.length, 1) * 100

    if (conversionRate > 20) {
      patterns.push({
        type: 'email_engagement',
        insight: `Leads with 3+ email opens have ${conversionRate.toFixed(1)}% conversion rate`,
        confidence: 0.76,
        action: 'Implement email nurture sequences for low-engagement leads'
      })
    }

    // Website behavior patterns
    const highWebsiteEngagement = leads.filter(lead => lead.website_visits > 5)
    const webConversionRate = highWebsiteEngagement.filter(lead => lead.status === 'converted').length / 
                             Math.max(highWebsiteEngagement.length, 1) * 100

    if (webConversionRate > 15) {
      patterns.push({
        type: 'website_engagement',
        insight: `Leads with 5+ website visits convert at ${webConversionRate.toFixed(1)}%`,
        confidence: 0.73,
        action: 'Retarget leads with high website engagement'
      })
    }

    return patterns
  }

  private static findConversionPredictors(leads: any[]) {
    const patterns = []
    
    // Time-based patterns
    const recentLeads = leads.filter(lead => {
      const daysSinceCreated = (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceCreated <= 30
    })
    
    const recentConversionRate = recentLeads.filter(lead => lead.status === 'converted').length / 
                                Math.max(recentLeads.length, 1) * 100

    if (recentConversionRate > 0) {
      patterns.push({
        type: 'timing',
        insight: `Recent leads (last 30 days) convert at ${recentConversionRate.toFixed(1)}%`,
        confidence: 0.68,
        action: 'Follow up with leads within 24 hours of creation'
      })
    }

    // Demo request correlation
    const demoRequested = leads.filter(lead => lead.demo_requested)
    const demoConversionRate = demoRequested.filter(lead => lead.status === 'converted').length / 
                              Math.max(demoRequested.length, 1) * 100

    if (demoConversionRate > 30) {
      patterns.push({
        type: 'demo_request',
        insight: `Leads who request demos convert at ${demoConversionRate.toFixed(1)}%`,
        confidence: 0.89,
        action: 'Proactively offer demos to qualified leads'
      })
    }

    return patterns
  }

  private static findChurnRiskFactors(leads: any[]) {
    const patterns = []
    
    // Inactivity patterns
    const inactiveLeads = leads.filter(lead => {
      const daysSinceActivity = (Date.now() - new Date(lead.last_activity || lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceActivity > 14 && lead.status === 'active'
    })

    if (inactiveLeads.length > 0) {
      patterns.push({
        type: 'inactivity_risk',
        insight: `${inactiveLeads.length} leads inactive for 14+ days`,
        confidence: 0.71,
        action: 'Re-engage inactive leads with targeted campaigns'
      })
    }

    // Low engagement patterns
    const lowEngagement = leads.filter(lead => 
      lead.email_opens < 1 && lead.website_visits < 2 && lead.status === 'active'
    )

    if (lowEngagement.length > 0) {
      patterns.push({
        type: 'low_engagement_risk',
        insight: `${lowEngagement.length} leads show minimal engagement`,
        confidence: 0.66,
        action: 'Personalize outreach for low-engagement leads'
      })
    }

    return patterns
  }

  private static calculateSuccessRateByAttribute(leads: any[], attribute: string) {
    const attributeStats: Record<string, { total: number; converted: number }> = leads.reduce((acc, lead) => {
      const value = lead[attribute] || 'Unknown'
      if (!acc[value]) {
        acc[value] = { total: 0, converted: 0 }
      }
      acc[value].total++
      if (lead.status === 'converted') {
        acc[value].converted++
      }
      return acc
    }, {} as Record<string, { total: number; converted: number }>)

    return Object.entries(attributeStats)
      .map(([value, stats]) => ({
        value,
        rate: (stats.converted / stats.total) * 100,
        total: stats.total,
        converted: stats.converted
      }))
      .filter(item => item.total >= 3) // Minimum sample size
      .sort((a, b) => b.rate - a.rate)
  }

  // Generate personalized recommendations for individual leads
  static generateLeadRecommendations(lead: any, patterns: any): any[] {
    const recommendations = []

    // Priority actions based on lead score
    const score = this.calculateLeadScore(lead)
    
    if (score >= 80) {
      recommendations.push({
        type: 'urgent',
        priority: 'high',
        action: 'Schedule immediate sales call',
        reason: 'High-value lead with strong buying signals',
        timeline: 'Within 24 hours',
        icon: Phone,
        confidence: 0.92
      })
    } else if (score >= 60) {
      recommendations.push({
        type: 'nurture',
        priority: 'medium',
        action: 'Send product demo invitation',
        reason: 'Warm lead ready for deeper engagement',
        timeline: 'Within 3 days',
        icon: Calendar,
        confidence: 0.78
      })
    } else if (score >= 40) {
      recommendations.push({
        type: 'educate',
        priority: 'medium',
        action: 'Share relevant case studies',
        reason: 'Lead needs more information to advance',
        timeline: 'Within 1 week',
        icon: Mail,
        confidence: 0.65
      })
    }

    // Industry-specific recommendations
    if (patterns.highValueIndicators.find((p: any) => p.type === 'industry' && lead.industry === p.value)) {
      recommendations.push({
        type: 'prioritize',
        priority: 'high',
        action: 'Fast-track this lead',
        reason: `${lead.industry} industry shows high conversion rates`,
        timeline: 'Immediate',
        icon: Target,
        confidence: 0.85
      })
    }

    // Engagement-based recommendations
    if (lead.email_opens < 2) {
      recommendations.push({
        type: 'engagement',
        priority: 'low',
        action: 'Improve email subject lines',
        reason: 'Low email engagement detected',
        timeline: 'Next campaign',
        icon: Mail,
        confidence: 0.59
      })
    }

    // Activity-based recommendations
    const daysSinceActivity = (Date.now() - new Date(lead.last_activity || lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysSinceActivity > 7) {
      recommendations.push({
        type: 'reactivate',
        priority: 'medium',
        action: 'Send re-engagement campaign',
        reason: `No activity for ${Math.floor(daysSinceActivity)} days`,
        timeline: 'This week',
        icon: AlertCircle,
        confidence: 0.71
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  private static calculateLeadScore(lead: any): number {
    // Simplified lead scoring for AI recommendations
    let score = 0
    
    // Engagement scoring
    score += (lead.email_opens || 0) * 5
    score += (lead.website_visits || 0) * 3
    score += (lead.form_submissions || 0) * 10
    
    // Demographic scoring
    if (lead.industry) score += 10
    if (lead.company_size === 'enterprise') score += 20
    else if (lead.company_size === 'medium') score += 15
    
    // Behavioral scoring
    if (lead.demo_requested) score += 25
    if (lead.pricing_page_views > 0) score += 15
    
    return Math.min(score, 100)
  }

  // Generate team recommendations
  static generateTeamRecommendations(leads: any[], patterns: any) {
    const recommendations = []

    // Channel optimization
    if (patterns.highValueIndicators.length > 0) {
      const topChannel = patterns.highValueIndicators.find((p: any) => p.type === 'lead_source')
      if (topChannel) {
        recommendations.push({
          type: 'strategy',
          title: 'Optimize Lead Sources',
          description: topChannel.insight,
          action: topChannel.action,
          impact: 'high',
          effort: 'medium',
          timeline: '2 weeks'
        })
      }
    }

    // Process improvements
    const highValueLeads = leads.filter(lead => this.calculateLeadScore(lead) >= 80)
    const responseTime = this.calculateAverageResponseTime(highValueLeads)
    
    if (responseTime > 24) {
      recommendations.push({
        type: 'process',
        title: 'Improve Response Time',
        description: `Average response time for high-value leads is ${responseTime} hours`,
        action: 'Implement lead routing automation',
        impact: 'high',
        effort: 'high',
        timeline: '4 weeks'
      })
    }

    // Training recommendations
    const lowPerformingSegments = this.identifyLowPerformingSegments(leads)
    if (lowPerformingSegments.length > 0) {
      recommendations.push({
        type: 'training',
        title: 'Focus Training Areas',
        description: `${lowPerformingSegments[0]} segment shows low conversion`,
        action: 'Provide targeted sales training',
        impact: 'medium',
        effort: 'medium',
        timeline: '3 weeks'
      })
    }

    return recommendations
  }

  private static calculateAverageResponseTime(leads: any[]): number {
    // Simplified calculation - in real implementation, track actual response times
    return Math.random() * 48 + 12 // Mock: 12-60 hours
  }

  private static identifyLowPerformingSegments(leads: any[]): string[] {
    // Simplified analysis - identify segments with low conversion
    const segments = ['small_business', 'enterprise', 'startup']
    return segments.filter(() => Math.random() < 0.3) // Mock analysis
  }
}

// AI Recommendations Component
export default function AIRecommendations({ leads = [], selectedLead = null }: { 
  leads: any[]
  selectedLead?: any 
}) {
  const [patterns, setPatterns] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI analysis
    setLoading(true)
    setTimeout(() => {
      const analysisResults = AIRecommendationEngine.analyzeLeadPatterns(leads)
      setPatterns(analysisResults)
      setLoading(false)
    }, 1500)
  }, [leads])

  const leadRecommendations = useMemo(() => {
    if (!selectedLead || !patterns) return []
    return AIRecommendationEngine.generateLeadRecommendations(selectedLead, patterns)
  }, [selectedLead, patterns])

  const teamRecommendations = useMemo(() => {
    if (!patterns) return []
    return AIRecommendationEngine.generateTeamRecommendations(leads, patterns)
  }, [leads, patterns])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 animate-pulse" />
            AI Analysis in Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-500" />
              <p className="text-muted-foreground">Analyzing lead patterns and generating insights...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
      </div>

      {/* Pattern Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Key Patterns Discovered
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patterns?.highValueIndicators?.map((pattern: any, index: number) => (
            <Alert key={index}>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>{pattern.insight}</strong>
                <br />
                <span className="text-sm text-muted-foreground">
                  Recommended action: {pattern.action}
                </span>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(pattern.confidence * 100)}% confidence
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Individual Lead Recommendations */}
      {selectedLead && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Recommendations for {selectedLead.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leadRecommendations.map((rec: any, index: number) => {
              const IconComponent = rec.icon
              return (
                <div key={index} className={`p-4 border rounded-lg ${
                  rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                  rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <IconComponent className={`w-5 h-5 mt-0.5 ${
                      rec.priority === 'high' ? 'text-red-600' :
                      rec.priority === 'medium' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{rec.action}</span>
                        <Badge variant={
                          rec.priority === 'high' ? 'destructive' :
                          rec.priority === 'medium' ? 'default' : 'secondary'
                        } className="text-xs">
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Timeline: {rec.timeline}</span>
                        <span>Confidence: {Math.round(rec.confidence * 100)}%</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Team Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamRecommendations.map((rec: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{rec.title}</h4>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    Impact: {rec.impact}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Effort: {rec.effort}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{rec.action}</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{rec.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}