'use client';

import { useState, useEffect } from 'react';
import { useRoleStore } from '@/lib/stores/roleStore';

interface Role {
  id: number;
  name: string;
  description: string;
}

export const useRoles = () => {
  const { myRoles, fetchMyRoles, loading, error } = useRoleStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMarketingManager, setIsMarketingManager] = useState(false);
  const [isSalesManager, setIsSalesManager] = useState(false);

  useEffect(() => {
    fetchMyRoles();
  }, [fetchMyRoles]);

  useEffect(() => {
    const checkRoles = () => {
      // Handle case where myRoles might be undefined or null
      const roles = Array.isArray(myRoles) ? myRoles : [];
      const roleNames = roles.map(role => role.name);
      setIsAdmin(roleNames.includes('Admin'));
      setIsMarketingManager(roleNames.includes('Marketing Manager'));
      setIsSalesManager(roleNames.includes('Sales Manager'));
    };

    checkRoles();
  }, [myRoles]);

  // Function to check if user has specific roles
  const hasRole = (roleName: string | string[]) => {
    // Handle case where myRoles might be undefined or null
    const roles = Array.isArray(myRoles) ? myRoles : [];
    const roleNames = roles.map(role => role.name);
    
    if (Array.isArray(roleName)) {
      return roleName.some(role => roleNames.includes(role));
    }
    
    return roleNames.includes(roleName);
  };

  // Function to check if user has any of the specified roles
  const hasAnyRole = (roleNames: string[]) => {
    return roleNames.some(roleName => hasRole(roleName));
  };

  return {
    myRoles: Array.isArray(myRoles) ? myRoles : [],
    fetchMyRoles,
    loading,
    error,
    isAdmin,
    isMarketingManager,
    isSalesManager,
    hasRole,
    hasAnyRole
  };
};