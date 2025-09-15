# Role-Based Access Control (RBAC) Implementation

This document describes the complete implementation of Role-Based Access Control (RBAC) for the Bondly CRM application.

## Overview

The RBAC system implements five distinct roles with specific permissions:
- **Admin**: Full access to all features
- **Marketing Manager**: Access to marketing-related features
- **Sales Manager**: Access to sales-related features
- **Marketing Agent**: Limited access to marketing features
- **Sales Representative**: Limited access to sales features

## Architecture

The RBAC system is built with the following components:

### 1. Database Schema

The system uses two main tables:
- `roles`: Stores all available roles
- `user_roles`: Maps users to their assigned roles
- `rbac_settings`: Controls RBAC enforcement (feature flag)
- `role_audit`: Logs all role assignment/unassignment actions

### 2. Backend API

RESTful API endpoints under `/api/extended/roles`:
- `GET /roles` - List all roles (Admin only)
- `POST /roles` - Create new role (Admin only)
- `PUT /roles/:id` - Update role (Admin only)
- `DELETE /roles/:id` - Delete role (Admin only)
- `GET /roles/me` - Get current user's roles
- `GET /roles/users` - List all users with their roles (Admin only)
- `GET /roles/users/:userId` - Get specific user's roles (Admin only)
- `POST /roles/users/:userId` - Assign role to user (Admin only)
- `DELETE /roles/users/:userId/:roleId` - Remove role from user (Admin only)
- `GET /roles/audit` - View role audit trail (Admin only)
- `GET /roles/audit/users/:userId` - View audit trail for specific user (Admin only)

### 3. Frontend Integration

#### Role-Based Navigation
The sidebar navigation dynamically shows/hides menu items based on user roles:
- Marketing Manager: Contacts, Journeys, Marketing Planner, Marketing Campaigns, Website Analytics, Library, Settings
- Sales Manager: Contacts, Lead Generation, Marketing Planner, Settings
- Marketing Agent: Contacts, Marketing Planner, Marketing Campaigns, Settings
- Sales Representative: Contacts, Lead Generation, Marketing Planner, Settings
- Admin: All features plus Role Management

#### Role Badges
Role badges are displayed in:
- User profile page
- Topbar user dropdown
- Mobile sidebar user section

#### Protected Routes
The `ProtectedRoute` component ensures only authorized users can access specific pages, with optional role requirements.

## Implementation Details

### Database Migrations

The system includes SQL migrations for creating the necessary tables with proper constraints and indexes.

### API Security

All role management endpoints are protected with:
- JWT authentication
- Role-based authorization middleware
- Input validation
- Audit logging

### Frontend Components

#### Role Store (Zustand)
Centralized state management for roles with real API integration:
- Fetch roles
- Create/update/delete roles
- Assign/unassign roles to users
- Fetch current user roles

#### UI Components
- `RolesList`: Manage system roles (Admin only)
- `UserRoles`: Assign roles to users (Admin only)
- `UserRoleBadge`: Display role badges with appropriate styling

### Audit Trail

All role assignments and unassignments are logged with:
- Action type (ASSIGNED/UNASSIGNED)
- Timestamp
- User performing the action
- IP address and user agent
- Optional notes

## Usage

### Assigning Roles
1. Navigate to Settings > Roles (Admin only)
2. Go to the "User Roles" tab
3. Search for a user
4. Select a role from the dropdown
5. Click "Assign Role"

### Managing Roles
1. Navigate to Settings > Roles (Admin only)
2. Go to the "Roles" tab
3. Create, edit, or delete roles as needed

### Viewing Audit Trail
1. Navigate to Settings > Roles (Admin only)
2. The audit functionality can be extended to view role change history

## Security Considerations

- All role management operations require Admin privileges
- Role assignments are logged for accountability
- RBAC enforcement can be toggled via feature flag
- Proper input validation prevents injection attacks
- Row Level Security (RLS) policies protect database access

## Future Enhancements

- Granular permission system (beyond role-based)
- Role inheritance hierarchy
- Temporary role assignments
- Enhanced audit trail filtering and search
- Role-based dashboard widgets