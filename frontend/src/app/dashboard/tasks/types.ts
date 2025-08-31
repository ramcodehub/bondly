export type Priority = "low" | "medium" | "high" | "urgent"
export type Status = "todo" | "in_progress" | "done" | "cancelled"

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  due_date?: string
  priority: Priority
  status: Status
  labels: string[]
  tags?: string[]
  assignedTo: {
    id: string
    name: string
    avatar: string
  }[]
  assigned_to?: string
  createdAt: string
  updatedAt: string
  created_at?: string
  updated_at?: string
  completed_at?: string
  deal_id?: string
  lead_id?: string
  contact_id?: string
  account_id?: string
  created_by?: string
  estimated_hours?: number
  actual_hours?: number
  notes?: string
}
