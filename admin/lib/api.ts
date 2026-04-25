import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-six-theta-99.vercel.app';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Admin Auth APIs
export const authAPI = {
  login: (email: string, password: string) => api.post('/admin/login', { email, password }),
  logout: () => api.post('/admin/logout'),
  verifyToken: () => api.get('/admin/verify'),
};

// Photos APIs
export const photosAPI = {
  getAll: () => api.get('/photos'),
  upload: (formData: FormData) => api.post('/photos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (photoId: string) => api.delete(`/photos/${photoId}`),
  update: (photoId: string, data: any) => {
    const isFormData = data instanceof FormData;
    return api.put(`/photos/${photoId}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
    });
  },
};

// Blog APIs
export const blogsAPI = {
  getAll: () => api.get('/blogs'),
  create: (data: any) => api.post('/blogs', data),
  update: (blogId: string, data: any) => api.put(`/blogs/${blogId}`, data),
  delete: (blogId: string) => api.delete(`/blogs/${blogId}`),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

export default api;
