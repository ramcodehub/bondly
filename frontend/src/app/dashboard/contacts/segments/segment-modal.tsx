"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { SegmentForm } from "./segment-form"

interface SegmentModalProps {
  onCreateSegment: () => void
}

export function SegmentModal({ onCreateSegment }: SegmentModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCreateSegment = () => {
    onCreateSegment()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Create New Contact Segment</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <SegmentForm 
            onSuccess={handleCreateSegment}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}