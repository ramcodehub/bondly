"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { TopicForm } from "./topic-form"

interface TopicModalProps {
  onCreateTopic: () => void
}

export function TopicModal({ onCreateTopic }: TopicModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCreateTopic = () => {
    onCreateTopic()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Create New Contact Topic</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <TopicForm 
            onSuccess={handleCreateTopic}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}