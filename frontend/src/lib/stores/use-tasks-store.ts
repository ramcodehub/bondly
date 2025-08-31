import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus, TaskStore, Priority } from './types';

const createTasksStore = (set: any, get: any): TaskStore => ({
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filter: 'all',

  // Add a new task
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      status: task.status ?? 'not_started', // Use provided status or default to 'not_started'
      priority: task.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state: TaskStore) => ({
      items: [...state.items, newTask],
    }));

    return newTask;
  },

  // Update an existing task
  updateTask: (id, updates) => {
    set((state: TaskStore) => ({
      items: state.items.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },

  // Delete a task
  deleteTask: (id) => {
    set((state: TaskStore) => ({
      items: state.items.filter((task) => task.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // Toggle task status
  toggleTaskStatus: (id) => {
    set((state: TaskStore) => ({
      items: state.items.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === 'completed' ? 'not_started' : 'completed',
              updatedAt: new Date().toISOString(),
              completedAt: task.status === 'completed' ? undefined : new Date().toISOString(),
            }
          : task
      ),
    }));
  },

  // Set the currently selected task
  setSelectedTask: (id) => {
    set({ selectedId: id });
  },

  // Get a task by ID
  getTask: (id) => {
    return get().items.find((task: Task) => task.id === id);
  },

  // Get tasks by status
  getTasksByStatus: (status: TaskStatus) => {
    return get().items.filter((task: Task) => task.status === status);
  },

  // Get tasks by priority
  getTasksByPriority: (priority: Priority) => {
    return get().items.filter((task: Task) => task.priority === priority);
  },

  // Set the current filter
  setFilter: (filter: 'all' | TaskStatus) => {
    set({ filter });
  },

  // Get filtered tasks based on current filter
  getFilteredTasks: () => {
    const { items, filter } = get();
    if (filter === 'all') return items;
    return items.filter((task: Task) => task.status === filter);
  },

  // Set loading state
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // Set error state
  setError: (error: string | null) => {
    set({ error });
  },
});

// Create the tasks store with persistence
export const useTasksStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      ...createTasksStore(set, get),
    }),
    {
      name: 'tasks-storage',
      partialize: (state) => ({
        items: state.items,
        selectedId: state.selectedId,
        filter: state.filter,
      }),
    }
  )
);

export { createTasksStore };
export * from './types';
