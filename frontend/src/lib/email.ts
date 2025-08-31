/**
 * Email Integration Service
 * Provides comprehensive email functionality for lead communication and tracking
 */

// Email Provider Configuration
export interface EmailProvider {
  name: string
  smtp: {
    host: string
    port: number
    secure: boolean
  }
  auth: {
    user: string
    pass: string
  }
}

// Email Template Structure
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: 'welcome' | 'follow_up' | 'demo' | 'proposal' | 'nurture' | 'thank_you'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Email Campaign Structure
export interface EmailCampaign {
  id: string
  name: string
  templateId: string
  recipientIds: string[]
  scheduledAt?: Date
  sentAt?: Date
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  metrics: EmailCampaignMetrics
  tags: string[]
}

// Email Tracking Metrics
export interface EmailCampaignMetrics {
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  replied: number
  openRate: number
  clickRate: number
  deliveryRate: number
}

// Individual Email Activity
export interface EmailActivity {
  id: string
  leadId: string
  campaignId?: string
  templateId?: string
  subject: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'replied'
  sentAt: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  bouncedAt?: Date
  repliedAt?: Date
  trackingId: string
  metadata: Record<string, any>
}

// Email Configuration
const EMAIL_CONFIG = {
  providers: {
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || ''
    },
    mailgun: {
      domain: process.env.MAILGUN_DOMAIN || '',
      apiKey: process.env.MAILGUN_API_KEY || ''
    }
  },
  tracking: {
    domain: process.env.TRACKING_DOMAIN || 'localhost:3000',
    pixelEndpoint: '/api/email/track/open',
    linkEndpoint: '/api/email/track/click'
  },
  templates: {
    baseUrl: process.env.TEMPLATE_BASE_URL || 'http://localhost:3000'
  }
}

// Email Service Class
export class EmailService {
  private static instance: EmailService
  private provider: string = 'smtp'

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  // Send individual email
  async sendEmail(params: {
    to: string
    subject: string
    htmlContent: string
    textContent?: string
    leadId?: string
    campaignId?: string
    templateId?: string
    trackingEnabled?: boolean
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const trackingId = this.generateTrackingId()
      let htmlWithTracking = params.htmlContent
      
      if (params.trackingEnabled !== false) {
        htmlWithTracking = this.addEmailTracking(params.htmlContent, trackingId)
      }

      // Mock email sending - in production, integrate with actual email provider
      const result = await this.mockSendEmail({
        to: params.to,
        subject: params.subject,
        html: htmlWithTracking,
        text: params.textContent || this.htmlToText(params.htmlContent)
      })

      // Record email activity
      if (params.leadId) {
        await this.recordEmailActivity({
          leadId: params.leadId,
          campaignId: params.campaignId,
          templateId: params.templateId,
          subject: params.subject,
          status: 'sent',
          sentAt: new Date(),
          trackingId
        })
      }

      return result
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Send campaign emails
  async sendCampaign(campaignId: string): Promise<{
    success: boolean
    results: Array<{ email: string; success: boolean; error?: string }>
  }> {
    try {
      const campaign = await this.getCampaign(campaignId)
      if (!campaign) {
        throw new Error('Campaign not found')
      }

      const template = await this.getTemplate(campaign.templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      const results = []
      
      for (const recipientId of campaign.recipientIds) {
        const lead = await this.getLead(recipientId)
        if (!lead) {
          results.push({ email: 'unknown', success: false, error: 'Lead not found' })
          continue
        }

        const personalizedContent = this.personalizeTemplate(template, lead)
        const result = await this.sendEmail({
          to: lead.email,
          subject: personalizedContent.subject,
          htmlContent: personalizedContent.htmlContent,
          textContent: personalizedContent.textContent,
          leadId: lead.id,
          campaignId: campaign.id,
          templateId: template.id
        })

        results.push({
          email: lead.email,
          success: result.success,
          error: result.error
        })
      }

      // Update campaign status
      await this.updateCampaignStatus(campaignId, 'sent')
      
      return { success: true, results }
    } catch (error) {
      console.error('Campaign sending failed:', error)
      return { success: false, results: [] }
    }
  }

  // Template management
  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    const newTemplate: EmailTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // In production, save to database
    await this.saveTemplate(newTemplate)
    return newTemplate
  }

  async updateTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    const template = await this.getTemplate(id)
    if (!template) return null

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date()
    }

    await this.saveTemplate(updatedTemplate)
    return updatedTemplate
  }

