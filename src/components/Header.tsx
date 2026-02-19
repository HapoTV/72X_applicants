// src/components/Header.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Bell, Search, Clock, Gift, ChevronDown, BellRing } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../services/NotificationService';
import UserSubscriptionService from '../services/UserSubscriptionService';
import NotificationPopup from './NotificationPopup';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

interface FreeTrialInfo {
  remainingDays: number;
  endDate: string;
  isActive: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const { user, isSuperAdmin, userOrganisation } = useAuth();
  const userEmail = localStorage.getItem('userEmail');
  const userStatus = localStorage.getItem('userStatus');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [freeTrialDropdownOpen, setFreeTrialDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const freeTrialRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [freeTrialInfo, setFreeTrialInfo] = useState<FreeTrialInfo | null>(null);
  const [isLoadingTrial, setIsLoadingTrial] = useState(false);

  // Check if user is on free trial - using both status and trial info
  const isFreeTrial = userStatus === 'FREE_TRIAL';

  const localFreeTrialInfo = useMemo<FreeTrialInfo | null>(() => {
    if (!isFreeTrial) return null;
    const startDateRaw = localStorage.getItem('freeTrialStartDate');
    if (!startDateRaw) return null;
    const startDate = new Date(startDateRaw);
    if (Number.isNaN(startDate.getTime())) return null;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14);
    const remainingDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return {
      remainingDays: Math.max(0, remainingDays),
      endDate: endDate.toISOString(),
      isActive: remainingDays > 0,
    };
  }, [isFreeTrial]);

