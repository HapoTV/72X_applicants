// src/components/Header.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Bell, Search, LogOut, Clock, Gift, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationService from '../services/NotificationService';
import UserSubscriptionService from '../services/UserSubscriptionService';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userStatus = localStorage.getItem('userStatus');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [freeTrialDropdownOpen, setFreeTrialDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const freeTrialRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [freeTrialInfo, setFreeTrialInfo] = useState<{
    remainingDays: number;
    endDate: string;
    isActive: boolean;
  } | null>(null);

  // Check if user is on free trial
  const isFreeTrial = userStatus === 'FREE_TRIAL' || freeTrialInfo?.isActive;

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFreeTrial) {
      fetchFreeTrialInfo();
      // Update every hour to show accurate remaining time
      const interval = setInterval(fetchFreeTrialInfo, 3600000);
      return () => clearInterval(interval);
    }
  }, [isFreeTrial]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (freeTrialRef.current && !freeTrialRef.current.contains(event.target as Node)) {
        setFreeTrialDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await NotificationService.getUserNotifications(true);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchFreeTrialInfo = async () => {
    try {
      const response = await UserSubscriptionService.getFreeTrialStatus();
      if (response.success && response.remainingDays !== undefined) {
        setFreeTrialInfo({
          remainingDays: response.remainingDays,
          endDate: response.trialEndDate || calculateEndDate(response.remainingDays),
          isActive: true
        });
      } else {
        // If API doesn't return data, calculate based on user status
        if (isFreeTrial) {
          // Calculate approximate end date (14 days from start)
          // You might want to store the actual start date somewhere
          const startDate = localStorage.getItem('freeTrialStartDate') || new Date().toISOString();
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 14);
          const remainingDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          setFreeTrialInfo({
            remainingDays: Math.max(0, remainingDays),
            endDate: endDate.toISOString(),
            isActive: remainingDays > 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching free trial info:', error);
    }
  };

  const calculateEndDate = (remainingDays: number): string => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + remainingDays);
    return endDate.toISOString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRemainingTime = (remainingDays: number): string => {
    if (remainingDays === 0) return 'Ends today';
    if (remainingDays === 1) return '1 day left';
    return `${remainingDays} days left`;
  };

  const getTrialProgressPercentage = (): number => {
    if (!freeTrialInfo) return 0;
    const totalDays = 14;
    const usedDays = totalDays - freeTrialInfo.remainingDays;
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

  const index = useMemo(
    () => [
      { title: 'Dashboard', path: '/', keywords: ['home', 'overview', 'metrics'] },
      { title: 'Notifications', path: '/notifications', keywords: ['alerts', 'messages', 'updates', 'bell'] },
      { title: 'Schedule', path: '/schedule', keywords: ['calendar', 'events'] },
      { title: 'Learning', path: '/learning', keywords: ['modules', 'courses'] },
      { title: 'Community', path: '/community', keywords: ['discussions', 'networking', 'mentorship'] },
      { title: 'Funding Finder', path: '/funding', keywords: ['grants', 'loans', 'investors'] },
      { title: 'Expert Sessions', path: '/experts', keywords: ['q&a', 'videos', 'mentors'] },
      { title: 'Toolkit', path: '/toolkit', keywords: ['tools', 'resources'] },
      { title: 'Marketplace', path: '/marketplace', keywords: ['products', 'store'] },
      { title: 'Mentorship Hub', path: '/mentorship-hub', keywords: ['mentors', 'peers'] },
      { title: 'Applications', path: '/applications', keywords: ['apps', 'store'] },
      { title: 'Profile', path: '/profile', keywords: ['settings', 'my profile', 'my information', 'account', 'user'] },
      { title: 'Settings', path: '/profile', keywords: ['profile', 'account', 'my info', 'my information'] },
      { title: 'Analytics', path: '/analytics', keywords: ['data', 'insights', 'reports', 'customers', 'growth'] },
      { title: 'Data Input', path: '/data-input', keywords: ['data', 'input', 'capture', 'customers', 'growth'] },
      { title: 'Notifications', path: '/notifications', keywords: ['alerts', 'messages', 'updates', 'bell'] },
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
          {/* Free Trial Indicator - Only show when user is on free trial */}
          {isFreeTrial && freeTrialInfo && (
            <div ref={freeTrialRef} className="relative">
              <button
                onClick={() => setFreeTrialDropdownOpen(!freeTrialDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:border-green-300 transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Free Trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    {formatRemainingTime(freeTrialInfo.remainingDays)}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-green-600 transition-transform ${
                    freeTrialDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>

              {/* Free Trial Dropdown */}
              {freeTrialDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-900">Free Trial Status</h3>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                        Active
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Trial Progress</span>
                        <span className="font-medium text-gray-900">
                          {14 - freeTrialInfo.remainingDays} of 14 days used
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
                          <p className="text-sm text-gray-900">{formatDate(freeTrialInfo.endDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                        <Gift className="w-4 h-4 text-amber-600" />
                        <div>
                          <p className="text-xs text-amber-700 font-medium">Remaining</p>
                          <p className="text-sm text-gray-900">{formatRemainingTime(freeTrialInfo.remainingDays)}</p>
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
          <Link
            to="/notifications"
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;