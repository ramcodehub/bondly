import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../src/app/dashboard/page';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Dashboard Page', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockClear();
  });

  it('renders dashboard title', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalAccounts: 5,
        totalContacts: 10,
        totalOpportunities: 3,
      }),
    });

    render(<DashboardPage />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome to your Bondly. Here\'s an overview of your business.')).toBeInTheDocument();
  });

  it('displays metric cards', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalAccounts: 5,
        totalContacts: 10,
        totalOpportunities: 3,
      }),
    });

    render(<DashboardPage />);
    
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Deals')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('loads data from API', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalAccounts: 5,
        totalContacts: 10,
        totalOpportunities: 3,
      }),
    });

    render(<DashboardPage />);

    // Wait for API call to complete and data to be loaded
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // companies count
      expect(screen.getByText('10')).toBeInTheDocument(); // contacts count
      expect(screen.getByText('3')).toBeInTheDocument(); // deals count
    });

    expect(fetch).toHaveBeenCalledWith('/api/homepage/stats');
  });

  it('falls back to mock data when API fails and mock is enabled', async () => {
    // Set environment to development for mock data
    const originalEnv = process.env.NODE_ENV;
    const originalMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
    
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';

    // Mock API failure
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<DashboardPage />);

    // Wait for fallback to mock data
    await waitFor(() => {
      expect(screen.getByText('12')).toBeInTheDocument(); // mock companies count
      expect(screen.getByText('87')).toBeInTheDocument(); // mock contacts count
      expect(screen.getByText('14')).toBeInTheDocument(); // mock deals count
      expect(screen.getByText('23')).toBeInTheDocument(); // mock tasks count
    });

    // Restore environment
    process.env.NODE_ENV = originalEnv;
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = originalMock;
  });
});