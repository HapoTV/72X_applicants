// src/interfaces/AdData.ts

export const AdTargetingType = {
  ALL_USERS: 'ALL_USERS',
  SPECIFIC_INDUSTRY: 'SPECIFIC_INDUSTRY',
  BUSINESS_REFERENCE: 'BUSINESS_REFERENCE',
  USER_ROLE: 'USER_ROLE',
  USER_PACKAGE: 'USER_PACKAGE'
} as const;

export type AdTargetingType = typeof AdTargetingType[keyof typeof AdTargetingType];

export const AdStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  DRAFT: 'DRAFT',
  ARCHIVED: 'ARCHIVED'
} as const;

export type AdStatus = typeof AdStatus[keyof typeof AdStatus];

export const MediaType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  GIF: 'GIF',
  HTML: 'HTML'
} as const;

export type MediaType = typeof MediaType[keyof typeof MediaType];

export const EngagementType = {
  AD_CLICK: 'AD_CLICK',
  AD_VIEW: 'AD_VIEW',
  AD_IMPRESSION: 'AD_IMPRESSION',
  AD_INTERACTION: 'AD_INTERACTION',
  DASHBOARD_VISIT: 'DASHBOARD_VISIT',
  TIP_READ: 'TIP_READ',
  ACTION_COMPLETED: 'ACTION_COMPLETED',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED'
} as const;

export type EngagementType = typeof EngagementType[keyof typeof EngagementType];

export const EngagementPeriod = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  ALL_TIME: 'ALL_TIME'
} as const;

export type EngagementPeriod = typeof EngagementPeriod[keyof typeof EngagementPeriod];

export interface AdDTO {
  adId: string;
  title: string;
  description?: string;
  bannerUrl: string;
  clickUrl: string;
  mediaType: MediaType;
  targetingType: AdTargetingType;
  targetValue?: string;
  budget: number;
  costPerClick?: number;
  costPerImpression?: number;
  totalClicks?: number;
  totalImpressions: number;
  status: AdStatus;
  startDate?: string;
  endDate?: string;
  createdById: string;
  createdAt?: string;
  priority: number;
  maxImpressions?: number;
  maxClicks?: number;
  isActive: boolean;
}

export interface AdUploadDTO {
  title: string;
  description?: string;
  bannerFile: File;
  clickUrl: string;
  mediaType: MediaType;
  targetingType: AdTargetingType;
  targetValue?: string;
  budget: number;
  costPerClick?: number;
  costPerImpression?: number;
  priority?: number;
  maxImpressions?: number;
  maxClicks?: number;
}

export interface EngagementDTO {
  engagementId: string;
  userId: string;
  engagementType: EngagementType;
  score: number;
  description?: string;
  metadata?: string;
  adId?: string;
  engagementDate: string;
  period: EngagementPeriod;
  totalScore: number;
  createdAt: string;
}

export interface EngagementSummaryDTO {
  userId: string;
  userName: string;
  userEmail: string;
  periodStart: string;
  periodEnd: string;
  period: EngagementPeriod;
  totalScore: number;
  totalEngagements: number;
  engagementByType: Record<string, number>;
  adClicks: number;
  adViews: number;
  adInteractions: number;
  rank: number;
  percentile: number;
}

export interface EngagementAnalytics {
  dailyScores: Record<string, number>;
  typeDistribution: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  totalEngagements: number;
  totalScore: number;
}

export interface DashboardEngagementData {
  levelTitle: string;
  xpLabel: string;
  streakLabel: string;
  badgesLabel: string;
  nextLevelLabel: string;
  progressPercent: number;
  leaderboard: LeaderboardData[];
  stats: {
    adClicks: number;
    adViews: number;
    totalEngagements: number;
  };
}

export interface AdClickResponse {
  success: boolean;
  clickId?: string;
  clickedAt?: string;
  error?: string;
}

export interface AdStats {
  totalAds: number;
  activeAds: number;
  totalClicks: number;
  totalImpressions: number;
  clickThroughRate: number;
}

export interface LeaderboardData {
  rank: number;
  userId: string;
  userName: string;
  totalScore: number;
  avatarUrl?: string;
  change: number;
}

export interface EngagementStreak {
  currentStreak: number;
  longestStreak: number;
  streakHistory?: number[];
}