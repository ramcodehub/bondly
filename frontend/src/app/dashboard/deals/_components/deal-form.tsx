"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2, X } from "lucide-react"
import { format } from "date-fns"
import supabase from "@/lib/supabase-client"
import { Deal, DealStage } from "../types"

interface DealFormProps {
  deal?: Deal
  isOpen: boolean
  onClose: () => void
  onSubmit: (deal: Deal) => void
}

interface FormData {
  name: string
  amount: string
  stage: DealStage
  probability: string
  close_date: Date | undefined
  description: string
  lead_id: string
  contact_id: string
  company_id: string
  deal_source: string
  next_step: string
}

interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  company?: string
}

interface Contact {
  id: string
  name: string
  email: string
  company_id?: string
}

interface Company {
  id: string
  name: string
  industry?: string
}

export function DealForm({ deal, isOpen, onClose, onSubmit }: DealFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    amount: "",
    stage: "lead",
    probability: "0",
    close_date: undefined,
    description: "",
    lead_id: "",
    contact_id: "",
    company_id: "",
    deal_source: "",
    next_step: ""
  })

  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Fetch dropdown data
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData()
    }
  }, [isOpen])

  // Populate form when editing
  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || "",
        amount: deal.amount?.toString() || "",
        stage: deal.stage || "lead",
        probability: deal.probability?.toString() || "0",
        close_date: deal.close_date ? new Date(deal.close_date) : undefined,
        description: deal.description || "",
        lead_id: deal.lead_id || "",
        contact_id: deal.contact_id || "",
        company_id: deal.account_id || "",
        deal_source: deal.deal_source || "",
        next_step: deal.next_step || ""
      })
    } else {
      // Reset form for new deal
      setFormData({
        name: "",
        amount: "",
        stage: "lead",
        probability: "0",
        close_date: undefined,
        description: "",
        lead_id: "",
        contact_id: "",
        company_id: "",
        deal_source: "",
        next_step: ""
      })
    }
  }, [deal])

  const fetchDropdownData = async () => {
    setLoadingData(true)
    try {
      const [leadsResponse, contactsResponse, companiesResponse] = await Promise.all([
        supabase.from('leads').select('id, first_name, last_name, email, company').limit(100),
        supabase.from('contacts').select('id, name, email, company_id').limit(100),
        supabase.from('companies').select('id, name, industry').limit(100)
      ])

      if (leadsResponse.data) setLeads(leadsResponse.data)
      if (contactsResponse.data) setContacts(contactsResponse.data)
      if (companiesResponse.data) setCompanies(companiesResponse.data)
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Deal name is required')
      return
    }

    setLoading(true)
    
    try {
      const dealData = {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount) || 0,
        stage: formData.stage,
        probability: parseInt(formData.probability) || 0,
        close_date: formData.close_date ? format(formData.close_date, 'yyyy-MM-dd') : null,
        description: formData.description.trim() || null,
        lead_id: formData.lead_id || null,
        contact_id: formData.contact_id ? parseInt(formData.contact_id) : null,
        company_id: formData.company_id || null,
        deal_source: formData.deal_source.trim() || null,
        next_step: formData.next_step.trim() || null
      }

      let response
      if (deal?.id) {
        // Update existing deal
        response = await supabase
          .from('deals')
          .update(dealData)
          .eq('id', deal.id)
          .select()
          .single()
      } else {
        // Create new deal
        response = await supabase
          .from('deals')
          .insert([dealData])
          .select()
          .single()
      }

      if (response.error) {
        console.error('Error saving deal:', response.error)
        alert('Failed to save deal. Please try again.')
        return
      }

      onSubmit(response.data)
      onClose()
    } catch (error) {
      console.error('Error saving deal:', error)
      alert('Failed to save deal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{deal ? 'Edit Deal' : 'Create New Deal'}</CardTitle>
              <CardDescription>
                {deal ? 'Update deal information' : 'Enter deal details to create a new opportunity'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {loadingData && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading form data...</span>
              </div>
            )}

            {!loadingData && (
              <>
                {/* Deal Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Deal Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter deal name"
                    required
                  />
                </div>

                {/* Amount and Probability */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Stage and Source */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Select value={formData.stage} onValueChange={(value: DealStage) => setFormData(prev => ({ ...prev, stage: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed_won">Closed Won</SelectItem>
                        <SelectItem value="closed_lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deal_source">Deal Source</Label>
                    <Select value={formData.deal_source} onValueChange={(value) => setFormData(prev => ({ ...prev, deal_source: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Cold Call">Cold Call</SelectItem>
                        <SelectItem value="Trade Show">Trade Show</SelectItem>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Close Date */}
                <div className="space-y-2">
                  <Label>Expected Close Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.close_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.close_date ? format(formData.close_date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.close_date}
                        onSelect={(date: Date | undefined) => setFormData(prev => ({ ...prev, close_date: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Associated Records */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Lead */}
                  <div className="space-y-2">
                    <Label htmlFor="lead_id">Associated Lead</Label>
                    <Select value={formData.lead_id || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, lead_id: value === "none" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No lead selected</SelectItem>
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.first_name} {lead.last_name} - {lead.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <Label htmlFor="contact_id">Associated Contact</Label>
                    <Select value={formData.contact_id || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, contact_id: value === "none" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No contact selected</SelectItem>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id.toString()}>
                            {contact.name} - {contact.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company_id">Associated Company</Label>
                    <Select value={formData.company_id || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, company_id: value === "none" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No company selected</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name} {company.industry ? `- ${company.industry}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter deal description..."
                    rows={3}
                  />
                </div>

                {/* Next Step */}
                <div className="space-y-2">
                  <Label htmlFor="next_step">Next Step</Label>
                  <Textarea
                    id="next_step"
                    value={formData.next_step}
                    onChange={(e) => setFormData(prev => ({ ...prev, next_step: e.target.value }))}
                    placeholder="What's the next action to take..."
                    rows={2}
                  />
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || loadingData}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}