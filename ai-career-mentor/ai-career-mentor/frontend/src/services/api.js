/**
 * API Service - Axios instance with interceptors
 */

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

// ─── Request Interceptor (attach JWT) ─────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (handle 401) ───────────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// ─── Chat ──────────────────────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (data) => API.post('/chat/message', data),
  getHistory: () => API.get('/chat/history'),
  getSession: (sessionId) => API.get(`/chat/${sessionId}`),
  deleteSession: (sessionId) => API.delete(`/chat/${sessionId}`),
};

// ─── Resume ───────────────────────────────────────────────────────────────────
export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => API.get('/resume'),
  getRoadmap: () => API.post('/resume/roadmap'),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

// ─── Payment ──────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createCheckout: () => API.post('/payment/create-checkout'),
  getStatus: () => API.get('/payment/status'),
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getUserStats: () => API.get('/analytics/user'),
};

export default API;
