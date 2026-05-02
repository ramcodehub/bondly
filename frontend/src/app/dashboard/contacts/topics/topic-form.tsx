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
const topicFormSchema = z.object({
  name: z.string().min(2, {
    message: "Topic name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.string().optional(),
  conversation_count: z.number().min(0).default(0),
  is_trending: z.boolean().default(false),
  status: z.enum(["active", "inactive", "archived"], {
    required_error: "Please select a status.",
  }),
})

type TopicFormValues = z.infer<typeof topicFormSchema>

interface TopicFormProps {
  initialData?: {
    id?: string
    name: string
    description?: string
    category?: string
    conversation_count: number
    is_trending: boolean
    status: "active" | "inactive" | "archived"
  } | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function TopicForm({ 
  initialData, 
  onSuccess, 
  onCancel
}: TopicFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || "",
      category: initialData.category || "",
      conversation_count: initialData.conversation_count,
      is_trending: initialData.is_trending,
      status: initialData.status,
    } : {
      name: "",
      description: "",
      category: "",
      conversation_count: 0,
      is_trending: false,
      status: "active",
    },
  })

  const isEdit = !!initialData?.id
  const title = isEdit ? "Edit Contact Topic" : "Add New Contact Topic"
  const action = isEdit ? "Save Changes" : "Add Topic"

  const onSubmit = async (data: TopicFormValues) => {
    try {
      setLoading(true);
      const topicData = {
        name: data.name,
        description: data.description,
        category: data.category,
        conversation_count: data.conversation_count,
        is_trending: data.is_trending,
        status: data.status,
      }

      let response;
      if (isEdit && initialData?.id) {
        // Update existing topic
        response = await fetch(`/api/contact-topics/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(topicData),
        });
      } else {
        // Create new topic
        response = await fetch('/api/contact-topics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(topicData),
        });
      }

      // Handle non-OK responses
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Failed to save contact topic';
        
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

      toast.success(isEdit ? 'Contact topic updated successfully' : 'Contact topic created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving contact topic:', error);
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
                  <Input placeholder="Product Feedback" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Product" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="conversation_count"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Conversation Count</FormLabel>
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
            name="status"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="is_trending"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Trending Topic
                  </FormLabel>
                </div>
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
                  placeholder="Describe this contact topic..." 
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