// src/pages/adminDashboard/tabs/components/UserTableRow.tsx
import React from 'react';
import { 
  Mail, 
  Phone, 
  Building2, 
  Eye, 
  Trash2, 
  Clock, 
  Circle,
  CreditCard
} from 'lucide-react';
import type { UserWithSubscription } from './types';

interface UserTableRowProps {
  user: UserWithSubscription;
  isSuperAdmin: boolean;
  currentUser: any;
  userOrganisation: string | null;
  onViewDetails: (user: UserWithSubscription) => void;
  onDelete: (userId: string, userRole: string, userOrg?: string) => void;
  formatLastSeen: (lastSeen: string) => string;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSuperAdmin,
  currentUser,
  userOrganisation,
  onViewDetails,
  onDelete,
  formatLastSeen
}) => {
  const canDelete = () => {
    if (isSuperAdmin) return true;
    if (user.role === 'SUPER_ADMIN') return false;
    if (user.role === 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
      return user.organisation === userOrganisation;
    }
    return user.organisation === userOrganisation;
  };

  const getSubscriptionBadge = () => {
    if (!user.subscription) return null;
    
    const { subscriptionType, planName, trialEndsAt } = user.subscription;
    const isOnTrial = trialEndsAt && new Date(trialEndsAt) > new Date();
    
    let bgColor = 'bg-gray-100 text-gray-800';
    if (subscriptionType === 'PREMIUM') bgColor = 'bg-purple-100 text-purple-800';
    else if (subscriptionType === 'ESSENTIAL') bgColor = 'bg-blue-100 text-blue-800';
    else if (subscriptionType === 'START_UP') bgColor = 'bg-green-100 text-green-800';
    
    return (
      <div className="flex items-center gap-1">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
          {planName || subscriptionType}
        </span>
        {isOnTrial && (
          <span className="text-xs text-orange-600 font-medium">(Trial)</span>
        )}
      </div>
    );
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.profileImageUrl ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.profileImageUrl}
                alt={user.fullName}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.fullName || 'No name'}
            </div>
            <div className="text-sm text-gray-500">
              {user.companyName || 'No company'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="truncate max-w-[150px]">{user.email}</span>
        </div>
        {user.mobileNumber && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{user.mobileNumber}</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
          user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {user.role}
        </span>
      </td>
      {isSuperAdmin && (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <Building2 className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600">
              {user.organisation || '-'}
            </span>
          </div>
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          user.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {user.status || 'PENDING'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Circle className={`w-3 h-3 mr-2 ${
            user.isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-300 text-gray-300'
          }`} />
          <span className="text-sm text-gray-600">
            {user.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          {user.subscription ? getSubscriptionBadge() : (
            <span className="text-sm text-gray-400">No subscription</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
          {user.isOnline ? 'Currently online' : formatLastSeen(user.lastActive)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button 
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
            onClick={() => onViewDetails(user)}
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {canDelete() && (
            <button 
              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
              onClick={() => onDelete(user.userId, user.role, user.organisation)}
              title="Delete user"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};