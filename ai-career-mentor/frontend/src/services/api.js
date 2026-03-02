// Axios instance configured for our backend API.
// This keeps all HTTP calls consistent and makes it easy to add auth headers.

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://smart-career-mentor-fdrv.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach token from localStorage (if present) to every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("acm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

