import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { createCompanyStore } from './use-companies-store';
import { createContactStore } from './use-contacts-store';
import { createDealsStore } from './use-deals-store';
import { createTasksStore } from './use-tasks-store';
import { createInteractionStore } from './use-interactions-store';
import { createTransactionStore } from './use-transactions-store';
import { createServiceLifecycleStore } from './use-service-lifecycle-store';
import type { RootState } from './types';

// Custom storage implementation for SSR compatibility
const createCustomStorage = (): StateStorage => {
  if (typeof window === 'undefined') {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
  
  return {
    getItem: (name: string) => {
      try {
        const value = localStorage.getItem(name);
        return Promise.resolve(value);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return Promise.resolve(null);
      }
    },
    setItem: (name: string, value: string) => {
      try {
        localStorage.setItem(name, value);
        return Promise.resolve();
      } catch (error) {
        console.error('Error setting localStorage:', error);
        return Promise.resolve();
      }
    },
    removeItem: (name: string) => {
      try {
        localStorage.removeItem(name);
        return Promise.resolve();
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return Promise.resolve();
      }
    },
  };
};

// Create the root store with all individual stores
export const useRootStore = create<RootState>()(
  persist(
    (set, get) => ({
      // Initialize all stores
      companies: createCompanyStore(set, get),
      contacts: createContactStore(set, get),
      deals: createDealsStore(set, get),
      tasks: createTasksStore(set, get),
      interactions: createInteractionStore(set, get),
      transactions: createTransactionStore(set, get),
      serviceLifecycle: createServiceLifecycleStore(set, get),
      
      // Reset all stores
      resetAll: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('root-storage');
          window.location.reload();
        }
      },
      
      // Hydrate stores from server data (useful for SSR/SSG)
      hydrate: (data: Partial<RootState>) => {
        set((state) => {
          const newState = { ...state };
          if (data.companies) {
            newState.companies = { ...state.companies, ...data.companies };
          }
          if (data.contacts) {
            newState.contacts = { ...state.contacts, ...data.contacts };
          }
          if (data.deals) {
            newState.deals = { ...state.deals, ...data.deals };
          }
          if (data.tasks) {
            newState.tasks = { ...state.tasks, ...data.tasks };
          }
          if (data.interactions) {
            newState.interactions = { ...state.interactions, ...data.interactions };
          }
          if (data.transactions) {
            newState.transactions = { ...state.transactions, ...data.transactions };
          }
          if (data.serviceLifecycle) {
            newState.serviceLifecycle = { ...state.serviceLifecycle, ...data.serviceLifecycle };
          }
          return newState;
        });
      },
    }),
    {
      name: 'root-storage',
      storage: createJSONStorage(createCustomStorage),
      partialize: (state: RootState) => ({
        companies: {
          items: state.companies.items,
          selectedId: state.companies.selectedId,
          filter: state.companies.filter,
        },
        contacts: {
          items: state.contacts.items,
          selectedId: state.contacts.selectedId,
          filter: state.contacts.filter,
        },
        deals: {
          items: state.deals.items,
          selectedId: state.deals.selectedId,
          currentStage: state.deals.currentStage,
          filter: state.deals.filter,
        },
        tasks: {
          items: state.tasks.items,
          selectedId: state.tasks.selectedId,
          filter: state.tasks.filter,
        },
        interactions: {
          items: state.interactions.items,
          selectedId: state.interactions.selectedId,
          filter: state.interactions.filter,
        },
        transactions: {
          items: state.transactions.items,
          selectedId: state.transactions.selectedId,
          filter: state.transactions.filter,
        },
        serviceLifecycle: {
          items: state.serviceLifecycle.items,
          selectedId: state.serviceLifecycle.selectedId,
          filter: state.serviceLifecycle.filter,
        },
      }),
      version: 1,
    }
  )
);

// Export individual store hooks for convenience
export const useCompanies = () => useRootStore((state) => state.companies);
export const useContacts = () => useRootStore((state) => state.contacts);
export const useDeals = () => useRootStore((state) => state.deals);
export const useTasks = () => useRootStore((state) => state.tasks);
export const useInteractions = () => useRootStore((state) => state.interactions);
export const useTransactions = () => useRootStore((state) => state.transactions);
export const useServiceLifecycle = () => useRootStore((state) => state.serviceLifecycle);

export type { RootState };