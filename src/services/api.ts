import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API key services
export const apiKeyService = {
  getMyKeys: () => api.get('/keys/my-keys'),
  createKey: () => api.post('/keys'),
  revokeKey: (id: string) => api.patch(`/keys/${id}/revoke`),
  getKeyDetails: (id: string) => api.get(`/keys/${id}`),
};

// Usage analytics services
export const usageService = {
  getMyUsage: () => api.get('/usage/my-usage'),
  getKeyUsage: (id: string) => api.get(`/usage/key/${id}`),
  getModelUsage: (modelId: string) => api.get(`/usage/model/${modelId}`),
  getDeveloperStats: () => api.get('/usage/developer/stats'),
};

// Models services
export const modelService = {
  getAllModels: (params = {}) => api.get('/models', { params }),
  getModelById: (id: string) => api.get(`/models/${id}`),
  getMyModels: () => api.get('/models/developer/my-models'),
};

// Auth services
export const authService = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/users/login', credentials),
  register: (userData: any) => 
    api.post('/users/register', userData),
  getProfile: () => api.get('/users/profile'),
};

export default api;