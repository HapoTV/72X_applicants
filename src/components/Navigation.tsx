import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  Calendar
} from 'lucide-react';
import Logo from '../assets/Logo.svg';

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem('navCollapsed') === '1');
  const [isDashboardSubNavOpen, setIsDashboardSubNavOpen] = useState(false);
  const [isScheduleSubNavOpen, setIsScheduleSubNavOpen] = useState(false);
  const [isLearningSubNavOpen, setIsLearningSubNavOpen] = useState(false);
  const [isCommunitySubNavOpen, setIsCommunitySubNavOpen] = useState(false);
  const [isAppStoreSubNavOpen, setIsAppStoreSubNavOpen] = useState(false);
  
  // Get user info and package from localStorage
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const userPackage = (localStorage.getItem('userPackage') as PackageType) || 'startup';
  const userName = userEmail.split('@')[0].replace('.', ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

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

  const packageHierarchy = { startup: 0, essential: 1, premium: 2 };

  const isFeatureLocked = (itemPackage: PackageType): boolean => {
    // By default, everything is unlocked. If you want to re-enable gating,
    // set localStorage.lockFeatures = '1' or set a lower userPackage.
    const lockingOn = localStorage.getItem('lockFeatures') === '1';
    if (!lockingOn) return false;
    return packageHierarchy[itemPackage] > packageHierarchy[userPackage];
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
            {!collapsed && <img src={Logo} alt="SeventyTwoX Logo" className="w-36 h-36" />}
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
        <div className="flex flex-col items-center py-4 border-b border-gray-200">
          <div className={`bg-primary-500 rounded-full flex items-center justify-center mb-3 shadow-md ${collapsed ? 'w-10 h-10' : 'w-16 h-16'}`}>
            <span className="text-white text-xl font-bold">
              {userInitials}
            </span>
          </div>
          {!collapsed && (
            <>
              <h3 className="text-sm font-semibold text-gray-900 text-center">{userName}</h3>
              <p className="text-xs text-gray-500 text-center mt-1">{userEmail}</p>
            </>
          )}
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
                    to="/learning/business-planning"
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
                  <div className="flex items-center space-x-2">
                    {React.createElement(item.icon, { className: "w-4 h-4 flex-shrink-0" })}
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
      </div>
    </nav>
  );
};

export default Navigation;