// src/pages/adminDashboard/AdminNavbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, LogOut, User, ChevronDown, Shield, Building2, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';
import NotificationPopup from '../../components/NotificationPopup';

interface AdminNavbarProps {
    onLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onLogout }) => {
    const { user, isSuperAdmin, userOrganisation } = useAuth();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
    const notificationButtonRef = useRef<HTMLButtonElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            // Try to get unread count from dedicated endpoint
            const count = await NotificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            // Fallback to fetching notifications and counting
            try {
                const notifications = await NotificationService.getUserNotifications(true);
                setUnreadCount(notifications.length);
            } catch (fallbackError) {
                console.error('Error fetching unread count:', fallbackError);
            }
        }
    };

    const handleNotificationClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setNotificationPopupOpen(!notificationPopupOpen);
    };

    const handleLogout = () => {
        onLogout();
        
        // Navigate to appropriate login page based on role
        const role = user?.role?.toUpperCase() || '';
        if (role === 'SUPER_ADMIN') {
            navigate('/login/haposuperadmin');
        } else {
            navigate('/login/asadmin');
        }
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side: Logo and Brand */}
                    <div className="flex items-center">
                        <img src="/Logo2.png" alt="SeventyTwoX Logo" className="w-12 h-12" />
                        <span className="text-xl font-bold ml-3 hidden md:inline">
                            {isSuperAdmin ? (
                                <span className="flex items-center">
                                    <Crown className="w-5 h-5 text-purple-600 mr-1" />
                                    Admin Dashboard
                                </span>
                            ) : (
                                'Admin Dashboard'
                            )}
                        </span>
                        <span className="text-xl font-bold ml-3 md:hidden">
                            Admin
                        </span>

                        {userOrganisation && !isSuperAdmin && (
                            <span className="ml-3 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hidden md:inline">
                                {userOrganisation}
                            </span>
                        )}
                    </div>

                    {/* Right side: Controls */}
                    <div className="flex items-center space-x-4">
                        {/* Role Badge */}
                        {!isSuperAdmin && (
                            <div className="hidden md:flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs font-medium">Admin</span>
                            </div>
                        )}

                        {/* Notification Button */}
                        <button
                            ref={notificationButtonRef}
                            onClick={handleNotificationClick}
                            className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                            title="Notifications"
                        >
                            {unreadCount > 0 ? (
                                <BellRing className="w-5 h-5" />
                            ) : (
                                <Bell className="w-5 h-5" />
                            )}
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <NotificationPopup
                            isOpen={notificationPopupOpen}
                            onClose={() => setNotificationPopupOpen(false)}
                            anchorEl={notificationButtonRef as React.RefObject<HTMLElement>}
                        />

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isSuperAdmin ? 'bg-purple-100' : 'bg-blue-100'
                                }`}>
                                    {isSuperAdmin ? (
                                        <Crown className="w-4 h-4 text-purple-600" />
                                    ) : (
                                        <User className="w-4 h-4 text-blue-600" />
                                    )}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-700">
                                        {user?.fullName?.split(' ')[0] || (isSuperAdmin ? 'Super Admin' : 'Admin')}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                        {user?.email?.split('@')[0] || (isSuperAdmin ? 'superadmin' : 'admin')}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.fullName || (isSuperAdmin ? 'Super Admin' : 'Admin User')}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email || (isSuperAdmin ? 'superadmin@example.com' : 'admin@example.com')}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    isSuperAdmin 
                                                        ? 'bg-purple-100 text-purple-700' 
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {user?.role || (isSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN')}
                                                </span>
                                                {userOrganisation && !isSuperAdmin && (
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center">
                                                        <Building2 className="w-3 h-3 mr-1" />
                                                        {userOrganisation}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/admin/dashboard/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Profile Settings
                                            </Link>
                                            <Link
                                                to="/admin/notifications"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Notification Center
                                            </Link>
                                            {isSuperAdmin && (
                                                <Link
                                                    to="/admin/organisations"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Manage Organisations
                                                </Link>
                                            )}
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;