  // Email tracking
  async trackEmailOpen(trackingId: string): Promise<void> {
    try {
      const activity = await this.getEmailActivityByTracking(trackingId)
      if (activity && !activity.openedAt) {
        await this.updateEmailActivity(activity.id, {
          status: 'opened',
          openedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Email open tracking failed:', error)
    }
  }

  async trackEmailClick(trackingId: string, linkUrl: string): Promise<string> {
    try {
      const activity = await this.getEmailActivityByTracking(trackingId)
      if (activity) {
        await this.updateEmailActivity(activity.id, {
          status: 'clicked',
          clickedAt: new Date(),
          metadata: { ...activity.metadata, clickedLinks: [...(activity.metadata.clickedLinks || []), linkUrl] }
        })
      }
      return linkUrl
    } catch (error) {
      console.error('Email click tracking failed:', error)
      return linkUrl
    }
  }

  // Analytics and reporting
  async getEmailMetrics(leadId?: string, campaignId?: string, dateRange?: { from: Date; to: Date }): Promise<EmailCampaignMetrics> {
    // Mock metrics - in production, query from database
    return {
      sent: 150,
      delivered: 147,
      opened: 89,
      clicked: 34,
      bounced: 3,
      unsubscribed: 2,
      replied: 12,
      openRate: 60.5,
      clickRate: 23.1,
      deliveryRate: 98.0
    }
  }

  async getLeadEmailHistory(leadId: string): Promise<EmailActivity[]> {
    // Mock data - in production, query from database
    return [
      {
        id: '1',
        leadId,
        subject: 'Welcome to our CRM platform',
        status: 'opened',
        sentAt: new Date(Date.now() - 86400000 * 2),
        deliveredAt: new Date(Date.now() - 86400000 * 2 + 300000),
        openedAt: new Date(Date.now() - 86400000 * 1 + 3600000),
        trackingId: 'track_123',
        metadata: {}
      }
    ]
  }

  // Private helper methods
  private async mockSendEmail(params: { to: string; subject: string; html: string; text: string }): Promise<{ success: boolean; messageId?: string }> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Mock success rate (95%)
    const success = Math.random() > 0.05
    return success 
      ? { success: true, messageId: `msg_${Date.now()}` }
      : { success: false }
  }

  private addEmailTracking(htmlContent: string, trackingId: string): string {
    // Add tracking pixel
    const trackingPixel = `<img src="${EMAIL_CONFIG.tracking.domain}${EMAIL_CONFIG.tracking.pixelEndpoint}?t=${trackingId}" width="1" height="1" style="display:none;" />`
    
    // Add click tracking to links
    const trackedHtml = htmlContent.replace(
      /<a\s+([^>]*href\s*=\s*["']([^"']+)["'][^>]*)>/gi,
      `<a $1 data-track="${trackingId}">`
    )
    
    return trackedHtml + trackingPixel
  }

  private personalizeTemplate(template: EmailTemplate, lead: any): { subject: string; htmlContent: string; textContent: string } {
    const variables = {
      firstName: lead.first_name || 'there',
      lastName: lead.last_name || '',
      company: lead.company || 'your company',
      email: lead.email,
      industry: lead.industry || 'your industry'
    }

    let subject = template.subject
    let htmlContent = template.htmlContent
    let textContent = template.textContent

    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value)
      htmlContent = htmlContent.replace(regex, value)
      textContent = textContent.replace(regex, value)
    })

    return { subject, htmlContent, textContent }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
  }

  private generateId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateTrackingId(): string {
    return `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Mock database operations - replace with actual database calls
  private async saveTemplate(template: EmailTemplate): Promise<void> {
    // Save to database
    console.log('Saving template:', template.name)
  }

  private async getTemplate(id: string): Promise<EmailTemplate | null> {
    // Mock template
    return {
      id,
      name: 'Welcome Email',
      subject: 'Welcome {{firstName}}!',
      htmlContent: '<h1>Welcome {{firstName}}!</h1><p>Thanks for joining {{company}}.</p>',
      textContent: 'Welcome {{firstName}}! Thanks for joining {{company}}.',
      variables: ['firstName', 'company'],
      category: 'welcome',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private async getCampaign(id: string): Promise<EmailCampaign | null> {
    // Mock campaign
    return {
      id,
      name: 'Welcome Campaign',
      templateId: 'template_1',
      recipientIds: ['lead_1', 'lead_2'],
      status: 'draft',
      metrics: {
        sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0, replied: 0,
        openRate: 0, clickRate: 0, deliveryRate: 0
      },
      tags: ['welcome', 'new_leads']
    }
  }

  private async getLead(id: string): Promise<any> {
    // Mock lead data
    return {
      id,
      email: 'lead@example.com',
      first_name: 'John',
      last_name: 'Doe',
      company: 'Example Corp',
      industry: 'Technology'
    }
  }

  private async recordEmailActivity(activity: Omit<EmailActivity, 'id'>): Promise<void> {
    console.log('Recording email activity:', activity)
  }

  private async updateEmailActivity(id: string, updates: Partial<EmailActivity>): Promise<void> {
    console.log('Updating email activity:', id, updates)
  }

  private async getEmailActivityByTracking(trackingId: string): Promise<EmailActivity | null> {
    // Mock activity
    return {
      id: 'activity_1',
      leadId: 'lead_1',
      subject: 'Test Email',
      status: 'sent',
      sentAt: new Date(),
      trackingId,
      metadata: {}
    }
  }

  private async updateCampaignStatus(id: string, status: EmailCampaign['status']): Promise<void> {
    console.log('Updating campaign status:', id, status)
  }
}

export default EmailService.getInstance()