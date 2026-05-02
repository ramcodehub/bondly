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
const listFormSchema = z.object({
  name: z.string().min(2, {
    message: "List name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  contact_count: z.number().min(0).default(0),
})

type ListFormValues = z.infer<typeof listFormSchema>

interface ListFormProps {
  initialData?: {
    id?: string
    name: string
    description?: string
    is_active: boolean
    contact_count: number
  } | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function ListForm({ 
  initialData, 
  onSuccess, 
  onCancel
}: ListFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ListFormValues>({
    resolver: zodResolver(listFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      is_active: true,
      contact_count: 0,
    },
  })

  const isEdit = !!initialData?.id
  const title = isEdit ? "Edit Contact List" : "Add New Contact List"
  const action = isEdit ? "Save Changes" : "Add List"

  const onSubmit = async (data: ListFormValues) => {
    try {
      setLoading(true);
      const listData = {
        name: data.name,
        description: data.description,
        is_active: data.is_active,
        contact_count: data.contact_count,
      }

      let response;
      if (isEdit && initialData?.id) {
        // Update existing list
        response = await fetch(`/api/contact-lists/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(listData),
        });
      } else {
        // Create new list
        response = await fetch('/api/contact-lists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(listData),
        });
      }

      // Handle non-OK responses
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Failed to save contact list';
        
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

      toast.success(isEdit ? 'Contact list updated successfully' : 'Contact list created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving contact list:', error);
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
                  <Input placeholder="VIP Customers" {...field} />
                </FormControl>
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
                  placeholder="Describe this contact list..." 
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