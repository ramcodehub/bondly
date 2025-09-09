"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

// Define the form schema using zod
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional(),
  phone: z.string().optional(),
  image_url: z.string().optional(),
  company_name: z.string().optional(),
  company_id: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"], {
    required_error: "Please select a status.",
  }),
  lastContact: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

interface ContactFormProps {
  initialData?: {
    id?: string
    name: string
    role?: string
    email?: string
    phone?: string
    image_url?: string
    company_name?: string
    company_id?: string
    status: "active" | "inactive" | "pending"
    lastContact?: string
  } | null
  onSuccess?: () => void
  onCancel?: () => void
  isOpen?: boolean
}

export function ContactForm({ 
  initialData, 
  onSuccess, 
  onCancel,
  isOpen = false 
}: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: initialData || {
      name: "",
      role: "",
      email: "",
      phone: "",
      image_url: "",
      company_name: "",
      company_id: "",
      status: "pending" as const,
      lastContact: new Date().toISOString().split('T')[0],
    },
  })

  const isEdit = !!initialData?.id
  const title = isEdit ? "Edit Contact" : "Add New Contact"
  const action = isEdit ? "Save Changes" : "Add Contact"

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setLoading(true);
      const contactData = {
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
        image_url: data.image_url,
        company_name: data.company_name,
        company_id: data.company_id,
        lastContact: data.lastContact,
        status: data.status,
      }

      let response;
      if (isEdit && initialData?.id) {
        // Update existing contact
        response = await fetch(`/api/contacts/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            role: data.role,
            email: data.email,
            phone: data.phone,
            image_url: data.image_url,
            company_name: data.company_name,
            company_id: data.company_id,
            lastContact: data.lastContact,
            status: data.status,
          }),
        });
      } else {
        // Create new contact
        response = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            role: data.role,
            email: data.email,
            phone: data.phone,
            image_url: data.image_url,
            company_name: data.company_name,
            company_id: data.company_id,
            lastContact: data.lastContact,
            status: data.status,
          }),
        });
      }

      // Handle non-OK responses
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Failed to save contact';
        
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

      // Parse successful response
      let result;
      const responseText = await response.text();
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        // If response is not JSON but request was successful, continue with empty result
        result = {};
      }

      toast.success(isEdit ? 'Contact updated successfully' : 'Contact created successfully');
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error('Error saving contact:', error);
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
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastContact"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Last Contact</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company_id"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Company ID</FormLabel>
                <FormControl>
                  <Input placeholder="Company UUID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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