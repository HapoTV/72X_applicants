// src/pages/adminDashboard/AdminNavbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminNavbarNotifications } from './hooks/useAdminNavbarNotifications';
import { AdminNavbarBrand } from './components/AdminNavbarBrand';
import { AdminNavbarNotifications } from './components/AdminNavbarNotifications';
import { AdminNavbarUserMenu } from './components/AdminNavbarUserMenu';

interface AdminNavbarProps {
    onLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onLogout }) => {
    const { user, isSuperAdmin, userOrganisation } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { unreadCount, notificationPopupOpen, setNotificationPopupOpen } = useAdminNavbarNotifications();

    const notificationButtonRef = useRef<HTMLButtonElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        } else if (role === 'COC_ADMIN') {
            navigate('/login/cocadmin');
        } else {
            navigate('/login/asadmin');
        }
    };

    const isCocAdminDashboard = location.pathname.startsWith('/cocadmin/');
    const profilePath = isCocAdminDashboard ? '/cocadmin/dashboard/profile' : '/admin/dashboard/profile';
    const notificationsPath = isCocAdminDashboard ? '/cocadmin/notifications' : '/admin/notifications';

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <AdminNavbarBrand isSuperAdmin={isSuperAdmin} userOrganisation={userOrganisation} />

                    <div className="flex items-center space-x-4">
                        {!isSuperAdmin && (
                            <div className="hidden md:flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs font-medium">Admin</span>
                            </div>
                        )}

                        <AdminNavbarNotifications
                            unreadCount={unreadCount}
                            notificationPopupOpen={notificationPopupOpen}
                            notificationButtonRef={notificationButtonRef}
                            onToggle={handleNotificationClick}
                            onClose={() => setNotificationPopupOpen(false)}
                        />

                        <div className="relative" ref={userMenuRef}>
                            <AdminNavbarUserMenu
                                user={user}
                                isSuperAdmin={isSuperAdmin}
                                userOrganisation={userOrganisation}
                                showUserMenu={showUserMenu}
                                profilePath={profilePath}
                                notificationsPath={notificationsPath}
                                onToggleMenu={() => setShowUserMenu(!showUserMenu)}
                                onCloseMenu={() => setShowUserMenu(false)}
                                onLogout={handleLogout}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;