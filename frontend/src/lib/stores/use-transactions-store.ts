import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Status } from './types';

// Define Transaction types
export interface Transaction {
  id: string;
  company_id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

export interface TransactionStore {
  items: Transaction[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  filter: 'all' | string;
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'created_at'>>) => void;
  deleteTransaction: (id: string) => void;
  setSelectedTransaction: (id: string | null) => void;
  getTransaction: (id: string) => Transaction | undefined;
  getTransactionsByCompany: (companyId: string) => Transaction[];
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: 'all' | string) => void;
  getFilteredTransactions: () => Transaction[];
}

export const createTransactionStore = (set: any, get: any): TransactionStore => ({
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filter: 'all',

  // Add a new transaction
  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    set((state: TransactionStore) => ({
      items: [...state.items, newTransaction],
    }));

    return newTransaction;
  },

  // Update an existing transaction
  updateTransaction: (id, updates) => {
    set((state: TransactionStore) => ({
      items: state.items.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updates }
          : transaction
      ),
    }));
  },

  // Delete a transaction
  deleteTransaction: (id) => {
    set((state: TransactionStore) => ({
      items: state.items.filter((transaction) => transaction.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // Set the currently selected transaction
  setSelectedTransaction: (id) => {
    set({ selectedId: id });
  },

  // Get a transaction by ID
  getTransaction: (id) => {
    return get().items.find((transaction: Transaction) => transaction.id === id);
  },

  // Get transactions by company ID
  getTransactionsByCompany: (companyId) => {
    return get().items.filter((transaction: Transaction) => transaction.company_id === companyId);
  },

  // Set loading state
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // Set error state
  setError: (error: string | null) => {
    set({ error });
  },

  // Set filter
  setFilter: (filter: 'all' | string) => {
    set({ filter });
  },

  // Get filtered transactions
  getFilteredTransactions: () => {
    const { items, filter } = get();
    if (filter === 'all') return items;
    return items.filter((transaction: Transaction) => transaction.type === filter);
  },
});

// Create the transactions store with persistence
const useTransactionsStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      ...createTransactionStore(set, get),
    }),
    {
      name: 'transactions-storage',
      partialize: (state) => ({
        items: state.items,
        selectedId: state.selectedId,
        filter: state.filter,
      }),
    }
  )
);

export default useTransactionsStore;