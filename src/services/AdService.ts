// src/services/AdService.ts
import axiosClient from '../api/axiosClient';
import type { 
  AdDTO, 
  AdUploadDTO, 
  EngagementDTO, 
  EngagementSummaryDTO, 
  EngagementAnalytics,
  AdStatus,
  AdTargetingType,
  
  EngagementType,
  DashboardEngagementData
} from '../interfaces/AdData';
import {EngagementPeriod} from '../interfaces/AdData';

class AdService {
  // Ad Management Methods
  async createAd(adData: AdUploadDTO): Promise<AdDTO> {
    try {
      const formData = new FormData();
      formData.append('title', adData.title);
      if (adData.description) formData.append('description', adData.description);
      formData.append('bannerFile', adData.bannerFile);
      formData.append('clickUrl', adData.clickUrl);
      formData.append('mediaType', adData.mediaType);
      formData.append('targetingType', adData.targetingType);
      if (adData.targetValue) formData.append('targetValue', adData.targetValue);
      formData.append('budget', adData.budget.toString());
      if (adData.costPerClick) formData.append('costPerClick', adData.costPerClick.toString());
      if (adData.costPerImpression) formData.append('costPerImpression', adData.costPerImpression.toString());
      if (adData.priority) formData.append('priority', adData.priority.toString());
      if (adData.maxImpressions) formData.append('maxImpressions', adData.maxImpressions.toString());
      if (adData.maxClicks) formData.append('maxClicks', adData.maxClicks.toString());

      const response = await axiosClient.post('/ads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating ad:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to create advertisement');
      }
    }
  }

  async updateAd(adId: string, adData: Partial<AdDTO>): Promise<AdDTO> {
    try {
      const response = await axiosClient.put(`/ads/${adId}`, adData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating ad:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to update advertisement');
      }
    }
  }

  async deleteAd(adId: string): Promise<void> {
    try {
      await axiosClient.delete(`/ads/${adId}`);
    } catch (error: any) {
      console.error('Error deleting ad:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to delete advertisement');
      }
    }
  }

  async getAdById(adId: string): Promise<AdDTO> {
    try {
      const response = await axiosClient.get(`/ads/${adId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching ad:', error);
      throw new Error('Failed to fetch advertisement');
    }
  }

  async getUserAds(page: number = 0, size: number = 20): Promise<{ content: AdDTO[], totalElements: number }> {
    try {
      const response = await axiosClient.get('/ads/my-ads', {
        params: { page, size, sort: 'createdAt,desc' }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user ads:', error);
      return { content: [], totalElements: 0 };
    }
  }

  async getActiveAds(page: number = 0, size: number = 20): Promise<{ content: AdDTO[], totalElements: number }> {
    try {
      const response = await axiosClient.get('/ads/active', {
        params: { page, size }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching active ads:', error);
      return { content: [], totalElements: 0 };
    }
  }

  async getAdsForUser(): Promise<AdDTO[]> {
    try {
      const response = await axiosClient.get('/ads/for-user');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching ads for user:', error);
      return [];
    }
  }

  async recordAdImpression(adId: string): Promise<void> {
    try {
      await axiosClient.post(`/ads/${adId}/impression`);
    } catch (error: any) {
      console.error('Error recording impression:', error);
      // Don't throw error for impression tracking to avoid breaking user experience
    }
  }

  async recordAdClick(adId: string): Promise<void> {
    try {
      await axiosClient.post(`/ads/${adId}/click`);
    } catch (error: any) {
      console.error('Error recording click:', error);
      // Don't throw error for click tracking to avoid breaking user experience
    }
  }

  async updateAdStatus(adId: string, status: AdStatus): Promise<void> {
    try {
      await axiosClient.patch(`/ads/${adId}/status`, null, {
        params: { status }
      });
    } catch (error: any) {
      console.error('Error updating ad status:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to update ad status');
      }
    }
  }

  async getUserAdStats(): Promise<number> {
    try {
      const response = await axiosClient.get('/ads/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching ad stats:', error);
      return 0;
    }
  }

  async searchAds(keyword?: string, status?: AdStatus, targetingType?: AdTargetingType): Promise<AdDTO[]> {
    try {
      const response = await axiosClient.get('/ads/search', {
        params: { keyword, status, targetingType }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching ads:', error);
      return [];
    }
  }

  // Engagement Methods
  async recordEngagement(
    type: EngagementType, 
    score: number, 
    description?: string, 
    adId?: string
  ): Promise<EngagementDTO> {
    try {
      const response = await axiosClient.post('/engagement/record', null, {
        params: { type, score, description, adId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error recording engagement:', error);
      throw new Error('Failed to record engagement');
    }
  }

  async getUserEngagementSummary(period: EngagementPeriod = EngagementPeriod.WEEKLY): Promise<EngagementSummaryDTO> {
    try {
      const response = await axiosClient.get('/engagement/summary', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching engagement summary:', error);
      // Return default summary if API fails
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('fullName') || 'User';
      const userEmail = localStorage.getItem('userEmail') || '';
      
      return {
        userId: userId || '',
        userName,
        userEmail,
        periodStart: new Date().toISOString(),
        periodEnd: new Date().toISOString(),
        period,
        totalScore: 0,
        totalEngagements: 0,
        engagementByType: {},
        adClicks: 0,
        adViews: 0,
        adInteractions: 0,
        rank: 0,
        percentile: 0
      };
    }
  }

  async getUserEngagements(page: number = 0, size: number = 50): Promise<{ content: EngagementDTO[], totalElements: number }> {
    try {
      const response = await axiosClient.get('/engagement/my-engagements', {
        params: { page, size, sort: 'createdAt,desc' }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user engagements:', error);
      return { content: [], totalElements: 0 };
    }
  }

  async getLeaderboard(period: EngagementPeriod = EngagementPeriod.WEEKLY): Promise<EngagementSummaryDTO[]> {
    try {
      const response = await axiosClient.get('/engagement/leaderboard', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  async getEngagementAnalytics(startDate: string, endDate: string): Promise<EngagementAnalytics> {
    try {
      const response = await axiosClient.get('/engagement/analytics', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching engagement analytics:', error);
      return {
        dailyScores: {},
        typeDistribution: {},
        currentStreak: 0,
        longestStreak: 0,
        totalEngagements: 0,
        totalScore: 0
      };
    }
  }

  async getEngagementStreak(): Promise<{ currentStreak: number, longestStreak: number }> {
    try {
      const response = await axiosClient.get('/engagement/streak');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching engagement streak:', error);
      return { currentStreak: 0, longestStreak: 0 };
    }
  }

  // Helper Methods
  async getRandomAdForUser(): Promise<AdDTO | null> {
    try {
      const ads = await this.getAdsForUser();
      if (ads.length === 0) return null;
      
      // Filter active ads
      const activeAds = ads.filter(ad => 
        ad.status === AdStatus.ACTIVE && 
        ad.isActive
      );
      
      if (activeAds.length === 0) return null;
      
      // Simple random selection
      const randomIndex = Math.floor(Math.random() * activeAds.length);
      return activeAds[randomIndex];
    } catch (error) {
      console.error('Error fetching random ad:', error);
      return null;
    }
  }

  async getUserEngagementLevel(): Promise<string> {
    try {
      const summary = await this.getUserEngagementSummary(EngagementPeriod.MONTHLY);
      const score = summary.totalScore;
      
      if (score >= 1000) return 'Expert';
      if (score >= 500) return 'Advanced';
      if (score >= 200) return 'Intermediate';
      if (score >= 50) return 'Beginner';
      return 'Newbie';
    } catch (error) {
      console.error('Error fetching engagement level:', error);
      return 'Newbie';
    }
  }

  // Dashboard Integration
  async getDashboardEngagement(): Promise<DashboardEngagementData> {
    try {
      const [summary, leaderboard, streak, level] = await Promise.all([
        this.getUserEngagementSummary(EngagementPeriod.WEEKLY),
        this.getLeaderboard(EngagementPeriod.WEEKLY),
        this.getEngagementStreak(),
        this.getUserEngagementLevel()
      ]);

      const userRank = summary.rank;
      const topUsers = leaderboard.slice(0, 5);

      return {
        levelTitle: level,
        xpLabel: `${summary.totalScore} XP`,
        streakLabel: `${streak.currentStreak} day streak`,
        badgesLabel: `${Object.keys(summary.engagementByType).length} badges`,
        nextLevelLabel: userRank > 0 ? `Rank #${userRank}` : 'Start engaging!',
        progressPercent: summary.percentile,
        leaderboard: topUsers,
        stats: {
          adClicks: summary.adClicks,
          adViews: summary.adViews,
          totalEngagements: summary.totalEngagements
        },
        rank: userRank
      };
    } catch (error) {
      console.error('Error fetching dashboard engagement:', error);
      // Return default data
      return {
        levelTitle: 'Newbie',
        xpLabel: '0 XP',
        streakLabel: '0 day streak',
        badgesLabel: '0 badges',
        nextLevelLabel: 'Start engaging!',
        progressPercent: 0,
        leaderboard: [],
        stats: {
          adClicks: 0,
          adViews: 0,
          totalEngagements: 0
        },
        rank: 0
      };
    }
  }
}

export const adService = new AdService();