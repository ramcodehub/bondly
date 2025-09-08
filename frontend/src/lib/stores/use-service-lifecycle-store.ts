import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define Service Lifecycle types
export interface ServiceStage {
  id: string;
  company_id: string;
  stage: string; // onboarding, engagement, retention, advocacy
  details: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceLifecycleStore {
  items: ServiceStage[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  filter: 'all' | string;
  
  // Actions
  addServiceStage: (stage: Omit<ServiceStage, 'id' | 'created_at' | 'updated_at'>) => ServiceStage;
  updateServiceStage: (id: string, updates: Partial<Omit<ServiceStage, 'id' | 'created_at' | 'updated_at'>>) => void;
  deleteServiceStage: (id: string) => void;
  setSelectedServiceStage: (id: string | null) => void;
  getServiceStage: (id: string) => ServiceStage | undefined;
  getServiceStagesByCompany: (companyId: string) => ServiceStage[];
  getServiceStageByType: (companyId: string, stageType: string) => ServiceStage | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: 'all' | string) => void;
  getFilteredServiceStages: () => ServiceStage[];
}

export const createServiceLifecycleStore = (set: any, get: any): ServiceLifecycleStore => ({
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filter: 'all',

  // Add a new service stage
  addServiceStage: (stage) => {
    const newStage: ServiceStage = {
      ...stage,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set((state: ServiceLifecycleStore) => ({
      items: [...state.items, newStage],
    }));

    return newStage;
  },

  // Update an existing service stage
  updateServiceStage: (id, updates) => {
    const now = new Date().toISOString();
    set((state: ServiceLifecycleStore) => ({
      items: state.items.map((stage) =>
        stage.id === id
          ? { ...stage, ...updates, updated_at: updates.details ? now : stage.updated_at }
          : stage
      ),
    }));
  },

  // Delete a service stage
  deleteServiceStage: (id) => {
    set((state: ServiceLifecycleStore) => ({
      items: state.items.filter((stage) => stage.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // Set the currently selected service stage
  setSelectedServiceStage: (id) => {
    set({ selectedId: id });
  },

  // Get a service stage by ID
  getServiceStage: (id) => {
    return get().items.find((stage: ServiceStage) => stage.id === id);
  },

  // Get service stages by company ID
  getServiceStagesByCompany: (companyId) => {
    return get().items.filter((stage: ServiceStage) => stage.company_id === companyId);
  },

  // Get a specific service stage type for a company
  getServiceStageByType: (companyId, stageType) => {
    return get().items.find((stage: ServiceStage) => 
      stage.company_id === companyId && stage.stage === stageType
    );
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

  // Get filtered service stages
  getFilteredServiceStages: () => {
    const { items, filter } = get();
    if (filter === 'all') return items;
    return items.filter((stage: ServiceStage) => stage.stage === filter);
  },
});

// Create the service lifecycle store with persistence
const useServiceLifecycleStore = create<ServiceLifecycleStore>()(
  persist(
    (set, get) => ({
      ...createServiceLifecycleStore(set, get),
    }),
    {
      name: 'service-lifecycle-storage',
      partialize: (state) => ({
        items: state.items,
        selectedId: state.selectedId,
        filter: state.filter,
      }),
    }
  )
);

export default useServiceLifecycleStore;