'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SimpleTable } from '@/components/ui/simple-table';
import { useRoleStore } from '@/lib/stores/roleStore';

interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export function RolesList() {
  const { roles, loading, error, fetchRoles, createRole, updateRole, deleteRole } = useRoleStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCreateRole = async () => {
    try {
      await createRole(newRole);
      setNewRole({ name: '', description: '' });
      setIsCreateDialogOpen(false);
      toast.success('Role created successfully');
    } catch (error) {
      toast.error('Failed to create role');
      console.error('Error creating role:', error);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    
    try {
      await updateRole(editingRole.id, { name: editingRole.name, description: editingRole.description });
      setIsEditDialogOpen(false);
      setEditingRole(null);
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      await deleteRole(roleId);
      toast.success('Role deleted successfully');
    } catch (error) {
      toast.error('Failed to delete role');
      console.error('Error deleting role:', error);
    }
  };

  // Define columns for the SimpleTable
  const columns = [
    {
      header: 'Name',
      key: 'name',
      className: 'font-medium'
    },
    {
      header: 'Description',
      key: 'description'
    },
    {
      header: 'Created At',
      key: 'created_at',
      cell: (row: Role) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Actions',
      cell: (row: Role) => (
        <div className="text-right space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingRole(row);
              setIsEditDialogOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteRole(row.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Manage system roles and permissions</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Add a new role to the system with specific permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    placeholder="Enter role name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    placeholder="Enter role description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            Error: {error}
          </div>
        ) : (
          <SimpleTable columns={columns} data={roles} />
        )}
      </CardContent>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Modify the role details
            </DialogDescription>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  placeholder="Enter role description"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}