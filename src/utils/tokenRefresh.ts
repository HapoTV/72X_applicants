// src/utils/tokenRefresh.ts
import axiosClient from '../api/axiosClient';

export const refreshToken = async (): Promise<boolean> => {
  try {
    console.log('🔄 Attempting to refresh token...');
    const response = await axiosClient.post('/authentication/refresh-token');
    
    if (response.data && response.data.token) {
      // Store new token
      localStorage.setItem('authToken', response.data.token);
      
      // Update user data if returned
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Update organisation
      if (response.data.organisation) {
        localStorage.setItem('userOrganisation', response.data.organisation);
        console.log('✅ Token refreshed, organisation:', response.data.organisation);
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Failed to refresh token:', error);
    return false;
  }
};