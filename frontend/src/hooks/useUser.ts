import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { useRoleStore } from '@/lib/stores/roleStore';

type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { myRoles, fetchMyRoles, loading: rolesLoading } = useRoleStore();

  // Unified loading state
  const isInitialLoading = loading || rolesLoading;

  // 🔍 PHASE 6: UI CONSUMPTION (NORMALIZED)
  const rbac = useMemo(() => {
    // Access flat names from normalized store: myRoles is Array<{ id, name }>
    const roles = Array.isArray(myRoles) 
      ? myRoles.map(r => r?.name?.toLowerCase() || '') 
      : [];
    
    console.log("🔍 PHASE 6: UI user roles:", roles);
    
    const hasAnyRole = roles.length > 0;
    
    const result = {
      isAdmin: roles.some(r => r.includes('admin')),
      isManager: roles.some(r => r.includes('manager')),
      isSales: roles.some(r => r.includes('sales')) || (!hasAnyRole && !!user),
      roles: roles
    };
    
    console.log("🔍 PHASE 7: CALCULATED RBAC:", result);
    return result;
  }, [myRoles, user]);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') console.error('Profile fetch error:', error);
        return;
      }
      setProfile(data);
    } catch (error) {
      // Silent fail for profile
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser && session) {
          // Task 6: Explicit profile fetch
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          setProfile(profileData);
          
          // Task 3: Timing Fix
          await fetchMyRoles();
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser && session) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          setProfile(profileData);
          await fetchMyRoles();
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 🚀 Task 4: Subscribe to profiles table updates
    let profileSubscription: any = null;

    if (user?.id) {
      profileSubscription = supabase
        .channel(`profile-updates-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log('🔄 Realtime profile update received:', payload.new);
            setProfile(payload.new as UserProfile);
          }
        )
        .subscribe();
    }

    return () => {
      authListener?.subscription?.unsubscribe();
      // 🚀 Task 5: Cleanup subscription on unmount
      if (profileSubscription) {
        supabase.removeChannel(profileSubscription);
      }
    };
  }, [user?.id, fetchMyRoles]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data?.user) {
        // Task 5: Redirect instead of reload
        router.push('/dashboard');
        toast.success('Welcome back!');
      }
      
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid email or password';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) throw error;
      
      if (data?.user) {
        // Task 5: Redirect instead of reload
        router.push('/dashboard');
      }

      toast.success('Account created! Please verify your email.');
      return { success: true, user: data?.user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, roleId: number) => {
    if (!rbac.isAdmin) {
      toast.error('Permission denied: Admin only');
      return { success: false };
    }
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role_id: roleId });
      
      if (error) {
        if (error.code === '23505') {
          toast.info('User already has this role');
          return { success: true };
        }
        throw error;
      }
      
      toast.success('Role updated successfully');
      return { success: true };
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to assign role');
      return { success: false };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No user authenticated' };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  const uploadAvatar = async (file: File) => {
    if (!user) return { success: false, error: 'No user authenticated' };
    
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = fileName;

      // Upload file with upsert: true to replace existing
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Append timestamp to URL to bypass browser cache
      const publicUrlWithTimestamp = `${publicUrl}?t=${new Date().getTime()}`;

      // Update profiles.avatar_url
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrlWithTimestamp,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      // Update local state instantly
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrlWithTimestamp } : null);
      
      toast.success('Avatar updated successfully');
      return { success: true, url: publicUrlWithTimestamp };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to upload avatar';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading: isInitialLoading,
    signIn,
    signUp,
    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      router.push('/login');
    },
    ...rbac,
    assignRole,
    updateProfile,
    uploadAvatar,
    isAuthenticated: !!user,
  };
};

export default useUser;