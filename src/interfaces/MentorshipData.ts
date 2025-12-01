// src/interfaces/MentorshipData.ts
export interface Mentorship {
  mentorshipId: string;
  mentorName: string;
  mentorTitle: string;
  mentorEmail?: string;
  expertise: string[];
  experience?: string;
  background?: string;
  availability?: string;
  rating?: number;
  sessionsCompleted?: number;
  bio?: string;
  sessionDuration?: string; // e.g., "60 minutes"
  sessionPrice?: string;
  languages?: string[];
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MentorshipFormData {
  mentorName: string;
  mentorTitle: string;
  mentorEmail: string;
  expertise: string;
  experience: string;
  background: string;
  availability: string;
  rating: number;
  sessionsCompleted: number;
  bio: string;
  sessionDuration: string;
  sessionPrice: string;
  languages: string;
}

export interface AdminMentorshipItem {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorEmail?: string;
  expertise: string[];
  experience?: string;
  background?: string;
  availability?: string;
  rating?: number;
  sessionsCompleted?: number;
  bio?: string;
  sessionDuration?: string;
  sessionPrice?: string;
  languages?: string[];
  createdBy: string;
}

export interface UserMentorshipItem {
  id: string;
  mentorName: string;
  mentorTitle: string;
  expertise: string[];
  experience?: string;
  background?: string;
  rating?: number;
  sessionsCompleted?: number;
  sessionDuration?: string;
  sessionPrice?: string;
  languages?: string[];
  availability?: string;
  isAvailable?: boolean;
}

/**
 * API Response structure for mentorship
 */
export interface MentorshipApiResponse {
  mentorshipId: string;
  mentorName: string;
  mentorTitle: string;
  mentorEmail?: string;
  expertise: string[];
  experience?: string;
  background?: string;
  availability?: string;
  rating?: number;
  sessionsCompleted?: number;
  bio?: string;
  sessionDuration?: string;
  sessionPrice?: string;
  languages?: string[];
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for creating/updating mentorship
 */
export interface MentorshipRequest {
  mentorName: string;
  mentorTitle: string;
  mentorEmail?: string;
  expertise: string[];
  experience?: string;
  background?: string;
  availability?: string;
  rating?: number;
  sessionsCompleted?: number;
  bio?: string;
  sessionDuration?: string;
  sessionPrice?: string;
  languages?: string[];
  createdBy: string;
}
