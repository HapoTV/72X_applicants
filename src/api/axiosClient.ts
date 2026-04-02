// src/api/axiosClient.ts
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

// Get API URL from environment variable with fallback
const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_PRODUCTION_URL ||
  'http://localhost:8080';

console.log('🔧 API Base URL:', API_URL);

// For Production
// const API_URL = import.meta.env. VITE_BACKEND_URL;

export const publicAxios = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosClient = axios.create({
  baseURL: `${API_URL}/api`,
  // 🚫 DO NOT set Content-Type globally
  // Let axios automatically set it depending on request type
  // withCredentials: false (default)
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    const token = localStorage.getItem("authToken");
    const organisation = localStorage.getItem("userOrganisation");
    const userRole = localStorage.getItem("userRole");

    console.log("🔧 Axios Request Config:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + "..." : "Missing",
      organisation: organisation || "None",
      role: userRole || "None",
      isFormData: config.data instanceof FormData
    });

    // ✅ Add token ONLY if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const url = typeof config.url === 'string' ? config.url : '';
    const shouldSkipOrganisationHeader = url.startsWith('/users/me');

    if (!shouldSkipOrganisationHeader && organisation && userRole !== 'SUPER_ADMIN') {
      config.headers['X-Organisation'] = organisation;
      console.log("🏢 Added organisation header:", organisation);
    }

    // ✅ IMPORTANT:
    // If sending FormData, DO NOT manually set Content-Type
    // Browser will automatically set multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: unknown) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ Axios Response Success:", {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error: AxiosError) => {
    const url = error.config?.url as string | undefined;
    const method = (error.config?.method as string | undefined)?.toLowerCase();
    const status = error.response?.status as number | undefined;

    const isExpectedMissingQuiz =
      method === 'get' &&
      status === 404 &&
      typeof url === 'string' &&
      /^\/learning-materials\/[^/]+\/quiz$/.test(url);

    if (!isExpectedMissingQuiz) {
      console.error("❌ Axios Response Error:", {
        url,
        status,
        message: error.message,
        data: error.response?.data
      });
    }

    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("🌐 Network error - Check backend/CORS");
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    }

    if (error.response?.status === 401) {
      console.warn("🔐 Unauthorized - Token invalid/expired");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userOrganisation");

      const currentPath = window.location.pathname || '';
      const publicAuthPaths = [
        '/login',
        '/login/asadmin',
        '/login/cocadmin',
        '/login/haposuperadmin',
        '/signup',
        '/verify-otp',
        '/reset-password',
        '/setup-account',
        '/create-password',
      ];

      const isOnPublicAuthPage = publicAuthPaths.some(
        (p) => currentPath === p || currentPath.startsWith(`${p}/`)
      );

      if (!isOnPublicAuthPage) {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      console.error("🚫 Forbidden - No permission");
      // Could show a user-friendly message
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
