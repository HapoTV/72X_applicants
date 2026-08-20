// src/pages/adminDashboard/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { getActiveTabFromPathname } from './utils/adminTabRouting';
import { AdminDashboardTabContent } from './AdminDashboardTabs';

interface AdminDashboardProps {
  dashboardBasePath?: string;
}

export default function AdminDashboard({ dashboardBasePath }: AdminDashboardProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin, isCocAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('applicants');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userOrganisation');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    useEffect(() => {
        const path = location.pathname;
        const next = getActiveTabFromPathname(path);
        if (next) {
            setActiveTab(next);
            return;
        }
        if (!path.includes('/admin/') && !path.includes('/cocadmin/')) {
            navigate('/admin/dashboard/applicants', { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar onLogout={handleLogout} />
            <div className="flex">
                <AdminSidebar activeTab={activeTab} onTabChange={(tab, path) => {
                    setActiveTab(tab);
                    if (path) {
                        navigate(path);
                        return;
                    }
                    const base = dashboardBasePath || (location.pathname.startsWith('/cocadmin') ? '/cocadmin' : '/admin');
                    navigate(`${base.replace(/\/$/, '')}/dashboard/${tab}`);
                }} />
                <main className="flex-1 p-6">
                    <AdminDashboardTabContent activeTab={activeTab} isSuperAdmin={isSuperAdmin} isCocAdmin={isCocAdmin} />
                </main>
            </div>
        </div>
    );
}
