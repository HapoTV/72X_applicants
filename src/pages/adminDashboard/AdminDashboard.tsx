import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';
import ApplicantsTab from './tabs/ApplicantsTab';
import EventsTab from './tabs/EventsTab';
import FundingTab from './tabs/FundingTab';
import AdminProfile from './tabs/AdminProfile';
import AdminNotifications from './AdminNotifications';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AdminTab>('applicants');

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
            
            case 'funding':
                return <FundingTab />;
            case 'profile':
                return <AdminProfile />;
            case 'notifications':
                return <AdminNotifications/>;   

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