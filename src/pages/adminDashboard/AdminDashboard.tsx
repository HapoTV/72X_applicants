// src/pages/adminDashboard/AdminDashboard.tsx
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { getActiveTabFromPathname } from './utils/adminTabRouting';
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
import CocBusinessRefPanel from './tabs/CocBusinessRefPanel';

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

    const accessDenied = <div className="p-8 text-center text-red-600">Access Denied</div>;
    const tabRenderers: Record<AdminTab, () => ReactNode> = {
        applicants: () => <ApplicantsTab />,
        events: () => <EventsTab />,
        learning: () => <LearningTab isCocAdmin={isCocAdmin} />,
        mentorship: () => <MentorshipTab />,
        funding: () => <FundingTab />,
        ad: () => (isSuperAdmin ? <AdTab /> : accessDenied),
        profile: () => <AdminProfile />,
        payments: () => <AdminPaymentsTab />,
        monitoring: () => (isSuperAdmin ? <AdminMonitor /> : accessDenied),
        organisation: () => {
            if (isSuperAdmin) return <AdminOrganisationManagement />;
            if (isCocAdmin) return <CocOrganisationManagement />;
            return accessDenied;
        },
        admins: () => (isSuperAdmin ? <AdminManagement /> : accessDenied),
        'business-ref': () => {
            if (isCocAdmin) return <CocBusinessRefPanel />;
            if (!isSuperAdmin) return <OrgAdminBusinessRefPanel />;
            return accessDenied;
        },
    };

    const renderActiveTab = () => {
        return tabRenderers[activeTab]?.() ?? <ApplicantsTab />;
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
