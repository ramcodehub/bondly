import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Status } from './types';

// Define Interaction types
export interface Interaction {
  id: string;
  contact_id: number;
  type: string;
  description: string;
  created_at: string;
  created_by: string;
}

export interface InteractionStore {
  items: Interaction[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  filter: 'all' | string;
  
  // Actions
  addInteraction: (interaction: Omit<Interaction, 'id' | 'created_at' | 'created_by'> & { created_by?: string }) => Interaction;
  updateInteraction: (id: string, updates: Partial<Omit<Interaction, 'id' | 'created_at' | 'created_by'>>) => void;
  deleteInteraction: (id: string) => void;
  setSelectedInteraction: (id: string | null) => void;
  getInteraction: (id: string) => Interaction | undefined;
  getInteractionsByContact: (contactId: number) => Interaction[];
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: 'all' | string) => void;
  getFilteredInteractions: () => Interaction[];
}

export const createInteractionStore = (set: any, get: any): InteractionStore => ({
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filter: 'all',

  // Add a new interaction
  addInteraction: (interaction) => {
    const newInteraction: Interaction = {
      ...interaction,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      created_by: interaction.created_by || 'current_user_id', // This should be replaced with actual user ID
    };

    set((state: InteractionStore) => ({
      items: [...state.items, newInteraction],
    }));

    return newInteraction;
  },

  // Update an existing interaction
  updateInteraction: (id, updates) => {
    set((state: InteractionStore) => ({
      items: state.items.map((interaction) =>
        interaction.id === id
          ? { ...interaction, ...updates, updated_at: new Date().toISOString() }
          : interaction
      ),
    }));
  },

  // Delete an interaction
  deleteInteraction: (id) => {
    set((state: InteractionStore) => ({
      items: state.items.filter((interaction) => interaction.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // Set the currently selected interaction
  setSelectedInteraction: (id) => {
    set({ selectedId: id });
  },

  // Get an interaction by ID
  getInteraction: (id) => {
    return get().items.find((interaction: Interaction) => interaction.id === id);
  },

  // Get interactions by contact ID
  getInteractionsByContact: (contactId) => {
    return get().items.filter((interaction: Interaction) => interaction.contact_id === contactId);
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

  // Get filtered interactions
  getFilteredInteractions: () => {
    const { items, filter } = get();
    if (filter === 'all') return items;
    return items.filter((interaction: Interaction) => interaction.type === filter);
  },
});

// Create the interactions store with persistence
const useInteractionsStore = create<InteractionStore>()(
  persist(
    (set, get) => ({
      ...createInteractionStore(set, get),
    }),
    {
      name: 'interactions-storage',
      partialize: (state) => ({
        items: state.items,
        selectedId: state.selectedId,
        filter: state.filter,
      }),
    }
  )
);

export default useInteractionsStore;