import { create, type StateCreator, type StoreApi, type UseBoundStore } from 'zustand';
import { devtools, persist, type PersistStorage, type StorageValue } from 'zustand/middleware';

// Import store hooks
import useCompaniesStore from './use-companies-store';
import useContactsStore from './use-contacts-store';
import useDealsStore from './use-deals-store';
import { useTasksStore } from './use-tasks-store';
import { useRootStore } from './use-root-store';
import useInteractionsStore from './use-interactions-store';
import useTransactionsStore from './use-transactions-store';
import useServiceLifecycleStore from './use-service-lifecycle-store';
import { useChatAssistantStore } from './use-chat-assistant-store';

// Export store hooks
export { 
  useCompaniesStore,
  useContactsStore,
  useDealsStore,
  useTasksStore,
  useRootStore,
  useInteractionsStore,
  useTransactionsStore,
  useServiceLifecycleStore,
  useChatAssistantStore
};

// Export all types from types.ts
export type {
  // Common types
  Status,
  Priority,
  
  // Contact types
  Contact,
  
  // Company types
  Company,
  CompanySize,
  Industry,
  
  // Deal types
  Deal,
  DealStage,
  
  // Task types
  Task,
  TaskStatus,
  
  // Interaction types
  Interaction,
  
  // Transaction types
  Transaction,
  
  // Service Lifecycle types
  ServiceStage,
  
  // Store interfaces
  CompanyStore,
  ContactStore,
  DealsStore,
  TaskStore,
  InteractionStore,
  TransactionStore,
  ServiceLifecycleStore,
  
  // Root state
  RootState,
  
  // Helper types
  WithStoreProps
} from './types';

// Helper type for store with $reset
type StoreWithReset<T> = T & { $reset?: () => void }

// Storage configuration for persistence
const createStorage = <T>(): PersistStorage<T> => ({
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    const value = localStorage.getItem(name)
    return value ? JSON.parse(value) : null
  },
  setItem: (name: string, value: StorageValue<T>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, JSON.stringify(value))
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name)
    }
  },
})

// Helper function to reset all stores
export const resetAllStores = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
    window.location.reload()
  }
}

// Export store types
export type { StoreWithReset }

// Export storage configuration
export { createStorage }