import React from 'react';
import RecentActivity from '../../components/RecentActivity';

const CommunityFeed: React.FC = () => {
  return (
    <div className="space-y-3 animate-fade-in px-2 sm:px-0">
      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default CommunityFeed;
