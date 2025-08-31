import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Company, CompanyStore, Industry } from './types';

// Helper function to generate a unique ID
const generateId = () => uuidv4();

export const createCompanyStore = (set: any, get: any): CompanyStore => ({
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filter: 'all',

  // Add a new company
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCompany: Company = {
      ...company,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state: CompanyStore) => ({
      items: [...state.items, newCompany],
    }));

    return newCompany;
  },

  // Update an existing company
  updateCompany: (id: string, updates: Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>) => {
    set((state: CompanyStore) => ({
      items: state.items.map((company: Company) =>
        company.id === id
          ? { ...company, ...updates, updatedAt: new Date().toISOString() }
          : company
      ),
    }));
  },

  // Delete a company
  deleteCompany: (id: string) => {
    set((state: CompanyStore) => ({
      items: state.items.filter((company: Company) => company.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // Set the currently selected company
  setSelectedCompany: (id: string | null) => {
    set({ selectedId: id });
  },

  // Get a company by ID
  getCompany: (id: string) => {
    return get().items.find((company: Company) => company.id === id);
  },

  // Get companies by industry
  getCompaniesByIndustry: (industry: Industry) => {
    return get().items.filter((company: Company) => company.industry === industry);
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
  setFilter: (filter: 'all' | Industry) => {
    set({ filter });
  },

  // Get filtered companies
  getFilteredCompanies: () => {
    const { items, filter } = get();
    if (filter === 'all') return items;
    return items.filter((company: Company) => company.industry === filter);
  },
});

// Create the companies store with persistence
const useCompaniesStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      ...createCompanyStore(set, get),
    }),
    {
      name: 'companies-storage',
      partialize: (state) => ({
        items: state.items,
        selectedId: state.selectedId,
        filter: state.filter,
      }),
    }
  )
);

export default useCompaniesStore;
