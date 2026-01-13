// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (userId) {
      config.headers["X-User-ID"] = userId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network error - Backend might be down or CORS issue");
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }
    
    if (error.response?.status === 403) {
      console.error("Forbidden: You don't have permission to access this resource");
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;