// src/interfaces/crm/activity.interface.ts

export interface Activity {
    id: string;
    userId: string;
    message: string;
    timestamp: string;
    createdAt: string;
}

export interface ActivitiesResponse {
    success: boolean;
    data: Activity[];
    count: number;
    message?: string;
}