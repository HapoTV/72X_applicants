// src/api/emailService.ts
import { publicAxios } from "./axiosClient";

export const emailService = {
  /**
   * Request password reset / verification email
   * Uses publicAxios (NO auth token required)
   */
  async sendVerificationCode(email: string): Promise<void> {
    try {
      console.log("📧 Sending password reset request for:", email);

      await publicAxios.post("/auth/forgot-password", {
        email,
      });

      console.log("✅ Password reset request sent successfully");
    } catch (error: any) {
      // Server responded with status code
      if (error.response) {
        console.error(
          "❌ Server error:",
          error.response.status,
          error.response.data
        );
        throw new Error(
          error.response.data?.message ||
            "Server error while sending reset email"
        );
      }

      // Request sent but no response
      if (error.request) {
        console.error("❌ No response from server:", error.request);
        throw new Error(
          "Cannot connect to the server. Please check if the backend is running."
        );
      }

      // Axios config / runtime error
      console.error("❌ Request setup error:", error.message);
      throw new Error("Unexpected error occurred");
    }
  },
};
