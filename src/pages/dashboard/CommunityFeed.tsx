import React, { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import RecentActivity from '../../components/RecentActivity';

const CommunityFeed: React.FC = () => {
  const [open, setOpen] = useState(false);
  type Update = { initials?: string; title: string; message?: string; timestamp?: string };
  const updates: Update[] = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('communityUpdates') || '[]'); } catch { return []; }
  }, []);
  const recent = updates.slice(-4).reverse();
  return (
    <div className="space-y-3 animate-fade-in px-2 sm:px-0">
      {/* Recent Activity */}
      <RecentActivity />

      {/* Community Highlights */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-900">Community Highlights</h3>
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </div>
        {recent.length === 0 ? (
          <div className="text-xs text-gray-500">No community updates yet.</div>
        ) : (
          <div className="space-y-2">
            {recent.map((u, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{u.initials || 'U'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">{u.title}</p>
                  {u.message && <p className="text-xs text-gray-600">{u.message}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setOpen(true)} className="w-full mt-3 py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          View All Community Updates
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">All Community Updates</h3>
              <button onClick={() => setOpen(false)} className="px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50">Close</button>
            </div>
            {updates.length === 0 ? (
              <div className="text-sm text-gray-500">No updates yet.</div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {[...updates].reverse().map((u, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{u.title}</h4>
                      {u.timestamp && <span className="text-xs text-gray-500">{new Date(u.timestamp).toLocaleString()}</span>}
                    </div>
                    {u.message && <p className="text-xs text-gray-600">{u.message}</p>}
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

export default CommunityFeed;
