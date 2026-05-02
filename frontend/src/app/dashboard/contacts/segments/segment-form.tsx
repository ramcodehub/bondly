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
const segmentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Segment name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  segment_type: z.enum(["demographics", "behavior", "engagement", "custom"], {
    required_error: "Please select a segment type.",
  }),
  is_active: z.boolean().default(true),
  contact_count: z.number().min(0).default(0),
})

type SegmentFormValues = z.infer<typeof segmentFormSchema>

interface SegmentFormProps {
  initialData?: {
    id?: string
    name: string
    description?: string
    segment_type: "demographics" | "behavior" | "engagement" | "custom"
    is_active: boolean
    contact_count: number
  } | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function SegmentForm({ 
  initialData, 
  onSuccess, 
  onCancel
}: SegmentFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<SegmentFormValues>({
    resolver: zodResolver(segmentFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || "",
      segment_type: initialData.segment_type,
      is_active: initialData.is_active,
      contact_count: initialData.contact_count,
    } : {
      name: "",
      description: "",
      segment_type: "custom",
      is_active: true,
      contact_count: 0,
    },
  })

  const isEdit = !!initialData?.id
  const title = isEdit ? "Edit Contact Segment" : "Add New Contact Segment"
  const action = isEdit ? "Save Changes" : "Add Segment"

  const onSubmit = async (data: SegmentFormValues) => {
    try {
      setLoading(true);
      const segmentData = {
        name: data.name,
        description: data.description,
        segment_type: data.segment_type,
        is_active: data.is_active,
        contact_count: data.contact_count,
      }

      let response;
      if (isEdit && initialData?.id) {
        // Update existing segment
        response = await fetch(`/api/contact-segments/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(segmentData),
        });
      } else {
        // Create new segment
        response = await fetch('/api/contact-segments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(segmentData),
        });
      }

      // Handle non-OK responses
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Failed to save contact segment';
        
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

      toast.success(isEdit ? 'Contact segment updated successfully' : 'Contact segment created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving contact segment:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
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
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Age 18-30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="segment_type"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Segment Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="demographics">Demographics</SelectItem>
                    <SelectItem value="behavior">Behavior</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact_count"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Contact Count</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="0" 
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
            name="is_active"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe this contact segment..." 
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