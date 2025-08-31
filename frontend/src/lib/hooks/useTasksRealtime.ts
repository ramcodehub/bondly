"use client"

import { useEffect, useState, useCallback } from 'react'
import { Task, Priority } from '@/app/dashboard/tasks/types'
import realtimeManager from '@/lib/realtime'
import supabase from '@/lib/supabase-client'
import { notifications } from '@/lib/notifications'

interface TasksRealtimeState {
  tasks: Task[]
  loading: boolean
  error: string | null
  stats: {
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    urgentTasks: number
    priorityBreakdown: Record<Priority, number>
    statusBreakdown: Record<string, number>
    recentTasks: Task[]
    overdueTasks: Task[]
  }
}

export function useTasksRealtime() {
  const [state, setState] = useState<TasksRealtimeState>({
    tasks: [],
    loading: true,
    error: null,
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      urgentTasks: 0,
      priorityBreakdown: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      },
      statusBreakdown: {
        todo: 0,
        in_progress: 0,
        done: 0,
        cancelled: 0
      },
      recentTasks: [],
      overdueTasks: []
    }
  })

  // Transform Supabase data to Task interface
  const transformTask = useCallback((taskData: any): Task => {
    return {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.due_date || '',
      priority: taskData.priority as Priority,
      status: taskData.status,
      labels: taskData.tags || [],
      assignedTo: taskData.assigned_to ? [{ 
        id: taskData.assigned_to, 
        name: 'User', 
        avatar: '' 
      }] : [],
      createdAt: taskData.created_at || '',
      updatedAt: taskData.updated_at || '',
      deal_id: taskData.deal_id,
      lead_id: taskData.lead_id,
      contact_id: taskData.contact_id,
      account_id: taskData.account_id,
      created_by: taskData.created_by,
      estimated_hours: taskData.estimated_hours,
      actual_hours: taskData.actual_hours,
      notes: taskData.notes
    }
  }, [])

  // Calculate stats from tasks array
  const calculateStats = useCallback((tasks: Task[]) => {
    const now = new Date()
    
    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'done').length,
      pendingTasks: tasks.filter(task => task.status !== 'done' && task.status !== 'cancelled').length,
      urgentTasks: tasks.filter(task => task.priority === 'urgent' && task.status !== 'done').length,
      priorityBreakdown: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      } as Record<Priority, number>,
      statusBreakdown: {
        todo: 0,
        in_progress: 0,
        done: 0,
        cancelled: 0
      },
      recentTasks: tasks.slice(0, 5),
      overdueTasks: tasks.filter(task => {
        if (task.status === 'done' || !task.dueDate) return false
        const dueDate = new Date(task.dueDate)
        return dueDate < now
      })
    }

    // Calculate breakdowns
    tasks.forEach(task => {
      if (stats.priorityBreakdown[task.priority] !== undefined) {
        stats.priorityBreakdown[task.priority]++
      }
      if (stats.statusBreakdown[task.status] !== undefined) {
        stats.statusBreakdown[task.status]++
      }
    })

    return stats
  }, [])

  // Fetch initial tasks data
  const fetchTasks = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          deals(name, amount, stage),
          leads(first_name, last_name, email, company),
          contacts(name, email, phone),
          companies(name, industry)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const transformedTasks = (data || []).map(transformTask)
      const stats = calculateStats(transformedTasks)

      setState(prev => ({
        ...prev,
        tasks: transformedTasks,
        stats,
        loading: false,
        error: null
      }))

    } catch (error) {
      console.error('Error fetching tasks:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks'
      }))
    }
  }, [transformTask, calculateStats])

  // Optimistic update for creating task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticTask: Task = {
        id: tempId,
        title: taskData.title || '',
        description: taskData.description || '',
        dueDate: taskData.dueDate || '',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        labels: taskData.labels || [],
        assignedTo: taskData.assignedTo || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...taskData
      } as Task

      setState(prev => {
        const newTasks = [optimisticTask, ...prev.tasks]
        return {
          ...prev,
          tasks: newTasks,
          stats: calculateStats(newTasks)
        }
      })

      // Actual API call
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description || null,
          due_date: taskData.dueDate || null,
          priority: taskData.priority || 'medium',
          status: taskData.status || 'todo',
          deal_id: taskData.deal_id || null,
          lead_id: taskData.lead_id || null,
          contact_id: taskData.contact_id || null,
          account_id: taskData.account_id || null,
          assigned_to: taskData.assignedTo?.[0]?.id || null,
          estimated_hours: taskData.estimated_hours || null,
          tags: taskData.labels || null,
          notes: taskData.notes || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const result = await response.json()
      
      // Replace optimistic update with real data
      setState(prev => {
        const newTasks = prev.tasks.map(task => 
          task.id === tempId ? transformTask(result.data) : task
        )
        return {
          ...prev,
          tasks: newTasks,
          stats: calculateStats(newTasks)
        }
      })

      notifications.success('Task created successfully')
      return result.data

    } catch (error) {
      // Remove optimistic update on error
      setState(prev => {
        const newTasks = prev.tasks.filter(task => !task.id.startsWith('temp-'))
        return {
          ...prev,
          tasks: newTasks,
          stats: calculateStats(newTasks)
        }
      })
      
      notifications.error('Failed to create task')
      throw error
    }
  }, [transformTask, calculateStats])

  // Optimistic update for updating task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      // Optimistic update
      setState(prev => {
        const newTasks = prev.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
        return {
          ...prev,
          tasks: newTasks,
          stats: calculateStats(newTasks)
        }
      })

      // Actual API call
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updates.title,
          description: updates.description,
          due_date: updates.dueDate,
          priority: updates.priority,
          status: updates.status,
          deal_id: updates.deal_id,
          lead_id: updates.lead_id,
          contact_id: updates.contact_id,
          account_id: updates.account_id,
          assigned_to: updates.assignedTo?.[0]?.id,
          estimated_hours: updates.estimated_hours,
          actual_hours: updates.actual_hours,
          tags: updates.labels,
          notes: updates.notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const result = await response.json()
      
      // Update with real data
      setState(prev => {
        const newTasks = prev.tasks.map(task => 
          task.id === taskId ? transformTask(result.data) : task
        )
        return {
          ...prev,
          tasks: newTasks,
          stats: calculateStats(newTasks)
        }
      })

      notifications.success('Task updated successfully')
      return result.data

    } catch (error) {
      // Revert optimistic update on error
      fetchTasks()
      notifications.error('Failed to update task')
      throw error
    }
  }, [transformTask, calculateStats, fetchTasks])

  // Optimistic update for deleting task
  const deleteTask = useCallback(async (taskId: string) => {
    // Save current state for rollback
    let originalTasksState: Task[] = [];
    
    try {
      // Save current state for rollback
      originalTasksState = state.tasks;
      
      // Optimistic update
      setState(prev => {
        const newTasks = prev.tasks.filter(task => task.id !== taskId)
        return {
          ...prev,
          tasks: newTasks,
          stats: calculateStats(newTasks)
        }
      })

      // Actual API call
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      notifications.success('Task deleted successfully')

    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        tasks: originalTasksState,
        stats: calculateStats(originalTasksState)
      }))
      
      notifications.error('Failed to delete task')
      throw error
    }
  }, [state.tasks, calculateStats])

  // Toggle task status (common operation)
  const toggleTaskStatus = useCallback(async (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId)
    if (!task) return

    const newStatus = task.status === 'done' ? 'todo' : 'done'
    await updateTask(taskId, { status: newStatus })
  }, [state.tasks, updateTask])

  // Set up realtime subscription
  useEffect(() => {
    // Initial fetch
    fetchTasks()

    // Subscribe to realtime changes
    const unsubscribe = realtimeManager.subscribe({
      table: 'tasks',
      onChange: (event) => {
        console.log('Tasks realtime event:', event)
        
        if (event.eventType === 'INSERT') {
          const newTask = transformTask(event.new)
          setState(prev => {
            // Avoid duplicates from optimistic updates
            if (prev.tasks.find(task => task.id === newTask.id)) {
              return prev
            }
            const newTasks = [newTask, ...prev.tasks]
            return {
              ...prev,
              tasks: newTasks,
              stats: calculateStats(newTasks)
            }
          })
          notifications.info('New task added', {
            description: `${event.new.title} - ${event.new.priority} priority`
          })
        } else if (event.eventType === 'UPDATE') {
          const updatedTask = transformTask(event.new)
          setState(prev => {
            const newTasks = prev.tasks.map(task => 
              task.id === updatedTask.id ? updatedTask : task
            )
            return {
              ...prev,
              tasks: newTasks,
              stats: calculateStats(newTasks)
            }
          })
          notifications.info('Task updated', {
            description: `${event.new.title} - ${event.new.status}`
          })
        } else if (event.eventType === 'DELETE') {
          setState(prev => {
            const newTasks = prev.tasks.filter(task => task.id !== event.old.id)
            return {
              ...prev,
              tasks: newTasks,
              stats: calculateStats(newTasks)
            }
          })
          notifications.info('Task deleted', {
            description: event.old.title
          })
        }
      }
    })

    return unsubscribe
  }, [fetchTasks, transformTask, calculateStats])

  return {
    ...state,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  }
}