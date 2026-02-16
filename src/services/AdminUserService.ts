// src/services/AdminUserService.ts
import axiosClient from '../api/axiosClient';

interface Organisation {
  name: string;
  userCount: number;
  adminCount: number;
  createdAt: string;
}

interface AdminUser {
  userId: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  organisation?: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface Applicant {
  id: string;
  fullName: string;
  email: string;
  businessReference: string;
  organisation?: string;
  companyName: string;
  status: string;
  appliedDate: string;
  package: string;
}

class AdminUserService {
  private baseURL = '/admin';

  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all organisations (Super Admin only)
  async getAllOrganisations(): Promise<Organisation[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/organisations`, {
        headers: this.getAuthHeader()
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching organisations:', error);
      return [];
    }
  }

  // Get all admins (Super Admin only)
  async getAllAdmins(): Promise<AdminUser[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/admins`, {
        headers: this.getAuthHeader()
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  }

  // Get applicants (filtered by organisation for regular admins)
  async getApplicants(organisation?: string | null): Promise<Applicant[]> {
    try {
      const params = organisation ? { organisation } : {};
      const response = await axiosClient.get(`${this.baseURL}/applicants`, {
        params,
        headers: this.getAuthHeader()
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching applicants:', error);
      return [];
    }
  }

  // Promote admin to super admin (Super Admin only)
  async promoteToSuperAdmin(userId: string): Promise<AdminUser> {
    try {
      const response = await axiosClient.put(`${this.baseURL}/promote/${userId}`, {}, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error promoting admin:', error);
      throw error;
    }
  }

  // Demote super admin to admin (Super Admin only)
  async demoteToAdmin(userId: string): Promise<AdminUser> {
    try {
      const response = await axiosClient.put(`${this.baseURL}/demote/${userId}`, {}, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error demoting super admin:', error);
      throw error;
    }
  }

  // Update user's organisation (Super Admin only)
  async updateUserOrganisation(userId: string, organisation: string): Promise<any> {
    try {
      const response = await axiosClient.put(`${this.baseURL}/user/${userId}/organisation`, 
        { organisation },
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user organisation:', error);
      throw error;
    }
  }

  // Get users by organisation (for admins to see their organisation's users)
  async getUsersByOrganisation(organisation: string): Promise<any[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/organisation/${organisation}/users`, {
        headers: this.getAuthHeader()
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching users by organisation:', error);
      return [];
    }
  }

  // Search users within organisation
  async searchUsersInOrganisation(organisation: string, query: string): Promise<any[]> {
    try {
      const response = await axiosClient.get(`${this.baseURL}/organisation/${organisation}/search`, {
        params: { query },
        headers: this.getAuthHeader()
      });
      return response.data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Get organisation statistics
  async getOrganisationStats(organisation?: string): Promise<any> {
    try {
      const params = organisation ? { organisation } : {};
      const response = await axiosClient.get(`${this.baseURL}/stats`, {
        params,
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching organisation stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
        totalAdmins: 0
      };
    }
  }
}

export default new AdminUserService();