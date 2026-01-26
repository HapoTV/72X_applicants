import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import ApplicantsTab from './tabs/ApplicantsTab';
import EventsTab from './tabs/EventsTab';
import LearningTab from './tabs/LearningTab';
import MentorshipTab from './tabs/MentorshipTab';
import FundingTab from './tabs/FundingTab';
import AdTab from './tabs/AdTab';
import AdminProfile from './tabs/AdminProfile';
import AdminMonitor from './tabs/AdminMonitor';
import AdminNotifications from './tabs/AdminNotifications';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'applicants' | 'events' | 'learning' | 'mentorship' | 'ad' | 'profile' | 'funding'>('applicants');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    // Initialize active tab from URL on mount
    useEffect(() => {
        const base = '/admin/dashboard/';
        if (location.pathname.startsWith(base)) {
            const segment = location.pathname.slice(base.length).split('/')[0];
            const validTabs = ['applicants', 'events', 'learning', 'mentorship', 'funding', 'ad', 'profile'] as const;
            if (segment && (validTabs as readonly string[]).includes(segment)) {
                setActiveTab(segment as typeof validTabs[number]);
                return;
            }
        }
        // Default to applicants if no valid segment
        navigate('/admin/dashboard/applicants', { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reflect activeTab in URL when it changes
    useEffect(() => {
        navigate(`/admin/dashboard/${activeTab}`, { replace: true });
    }, [activeTab, navigate]);

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
                <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <main className="flex-1 p-6">
                    {renderActiveTab()}
                </main>
            </div>
        </div>
    );
}
