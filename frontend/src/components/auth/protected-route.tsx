"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useRoles } from '@/hooks/useRoles';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[]; // Role(s) required to access this route
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { myRoles, loading: rolesLoading, hasRole } = useRoles();

  useEffect(() => {
    console.log('ProtectedRoute check:', { user, userLoading, rolesLoading, requiredRole });
    
    // If not loading and no user, redirect to login
    if (!userLoading && !user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }

    // If user exists but doesn't have required role, redirect to dashboard
    if (user && requiredRole && !rolesLoading) {
      if (!hasRole(requiredRole)) {
        console.log('User does not have required role, redirecting to dashboard');
        router.push('/dashboard');
      }
    }
  }, [user, userLoading, rolesLoading, requiredRole, hasRole, router]);

  // Show loading spinner while checking auth state or roles
  if (userLoading || rolesLoading) {
    console.log('Showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If user is authenticated and has required role (if specified), render children
  if (user && (!requiredRole || hasRole(requiredRole))) {
    console.log('User authenticated, rendering children');
    return <>{children}</>;
  }

  // If not authenticated or doesn't have required role, render nothing (will redirect)
  console.log('Not authenticated or missing required role, rendering nothing');
  return null;
}