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
    const organisation = localStorage.getItem("userOrganisation");
    const userRole = localStorage.getItem("userRole");

    console.log("🔧 Axios Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + "..." : "Missing",
      isFormData: config.data instanceof FormData
    });

    // ✅ Attach JWT if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Add organisation header for non-super-admins
    // Super admins see all data, so don't add organisation header
    if (organisation && userRole !== 'SUPER_ADMIN') {
      config.headers['X-Organisation'] = organisation;
      console.log("🏢 Added organisation header:", organisation);
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

    if (error.response?.status === 401) {
      console.warn("🔐 Unauthorized - Token invalid/expired");
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.error("🚫 Forbidden - No permission");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;