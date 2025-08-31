import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Contact, ContactStore, Status } from './types';

// Helper function to generate a unique ID
const generateId = () => uuidv4();

export const createContactStore = (set: any, get: any): ContactStore => ({
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filter: 'all',

  // Add a new contact
  addContact: (contact) => {
    const newContact: Contact = {
      ...contact,
      id: generateId(),
      status: contact.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state: ContactStore) => ({
      items: [...state.items, newContact],
    }));

    return newContact;
  },

  // Update an existing contact
  updateContact: (id, updates) => {
    set((state: ContactStore) => ({
      items: state.items.map((contact) =>
        contact.id === id
          ? { ...contact, ...updates, updatedAt: new Date().toISOString() }
          : contact
      ),
    }));
  },

  // Delete a contact
  deleteContact: (id) => {
    set((state: ContactStore) => ({
      items: state.items.filter((contact) => contact.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  // Set the currently selected contact
  setSelectedContact: (id) => {
    set({ selectedId: id });
  },

  // Get a contact by ID
  getContact: (id) => {
    return get().items.find((contact: Contact) => contact.id === id);
  },

  // Get contacts by status
  getContactsByStatus: (status: Status) => {
    return get().items.filter((contact: Contact) => contact.status === status);
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
  setFilter: (filter: 'all' | Status) => {
    set({ filter });
  },

  // Get filtered contacts
  getFilteredContacts: () => {
    const { items, filter } = get();
    if (filter === 'all') return items;
    return items.filter((contact: Contact) => contact.status === filter);
  },
});

// Create the contacts store with persistence
const useContactsStore = create<ContactStore>()(
  persist(
    (set, get) => ({
      ...createContactStore(set, get),
    }),
    {
      name: 'contacts-storage',
      partialize: (state) => ({
        items: state.items,
        selectedId: state.selectedId,
        filter: state.filter,
      }),
    }
  )
);

export default useContactsStore;
