import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { adService } from '../services/AdService';
import type { EngagementDTO } from '../interfaces/AdData';

interface ActivityItem {
  type: string;
  title: string;
  description?: string;
  timestamp: string; // ISO
}

const RecentActivity: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('activityLog') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await adService.getUserEngagements(0, 50);
        const items: ActivityItem[] = (res.content || []).map((e: EngagementDTO) => {
          const title = String(e.engagementType || '')
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return {
            type: String(e.engagementType || ''),
            title: title || 'Activity',
            description: e.description || undefined,
            timestamp: e.createdAt || new Date().toISOString(),
          };
        });

        if (!mounted) return;
        setActivityLog(items);
      } catch {
        // Keep localStorage fallback
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const recent = useMemo(() => activityLog.slice(-5).reverse(), [activityLog]);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

      {recent.length === 0 ? (
        <div className="text-xs sm:text-sm text-gray-500">No activity yet. Your actions will appear here.</div>
      ) : (
        <div className="space-y-3">
          {recent.map((a, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gray-100 text-gray-500">•</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1 text-sm">{a.title}</h4>
                {a.description && <p className="text-xs sm:text-sm text-gray-600 mb-1">{a.description}</p>}
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                  {new Date(a.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(true)}
        className="w-full mt-4 py-2 text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        View all activity
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">All Activity</h3>
              <button onClick={() => setOpen(false)} className="px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50">Close</button>
            </div>
            {activityLog.length === 0 ? (
              <div className="text-sm text-gray-500">No activity yet.</div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {[...activityLog].reverse().map((a, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{a.title}</h4>
                      <span className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</span>
                    </div>
                    {a.description && <p className="text-xs text-gray-600">{a.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;