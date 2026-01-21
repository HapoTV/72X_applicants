// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // ⚠️ REMOVE THIS - causing CORS issues with Supabase
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    
    console.log("🔧 Axios Request Config:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + "..." : "Missing"
    });
    
    // ✅ Add token ONLY if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ❌ REMOVE THIS - causing CORS error
    // if (userId) {
    //   config.headers["X-User-ID"] = userId;
    // }
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response Success:", {
      url: response.config.url,
      status: response.status,
      data: response.data ? { ...response.data, token: response.data.token ? "***MASKED***" : undefined } : "No data"
    });
    return response;
  },
  (error) => {
    console.error("❌ Axios Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("🌐 Network error - Check backend/CORS");
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    }
    
    if (error.response?.status === 401) {
      console.warn("🔐 Unauthorized - Token invalid/expired");
      localStorage.clear();
      window.location.href = "/login";
    }
    
    if (error.response?.status === 403) {
      console.error("🚫 Forbidden - No permission");
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;