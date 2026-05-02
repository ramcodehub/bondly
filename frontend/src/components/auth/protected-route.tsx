"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'sales'; // Simplified role keys
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAdmin, isManager, isSales } = useUser();

  useEffect(() => {
    // 1. Unauthenticated users -> login
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // 2. Role-based guards
    if (!loading && user && requiredRole) {
      let hasAccess = false;
      
      if (requiredRole === 'admin' && isAdmin) hasAccess = true;
      if (requiredRole === 'manager' && (isAdmin || isManager)) hasAccess = true;
      if (requiredRole === 'sales' && (isAdmin || isManager || isSales)) hasAccess = true;

      if (!hasAccess) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requiredRole, isAdmin, isManager, isSales, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Final check for rendering
  const hasAccess = !requiredRole || 
    (requiredRole === 'admin' && isAdmin) ||
    (requiredRole === 'manager' && (isAdmin || isManager)) ||
    (requiredRole === 'sales' && (isAdmin || isManager || isSales));

  if (user && hasAccess) {
    return <>{children}</>;
  }

  return null;
}