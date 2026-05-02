'use client';

import { useState, useEffect } from 'react';
import { useRoleStore } from '../lib/stores/roleStore';

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
    const assignDefaultRoleIfNeeded = async () => {
      // First fetch roles
      await fetchMyRoles();
      
      // Check if user has roles, if not, assign default role
      setTimeout(async () => {
        const currentRoles = useRoleStore.getState().myRoles;
        if (!currentRoles || currentRoles.length === 0) {
          console.log('User has no roles, attempting to assign default role');
          try {
            const response = await fetch('/api/assign-default-role', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            const result = await response.json();
            console.log('Default role assignment result:', result);
            
            // Refetch roles after assignment
            if (result.success) {
              await fetchMyRoles();
            }
          } catch (error) {
            console.error('Error assigning default role:', error);
          }
        }
      }, 100);
    };

    assignDefaultRoleIfNeeded();
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
    // Handle case where myRoles might be undefined or null
    const roles = Array.isArray(myRoles) ? myRoles : [];
    const userRoleNames = roles.map(role => role.name);
    return roleNames.some(role => userRoleNames.includes(role));
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