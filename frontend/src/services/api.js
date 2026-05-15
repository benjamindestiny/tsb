import axios from "axios";

// Base URL for your backend
const API_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tsb_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH API ====================

export const authAPI = {
  // Register new creator
  register: (data) => api.post("/auth/register", data),

  // Login creator
  login: (data) => api.post("/auth/login", data),

  // Get current user
  getMe: () => api.get("/auth/me"),
};

// ==================== CREATOR API ====================

export const creatorAPI = {
  // Get public profile by username
  getProfile: (username) => api.get(`/creator/${username}`),

  // Update profile (protected)
  updateProfile: (data) => api.put("/creator/profile", data),

  // Update settings (protected)
  updateSettings: (data) => api.put("/creator/settings", data),
};

// ==================== DONATIONS API ====================

export const donationsAPI = {
  // Support a creator
  sendSupport: (username, data) =>
    api.post(`/donations/support/${username}`, data),

  // Get my supporters (protected)
  getMySupporters: () => api.get("/donations/my-supporters"),
};

export default api;
