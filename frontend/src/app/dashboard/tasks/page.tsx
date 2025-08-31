"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
const DataTable = dynamic(() => import("@/components/ui/data-table.client"), { ssr: false })
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasksRealtime } from "@/lib/hooks/useTasksRealtime"
import { TaskForm } from "./_components/task-form"
import { 
  ArrowUpDown, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flag, 
  MoreHorizontal, 
  Star, 
  Tag,
  Plus,
  Trash2,
  Pencil,
  AlertTriangle,
  TrendingUp,
  CheckSquare
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Task, Priority } from "./types"

// Define proper types for table functions
interface TableContext {
  getIsAllPageRowsSelected: () => boolean
  toggleAllPageRowsSelected: (value: boolean) => void
}

interface RowContext {
  getIsSelected: () => boolean
  toggleSelected: (value: boolean) => void
  original: Task
}

interface ColumnContext {
  toggleSorting: (asc: boolean) => void
  getIsSorted: () => string | false
}

type ColumnDef<T> = {
  id?: string
  accessorKey?: keyof T
  header: string | ((props: { table?: TableContext; column?: ColumnContext }) => React.ReactNode)
  cell?: (props: { row: RowContext }) => React.ReactNode
  enableSorting?: boolean
  enableHiding?: boolean
}

export default function TasksPage() {
  // Use realtime hook instead of manual state management
  const { 
    tasks, 
    loading, 
    error, 
    stats, 
    createTask, 
    updateTask, 
    deleteTask,
    toggleTaskStatus 
  } = useTasksRealtime()
  
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)

  // expose to column cell handlers
  ;(globalThis as any).setRows = (updateFn: any) => {
    // This is handled by the realtime hook now
  }

  const handleTaskSubmit = async (taskData: Task) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData)
      } else {
        await createTask(taskData)
      }
      setShowTaskForm(false)
      setEditingTask(undefined)
    } catch (error) {
      console.error('Error submitting task:', error)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    const ok = confirm('Are you sure you want to delete this task?')
    if (!ok) return
    
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }: { table?: TableContext }) => (
        <Checkbox
          checked={table?.getIsAllPageRowsSelected() || false}
          onCheckedChange={(value: boolean) => table?.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: RowContext }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }: { column?: ColumnContext }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column?.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Task
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }: { row: RowContext }) => {
        const task = row.original
        const isCompleted = task.status === "done"
        
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={async () => {
                await toggleTaskStatus(task.id)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {task.description}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }: { row: RowContext }) => {
        const date = new Date(row.original.dueDate)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        const isOverdue = date < today && row.original.status !== "done"
        
        let displayDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        let icon = null
        
        if (date.toDateString() === today.toDateString()) {
          displayDate = 'Today'
          icon = <Star className="h-4 w-4 mr-1 text-amber-500" />
        } else if (date.toDateString() === tomorrow.toDateString()) {
          displayDate = 'Tomorrow'
          icon = <Clock className="h-4 w-4 mr-1 text-blue-500" />
        } else if (date.getTime() > today.getTime() && date.getTime() < today.getTime() + 7 * 24 * 60 * 60 * 1000) {
          displayDate = date.toLocaleDateString(undefined, { weekday: 'long' }) // Day name
        }
        
        return (
          <div className={`flex items-center ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
            {icon}
            <span>{displayDate}</span>
            {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
          </div>
        )
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }: { row: RowContext }) => {
        const priority = row.original.priority
        const priorityMap: Record<Priority, { label: string; color: string }> = {
          low: { label: "Low", color: "bg-gray-200 text-gray-800" },
          medium: { label: "Medium", color: "bg-blue-100 text-blue-800" },
          high: { label: "High", color: "bg-amber-100 text-amber-800" },
          urgent: { label: "Urgent", color: "bg-red-100 text-red-800" },
        }
        
        const priorityInfo = priorityMap[priority as Priority] || priorityMap.low
        
        return (
          <Badge variant="outline" className={`${priorityInfo.color} border-0`}>
            {priorityInfo.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }: { row: RowContext }) => {
        const assignedTo = row.original.assignedTo
        
        if (!assignedTo.length) {
          return <span className="text-muted-foreground">Unassigned</span>
        }
        
        return (
          <div className="flex -space-x-2">
            {assignedTo.map((user: any) => (
              <div
                key={user.id}
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background"
                title={user.name}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <span className="text-xs font-medium">
                    {user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: RowContext }) => {
        const task = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditTask(task)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit task
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate task</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and track your progress
          </p>
        </div>
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Real-time Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              All tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.urgentTasks}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading tasks: {error}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false)
          setEditingTask(undefined)
        }}
        onSubmit={handleTaskSubmit}
      />
      
      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={tasks}
          searchKey="title"
        />
      </div>
      
      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">Loading tasks...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
