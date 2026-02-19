// src/components/Navigation.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  MessageCircle,
  AppWindow,
  Brain,
  Lock,
  Star,
  Zap,
  ChevronRight,
  X,
  User,
  DollarSign,
  Video,
  BookOpen,
  Upload,
  ShoppingBag,
  Users,
  UserPlus,
  Calendar,
  Gift,
  LogOut
} from 'lucide-react';
import MessageServices from '../services/MessageServices'; // Add this import
import { authService } from '../services/AuthService';

type PackageType = 'startup' | 'essential' | 'premium';

interface NavigationProps {
  onClose?: () => void;
  onDashboardToggle?: (isOpen: boolean) => void;
  onScheduleToggle?: (isOpen: boolean) => void;
  onLearningToggle?: (isOpen: boolean) => void;
  onCommunityToggle?: (isOpen: boolean) => void;
  onAppStoreToggle?: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onClose, onDashboardToggle, onScheduleToggle, onLearningToggle, onCommunityToggle, onAppStoreToggle }) => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem('navCollapsed') === '1');
  const [isDashboardSubNavOpen, setIsDashboardSubNavOpen] = useState(false);
  const [isScheduleSubNavOpen, setIsScheduleSubNavOpen] = useState(false);
  const [isLearningSubNavOpen, setIsLearningSubNavOpen] = useState(false);
  const [isCommunitySubNavOpen, setIsCommunitySubNavOpen] = useState(false);
  const [isAppStoreSubNavOpen, setIsAppStoreSubNavOpen] = useState(false);
  
  // Add state for unread count
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Get user info and package from localStorage
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const [profileImageUrl, setProfileImageUrl] = useState<string>(() => {
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.profileImageUrl || '';
    } catch {
      return '';
    }
  });
  const [isHydratingProfileImage, setIsHydratingProfileImage] = useState(false);

  const userInitials = userEmail
    .split('@')[0]
    .split(/[._\s-]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const refreshProfileImage = () => {
      try {
        const raw = localStorage.getItem('user');
        const parsed = raw ? JSON.parse(raw) : null;
        setProfileImageUrl(parsed?.profileImageUrl || '');
      } catch {
        setProfileImageUrl('');
      }
    };

    const hydrateFromBackendIfMissing = async () => {
      if (isHydratingProfileImage) return;
      const token = localStorage.getItem('authToken');
      if (!token) return;
      if (profileImageUrl) return;

      setIsHydratingProfileImage(true);
      try {
        const userData = await authService.getCurrentUser();
        const url = userData.profileImageUrl || '';
        if (url) {
          setProfileImageUrl(url);
          try {
            const raw = localStorage.getItem('user');
            const parsed = raw ? JSON.parse(raw) : {};
            const nextUser = { ...parsed, profileImageUrl: url };
            localStorage.setItem('user', JSON.stringify(nextUser));
          } catch (e) {}
        }
      } catch (error) {
        console.error('Error hydrating profile image:', error);
      } finally {
        setIsHydratingProfileImage(false);
      }
    };

    const handleUserUpdated = () => {
      refreshProfileImage();
    };

    window.addEventListener('storage', refreshProfileImage);
    window.addEventListener('user-updated', handleUserUpdated as EventListener);
    refreshProfileImage();
    void hydrateFromBackendIfMissing();

    return () => {
      window.removeEventListener('storage', refreshProfileImage);
      window.removeEventListener('user-updated', handleUserUpdated as EventListener);
    };
  }, [isHydratingProfileImage, profileImageUrl]);

  const userStatus = localStorage.getItem('userStatus');
  const isFreeTrial = userStatus === 'FREE_TRIAL';

  const freeTrialRemainingDays = useMemo(() => {
    if (!isFreeTrial) return null;
    const startDateRaw = localStorage.getItem('freeTrialStartDate');
    if (!startDateRaw) return null;
    const startDate = new Date(startDateRaw);
    if (Number.isNaN(startDate.getTime())) return null;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14);
    const remainingDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, remainingDays);
  }, [isFreeTrial]);

  // Fetch unread count on mount and set up polling
  useEffect(() => {
    fetchUnreadCount();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await MessageServices.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('businessReference');
    localStorage.removeItem('userPackage');
    localStorage.removeItem('userStatus');
    localStorage.removeItem('freeTrialStartDate');
    onClose?.();
    window.location.href = '/login';
  };

  const navItems: Array<{
    path: string;
    icon: React.ElementType;
    label: string;
    package: PackageType;
  }> = [
    // Dashboard
    { path: '/', icon: Home, label: 'Dashboard', package: 'startup' as PackageType },
    
    // Roadmap
    { path: '/roadmap', icon: BarChart3, label: 'Roadmap', package: 'premium' as PackageType },
    
    // Schedule
    { path: '/schedule', icon: Calendar, label: 'Schedule', package: 'startup' as PackageType },
    
    // Learning
    { path: '/learning', icon: BookOpen, label: 'Learning', package: 'startup' as PackageType },

    // Connections - THIS IS THE ONE WE NEED TO NOTIFY
    { path: '/connections', icon: UserPlus, label: 'Connections', package: 'essential' as PackageType },
    
    // Marketplace
    { path: '/marketplace', icon: ShoppingBag, label: 'Marketplace', package: 'essential' as PackageType },
    
    // Community
    { path: '/community', icon: Users, label: 'Community', package: 'startup' as PackageType },
    
    // Mentorship
    { path: '/mentorship', icon: MessageCircle, label: 'Mentorship', package: 'essential' as PackageType },
    
    // Applications
    { path: '/applications', icon: AppWindow, label: 'App Store', package: 'essential' as PackageType },
    
    // Essential Package Features (includes all startup + these)
    { path: '/funding', icon: DollarSign, label: 'Funding', package: 'essential' },
    { path: '/data-input', icon: Upload, label: 'Data Input', package: 'essential' },
    
    // Premium Package Features (everything)
    { path: '/analytics', icon: BarChart3, label: 'Analytics', package: 'premium' },
    { path: '/experts', icon: Video, label: 'Expert Q&A', package: 'premium' },
    { path: '/ai-analyst', icon: Brain, label: 'AI Business Analyst', package: 'premium' },
    
    // Profile (available in all packages)
    { path: '/profile', icon: User, label: 'Profile', package: 'startup' },
  ];

  const isFeatureLocked = (_itemPackage: PackageType): boolean => {
    void _itemPackage;
    // By default, everything is unlocked. If you want to re-enable gating,
    // set localStorage.lockFeatures = '1' or set a lower userPackage.
    return false;
  };

  const closeAllSecondaryNavs = () => {
    setIsDashboardSubNavOpen(false);
    setIsScheduleSubNavOpen(false);
    setIsLearningSubNavOpen(false);
    setIsCommunitySubNavOpen(false);
    setIsAppStoreSubNavOpen(false);
    onDashboardToggle?.(false);
    onScheduleToggle?.(false);
    onLearningToggle?.(false);
    onCommunityToggle?.(false);
    onAppStoreToggle?.(false);
  };

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('navCollapsed', next ? '1' : '0');
    window.dispatchEvent(new CustomEvent('nav-collapsed-changed'));
  };

  return (
    <nav className={`bg-white h-full ${collapsed ? 'w-20' : 'w-56'} shadow-lg border-r border-gray-200 fixed left-0 top-0 z-50 md:z-auto flex flex-col transition-all duration-200 overflow-x-hidden`}>
      <div className="p-4 flex-shrink-0 relative min-h-[88px]">
        <div className="flex items-center justify-between mb-0">
          <div className="flex items-center justify-center flex-1">
            {!collapsed && <img src="/Logo2.png" alt="SeventyTwoX Logo" className="w-24 h-24" />}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {/* Floating chevron handle */}
          {!onClose && (
            <button
              onClick={toggleCollapsed}
              className="absolute -right-2 top-14 bg-white border border-gray-200 shadow rounded-full p-1 hover:bg-gray-50"
              aria-label="Toggle sidebar"
            >
              <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* User Profile Section */}
        <div className="flex flex-col items-center pt-2 pb-1 border-b border-gray-200">
          <div className={`bg-primary-500 rounded-full flex items-center justify-center mb-0 shadow-md overflow-hidden ${collapsed ? 'w-10 h-10' : 'w-16 h-16'}`}>
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setProfileImageUrl('')}
              />
            ) : (
              <span className="text-white text-xl font-bold">
                {userInitials}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const locked = isFeatureLocked(item.package);
            // Create upgrade path by removing leading slash and adding /upgrade prefix
            const upgradePath = `/upgrade${item.path}`;

            // Special handling for Dashboard - add arrow button with click
            if (item.path === '/') {
              return (
                <li 
                  key={item.path}
                  className="relative group"
                >
                  <NavLink
                    to="/dashboard/overview"
                    onClick={() => {
                      onClose?.();
                      // Close other secondary sidebars
                      setIsScheduleSubNavOpen(false);
                      setIsLearningSubNavOpen(false);
                      setIsCommunitySubNavOpen(false);
                      setIsAppStoreSubNavOpen(false);
                      onScheduleToggle?.(false);
                      onLearningToggle?.(false);
                      onCommunityToggle?.(false);
                      onAppStoreToggle?.(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {React.createElement(item.icon, { className: "w-4 h-4 flex-shrink-0" }, null)}
                      {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center space-x-1">
                        {item.package === "essential" ? (
                          <Star className="w-3 h-3 text-blue-500" />
                        ) : item.package === "premium" ? (
                          <Zap className="w-3 h-3 text-purple-500" />
                        ) : null}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const newState = !isDashboardSubNavOpen;
                        setIsDashboardSubNavOpen(newState);
                        onDashboardToggle?.(newState);
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </NavLink>
                </li>
              );
            }

            // Special handling for Schedule - add arrow button with click
            if (item.path === '/schedule') {
              return (
                <li 
                  key={item.path}
                  className="relative group"
                >
                  <NavLink
                    to="/schedule/events"
                    onClick={() => {
                      onClose?.();
                      // Close other secondary sidebars
                      setIsDashboardSubNavOpen(false);
                      setIsLearningSubNavOpen(false);
                      setIsCommunitySubNavOpen(false);
                      setIsAppStoreSubNavOpen(false);
                      onDashboardToggle?.(false);
                      onLearningToggle?.(false);
                      onCommunityToggle?.(false);
                      onAppStoreToggle?.(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {React.createElement(item.icon, { className: "w-4 h-4 flex-shrink-0" }, null)}
                      {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center space-x-1">
                        {item.package === "essential" ? (
                          <Star className="w-3 h-3 text-blue-500" />
                        ) : item.package === "premium" ? (
                          <Zap className="w-3 h-3 text-purple-500" />
                        ) : null}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const newState = !isScheduleSubNavOpen;
                        setIsScheduleSubNavOpen(newState);
                        onScheduleToggle?.(newState);
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </NavLink>
                </li>
              );
            }

            // Special handling for Learning - add arrow button with click
            if (item.path === '/learning') {
              return (
                <li 
                  key={item.path}
                  className="relative group"
                >
                  <NavLink
                    to="/learning?category=business-plan"
                    onClick={() => {
                      onClose?.();
                      // Close other secondary sidebars
                      setIsDashboardSubNavOpen(false);
                      setIsScheduleSubNavOpen(false);
                      setIsCommunitySubNavOpen(false);
                      setIsAppStoreSubNavOpen(false);
                      onDashboardToggle?.(false);
                      onScheduleToggle?.(false);
                      onCommunityToggle?.(false);
                      onAppStoreToggle?.(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {React.createElement(item.icon, { className: "w-4 h-4 flex-shrink-0" }, null)}
                      {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center space-x-1">
                        {item.package === "essential" ? (
                          <Star className="w-3 h-3 text-blue-500" />
                        ) : item.package === "premium" ? (
                          <Zap className="w-3 h-3 text-purple-500" />
                        ) : null}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const newState = !isLearningSubNavOpen;
                        setIsLearningSubNavOpen(newState);
                        onLearningToggle?.(newState);
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </NavLink>
                </li>
              );
            }

            // Special handling for Community - add arrow button with click
            if (item.path === '/community') {
              return (
                <li 
                  key={item.path}
                  className="relative group"
                >
                  <NavLink
                    to="/community/discussions"
                    onClick={() => {
                      onClose?.();
                      // Close other secondary sidebars
                      setIsDashboardSubNavOpen(false);
                      setIsScheduleSubNavOpen(false);
                      setIsLearningSubNavOpen(false);
                      setIsAppStoreSubNavOpen(false);
                      onDashboardToggle?.(false);
                      onScheduleToggle?.(false);
                      onLearningToggle?.(false);
                      onAppStoreToggle?.(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {React.createElement(item.icon, { className: "w-4 h-4 flex-shrink-0" }, null)}
                      {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center space-x-1">
                        {item.package === "essential" ? (
                          <Star className="w-3 h-3 text-blue-500" />
                        ) : item.package === "premium" ? (
                          <Zap className="w-3 h-3 text-purple-500" />
                        ) : null}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const newState = !isCommunitySubNavOpen;
                        setIsCommunitySubNavOpen(newState);
                        onCommunityToggle?.(newState);
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </NavLink>
                </li>
              );
            }

            // Special handling for App Store - add arrow button with click
            if (item.path === '/applications') {
              return (
                <li 
                  key={item.path}
                  className="relative group"
                >
                  <NavLink
                    to="/applications/crm"
                    onClick={() => {
                      onClose?.();
                      // Close other secondary sidebars
                      setIsDashboardSubNavOpen(false);
                      setIsScheduleSubNavOpen(false);
                      setIsLearningSubNavOpen(false);
                      setIsCommunitySubNavOpen(false);
                      setIsAppStoreSubNavOpen(false);
                      onDashboardToggle?.(false);
                      onScheduleToggle?.(false);
                      onLearningToggle?.(false);
                      onCommunityToggle?.(false);
                      onAppStoreToggle?.(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {React.createElement(item.icon, { className: "w-4 h-4 flex-shrink-0" }, null)}
                      {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center space-x-1">
                        {item.package === "essential" ? (
                          <Star className="w-3 h-3 text-blue-500" />
                        ) : item.package === "premium" ? (
                          <Zap className="w-3 h-3 text-purple-500" />
                        ) : null}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const newState = !isAppStoreSubNavOpen;
                        setIsAppStoreSubNavOpen(newState);
                        onAppStoreToggle?.(newState);
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </NavLink>
                </li>
              );
            }

            return (
              <li 
                key={item.path}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <NavLink
                  to={locked ? upgradePath : item.path}
                  onClick={() => {
                    onClose?.();
                    // Close all secondary sidebars
                    closeAllSecondaryNavs();
                    
                    // If this is the connections page, refresh unread counts after visiting
                    if (item.path === '/connections') {
                      setTimeout(() => {
                        fetchUnreadCount();
                      }, 1000);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      locked
                        ? 'text-gray-400 hover:bg-gray-50'
                        : isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2 relative">
                    {React.createElement(item.icon, { className: "w-4 h-4 flex-shrink-0" })}
                    
                    {/* Show unread badge for Connections */}
                    {item.path === '/connections' && unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </span>
                    )}
                    
                    {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </div>
                  
                  {!collapsed && (
                    <div className="flex items-center space-x-1">
                      {item.package === 'essential' ? (
                      <Star className="w-3 h-3 text-blue-500" />
                    ) : item.package === 'premium' ? (
                      <Zap className="w-3 h-3 text-purple-500" />
                    ) : null}
                      {locked && <Lock className="w-3 h-3" />}
                      
                      {/* Show small unread badge in collapsed view if needed */}
                      {collapsed && item.path === '/connections' && unreadCount > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center px-1 py-0.5 text-[8px] font-bold leading-none text-red-100 bg-red-600 rounded-full">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>

                {/* Message for locked features */}
                {locked && hoveredItem === item.path && (
                  <div 
                    className="fixed bg-orange-50 border-2 border-orange-400 text-gray-800 px-4 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap flex items-center space-x-2"
                    style={{ 
                      left: '228px',
                      top: `${document.querySelector(`a[href="${locked ? upgradePath : item.path}"]`)?.getBoundingClientRect().top}px`,
                      zIndex: 9999 
                    }}
                  >
                    <span className="text-orange-500">⚠</span>
                    <span>
                      This feature is for <span className="font-semibold text-orange-600">{item.package === 'essential' ? 'Essential' : 'Premium'}</span> package. <br />You need to upgrade to unlock it!
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {onClose && (
          <div className="mt-4 pt-4 border-t border-gray-200 md:hidden">
            {isFreeTrial && (
              <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-800">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-medium">Free Trial</span>
                  </div>
                  {typeof freeTrialRemainingDays === 'number' && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      {freeTrialRemainingDays === 0 ? 'Ends today' : `${freeTrialRemainingDays} days left`}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    onClose?.();
                    navigate('/select-package');
                  }}
                  className="mt-3 w-full py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  Upgrade
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;