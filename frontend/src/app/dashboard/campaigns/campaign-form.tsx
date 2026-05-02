"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CampaignFormValues, Campaign } from "./types"

interface CampaignFormProps {
  onSubmit: (data: CampaignFormValues) => void
  onCancel: () => void
  initialData?: Campaign
}

export function CampaignForm({ onSubmit, onCancel, initialData }: CampaignFormProps) {
  const [formData, setFormData] = useState<CampaignFormValues>({
    campaign_name: initialData?.campaign_name || "",
    type: initialData?.type || "Email",
    status: initialData?.status || "Planned",
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    end_date: initialData?.end_date || "",
    budgeted_cost: initialData?.budgeted_cost,
    actual_cost: initialData?.actual_cost,
    expected_revenue: initialData?.expected_revenue
  })
  const [loading, setLoading] = useState(false)

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        campaign_name: initialData.campaign_name || "",
        type: initialData.type || "Email",
        status: initialData.status || "Planned",
        start_date: initialData.start_date || new Date().toISOString().split('T')[0],
        end_date: initialData.end_date || "",
        budgeted_cost: initialData.budgeted_cost,
        actual_cost: initialData.actual_cost,
        expected_revenue: initialData.expected_revenue
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cost') || name.includes('revenue') ? 
        (value ? parseFloat(value) : undefined) : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
        <CardDescription>
          Fill in the details for your new marketing campaign
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaign_name">Campaign Name</Label>
            <Input
              id="campaign_name"
              name="campaign_name"
              value={formData.campaign_name}
              onChange={handleChange}
              placeholder="Summer Promotion"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                name="type" 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                name="status" 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgeted_cost">Budgeted Cost ($)</Label>
              <Input
                id="budgeted_cost"
                name="budgeted_cost"
                type="number"
                value={formData.budgeted_cost || ""}
                onChange={handleChange}
                placeholder="5000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actual_cost">Actual Cost ($)</Label>
              <Input
                id="actual_cost"
                name="actual_cost"
                type="number"
                value={formData.actual_cost || ""}
                onChange={handleChange}
                placeholder="4200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_revenue">Expected Revenue ($)</Label>
              <Input
                id="expected_revenue"
                name="expected_revenue"
                type="number"
                value={formData.expected_revenue || ""}
                onChange={handleChange}
                placeholder="25000"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}