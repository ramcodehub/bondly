"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define the form schema using zod
const qualificationFormSchema = z.object({
  lead_id: z.string().min(1, {
    message: "Lead ID is required.",
  }),
  qualification_score: z.number().min(0).max(100).default(0),
  status: z.enum(["new", "contacted", "qualified", "proposal_sent", "closed_won", "closed_lost"], {
    required_error: "Please select a status.",
  }),
  notes: z.string().optional(),
})

type QualificationFormValues = z.infer<typeof qualificationFormSchema>

interface QualificationFormProps {
  initialData?: {
    id?: string
    lead_id: string
    qualification_score: number
    status: "new" | "contacted" | "qualified" | "proposal_sent" | "closed_won" | "closed_lost"
    notes?: string
  } | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function QualificationForm({ 
  initialData, 
  onSuccess, 
  onCancel
}: QualificationFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<QualificationFormValues>({
    resolver: zodResolver(qualificationFormSchema),
    defaultValues: initialData ? {
      lead_id: initialData.lead_id,
      qualification_score: initialData.qualification_score,
      status: initialData.status,
      notes: initialData.notes || "",
    } : {
      lead_id: "",
      qualification_score: 0,
      status: "new",
      notes: "",
    },
  })

  const isEdit = !!initialData?.id
  const title = isEdit ? "Edit Lead Qualification" : "Add New Lead Qualification"
  const action = isEdit ? "Save Changes" : "Add Qualification"

  const onSubmit = async (data: QualificationFormValues) => {
    try {
      setLoading(true);
      const qualificationData = {
        lead_id: data.lead_id,
        qualification_score: data.qualification_score,
        status: data.status,
        notes: data.notes,
      }

      let response;
      if (isEdit && initialData?.id) {
        // Update existing qualification
        response = await fetch(`/api/lead-qualifications/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(qualificationData),
        });
      } else {
        // Create new qualification
        response = await fetch('/api/lead-qualifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(qualificationData),
        });
      }

      // Handle non-OK responses
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Failed to save lead qualification';
        
        try {
          // Try to parse as JSON
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If not JSON, use the raw text if available
          if (text) {
            errorMessage = text;
          } else {
            errorMessage = `Server responded with status: ${response.status} ${response.statusText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      toast.success(isEdit ? 'Lead qualification updated successfully' : 'Lead qualification created successfully');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lead_id"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Lead ID *</FormLabel>
                <FormControl>
                  <Input placeholder="Lead UUID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="qualification_score"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Qualification Score</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100"
                    placeholder="0-100" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any notes about this lead qualification..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {action}
          </Button>
        </div>
      </form>
    </Form>
  )
}