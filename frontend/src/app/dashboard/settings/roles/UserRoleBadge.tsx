'use client';

import { Badge } from '@/components/ui/badge';

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  // Define color variants for different roles
  const getRoleVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'marketing manager':
        return 'default';
      case 'marketing agent':
        return 'secondary';
      case 'sales manager':
        return 'default';
      case 'sales representative':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Handle case where role might be undefined
  if (!role) {
    return <Badge variant="outline">Unknown Role</Badge>;
  }

  return (
    <Badge variant={getRoleVariant(role)}>
      {role}
    </Badge>
  );
}