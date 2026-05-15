import { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { AuthContext } from "./authState";

// Provider component
export const AuthProvider = ({ children }) => {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("tsb_token")),
  );
  const [error, setError] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem("tsb_token");

    if (!token) return;

    // Verify token is still valid
    authAPI
      .getMe()
      .then((res) => {
        setCreator(res.data.creator);
      })
      .catch(() => {
        // Token expired or invalid
        localStorage.removeItem("tsb_token");
        setCreator(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await authAPI.login({ email, password });

      localStorage.setItem("tsb_token", res.data.token);
      setCreator(res.data.creator);

      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Register function
  const register = async (data) => {
    try {
      setError(null);
      const res = await authAPI.register(data);

      localStorage.setItem("tsb_token", res.data.token);
      setCreator(res.data.creator);

      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("tsb_token");
    setCreator(null);
  };

  const value = {
    creator,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!creator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
