import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';
import ApplicantsTab from './tabs/ApplicantsTab';
import EventsTab from './tabs/EventsTab';
import FundingTab from './tabs/FundingTab';
import AdTab from './tabs/AdTab';
import LearningTab from './tabs/LearningTab';
import MentorshipTab from './tabs/MentorshipTab';
import AdminProfile from './tabs/AdminProfile';
import AdminMonitor from './tabs/AdminMonitor';
import AdminPaymentsPage from '../../pages/payment/AdminPaymentsPage';
import AdminAnalytics from './tabs/AdminAnalytics';
import AdminNotifications from './AdminNotifications';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<AdminTab>('applicants');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    // Initialize active tab from URL on mount
    useEffect(() => {
        const path = location.pathname;
        
        if (path === '/admin/analytics') {
            setActiveTab('analytics');
            return;
        }
        
        if (path === '/admin/notifications') {
            setActiveTab('notifications');
            return;
        }
        
        const base = '/admin/dashboard/';
        if (path.startsWith(base)) {
            const segment = path.slice(base.length).split('/')[0];
            const validTabs = ['applicants', 'events', 'learning', 'mentorship', 'funding', 'ad', 'payments', 'profile', 'monitoring'] as const;
            if (segment && (validTabs as readonly string[]).includes(segment)) {
                setActiveTab(segment as typeof validTabs[number]);
                return;
            }
        }
        
        // Default to applicants if no valid segment
        navigate('/admin/dashboard/applicants', { replace: true });
    }, [location.pathname, navigate]);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'applicants':
                return <ApplicantsTab />;
            case 'events':
                return <EventsTab />;
            case 'learning':
                return <LearningTab />;
            case 'mentorship':
                return <MentorshipTab />;
            case 'funding':
                return <FundingTab />;
            case 'ad':
                return <AdTab />;
            case 'profile':
                return <AdminProfile />;
            case 'monitoring':
                return <AdminMonitor />;
            case 'payments':
                return <AdminPaymentsPage />;
            case 'analytics':
                return <AdminAnalytics />;
            case 'notifications':
                return <AdminNotifications />;
            default:
                return <ApplicantsTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar onLogout={handleLogout} />
            <div className="flex">
                <AdminSidebar activeTab={activeTab} onTabChange ={(tab) => setActiveTab(tab)} />
                <main className="flex-1 p-6">
                    {renderActiveTab()}
                </main>
            </div>
        </div>
    );
}