  const effectiveFreeTrialInfo = freeTrialInfo ?? localFreeTrialInfo;

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFreeTrial) {
      fetchFreeTrialInfo();
      // Update more frequently to keep countdown accurate (every 30 minutes)
      const interval = setInterval(fetchFreeTrialInfo, 30 * 60 * 1000); // 30 minutes
      return () => clearInterval(interval);
    }
  }, [isFreeTrial]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (freeTrialRef.current && !freeTrialRef.current.contains(event.target as Node)) {
        setFreeTrialDropdownOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchFreeTrialInfo = async () => {
    if (isLoadingTrial) return;
    
    setIsLoadingTrial(true);
    try {
      const response = await UserSubscriptionService.getFreeTrialStatus();
      console.log('Free trial API response:', response);
      
      // Check if we have valid trial data
      if (response && response.success === true && response.remaining_days !== undefined && response.remaining_days !== null) {
        // Calculate end date if not provided
        let endDate = response.trial_end_date;
        if (!endDate && response.remaining_days > 0) {
          const date = new Date();
          date.setDate(date.getDate() + response.remaining_days);
          endDate = date.toISOString();
        }
        
        setFreeTrialInfo({
          remainingDays: response.remaining_days,
          endDate: endDate || new Date().toISOString(),
          isActive: response.remaining_days > 0
        });
        console.log('Set free trial info:', {
          remainingDays: response.remaining_days,
          endDate: endDate
        });
      } else {
        // No active trial
        setFreeTrialInfo(null);
      }
    } catch (error) {
      console.error('Error fetching free trial info:', error);
      setFreeTrialInfo(null);
    } finally {
      setIsLoadingTrial(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date unavailable';
    }
  };

  const formatRemainingTime = (remainingDays: number): string => {
    if (remainingDays <= 0) return 'Expired';
    if (remainingDays === 1) return '1 day left';
    return `${remainingDays} days left`;
  };

  const getTrialProgressPercentage = (): number => {
    if (!effectiveFreeTrialInfo) return 0;
    const totalDays = 14;
    const usedDays = totalDays - effectiveFreeTrialInfo.remainingDays;
    return Math.min(100, Math.max(0, (usedDays / totalDays) * 100));
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleUpgradeClick = () => {
    setFreeTrialDropdownOpen(false);
    navigate('/select-package');
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setNotificationPopupOpen(!notificationPopupOpen);
  };

  const index = useMemo(
    () => [
      { title: 'Dashboard', path: '/dashboard/overview', keywords: ['home', 'overview', 'metrics'] },
      { title: 'Notifications', path: '/notifications', keywords: ['alerts', 'messages', 'updates', 'bell'] },
      { title: 'Schedule', path: '/schedule/events', keywords: ['calendar', 'events'] },
      { title: 'Learning', path: '/learning?category=business-plan', keywords: ['modules', 'courses'] },
      { title: 'Community', path: '/community/discussions', keywords: ['discussions', 'networking', 'mentorship'] },
      { title: 'Funding Finder', path: '/funding', keywords: ['grants', 'loans', 'investors'] },
      { title: 'Marketplace', path: '/marketplace', keywords: ['products', 'store'] },
      { title: 'Mentorship', path: '/mentorship', keywords: ['mentors', 'peers'] },
      { title: 'Applications', path: '/applications', keywords: ['apps', 'store'] },
      { title: 'Profile', path: '/profile', keywords: ['settings', 'my profile', 'my information', 'account', 'user'] },
      { title: 'Settings', path: '/profile', keywords: ['profile', 'account', 'my info', 'my information'] },
      { title: 'Analytics', path: '/analytics', keywords: ['data', 'insights', 'reports', 'customers', 'growth'] },
      { title: 'Data Input', path: '/data-input', keywords: ['data', 'input', 'capture', 'customers', 'growth'] },
    ],
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as typeof index;
    return index.filter(i =>
      i.title.toLowerCase().includes(q) || i.keywords.some(k => k.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [index, query]);

  useEffect(() => {
    if (query.length > 0) setOpen(true);
    else setOpen(false);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    setQuery('');
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('businessReference');
    localStorage.removeItem('userPackage');
    localStorage.removeItem('userStatus');
    localStorage.removeItem('freeTrialStartDate');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setOpen(true)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
              {open && results.length > 0 && (
                <div className="absolute mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <ul className="py-1">
                    {results.map((r) => (
                      <li key={r.path}>
                        <button
                          onClick={() => handleSelect(r.path)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                        >
                          <div className="font-medium text-gray-900">{r.title}</div>
                          <div className="text-xs text-gray-500">{r.keywords.join(', ')}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Free Trial Indicator - Show for FREE_TRIAL users (details only if trial info available) */}
          {isFreeTrial && (
            <div ref={freeTrialRef} className="relative">
              <button
                onClick={() => {
                  if (!effectiveFreeTrialInfo) {
                    handleUpgradeClick();
                    return;
                  }
                  setFreeTrialDropdownOpen(!freeTrialDropdownOpen);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:border-green-300 transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Free Trial</span>
                </div>

                {effectiveFreeTrialInfo ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      {effectiveFreeTrialInfo.remainingDays > 0
                        ? formatRemainingTime(effectiveFreeTrialInfo.remainingDays)
                        : 'Expired'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-green-600 transition-transform ${
                        freeTrialDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                ) : (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    Active
                  </span>
                )}
              </button>

              {effectiveFreeTrialInfo && freeTrialDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-900">Free Trial Status</h3>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                        {effectiveFreeTrialInfo.remainingDays > 0 ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Trial Progress</span>
                        <span className="font-medium text-gray-900">
                          {14 - effectiveFreeTrialInfo.remainingDays} of 14 days used
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getTrialProgressPercentage())}`}
                          style={{ width: `${getTrialProgressPercentage()}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-blue-700 font-medium">Ends on</p>
                          <p className="text-sm text-gray-900">{formatDate(effectiveFreeTrialInfo.endDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                        <Gift className="w-4 h-4 text-amber-600" />
                        <div>
                          <p className="text-xs text-amber-700 font-medium">Remaining</p>
                          <p className="text-sm text-gray-900">{formatRemainingTime(effectiveFreeTrialInfo.remainingDays)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-3">
                        After trial ends, your account will switch to PENDING_PAYMENT status.
                        Upgrade now to continue uninterrupted access.
                      </p>
                      <button
                        onClick={handleUpgradeClick}
                        className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-colors"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notification Button */}
          <button
            ref={notificationButtonRef}
            onClick={handleNotificationClick}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {unreadCount > 0 ? (
              <BellRing className="w-5 h-5 text-primary-600" />
            ) : (
              <Bell className="w-5 h-5 text-gray-600" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPopup
            isOpen={notificationPopupOpen}
            onClose={() => setNotificationPopupOpen(false)}
            anchorEl={notificationButtonRef as React.RefObject<HTMLElement>}
          />

          <div ref={userMenuRef} className="relative flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="User menu"
            >
              <span className="text-white text-sm font-medium">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 
                 userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.fullName || userEmail || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email || userEmail}</div>
                  {userStatus && <div className="text-xs text-gray-500 mt-1">Status: {userStatus}</div>}
                  {freeTrialInfo && (
                    <div className="text-xs text-green-600 mt-1">
                      Trial: {freeTrialInfo.remainingDays} days left
                    </div>
                  )}
                  {userOrganisation && (
                    <div className="text-xs text-blue-600 mt-1">{userOrganisation}</div>
                  )}
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-gray-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/notifications');
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-gray-700"
                  >
                    Notifications
                  </button>
                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/admin/notifications');
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-gray-700"
                    >
                      Admin Panel
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-red-50 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;