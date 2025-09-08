"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Edit2, Plus, Loader2 } from "lucide-react"
import { useContactsRealtime } from "@/lib/hooks/useContactsRealtime"

const DataTable = dynamic(() => import("@/components/ui/data-table.client"), { ssr: false })
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContactForm } from "@/components/contact-form"
import { cn } from "@/lib/utils"

export default function ContactsPage() {
  const { contacts, loading, error, fetchContacts } = useContactsRealtime()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (error) {
      toast.error('Failed to load contacts', {
        description: error
      })
    }
  }, [error])

  const handleAddContact = () => {
    setIsAddDialogOpen(true)
  }

  const handleEditContact = (contact: any) => {
    setEditingContact(contact)
  }

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false)
    setEditingContact(null)
  }

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "company_name",
      header: "Company",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status
        return (
          <Badge
            variant={status === "active" ? "default" : "outline"}
            className={cn(
              "capitalize",
              status === "active" && "bg-green-100 text-green-800",
              status === "inactive" && "bg-gray-100 text-gray-800",
              status === "pending" && "bg-blue-100 text-blue-800"
            )}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }: { row: any }) => {
        return row.original.created_at 
          ? new Date(row.original.created_at).toLocaleDateString()
          : 'N/A'
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditContact(row.original)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contacts and their information
          </p>
        </div>
        <Button onClick={handleAddContact}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={contacts}
              searchKey="name"
              filterOptions={[
                {
                  label: "Status",
                  value: "status",
                  options: [
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                    { label: "Pending", value: "pending" }
                  ]
                }
              ]}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSuccess={handleFormSuccess}
            onCancel={() => setIsAddDialogOpen(false)}
            isOpen={isAddDialogOpen}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={!!editingContact} onOpenChange={(open) => !open && setEditingContact(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <ContactForm
              initialData={editingContact}
              onSuccess={handleFormSuccess}
              onCancel={() => setEditingContact(null)}
              isOpen={!!editingContact}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}