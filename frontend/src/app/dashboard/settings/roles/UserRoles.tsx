'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserRoleBadge } from './UserRoleBadge';
import { SimpleTable } from '@/components/ui/simple-table';
import { useRoleStore } from '@/lib/stores/roleStore';

interface User {
  id: string;
  email: string;
  full_name?: string;
  roles?: Role[];
}

interface Role {
  id: number;
  name: string;
}

export function UserRoles() {
  const { roles, loading, error, fetchRoles, assignRole, removeRole } = useRoleStore();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  useEffect(() => {
    fetchRoles();
    fetchData();
  }, [fetchRoles]);

  const fetchData = async () => {
    try {
      // Fetch users with their roles
      const response = await fetch('/api/extended/roles/users');
      const userData = await response.json();
      
      if (userData.success) {
        setUsers(userData.data);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select both a user and a role');
      return;
    }

    try {
      await assignRole(selectedUser.id, selectedRole);
      toast.success(`Role assigned to ${selectedUser.full_name || selectedUser.email}`);
      // Refresh data
      await fetchData();
      // Clear selection
      setSelectedUser(null);
      setSelectedRole(null);
    } catch (error) {
      toast.error('Failed to assign role');
      console.error('Error assigning role:', error);
    }
  };

  const handleRemoveRole = async (userId: string, roleId: number) => {
    try {
      await removeRole(userId, roleId);
      toast.success('Role removed successfully');
      // Refresh data
      await fetchData();
    } catch (error) {
      toast.error('Failed to remove role');
      console.error('Error removing role:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Define columns for the SimpleTable
  const columns = [
    {
      header: 'User',
      key: 'full_name',
      cell: (row: User) => row.full_name || 'No name'
    },
    {
      header: 'Email',
      key: 'email'
    },
    {
      header: 'Roles',
      cell: (row: User) => {
        return (
          <div className="flex flex-wrap gap-2">
            {row.roles && row.roles.length > 0 ? (
              row.roles.map((role) => (
                <UserRoleBadge key={`${row.id}-${role.id}`} role={role.name} />
              ))
            ) : (
              <span className="text-gray-500">No roles assigned</span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Actions',
      cell: (row: User) => (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedUser(row);
            }}
          >
            Manage Roles
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Roles</CardTitle>
        <CardDescription>Assign and manage roles for users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <Label htmlFor="user-search">Search Users</Label>
            <Input
              id="user-search"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <Label htmlFor="user-select">Select User</Label>
            <Select 
              value={selectedUser?.id || ''} 
              onValueChange={(value) => {
                const user = users.find(u => u.id === value);
                setSelectedUser(user || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-48">
            <Label htmlFor="role-select">Select Role</Label>
            <Select 
              value={selectedRole?.toString() || ''} 
              onValueChange={(value) => setSelectedRole(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={handleAssignRole} disabled={!selectedUser || !selectedRole}>
              Assign Role
            </Button>
          </div>
        </div>

        {selectedUser && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">Manage Roles for {selectedUser.full_name || selectedUser.email}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedUser.roles && selectedUser.roles.map((role) => (
                <div key={role.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="mr-2">{role.name}</span>
                  <button 
                    onClick={() => handleRemoveRole(selectedUser.id, role.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              {(!selectedUser.roles || selectedUser.roles.length === 0) && (
                <span className="text-gray-500">No roles assigned</span>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            Error: {error}
          </div>
        ) : (
          <SimpleTable columns={columns} data={users} />
        )}
      </CardContent>
    </Card>
  );
}