import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface RoleState {
  roles: Role[];
  myRoles: Role[];
  loading: boolean;
  error: string | null;
  
  // Role actions
  fetchRoles: () => Promise<void>;
  createRole: (role: Omit<Role, 'id' | 'created_at'>) => Promise<void>;
  updateRole: (id: number, role: Partial<Role>) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
  
  // User role actions
  getUserRoles: (userId: string) => Promise<Role[]>;
  assignRole: (userId: string, roleId: number) => Promise<void>;
  removeRole: (userId: string, roleId: number) => Promise<void>;
  
  // Current user roles
  fetchMyRoles: () => Promise<void>;
}

export const useRoleStore = create<RoleState>()(
  devtools((set, get) => ({
    roles: [],
    myRoles: [],
    loading: false,
    error: null,
    
    fetchRoles: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetch('/api/extended/roles');
        const data = await response.json();
        if (data.success) {
          set({ roles: data.data, loading: false });
        } else {
          throw new Error(data.message || 'Failed to fetch roles');
        }
      } catch (error: unknown) {
        console.error('Error fetching roles:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch roles';
        set({ error: errorMessage, loading: false });
      }
    },
    
    createRole: async (roleData) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch('/api/extended/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roleData)
        });
        
        const data = await response.json();
        if (data.success) {
          const newRole = data.data;
          set(state => ({ roles: [...state.roles, newRole], loading: false }));
        } else {
          throw new Error(data.message || 'Failed to create role');
        }
      } catch (error: unknown) {
        console.error('Error creating role:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create role';
        set({ error: errorMessage, loading: false });
      }
    },
    
    updateRole: async (id, roleData) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/extended/roles/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roleData)
        });
        
        const data = await response.json();
        if (data.success) {
          const updatedRole = data.data;
          set(state => ({
            roles: state.roles.map(role => role.id === id ? updatedRole : role),
            loading: false
          }));
        } else {
          throw new Error(data.message || 'Failed to update role');
        }
      } catch (error: unknown) {
        console.error('Error updating role:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update role';
        set({ error: errorMessage, loading: false });
      }
    },
    
    deleteRole: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/extended/roles/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
          set(state => ({
            roles: state.roles.filter(role => role.id !== id),
            loading: false
          }));
        } else {
          throw new Error(data.message || 'Failed to delete role');
        }
      } catch (error: unknown) {
        console.error('Error deleting role:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete role';
        set({ error: errorMessage, loading: false });
      }
    },
    
    getUserRoles: async (userId) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/extended/roles/users/${userId}`);
        const data = await response.json();
        if (data.success) {
          set({ loading: false });
          return data.data;
        } else {
          throw new Error(data.message || 'Failed to fetch user roles');
        }
      } catch (error: unknown) {
        console.error('Error fetching user roles:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user roles';
        set({ error: errorMessage, loading: false });
        return [];
      }
    },
    
    assignRole: async (userId, roleId) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/extended/roles/users/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role_id: roleId })
        });
        
        const data = await response.json();
        if (data.success) {
          set({ loading: false });
        } else {
          throw new Error(data.message || 'Failed to assign role');
        }
      } catch (error: unknown) {
        console.error('Error assigning role:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to assign role';
        set({ error: errorMessage, loading: false });
      }
    },
    
    removeRole: async (userId, roleId) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/extended/roles/users/${userId}/${roleId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
          set({ loading: false });
        } else {
          throw new Error(data.message || 'Failed to remove role');
        }
      } catch (error: unknown) {
        console.error('Error removing role:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove role';
        set({ error: errorMessage, loading: false });
      }
    },
    
    fetchMyRoles: async () => {
      set({ loading: true, error: null });
      try {
        console.log('Fetching user roles from /api/extended/roles/me');
        const response = await fetch('/api/extended/roles/me');
        const data = await response.json();
        console.log('Role API response:', data);
        if (data.success) {
          set({ myRoles: data.data, loading: false });
          console.log('User roles set:', data.data);
        } else {
          // If there's an error fetching roles, we should still complete the loading
          console.error('Error fetching my roles:', data.message);
          set({ loading: false });
        }
      } catch (error: unknown) {
        console.error('Error fetching my roles:', error);
        // Even if there's an error, we should complete the loading to prevent infinite loading state
        set({ loading: false });
      }
    }
  }))
);