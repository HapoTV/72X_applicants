// src/pages/adminDashboard/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import ApplicantsTab from './tabs/ApplicantsTab';
import EventsTab from './tabs/EventsTab';
import FundingTab from './tabs/FundingTab';
import LearningTab from './tabs/LearningTab';
import MentorshipTab from './tabs/MentorshipTab';
import AdTab from './tabs/AdTab';
import AdminProfile from './tabs/AdminProfile';
import AdminMonitor from './tabs/AdminMonitor';
import AdminPaymentsTab from './tabs/AdminPaymentsTab';
import AdminOrganisationManagement from './tabs/AdminOrganisationManagement';
import AdminManagement from './tabs/AdminManagement';
import OrgAdminBusinessRefPanel from './tabs/OrgAdminBusinessRefPanel';
import CocOrganisationManagement from './tabs/CocOrganisationManagement';

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
        const adminBase = '/admin/dashboard/';
        const cocBase = '/cocadmin/dashboard/';
        const base = path.startsWith(cocBase) ? cocBase : adminBase;
        if (path.startsWith(base)) {
            const segment = path.slice(base.length).split('/')[0];
            const validTabs = [
                'applicants', 'events', 'learning', 'mentorship',
                'funding', 'ad', 'profile', 'monitoring', 'payments',
                'organisation', 'admins', 'business-ref'
            ] as const;
            if (segment && (validTabs as readonly string[]).includes(segment)) {
                setActiveTab(segment as AdminTab);
                return;
            }
        }
        if (!path.includes('/admin/') && !path.includes('/cocadmin/')) {
            navigate('/admin/dashboard/applicants', { replace: true });
        }
    }, [location.pathname, navigate]);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'applicants': return <ApplicantsTab />;
            case 'events': return <EventsTab />;
            case 'learning': return <LearningTab />;
            case 'mentorship': return <MentorshipTab />;
            case 'funding': return <FundingTab />;
            case 'ad': return isSuperAdmin ? <AdTab /> : <div className="p-8 text-center text-red-600">Access Denied</div>;
            case 'profile': return <AdminProfile />;
            case 'monitoring': return isSuperAdmin ? <AdminMonitor /> : <div className="p-8 text-center text-red-600">Access Denied</div>;
            case 'payments': return <AdminPaymentsTab />;
            case 'organisation':
                if (isSuperAdmin) return <AdminOrganisationManagement />;
                if (isCocAdmin) return <CocOrganisationManagement />;
                return <div className="p-8 text-center text-red-600">Access Denied</div>;
            case 'admins': return isSuperAdmin ? <AdminManagement /> : <div className="p-8 text-center text-red-600">Access Denied</div>;
            case 'business-ref': return !isSuperAdmin && !isCocAdmin ? <OrgAdminBusinessRefPanel /> : <div className="p-8 text-center text-red-600">Access Denied</div>;
            default: return <ApplicantsTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar onLogout={handleLogout} />
            <div className="flex">
                <AdminSidebar activeTab={activeTab} onTabChange={(tab) => {
                    setActiveTab(tab);
                    const base = dashboardBasePath || (location.pathname.startsWith('/cocadmin') ? '/cocadmin' : '/admin');
                    navigate(`${base.replace(/\/$/, '')}/dashboard/${tab}`);
                }} />
                <main className="flex-1 p-6">{renderActiveTab()}</main>
            </div>
        </div>
    );
}
