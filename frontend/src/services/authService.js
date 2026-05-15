import axios from "axios";

const API_URL = "https://tsb-api.onrender.com/api/auth";

// Register new creator
export const registerCreator = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

// Login creator
export const loginCreator = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

// Get current user
export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
