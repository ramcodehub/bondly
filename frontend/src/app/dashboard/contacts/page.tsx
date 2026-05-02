"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Filter, Search, Loader2 } from "lucide-react"
import { useContactsRealtime } from "@/lib/hooks/useContactsRealtime"
import { useState } from "react"
import { ContactList } from "@/components/contact-list"
import { RecentContacts } from "@/components/recent-contacts"
import { ContactModal } from "@/app/dashboard/components/contact-modal"

export default function ContactsPage() {
  const { contacts, loading, error, fetchContacts } = useContactsRealtime()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    (contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.company_name && contact.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h3 className="font-medium text-destructive">Error loading contacts</h3>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contact database
          </p>
        </div>
        <ContactModal onCreateContact={fetchContacts} />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search contacts..."
            className="w-full rounded-lg bg-background pl-8 py-2 text-sm border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact List</CardTitle>
              <CardDescription>
                Your complete contact database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactList 
                contacts={filteredContacts} 
                onContactSelect={(contact) => console.log("Selected contact:", contact)}
                onContactEdit={(contact) => console.log("Edit contact:", contact)}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <RecentContacts />
        </div>
      </div>
    </div>
  )
}