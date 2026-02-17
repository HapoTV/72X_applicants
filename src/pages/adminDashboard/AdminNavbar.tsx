// src/components/admin/AdminNavbar.tsx
import React, { useState, useEffect } from 'react';
import { Bell, BellRing, LogOut, User, ChevronDown, Shield, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationService from '../../services/NotificationService';

interface AdminNavbarProps {
    onLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onLogout }) => {
    const { user, isSuperAdmin, userOrganisation } = useAuth();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);

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

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side: Logo and Brand */}
                    <div className="flex items-center">
                        <img src="/Logo2.png" alt="SeventyTwoX Logo" className="w-12 h-12" />
                        <span className="text-xl font-bold ml-3 hidden md:inline">
                            {isSuperAdmin ? 'Super Admin' : 'Admin'} Dashboard
                        </span>
                        <span className="text-xl font-bold ml-3 md:hidden">
                            {isSuperAdmin ? 'Super' : 'Admin'}
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
                        {isSuperAdmin && (
                            <div className="hidden md:flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs font-medium">Super Admin</span>
                            </div>
                        )}

                        {/* Notification Button */}
                        <Link
                            to="/admin/notifications"
                            className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
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
                        </Link>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-700">
                                        {user?.fullName?.split(' ')[0] || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                        {user?.email?.split('@')[0] || 'admin'}
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
                                                {user?.fullName || 'Admin User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email || 'admin@example.com'}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                    {user?.role || 'ADMIN'}
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