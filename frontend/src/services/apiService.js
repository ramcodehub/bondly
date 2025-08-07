const API_URL = 'http://localhost:5000/api';

/**
 * Generic API request handler
 */
export const request = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

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

export const apiService = {
  auth: authService,
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getHello,
};