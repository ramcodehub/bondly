import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RolesList } from '../src/app/dashboard/settings/roles/RolesList';

// Mock the role store
jest.mock('@/lib/stores/roleStore', () => ({
  useRoleStore: () => ({
    roles: [
      { id: 1, name: 'Admin', description: 'Full access', created_at: '2023-01-01' },
      { id: 2, name: 'User', description: 'Standard user', created_at: '2023-01-01' }
    ],
    loading: false,
    error: null,
    fetchRoles: jest.fn(),
    createRole: jest.fn(),
    updateRole: jest.fn(),
    deleteRole: jest.fn()
  })
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('RolesList', () => {
  it('should render roles table', () => {
    render(<RolesList />);
    
    expect(screen.getByText('Roles')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('should open create role dialog', () => {
    render(<RolesList />);
    
    const createButton = screen.getByText('Create Role');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Create New Role')).toBeInTheDocument();
  });
});