import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LeadNurturingAction } from '@/app/dashboard/leads/types';

interface LeadNurturingState {
  nurturingActions: Record<string, LeadNurturingAction[]>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  fetchNurturingActions: (leadId: string) => Promise<void>;
  addNurturingAction: (leadId: string, action: Omit<LeadNurturingAction, 'id' | 'lead_id'>) => Promise<void>;
  updateNurturingAction: (actionId: number, updates: Partial<LeadNurturingAction>) => Promise<void>;
  getNurturingActions: (leadId: string) => LeadNurturingAction[];
  isLoading: (leadId: string) => boolean;
  getError: (leadId: string) => string | null;
}

export const useLeadNurturingStore = create<LeadNurturingState>()(
  persist(
    (set, get) => ({
      nurturingActions: {},
      loading: {},
      error: {},

      fetchNurturingActions: async (leadId: string) => {
        try {
          set(state => ({
            loading: { ...state.loading, [leadId]: true },
            error: { ...state.error, [leadId]: null }
          }));

          const response = await fetch(`/api/extended/leads/${leadId}/nurturing`);
          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch nurturing actions');
          }

          set(state => ({
            nurturingActions: {
              ...state.nurturingActions,
              [leadId]: result.data
            },
            loading: { ...state.loading, [leadId]: false }
          }));
        } catch (error: unknown) {
          const err = error as Error;
          console.error('Error fetching nurturing actions:', err);
          set(state => ({
            error: { ...state.error, [leadId]: err.message || 'Failed to fetch nurturing actions' },
            loading: { ...state.loading, [leadId]: false }
          }));
        }
      },

      addNurturingAction: async (leadId: string, action) => {
        try {
          set(state => ({
            loading: { ...state.loading, [leadId]: true },
            error: { ...state.error, [leadId]: null }
          }));

          const response = await fetch(`/api/extended/leads/${leadId}/nurturing`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(action),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || 'Failed to add nurturing action');
          }

          // Update the store with the new action
          set(state => ({
            nurturingActions: {
              ...state.nurturingActions,
              [leadId]: [result.data, ...(state.nurturingActions[leadId] || [])]
            },
            loading: { ...state.loading, [leadId]: false }
          }));
        } catch (error: unknown) {
          const err = error as Error;
          console.error('Error adding nurturing action:', err);
          set(state => ({
            error: { ...state.error, [leadId]: err.message || 'Failed to add nurturing action' },
            loading: { ...state.loading, [leadId]: false }
          }));
        }
      },

      updateNurturingAction: async (actionId: number, updates: Partial<LeadNurturingAction>) => {
        try {
          // Find which lead this action belongs to
          const state = get();
          let leadId = '';
          for (const [id, actions] of Object.entries(state.nurturingActions)) {
            if (actions.some(action => action.id === actionId)) {
              leadId = id;
              break;
            }
          }

          if (!leadId) {
            throw new Error('Lead not found for this action');
          }

          set(state => ({
            loading: { ...state.loading, [leadId]: true },
            error: { ...state.error, [leadId]: null }
          }));

          const response = await fetch(`/api/extended/leads/nurturing/${actionId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || 'Failed to update nurturing action');
          }

          // Update the store with the updated action
          set(state => ({
            nurturingActions: {
              ...state.nurturingActions,
              [leadId]: state.nurturingActions[leadId].map(action =>
                action.id === actionId ? { ...action, ...result.data } : action
              )
            },
            loading: { ...state.loading, [leadId]: false }
          }));
        } catch (error: unknown) {
          const err = error as Error;
          console.error('Error updating nurturing action:', err);
          // Find leadId for error state update
          const state = get();
          let leadId = '';
          for (const [id, actions] of Object.entries(state.nurturingActions)) {
            if (actions.some(action => action.id === actionId)) {
              leadId = id;
              break;
            }
          }
          
          if (leadId) {
            set(state => ({
              error: { ...state.error, [leadId]: err.message || 'Failed to update nurturing action' },
              loading: { ...state.loading, [leadId]: false }
            }));
          }
        }
      },

      getNurturingActions: (leadId: string) => {
        return get().nurturingActions[leadId] || [];
      },

      isLoading: (leadId: string) => {
        return get().loading[leadId] || false;
      },

      getError: (leadId: string) => {
        return get().error[leadId] || null;
      },
    }),
    {
      name: 'lead-nurturing-storage',
      partialize: (state) => ({
        nurturingActions: state.nurturingActions,
      }),
    }
  )
);