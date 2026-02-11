// services/AuthService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

class AuthService {
    async login(loginRequest: any) {
        try {
            const response = await axios.post(`${API_URL}/authentication/login`, loginRequest);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    async verifyOtp(verifyOtpRequest: any) {
        try {
            const response = await axios.post(`${API_URL}/authentication/verify-otp`, verifyOtpRequest);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    async resendOtp(resendOtpRequest: any) {
        try {
            const response = await axios.post(`${API_URL}/authentication/resend-otp`, resendOtpRequest);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    setAxiosAuthHeader(token: string) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

export const authService = new AuthService();