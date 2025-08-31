// Use Next.js env (fallback for dev)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

console.log('Using API URL:', API_URL);

/**
 * Generic API request handler
 */
export const request = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const defaultOptions = {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {})
      }
    });

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Authentication services
 */
const authService = {
  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return request('/auth/logout', { method: 'POST' });
  },

  getCurrentUser: async (token) => {
    return request('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

/**
 * Leads services
 */
const getLeads = async () => {
  return request('/leads');
};

const getLead = async (id) => {
  return request(`/leads/${id}`);
};

const createLead = async (leadData) => {
  return request('/leads', {
    method: 'POST',
    body: JSON.stringify(leadData),
  });
};

const updateLead = async (id, leadData) => {
  return request(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(leadData),
  });
};

const deleteLead = async (id) => {
  return request(`/leads/${id}`, { method: 'DELETE' });
};

/**
 * Hello service (example)
 */
const getHello = async () => {
  return request('/hello');
};

const getHome = async () => request('/home');

const getOpportunities = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/opportunities${query ? `?${query}` : ''}`);
};

const getAccounts = async (params = {}) => {
  try {
    const { page = 1, limit = 10, search = '' } = params;
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    });

    const response = await fetch(`${API_URL}/account?${queryParams}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch accounts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

const getAccountById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/account/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Account not found');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch account');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching account ${id}:`, error);
    throw error;
  }
};

const createAccount = async (accountData) => {
  try {
    const response = await fetch(`${API_URL}/account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create account');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

const updateAccount = async (id, accountData) => {
  try {
    const response = await fetch(`${API_URL}/account/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update account');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating account ${id}:`, error);
    throw error;
  }
};

const deleteAccount = async (id) => {
  try {
    const response = await fetch(`${API_URL}/account/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete account');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting account ${id}:`, error);
    throw error;
  }
};

const getContacts = async () => request('/contact');
const submitContact = async (payload) => request('/contact/submit', {
  method: 'POST',
  body: JSON.stringify(payload),
});

/**
 * Homepage services
 */
const getHomeCarousel = async () => {
  return request('/homepage/carousel');
};

const getHomeStats = async () => {
  return request('/homepage/stats');
};

const getRecentActivities = async () => {
  return request('/homepage/activities');
};

export const apiService = {
  auth: authService,
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getHello,
  getHome,
  getOpportunities,
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getContacts,
  submitContact,
  getHomeCarousel,
  getHomeStats,
  getRecentActivities,
};