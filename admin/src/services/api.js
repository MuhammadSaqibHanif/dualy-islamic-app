import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

console.log('🌐 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only logout on 401 for protected routes
      const url = error.config?.url;
      const publicEndpoints = ['/duas', '/challenges', '/duas/categories', '/languages'];
      const isPublicEndpoint = publicEndpoints.some(endpoint => url?.includes(endpoint));
      
      if (!isPublicEndpoint) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/admin/login', { email, password }),
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },
};

// Languages API
export const languagesAPI = {
  getAll: () => api.get('/languages'),
  getActive: () => api.get('/languages/active'),
};

// Dua Categories API
export const duaCategoriesAPI = {
  getAll: (params) => api.get('/duas/categories', { params }),
  getById: (id) => api.get(`/duas/categories/${id}`),
  create: (data) => api.post('/admin/dua-categories', data),
  update: (id, data) => api.patch(`/admin/dua-categories/${id}`, data),
  delete: (id) => api.delete(`/admin/dua-categories/${id}`),
};

// Duas API
export const duasAPI = {
  getAll: (params) => api.get('/duas', { params }),
  getById: (id) => api.get(`/duas/${id}`),
  create: (data) => api.post('/admin/duas', data),
  update: (id, data) => api.patch(`/admin/duas/${id}`, data),
  delete: (id) => api.delete(`/admin/duas/${id}`),
};

// Challenges API
export const challengesAPI = {
  getAll: (params) => api.get('/challenges', { params }),
  getById: (id) => api.get(`/challenges/${id}`),
  create: (data) => api.post('/admin/challenges', data),
  update: (id, data) => api.patch(`/admin/challenges/${id}`, data),
  delete: (id) => api.delete(`/admin/challenges/${id}`),
  getActive: () => api.get('/challenges/active'),  // ADD THIS
};

// Stats API
export const statsAPI = {
  getDashboard: () => api.get('/admin/stats/dashboard'),
};

export default api;
