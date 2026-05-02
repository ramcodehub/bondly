"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { ListForm } from "./list-form"

interface ListModalProps {
  onCreateList: () => void
}

export function ListModal({ onCreateList }: ListModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCreateList = () => {
    onCreateList()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Create New Contact List</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <ListForm 
            onSuccess={handleCreateList}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}