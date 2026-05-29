const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('writeflow_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } catch (e) {
      // response might not be JSON
    }

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('writeflow_token');
      localStorage.removeItem('writeflow_user');
      // Proactively trigger a storage event so contexts can react
      window.dispatchEvent(new Event('auth-change'));
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  try {
    return await response.json();
  } catch (e) {
    return null; // Empty response (e.g. DELETE requests)
  }
};

const api = {
  get: async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
      ...options,
    });
    return handleResponse(response);
  },

  post: async (endpoint, body, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },

  put: async (endpoint, body, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },

  delete: async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
      ...options,
    });
    return handleResponse(response);
  },
};

export default api;
