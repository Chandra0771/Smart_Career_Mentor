// React Context for authentication and user state.
// This keeps auth logic in one place and makes it easy to access
// from any component using the useAuth() hook.

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // user: holds the logged-in user's profile
  const [user, setUser] = useState(null);
  // loading: indicates if we are checking auth state or performing an auth request
  const [loading, setLoading] = useState(true);

  // Load user on initial mount if a token exists in localStorage
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("acm_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to load current user:", error);
        localStorage.removeItem("acm_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Helper to store token and user in state/localStorage
  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem("acm_token", token);
    setUser(userData);
  };

  // Register a new user
  const registerUser = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      handleAuthSuccess(res.data.token, res.data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please check your details.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user
  const loginUser = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      handleAuthSuccess(res.data.token, res.data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Log out the user
  const logout = () => {
    localStorage.removeItem("acm_token");
    setUser(null);
  };

  // Update profile information from dashboard
  const updateProfile = async (updates) => {
    try {
      const res = await api.put("/users/me", updates);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    registerUser,
    loginUser,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook so components can access auth easily
export const useAuth = () => useContext(AuthContext);

