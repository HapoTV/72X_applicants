import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [activeTab, setActiveTab] = useState<'applicants' | 'events' | 'learning' | 'mentorship' | 'ad' | 'profile' | 'monitoring' | 'notifications' | 'funding'>('applicants');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

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