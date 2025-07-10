// src/utils/axiosInstance.ts
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const baseURL = "http://localhost:8080/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired or missing token
    if (error.response?.status === 401 && originalRequest.retryCount < 2) {
      originalRequest.retryCount = originalRequest.retryCount || 0;
      originalRequest.retryCount += 1;
      try {
        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, clear the user state and redirect to login
        const { logout } = useAuth();
        await logout();
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);