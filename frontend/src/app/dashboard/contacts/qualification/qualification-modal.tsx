"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { QualificationForm } from "./qualification-form"

interface QualificationModalProps {
  onCreateQualification: () => void
}

export function QualificationModal({ onCreateQualification }: QualificationModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCreateQualification = () => {
    onCreateQualification()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Qualification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Create New Lead Qualification</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <QualificationForm 
            onSuccess={handleCreateQualification}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}