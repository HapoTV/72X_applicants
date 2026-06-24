// src/services/crm/activity.service.ts

import type { Activity, ActivitiesResponse } from '../../interfaces/crm/activity.interface';
import { CRMService } from './crm.service';

export class ActivityService extends CRMService {
    private readonly endpoint = '/crm/activities';

    async getActivities(): Promise<ActivitiesResponse> {
        const response = await this.get<ActivitiesResponse>(this.endpoint);
        console.log('ActivityService - getActivities raw response:', response);
        return response;
    }

    async getRecentActivities(limit: number = 10): Promise<ActivitiesResponse> {
        return this.get<ActivitiesResponse>(`${this.endpoint}/recent`, {
            params: { limit },
        });
    }

    async deleteAllActivities(): Promise<{ success: boolean; message: string }> {
        return this.delete<{ success: boolean; message: string }>(this.endpoint);
    }
}

export const activityService = new ActivityService();