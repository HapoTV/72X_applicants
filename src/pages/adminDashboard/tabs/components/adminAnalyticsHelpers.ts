// src/pages/adminDashboard/tabs/components/adminAnalyticsHelpers.ts
export type AnalyticsTimeRange = '7days' | '30days' | '90days' | '1year';

export const ANALYTICS_TIME_RANGES: readonly AnalyticsTimeRange[] = [
  '7days',
  '30days',
  '90days',
  '1year',
] as const;

export function analyticsTimeRangeLabel(range: AnalyticsTimeRange): string {
  switch (range) {
    case '7days':
      return '7 Days';
    case '30days':
      return '30 Days';
    case '90days':
      return '90 Days';
    case '1year':
      return '1 Year';
  }
}

export function startDateForAnalyticsRange(range: AnalyticsTimeRange): Date {
  const startDate = new Date();
  switch (range) {
    case '7days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }
  return startDate;
}
