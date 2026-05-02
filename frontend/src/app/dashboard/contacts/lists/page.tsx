"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Filter, Search } from "lucide-react"
import { useContactLists } from "@/lib/hooks/useContactLists"
import { useState, useMemo } from "react"
import { ListModal } from "./list-modal"

export default function ContactListsPage() {
  const { lists, loading, error, fetchLists } = useContactLists()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter lists based on search term
  const filteredLists = useMemo(() => {
    if (!searchTerm) return lists
    return lists.filter(list => 
      list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [lists, searchTerm])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Contact Lists</h1>
            <p className="text-muted-foreground">
              Manage your contact lists and segments
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create List
          </Button>
        </div>
        <div>Loading lists...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Contact Lists</h1>
            <p className="text-muted-foreground">
              Manage your contact lists and segments
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create List
          </Button>
        </div>
        <div className="text-red-500">Error loading lists: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Lists</h1>
          <p className="text-muted-foreground">
            Manage your contact lists and segments
          </p>
        </div>
        <ListModal onCreateList={fetchLists} />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search lists..."
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

      {filteredLists.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No contact lists found.</p>
          <ListModal onCreateList={fetchLists} />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {list.name}
                </CardTitle>
                <CardDescription>
                  {list.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{list.contact_count || 0}</span>
                  <Badge variant={list.is_active ? "secondary" : "destructive"}>
                    {list.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Contacts
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}