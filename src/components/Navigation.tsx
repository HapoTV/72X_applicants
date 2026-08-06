// src/components/Navigation.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  BookOpen,
  Users,
  AppWindow,
  Bell,
  Brain,
  User,
  ChevronRight,
  X,
  Gift,
  LogOut,
} from 'lucide-react';
import MessageServices from '../services/MessageServices';
import { authService } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

const appLogoUrl = `${import.meta.env.BASE_URL}Logo2.svg`;

interface NavigationProps {
  onClose?: () => void;
}

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', icon: Home,      label: 'Dashboard'    },
  { path: '/schedule',  icon: Calendar,  label: 'Calendar'     },
  { path: '/learning',  icon: BookOpen,  label: 'Learning'     },
  { path: '/community', icon: Users,     label: 'Community'    },
  { path: '/applications', icon: AppWindow, label: 'Apps'      },
  { path: '/notifications', icon: Bell,  label: 'Activity'     },
  { path: '/ai-analyst', icon: Brain,    label: 'AI Assistant' },
  { path: '/profile',   icon: User,      label: 'Profile'      },
];

const Navigation: React.FC<NavigationProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { userPackage } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem('navCollapsed') === '1');
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(() => {
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.profileImageUrl || '';
    } catch { return ''; }
  });

  const userEmail = localStorage.getItem('userEmail') || '';
  const userInitials = userEmail
    .split('@')[0]
    .split(/[._\s-]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const userStatus = localStorage.getItem('userStatus');
  const isFreeTrial = userStatus === 'FREE_TRIAL';

  const freeTrialRemainingDays = useMemo(() => {
    if (!isFreeTrial) return null;
    const raw = localStorage.getItem('freeTrialStartDate');
    if (!raw) return null;
    const start = new Date(raw);
    if (isNaN(start.getTime())) return null;
    const end = new Date(start);
    end.setDate(end.getDate() + 14);
    return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000));
  }, [isFreeTrial]);

  // Hydrate profile image
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem('user');
        setProfileImageUrl(JSON.parse(raw || 'null')?.profileImageUrl || '');
      } catch { setProfileImageUrl(''); }
    };

    const tryHydrate = async () => {
      if (profileImageUrl || !localStorage.getItem('authToken')) return;
      try {
        const data = await authService.getCurrentUser();
        const url = data.profileImageUrl || '';
        if (url) {
          setProfileImageUrl(url);
          try {
            const raw = localStorage.getItem('user');
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(raw || '{}'), profileImageUrl: url }));
          } catch {}
        }
      } catch {}
    };

    window.addEventListener('storage', refresh);
    window.addEventListener('user-updated', refresh as EventListener);
    refresh();
    void tryHydrate();
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('user-updated', refresh as EventListener);
    };
  }, [profileImageUrl]);

  // Unread message count
  useEffect(() => {
    const fetch = async () => {
      try { setUnreadCount(await MessageServices.getUnreadCount()); } catch {}
    };
    void fetch();
    const id = setInterval(fetch, 30_000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    ['authToken','userType','userEmail','businessReference','userPackage','userStatus','freeTrialStartDate']
      .forEach((k) => localStorage.removeItem(k));
    onClose?.();
    window.location.href = '/login';
  };

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('navCollapsed', next ? '1' : '0');
    window.dispatchEvent(new CustomEvent('nav-collapsed-changed'));
  };

  return (
    <nav className={`bg-white h-full ${collapsed ? 'w-20' : 'w-56'} shadow-sm border-r border-gray-200 fixed left-0 top-0 z-50 md:z-auto flex flex-col transition-all duration-200 overflow-x-hidden`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0 relative">
        <div className="flex items-center justify-between mb-3">
          {!collapsed && <img src={appLogoUrl} alt="SeventyTwoX" className="h-8 w-auto" />}
          {onClose ? (
            <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          ) : (
            <button
              onClick={toggleCollapsed}
              className="absolute -right-3 top-10 bg-white border border-gray-200 shadow-sm rounded-full p-1 hover:bg-gray-50 z-10"
              aria-label="Toggle sidebar"
            >
              <ChevronRight className={`w-3.5 h-3.5 text-gray-500 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
            </button>
          )}
        </div>

        {/* Avatar + name */}
        <div className={`flex ${collapsed ? 'justify-center' : 'items-center gap-2'} pb-3 border-b border-gray-100`}>
          <div className={`rounded-full overflow-hidden bg-primary-500 flex items-center justify-center flex-shrink-0 ${collapsed ? 'w-9 h-9' : 'w-10 h-10'}`}>
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" onError={() => setProfileImageUrl('')} />
            ) : (
              <span className="text-white text-sm font-semibold">{userInitials}</span>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{userEmail.split('@')[0]}</p>
              <p className="text-[10px] text-gray-400 capitalize">{userPackage || 'startup'} plan</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const showBadge = item.path === '/notifications' && unreadCount > 0;
            const to = item.path === '/dashboard' ? '/dashboard/overview' : item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={to}
                  end={item.path === '/dashboard'}
                  onClick={() => onClose?.()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative flex-shrink-0">
                        <Icon className="w-4 h-4" />
                        {showBadge && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500 text-[9px] text-white items-center justify-center font-bold">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          </span>
                        )}
                      </div>
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                      {isActive && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-500 rounded-l" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom: free trial + logout */}
      <div className="px-2 pb-4 flex-shrink-0 border-t border-gray-100 pt-3">
        {isFreeTrial && !collapsed && (
          <div className="mb-2 p-2.5 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-green-800">
                <Gift className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Free Trial</span>
              </div>
              {freeTrialRemainingDays !== null && (
                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                  {freeTrialRemainingDays === 0 ? 'Ends today' : `${freeTrialRemainingDays}d left`}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/select-package')}
              className="w-full py-1.5 bg-primary-500 text-white rounded-md text-xs font-medium hover:bg-primary-600 transition-colors"
            >
              Upgrade
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
