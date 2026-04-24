import axios from 'axios';

// Get backend URL from environment or use localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Admin Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/admin/login', { email, password }),
  logout: () => api.post('/admin/logout'),
  verifyToken: () => api.get('/admin/verify'),
};

// Photos APIs
export const photosAPI = {
  getAll: () => api.get('/photos'),
  upload: (formData) => api.post('/photos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (photoId) => api.delete(`/photos/${photoId}`),
  update: (photoId, data) => {
    const isFormData = data instanceof FormData;
    return api.put(`/photos/${photoId}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
    });
  },
};

// Blog APIs
export const blogsAPI = {
  getAll: () => api.get('/blogs'),
  create: (data) => api.post('/blogs', data),
  update: (blogId, data) => api.put(`/blogs/${blogId}`, data),
  delete: (blogId) => api.delete(`/blogs/${blogId}`),
};

// Discounts APIs
export const discountsAPI = {
  getAll: () => api.get('/discounts'),
  create: (data) => api.post('/discounts', data),
  update: (discountId, data) => api.put(`/discounts/${discountId}`, data),
  delete: (discountId) => api.delete(`/discounts/${discountId}`),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPhotosStats: () => api.get('/analytics/photos'),
  getBlogsStats: () => api.get('/analytics/blogs'),
};

export default api;
