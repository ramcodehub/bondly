import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Deal, DealsStore, DealStage } from './types';

// Helper function to generate a unique ID
const generateId = () => uuidv4();

export const createDealsStore = (set: any, get: any): DealsStore => ({
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filter: 'all',
  currentStage: 'prospect',

  // Add a new deal
  addDeal: (deal) => {
    const newDeal: Deal = {
      ...deal,
      id: generateId(),
      status: 'active',
      probability: deal.probability ?? 0, // Use nullish coalescing to handle undefined
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state: DealsStore) => ({
      items: [...state.items, newDeal],
    }));

    return newDeal;
  },

  // Update an existing deal
  updateDeal: (id, updates) => {
    set((state: DealsStore) => ({
      items: state.items.map((deal) =>
        deal.id === id
          ? { ...deal, ...updates, updatedAt: new Date().toISOString() }
          : deal
      ),
    }));
  },

  // Delete a deal
  deleteDeal: (id) => {
    set((state: DealsStore) => ({
      items: state.items.filter((deal) => deal.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // Set the currently selected deal
  setSelectedDeal: (id) => {
    set({ selectedId: id });
  },

  // Update deal stage
  updateDealStage: (id, stage) => {
    set((state: DealsStore) => ({
      items: state.items.map((deal) =>
        deal.id === id
          ? { ...deal, stage, updatedAt: new Date().toISOString() }
          : deal
      ),
    }));
  },

  // Set current stage filter
  setCurrentStage: (stage: DealStage) => {
    set({ currentStage: stage });
  },

  // Get a deal by ID
  getDeal: (id) => {
    return get().items.find((deal: Deal) => deal.id === id);
  },

  // Get deals by stage
  getDealsByStage: (stage: DealStage) => {
    return get().items.filter((deal: Deal) => deal.stage === stage);
  },

  // Get total value of all deals
  getTotalValue: () => {
    return get().items.reduce(
      (total: number, deal: Deal) => total + (deal.amount || 0),
      0
    );
  },

  // Get total value by stage
  getTotalValueByStage: (stage: DealStage) => {
    return get()
      .items.filter((deal: Deal) => deal.stage === stage)
      .reduce((total: number, deal: Deal) => total + (deal.amount || 0), 0);
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
  setFilter: (filter: 'all' | DealStage) => {
    set({ filter });
  },

  // Get filtered deals
  getFilteredDeals: () => {
    const { items, filter } = get();
    if (filter === 'all') return items;
    return items.filter((deal: Deal) => deal.stage === filter);
  },
});

// Create the deals store with persistence
const useDealsStore = create<DealsStore>()(
  persist(
    (set, get) => ({
      ...createDealsStore(set, get),
    }),
    {
      name: 'deals-storage',
      partialize: (state) => ({
        items: state.items,
        selectedId: state.selectedId,
        currentStage: state.currentStage,
        filter: state.filter,
      }),
    }
  )
);

export default useDealsStore;
