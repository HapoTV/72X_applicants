// src/pages/adminDashboard/tabs/components/adminMonitorHelpers.ts
export function getMetricStatus(
  value: number = 0,
  warningThreshold: number,
  criticalThreshold: number,
  reverse: boolean = false
): 'good' | 'warning' | 'critical' {
  if (reverse) {
    if (value >= criticalThreshold) return 'critical';
    if (value >= warningThreshold) return 'warning';
    return 'good';
  }
  if (value >= criticalThreshold) return 'critical';
  if (value >= warningThreshold) return 'warning';
  return 'good';
}

export function parseStorageToMB(size: string): number {
  const match = size.match(/(\d+\.?\d*)\s*(\w+)/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  switch (unit) {
    case 'GB':
      return value * 1024;
    case 'MB':
      return value;
    case 'KB':
      return value / 1024;
    default:
      return 0;
  }
}

export function calculatePercentage(used: string, total: string): number {
  const usedMB = parseStorageToMB(used);
  const totalMB = parseStorageToMB(total);
  return totalMB > 0 ? (usedMB / totalMB) * 100 : 0;
}
