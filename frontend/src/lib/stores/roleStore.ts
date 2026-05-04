import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase-client';

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface RoleState {
  roles: Role[];
  myRoles: Role[];
  permissions: string[]; // 🛡️ NEW: Permission-based RBAC
  loading: boolean;
  error: string | null;
  
  // Role actions
  fetchRoles: () => Promise<void>;
  createRole: (role: Omit<Role, 'id' | 'created_at'>) => Promise<void>;
  updateRole: (id: string, role: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  
  // User role actions
  getUserRoles: (userId: string) => Promise<Role[]>;
  assignRole: (userId: string, roleId: string) => Promise<void>;
  removeRole: (userId: string, roleId: string) => Promise<void>;
  
  // Current user roles & permissions
  fetchMyRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>; // 🛡️ NEW: Fetch permissions
  initializeRealtime: () => () => void; // 🛡️ NEW: Realtime sync
}

// 🔍 DATA NORMALIZATION
function normalizeRoles(data: any): Role[] {
  if (!data) return [];
  const raw = Array.isArray(data) ? data : [data];
  
  return raw.map(item => {
    const roleObj = item?.roles || item?.role || item;
    return {
      id: roleObj?.id,
      name: roleObj?.name || 'Unknown Role',
      description: roleObj?.description || '',
      created_at: roleObj?.created_at || new Date().toISOString()
    };
  }).filter(r => r.id);
}

// 🛡️ NORMALIZE PERMISSIONS
function normalizePermissions(data: any): string[] {
  if (!data) return [];
  
  const role = data?.role || data?.roles;
  if (!role) return [];

  const perms = role.role_permissions || [];
  return perms
    .map((rp: any) => rp.permission?.name)
    .filter(Boolean);
}

export const useRoleStore = create<RoleState>()(
  devtools((set, get) => ({
    roles: [],
    myRoles: [],
    permissions: [],
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
        set({ error: error instanceof Error ? error.message : 'Failed to fetch roles', loading: false });
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
          set(state => ({ roles: [...state.roles, data.data], loading: false }));
        } else {
          throw new Error(data.message || 'Failed to create role');
        }
      } catch (error: unknown) {
        set({ error: error instanceof Error ? error.message : 'Something went wrong', loading: false });
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
          set(state => ({
            roles: state.roles.map(role => role.id === id ? data.data : role),
            loading: false
          }));
        } else {
          throw new Error(data.message || 'Failed to update role');
        }
      } catch (error: unknown) {
        set({ error: error instanceof Error ? error.message : 'Something went wrong', loading: false });
      }
    },
    
    deleteRole: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/extended/roles/${id}`, { method: 'DELETE' });
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
        set({ error: error instanceof Error ? error.message : 'Something went wrong', loading: false });
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
        set({ error: error instanceof Error ? error.message : 'Failed to fetch user roles', loading: false });
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
        if (data.success) set({ loading: false });
        else throw new Error(data.message || 'Failed to assign role');
      } catch (error: unknown) {
        set({ error: error instanceof Error ? error.message : 'Something went wrong', loading: false });
      }
    },
    
    removeRole: async (userId, roleId) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/extended/roles/users/${userId}/${roleId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) set({ loading: false });
        else throw new Error(data.message || 'Failed to remove role');
      } catch (error: unknown) {
        set({ error: error instanceof Error ? error.message : 'Something went wrong', loading: false });
      }
    },
    
    fetchMyRoles: async () => {
      set({ loading: true, error: null });
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          set({ loading: false, myRoles: [], permissions: [] });
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select(`
            role:roles!role_id (
              id,
              name,
              description,
              created_at,
              role_permissions (
                permission:permissions (
                  name
                )
              )
            )
          `)
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { 
            set({ myRoles: [], permissions: [], loading: false });
            return;
          }
          throw error;
        }

        const normalizedRoles = normalizeRoles(data);
        const normalizedPerms = normalizePermissions(data);
        
        set({ 
          myRoles: normalizedRoles, 
          permissions: normalizedPerms,
          loading: false 
        });

        console.log("🛡️ RBAC UPGRADE:", { roles: normalizedRoles.map(r => r.name), permissions: normalizedPerms });

      } catch (error: any) {
        console.error('❌ RBAC FETCH ERROR:', error);
        set({ error: error instanceof Error ? error.message : 'Failed to fetch roles', loading: false, myRoles: [], permissions: [] });
      }
    },

    fetchPermissions: async () => {
      return get().fetchMyRoles();
    },

    initializeRealtime: () => {
      const { fetchMyRoles } = get();

      const profileChannel = supabase
        .channel('rbac-profiles')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles' },
          () => fetchMyRoles()
        )
        .subscribe();

      const permChannel = supabase
        .channel('rbac-permissions')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'role_permissions' },
          () => fetchMyRoles()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(profileChannel);
        supabase.removeChannel(permChannel);
      };
    }
  }))
);