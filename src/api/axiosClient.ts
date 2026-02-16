// src/api/axiosClient.ts
import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  // Do NOT set global Content-Type
  // Let axios handle it automatically
});

/**
 * ============================
 * REQUEST INTERCEPTOR
 * ============================
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    console.log("🔧 Axios Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      isFormData: config.data instanceof FormData,
    });

    // ✅ Attach JWT if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Let browser handle multipart boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

/**
 * ============================
 * RESPONSE INTERCEPTOR
 * ============================
 */
axiosClient.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Success:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const backendMessage =
      typeof responseData === "string"
        ? responseData
        : responseData?.message || "";

    console.error("❌ Axios Error:", {
      url: error.config?.url,
      status,
      message: backendMessage || error.message,
    });

    /**
     * 🌐 Network error (backend down / CORS issue)
     */
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      return Promise.reject(
        new Error(
          "Cannot connect to server. Please check if the backend is running."
        )
      );
    }

    /**
     * 🔐 401 Handling
     * Only logout if token is truly invalid or expired.
     * DO NOT logout for normal validation errors (like wrong current password).
     */
    if (status === 401) {
      const messageLower = backendMessage.toLowerCase();

      const tokenInvalid =
        messageLower.includes("expired") ||
        messageLower.includes("invalid") ||
        messageLower.includes("jwt");

      if (tokenInvalid) {
        console.warn("🔐 Token expired or invalid. Logging out...");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      // Otherwise let component handle it (e.g., wrong password)
      console.warn("⚠️ 401 received but not token-related. Passing to component.");
    }

    /**
     * 🚫 403 Handling
     */
    if (status === 403) {
      console.warn("🚫 Forbidden - Insufficient permissions.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
