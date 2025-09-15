# Role-Based Access Control (RBAC) System

## Overview

This document describes the Role-Based Access Control (RBAC) system implemented for Bondly CRM. The system provides a flexible and secure way to manage user permissions through roles and role assignments.

## Database Schema

### Roles Table

```sql
CREATE TABLE IF NOT EXISTS public.roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Roles Table

```sql
CREATE TABLE IF NOT EXISTS public.user_roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);
```

### RBAC Settings Table

```sql
CREATE TABLE IF NOT EXISTS public.rbac_settings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  enforce_roles BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Role Audit Table

```sql
CREATE TABLE IF NOT EXISTS public.role_audit (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL CHECK (action IN ('ASSIGNED', 'UNASSIGNED', 'MODIFIED')),
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  ip_address INET,
  user_agent TEXT
);
```

### Seeded Roles

The following roles are seeded during initial setup:

1. **Admin** - Full administrative access
2. **Marketing Manager** - Manage campaigns and marketing reports
3. **Marketing Agent** - Execute marketing tasks and campaigns
4. **Sales Manager** - Oversee sales team and pipelines
5. **Sales Representative** - Manage leads and deals

## API Endpoints

All role-related endpoints are available under `/api/extended/roles`.

### Role Management

#### GET `/api/extended/roles`
- **Description**: List all roles
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Admin",
        "description": "Full administrative access",
        "created_at": "2023-01-01T00:00:00Z"
      }
    ]
  }
  ```

#### POST `/api/extended/roles`
- **Description**: Create a new role (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Body**:
  ```json
  {
    "name": "New Role",
    "description": "Role description"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Role created successfully",
    "data": {
      "id": 2,
      "name": "New Role",
      "description": "Role description",
      "created_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

#### GET `/api/extended/roles/:id`
- **Description**: Get role details (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Admin",
      "description": "Full administrative access",
      "created_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

#### PUT `/api/extended/roles/:id`
- **Description**: Update role (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Body**:
  ```json
  {
    "name": "Updated Role Name",
    "description": "Updated description"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Role updated successfully",
    "data": {
      "id": 1,
      "name": "Updated Role Name",
      "description": "Updated description",
      "created_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

#### DELETE `/api/extended/roles/:id`
- **Description**: Delete role (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Response**:
  ```json
  {
    "success": true,
    "message": "Role deleted successfully"
  }
  ```

### User Role Management

#### GET `/api/extended/roles/users/:userId`
- **Description**: Get roles for a specific user (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Admin",
        "description": "Full administrative access"
      }
    ]
  }
  ```

#### POST `/api/extended/roles/users/:userId`
- **Description**: Assign role to user (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Body**:
  ```json
  {
    "role_id": 1
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Role assigned successfully",
    "data": {
      "id": 1,
      "name": "Admin",
      "description": "Full administrative access"
    }
  }
  ```

#### DELETE `/api/extended/roles/users/:userId/:roleId`
- **Description**: Remove role from user (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Response**:
  ```json
  {
    "success": true,
    "message": "Role removed successfully"
  }
  ```

#### GET `/api/extended/roles/me`
- **Description**: Get roles for the logged-in user
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Admin",
        "description": "Full administrative access"
      }
    ]
  }
  ```

### RBAC Settings

#### GET `/api/extended/roles/settings`
- **Description**: Get RBAC settings (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "enforce_roles": false,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

#### PUT `/api/extended/roles/settings`
- **Description**: Update RBAC settings (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Body**:
  ```json
  {
    "enforce_roles": true
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "RBAC settings updated successfully",
    "data": {
      "id": 1,
      "enforce_roles": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

### Role Audit Trail

#### GET `/api/extended/roles/audit`
- **Description**: Get role audit trail (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "user_id": "user-uuid",
        "role_id": 1,
        "action": "ASSIGNED",
        "assigned_by": "admin-uuid",
        "assigned_at": "2023-01-01T00:00:00Z",
        "notes": null,
        "ip_address": "127.0.0.1",
        "user_agent": "Mozilla/5.0..."
      }
    ]
  }
  ```

#### GET `/api/extended/roles/audit/users/:userId`
- **Description**: Get audit trail for a specific user (Admin-only)
- **Authentication**: Required
- **Authorization**: Admin role required
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "user_id": "user-uuid",
        "role_id": 1,
        "action": "ASSIGNED",
        "assigned_by": "admin-uuid",
        "assigned_at": "2023-01-01T00:00:00Z",
        "notes": null,
        "ip_address": "127.0.0.1",
        "user_agent": "Mozilla/5.0..."
      }
    ]
  }
  ```

## Frontend Implementation

### Role Management UI

The role management interface is available at `/dashboard/settings/roles` and is only accessible to users with the Admin role.

#### Components

1. **RolesList** - Manage system roles (create, edit, delete)
2. **UserRoles** - Assign and remove roles from users
3. **UserRoleBadge** - Display user roles with appropriate styling

### Role Store (Zustand)

A Zustand store is provided for managing role state in the frontend:

```typescript
import { useRoleStore } from '@/lib/stores/roleStore';

// Fetch all roles
const { roles, fetchRoles } = useRoleStore();

// Create a new role
const { createRole } = useRoleStore();

// Assign a role to a user
const { assignRole } = useRoleStore();
```

### Role Checking Hooks

A custom hook is provided for checking user roles:

```typescript
import { useRoles } from '@/hooks/useRoles';

const { isAdmin, hasRole, hasAnyRole } = useRoles();

// Check if user is admin
if (isAdmin) {
  // Show admin-only features
}

// Check if user has specific role
if (hasRole('Marketing Manager')) {
  // Show marketing manager features
}

// Check if user has any of the specified roles
if (hasAnyRole(['Admin', 'Marketing Manager'])) {
  // Show features for admins or marketing managers
}
```

## Middleware Usage

### requireRole Middleware

The `requireRole` middleware can be used to protect routes based on user roles:

```javascript
import { requireRole } from '../../middleware/requireRole.js';

// Protect a route for Admins only
router.get('/admin-only', requireAuth, requireRole('Admin'), (req, res) => {
  // Route logic here
});

// Protect a route for multiple roles
router.get('/marketing', requireAuth, requireRole('Marketing Manager', 'Marketing Agent'), (req, res) => {
  // Route logic here
});
```

## Implementation Notes

1. **Additive Only**: All changes are additive and do not modify existing functionality
2. **Non-Intrusive**: New features are namespaced under `/extended` to avoid conflicts
3. **Soft Enforcement**: Role checks are implemented for new features but do not restrict existing functionality
4. **Admin-Only Management**: Role assignment and management is restricted to Admin users
5. **Audit Trail**: Role assignments are tracked with `assigned_by` and `assigned_at` fields

## Security Considerations

1. All role-related endpoints require authentication
2. Administrative actions require the Admin role
3. Role assignments are tracked with audit information
4. Proper error handling prevents information leakage
5. Input validation prevents injection attacks

## Future Enhancements

1. **Permission-Based Access**: Extend to granular permissions within roles
2. **Role Hierarchies**: Implement role inheritance for more complex permission structures
3. **Enhanced Audit Logging**: Add comprehensive audit trails for all role-related actions with detailed metadata
4. **Role Templates**: Create templates for common role configurations
5. **Bulk Operations**: Add support for bulk role assignments and modifications
6. **Role Analytics**: Add reporting and analytics on role usage and assignments
7. **Temporary Role Assignments**: Implement time-based role assignments that expire automatically