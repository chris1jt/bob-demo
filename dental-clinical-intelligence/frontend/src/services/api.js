import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

// Patient API
export const patientAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get(`/patients?page=${page}&limit=${limit}`),
  
  search: (query) => 
    api.get(`/patients/search?q=${encodeURIComponent(query)}`),
  
  getById: (id) => 
    api.get(`/patients/${id}`),
  
  create: (data) => 
    api.post('/patients', data),
  
  update: (id, data) => 
    api.put(`/patients/${id}`, data),
  
  getHistory: (id) => 
    api.get(`/patients/${id}/history`),
};

// Dental Records API
export const dentalRecordAPI = {
  getByPatient: (patientId) => 
    api.get(`/dental-records/${patientId}`),
  
  create: (data) => 
    api.post('/dental-records', data),
  
  getXrays: (id) => 
    api.get(`/dental-records/${id}/xrays`),
  
  createAnalysis: (id, data) => 
    api.post(`/dental-records/${id}/analysis`, data),
};

// AI API
export const aiAPI = {
  chat: (message, context = {}) => 
    api.post('/ai/chat', { message, context }),
  
  getRecommendations: (patientId, findings = []) => 
    api.post('/ai/recommendations', { patientId, findings }),
  
  analyzeCase: (patientId, symptoms, findings) => 
    api.post('/ai/analyze-case', { patientId, symptoms, findings }),
  
  searchSimilar: (query, topK = 5) =>
    api.post('/ai/search-similar', { query, topK }),
};

// Assistant API (Context Studio MCP)
export const assistantAPI = {
  ask: (question, contextId = null) =>
    api.post('/assistant', { question, contextId }),
};

// Reports API
export const reportAPI = {
  getByPatient: (patientId) => 
    api.get(`/reports/${patientId}`),
  
  generate: (patientId, options = {}) => 
    api.post('/reports/generate', { patientId, ...options }),
  
  download: (id, format = 'json') => 
    api.get(`/reports/${id}/download?format=${format}`, { responseType: 'blob' }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => 
    api.get('/dashboard/stats'),
  
  getRecentPatients: (limit = 10) => 
    api.get(`/dashboard/recent-patients?limit=${limit}`),
  
  getPendingCases: () => 
    api.get('/dashboard/pending-cases'),
  
  getTrends: (period = '30d') => 
    api.get(`/dashboard/trends?period=${period}`),
  
  getAlerts: () => 
    api.get('/dashboard/alerts'),
};

export default api;

// Made with Bob
