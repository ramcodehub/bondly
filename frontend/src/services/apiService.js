// Use environment variable if available, otherwise default to development
const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

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

const getAccounts = async () => request('/account');
const getAccountById = async (id) => request(`/account/${id}`);

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
  getContacts,
  submitContact,
  getHomeCarousel,
  getHomeStats,
  getRecentActivities
};