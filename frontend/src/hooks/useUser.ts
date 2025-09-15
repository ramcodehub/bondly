import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';

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

  // Check active sessions and set the user
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setLoading(true);
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          // Fetch user profile
          await fetchUserProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Initial check for existing session
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id);
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          // If no session, we should still complete loading
          setUser(null);
          setProfile(null);
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Even if there's an error, we should complete loading
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    console.log('Auth listener set up');

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the database
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error: unknown) {
      console.error('Error in fetchUserProfile:', error);
      // If profile doesn't exist, create one
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === userId) {
          await createUserProfile(user);
        }
      } catch (authError) {
        console.error('Error getting user for profile creation:', authError);
      }
    }
  };

  // Create a new user profile
  const createUserProfile = async (user: User) => {
    try {
      console.log('Creating profile for user:', user.id);
      // First check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // If profile exists, use it
      if (existingProfile && !fetchError) {
        console.log('Profile already exists:', existingProfile);
        setProfile(existingProfile);
        return existingProfile;
      }
      
      // Otherwise create a new profile
      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        role: 'user',
        status: 'active',
        bio: '',
        phone: '',
        location: ''
      };
      
      console.log('Inserting new profile:', profileData);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Error inserting profile:', error);
        throw error;
      }
      
      console.log('Profile created successfully:', data);
      setProfile(data);
      return data;
    } catch (error: unknown) {
      console.error('Error creating user profile:', error);
      // Even if profile creation fails, we can still proceed with basic user info
      const basicProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        role: 'user',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        avatar_url: user.user_metadata?.avatar_url || '',
        bio: '',
        phone: '',
        location: ''
      };
      setProfile(basicProfile);
      return basicProfile;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Successfully signed in!');
      return { success: true };
    } catch (error: unknown) {
      console.error('Error signing in:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Account created! Please check your email for confirmation.');
      return { success: true, user: data.user };
    } catch (error: unknown) {
      console.error('Error signing up:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.log('Not authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      console.log('Updating profile for user:', user.id, 'with updates:', updates);
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      console.log('Profile updated successfully:', data);
      setProfile(data);
      toast.success('Profile updated successfully');
      return { success: true, data };
    } catch (error: unknown) {
      console.error('Error in updateProfile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Send password reset email
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Password reset email sent! Please check your inbox.');
      return { success: true };
    } catch (error: unknown) {
      console.error('Error sending password reset email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send password reset email');
      return { success: false, error };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error: unknown) {
      console.error('Error updating password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
      return { success: false, error };
    }
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
    isAdmin: user?.user_metadata?.role === 'admin',
  };
};

export default useUser;