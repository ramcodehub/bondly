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
import { Task, Priority, Status } from "../types"

interface TaskFormProps {
  task?: Task
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Task) => void
}

interface FormData {
  title: string
  description: string
  due_date: Date | undefined
  priority: Priority
  status: Status
  deal_id: string
  lead_id: string
  contact_id: string
  company_id: string
  assigned_to: string
  estimated_hours: string
  notes: string
  tags: string
}

// Renamed from Deal to TaskFormDeal to avoid type conflicts
interface TaskFormDeal {
  id: string
  name: string
  amount: number
  stage: string
  probability: number
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
}

interface Company {
  id: string
  name: string
  industry?: string
}

interface User {
  id: string
  email: string
  full_name?: string
}

export function TaskForm({ task, isOpen, onClose, onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    due_date: undefined,
    priority: "medium",
    status: "todo",
    deal_id: "",
    lead_id: "",
    contact_id: "",
    company_id: "",
    assigned_to: "",
    estimated_hours: "",
    notes: "",
    tags: ""
  })

  const [loading, setLoading] = useState(false)
  const [deals, setDeals] = useState<TaskFormDeal[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Fetch dropdown data
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData()
    }
  }, [isOpen])

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        priority: task.priority || "medium",
        status: task.status || "todo",
        deal_id: task.deal_id || "",
        lead_id: task.lead_id || "",
        contact_id: task.contact_id || "",
        company_id: task.account_id || "",
        assigned_to: task.assigned_to || "",
        estimated_hours: task.estimated_hours?.toString() || "",
        notes: task.notes || "",
        tags: task.tags?.join(", ") || ""
      })
    } else {
      // Reset form for new task
      setFormData({
        title: "",
        description: "",
        due_date: undefined,
        priority: "medium",
        status: "todo",
        deal_id: "",
        lead_id: "",
        contact_id: "",
        company_id: "",
        assigned_to: "",
        estimated_hours: "",
        notes: "",
        tags: ""
      })
    }
  }, [task])

  const fetchDropdownData = async () => {
    setLoadingData(true)
    try {
      const [dealsResponse, leadsResponse, contactsResponse, companiesResponse] = await Promise.all([
        supabase.from('deals').select('id, name, amount, stage, probability').limit(100),
        supabase.from('leads').select('id, first_name, last_name, email, company').limit(100),
        supabase.from('contacts').select('id, name, email').limit(100),
        supabase.from('companies').select('id, name, industry').limit(100),
      ])

      if (dealsResponse.data) setDeals(dealsResponse.data)
      if (leadsResponse.data) setLeads(leadsResponse.data)
      if (contactsResponse.data) setContacts(contactsResponse.data)
      if (companiesResponse.data) setCompanies(companiesResponse.data)

      // For users, we'll need to get from auth.users which might require admin access
      // For now, we'll leave it empty or get current user
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUsers([{ id: user.id, email: user.email || '', full_name: user.user_metadata?.full_name }])
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Task title is required')
      return
    }

    setLoading(true)
    
    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        due_date: formData.due_date ? format(formData.due_date, 'yyyy-MM-dd') : null,
        priority: formData.priority,
        status: formData.status,
        deal_id: formData.deal_id ? parseInt(formData.deal_id) : null,
        lead_id: formData.lead_id || null,
        contact_id: formData.contact_id ? parseInt(formData.contact_id) : null,
        company_id: formData.company_id || null,
        assigned_to: formData.assigned_to || null,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
        notes: formData.notes.trim() || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null
      }

      let response
      if (task?.id) {
        // Update existing task
        response = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', task.id)
          .select()
          .single()
      } else {
        // Create new task
        response = await supabase
          .from('tasks')
          .insert([taskData])
          .select()
          .single()
      }

      if (response.error) {
        console.error('Error saving task:', response.error)
        alert('Failed to save task. Please try again.')
        return
      }

      onSubmit(response.data)
      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
      alert('Failed to save task. Please try again.')
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
              <CardTitle>{task ? 'Edit Task' : 'Create New Task'}</CardTitle>
              <CardDescription>
                {task ? 'Update task information' : 'Enter task details to create a new task'}
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
                {/* Task Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                {/* Priority and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: Status) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Due Date and Estimated Hours */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.due_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.due_date ? format(formData.due_date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.due_date}
                          onSelect={(date: Date | undefined) => setFormData(prev => ({ ...prev, due_date: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_hours">Estimated Hours</Label>
                    <Input
                      id="estimated_hours"
                      type="number"
                      step="0.25"
                      min="0"
                      value={formData.estimated_hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                {/* Associated Records */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Deal */}
                  <div className="space-y-2">
                    <Label htmlFor="deal_id">Associated Deal</Label>
                    <Select value={formData.deal_id || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, deal_id: value === "none" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No deal selected</SelectItem>
                        {deals.map((deal) => (
                          <SelectItem key={deal.id} value={deal.id.toString()}>
                            {deal.name} - ${deal.amount} ({deal.stage})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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

                  {/* Assigned To */}
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Assigned To</Label>
                    <Select value={formData.assigned_to || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value === "none" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No assignee selected</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name || user.email}
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
                    placeholder="Enter task description..."
                    rows={3}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags separated by commas (e.g., urgent, client-call, follow-up)"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
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
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}