// src/components/Header.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Add Link
import NotificationService from '../services/NotificationService'; // Add this import

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0); // Add state for unread count

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await NotificationService.getUserNotifications(true);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const index = useMemo(
    () => [
      { title: 'Dashboard', path: '/', keywords: ['home', 'overview', 'metrics'] },
      { title: 'Schedule', path: '/schedule', keywords: ['calendar', 'events'] },
      { title: 'Learning', path: '/learning', keywords: ['modules', 'courses'] },
      { title: 'Community', path: '/community', keywords: ['discussions', 'networking', 'mentorship'] },
      { title: 'Funding Finder', path: '/funding', keywords: ['grants', 'loans', 'investors'] },
      { title: 'Expert Sessions', path: '/experts', keywords: ['q&a', 'videos', 'mentors'] },
      { title: 'Toolkit', path: '/toolkit', keywords: ['tools', 'resources'] },
      { title: 'Marketplace', path: '/marketplace', keywords: ['products', 'store'] },
      { title: 'Mentorship Hub', path: '/mentorship-hub', keywords: ['mentors', 'peers'] },
      { title: 'Applications', path: '/applications', keywords: ['apps', 'store'] },
      // Profile/Settings aliases
      { title: 'Profile', path: '/profile', keywords: ['settings', 'my profile', 'my information', 'account', 'user'] },
      { title: 'Settings', path: '/profile', keywords: ['profile', 'account', 'my info', 'my information'] },
      // Analytics/Data aliases
      { title: 'Analytics', path: '/analytics', keywords: ['data', 'insights', 'reports', 'customers', 'growth'] },
      { title: 'Data Input', path: '/data-input', keywords: ['data', 'input', 'capture', 'customers', 'growth'] },
      // Notifications alias
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
            {/* Notification Button - CHANGED TO Link */}
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