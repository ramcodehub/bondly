"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ExternalLink } from "lucide-react"
import { TaskForm } from "../tasks/_components/task-form"
import { Task } from "../tasks/types"
import Link from "next/link"

interface TaskModalProps {
  onCreateTask: (task: Task) => void
}

export function TaskModal({ onCreateTask }: TaskModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCreateTask = (task: Task) => {
    onCreateTask(task)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Create New Task</DialogTitle>
            <Link href="/dashboard/tasks" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Full Page
            </Link>
          </div>
        </DialogHeader>
        <div className="p-6 pt-0">
          <TaskForm 
            isOpen={true}
            onClose={() => setIsOpen(false)}
            onSubmit={handleCreateTask}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}