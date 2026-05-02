# Sidebar Debugging Guide

## Problem
The sidebar is only showing "Contact Dashboard" and its subcategories instead of all navigation items.

## Root Cause
Users are not being properly assigned the default 'user' role, which is required to access all navigation items in the sidebar.

## Debugging Tools

### 1. Test Role Debug Page
Visit `/test-role-debug` to access debugging tools:

- **Check User Role**: Verifies if the 'user' role exists in the database
- **Assign User Role**: Manually assigns the 'user' role to your account
- **Check My Roles**: Shows what roles are currently assigned to you
- **Assign Default Role**: Runs the standard role assignment process

### 2. Test User Roles Page
Visit `/test-user-roles` to see what roles are assigned to your account.

### 3. Test Sidebar Debug Page
Visit `/test-sidebar-debug` to see how the sidebar filtering logic works with your roles.

### 4. API Endpoints
You can also directly test these API endpoints:
- `GET /api/check-user-role` - Check if 'user' role exists
- `POST /api/assign-user-role` - Manually assign 'user' role
- `GET /api/extended/roles/me` - Get your current roles
- `POST /api/assign-default-role` - Run default role assignment

## Debugging Steps

1. Visit `/test-role-debug`
2. Click "Check User Role" - This should show that the 'user' role exists
3. Click "Check My Roles" - This will show your current roles (likely empty)
4. Click "Assign User Role" - This will assign the 'user' role to your account
5. Click "Check My Roles" again - This should now show you have the 'user' role
6. Refresh the dashboard page - The sidebar should now show all navigation items

## How It Works

1. The sidebar filters navigation items based on user roles
2. All navigation items have been updated to include the 'user' role in their access list
3. Users with the 'user' role should see all navigation items
4. If a user has no roles, only basic items (Contacts, Settings) are shown

## Common Issues

### Issue: User role doesn't exist
**Solution**: Run the database migration to add the 'user' role:
```sql
INSERT INTO public.roles (name, description)
VALUES ('user', 'Default role for all authenticated users')
ON CONFLICT (name) DO NOTHING;
```

### Issue: User has no roles assigned
**Solution**: Use the debugging tools to manually assign the 'user' role, or ensure the automatic role assignment is working.

### Issue: Role filtering logic not working
**Solution**: Check browser console for debugging logs from the sidebar component.