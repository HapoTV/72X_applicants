// src/pages/adminDashboard/tabs/components/UserTableRow.tsx
import React, { useMemo, useState } from 'react';
import { 
  Mail, 
  Phone, 
  Building2, 
  Eye, 
  Clock, 
  Circle,
  CreditCard,
  MoreVertical,
  Send,
  Trash2
} from 'lucide-react';
import type { UserWithSubscription } from './types';

interface UserTableRowProps {
  user: UserWithSubscription;
  isSuperAdmin: boolean;
  currentUser: any;
  userOrganisation: string | null;
  onViewDetails: (user: UserWithSubscription) => void;
  onResendInvite: (userId: string) => void;
  onDelete: (userId: string, userRole: string, userOrg?: string) => void;
  formatLastSeen: (lastSeen: string) => string;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSuperAdmin,
  currentUser,
  userOrganisation,
  onViewDetails,
  onResendInvite,
  onDelete,
  formatLastSeen
}) => {
  const isAdminRole = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'COC_ADMIN';
  const isAdminDisplayableStatus = user.status === 'ACTIVE' || user.status === 'INACTIVE';

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isExpiredInvite = useMemo(() => {
    if (!isAdminRole) return false;
    if ((user.status || '').toUpperCase() !== 'PENDING_PASSWORD') return false;
    if (!user.createdAt) return false;
    const created = new Date(user.createdAt);
    if (Number.isNaN(created.getTime())) return false;
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 7;
  }, [isAdminRole, user.createdAt, user.status]);

  const getDisplayStatus = () => {
    if (isExpiredInvite) return 'EXPIRED';
    return user.status || 'PENDING';
  };

  const shortenEmail = (email?: string) => {
    if (!email) return '';
    if (email.length <= 14) return email;
    return `${email.slice(0, 14)}…`;
  };

  const shortenPhone = (phone?: string) => {
    if (!phone) return '';
    if (phone.length <= 5) return phone;
    return `${phone.slice(0, 5)}…`;
  };

  const getReadablePlanName = (subscriptionType?: string, planName?: string) => {
    const value = (planName || subscriptionType || '').toUpperCase();
    if (value === 'START_UP' || value === 'START-UP' || value === 'STARTUP') return 'Start-Up';
    if (value === 'ESSENTIAL') return 'Essential';
    if (value === 'PREMIUM') return 'Premium';
    return planName || subscriptionType || '';
  };

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

    // Per requirement: blank if still on free trial
    if (isOnTrial) return null;
    
    let bgColor = 'bg-gray-100 text-gray-800';
    if (subscriptionType === 'PREMIUM') bgColor = 'bg-purple-100 text-purple-800';
    else if (subscriptionType === 'ESSENTIAL') bgColor = 'bg-blue-100 text-blue-800';
    else if (subscriptionType === 'START_UP') bgColor = 'bg-green-100 text-green-800';
    
    return (
      <div className="flex items-center gap-1">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
          {getReadablePlanName(subscriptionType, planName)}
        </span>
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
          <span title={user.email} className="max-w-[120px]">{shortenEmail(user.email)}</span>
        </div>
        {user.mobileNumber && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span title={user.mobileNumber}>{shortenPhone(user.mobileNumber)}</span>
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
        {isAdminRole && !isAdminDisplayableStatus ? (
          isExpiredInvite ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              EXPIRED
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )
        ) : (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            getDisplayStatus() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            getDisplayStatus() === 'INACTIVE' ? 'bg-red-100 text-red-800' :
            getDisplayStatus() === 'EXPIRED' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {getDisplayStatus()}
          </span>
        )}
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
          {isAdminRole ? (
            <span className="text-sm text-gray-400">-</span>
          ) : user.subscription ? (
            getSubscriptionBadge()
          ) : (
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
        <div className="flex items-center gap-2 justify-end">
          <button 
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
            onClick={() => onViewDetails(user)}
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {isSuperAdmin && (
            <div className="relative">
              <button
                className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(v => !v)}
                title="Actions"
                type="button"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  {isExpiredInvite && (
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onResendInvite(user.userId);
                      }}
                      type="button"
                    >
                      <Send className="w-4 h-4" />
                      Resend invite
                    </button>
                  )}

                  {canDelete() && (
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDelete(user.userId, user.role, user.organisation);
                      }}
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete user
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};