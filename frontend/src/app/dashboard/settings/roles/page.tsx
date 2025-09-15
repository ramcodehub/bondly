'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRoles } from '@/hooks/useRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { UserRoleBadge } from '@/app/dashboard/settings/roles/UserRoleBadge';
import { RolesList } from '@/app/dashboard/settings/roles/RolesList';
import { UserRoles } from '@/app/dashboard/settings/roles/UserRoles';

export default function RolesManagementPage() {
  const { profile, loading: userLoading } = useUser();
  const { isAdmin, loading: rolesLoading } = useRoles();
  const [activeTab, setActiveTab] = useState('roles');

  if (userLoading || rolesLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-2xl font-bold text-red-500 mb-2">Access Denied</div>
        <div className="text-gray-600">You do not have permission to access this page.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Role Management</h1>
        <p className="text-gray-500">Manage user roles and permissions</p>
      </div>

      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === 'roles' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('roles')}
        >
          Roles
        </Button>
        <Button
          variant={activeTab === 'user-roles' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('user-roles')}
        >
          User Roles
        </Button>
      </div>

      {activeTab === 'roles' && <RolesList />}
      {activeTab === 'user-roles' && <UserRoles />}
    </div>
  );
}