// src/pages/adminDashboard/tabs/components/UserStats.tsx
import React from 'react';
import { 
  Users, 
  CheckCircle, 
  Activity, 
  Award, 
  UserCog, 
  Building2,
  Circle 
} from 'lucide-react';
import type { StatsData } from './types';

interface UserStatsProps {
  stats: StatsData;
  isSuperAdmin: boolean;
}

export const UserStats: React.FC<UserStatsProps> = ({ stats, isSuperAdmin }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtext: `${stats.usersCount} users • ${stats.adminsCount} admins`,
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      subtext: `${stats.inactiveUsers} inactive`,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Online Now',
      value: stats.onlineUsers,
      subtext: `${stats.offlineUsers} offline`,
      icon: Activity,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      customDisplay: (
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 fill-green-500 text-green-500" />
          <p className="text-2xl font-bold text-gray-900">{stats.onlineUsers}</p>
        </div>
      )
    },
    {
      title: 'Free Trial',
      value: stats.freeTrialUsers,
      subtext: 'users on trial',
      icon: Award,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Admins',
      value: stats.adminsCount,
      subtext: 'including super admins',
      icon: UserCog,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="mt-4">
              {stat.customDisplay || (
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
            </div>
          </div>
        ))}

        {isSuperAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Organisations</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrganisations}</p>
              <p className="text-xs text-gray-500 mt-1">active organisations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};