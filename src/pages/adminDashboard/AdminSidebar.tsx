// src/components/admin/AdminSidebar.tsx
import {
	Users,
	Calendar,
	BookOpen,
	Handshake,
	DollarSign,
	User,
	Megaphone,
	ShieldAlert,
	CreditCard,
	Bell,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export type AdminTab =
	| 'applicants'
	| 'events'
	| 'learning'
	| 'mentorship'
	| 'funding'
	| 'ad'
	| 'payments'
	| 'monitoring'
	| 'profile'
	| 'notifications'
	| 'analytics';

interface AdminSidebarProps {
	activeTab: AdminTab;
	onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const navigate = useNavigate();

    const menuItems = [
		{ id: 'applicants' as const, label: 'Applicants', icon: Users },
		{ id: 'ad' as const, label: 'Ads', icon: Megaphone },
		{ id: 'events' as const, label: 'Events', icon: Calendar },
		{ id: 'learning' as const, label: 'Learning Material', icon: BookOpen },
		{ id: 'mentorship' as const, label: 'Mentorship', icon: Handshake },
		{ id: 'funding' as const, label: 'Funding', icon: DollarSign },
		{ id: 'payments' as const, label: 'Payments', icon: CreditCard },
		{ id: 'monitoring' as const, label: 'Monitoring', icon: ShieldAlert },
	];

    const handleTabClick = (tabId: string) => {
		onTabChange(tabId as AdminTab);
		navigate(`/admin/dashboard/${tabId}`);
	};

    const isActive = (tabId: string) => {
        return activeTab === tabId;
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin Dashboard</h2>
                <p className="text-sm text-gray-600">Management Portal</p>
            </div>
            
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.id);
                    
                    return (
                        <button 
                            key={item.id}
                            onClick={() => handleTabClick(item.id)} 
                            className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                                active 
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span className="font-medium">{item.label}</span>
                            {active && (
                                <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                        </button>
                    );
                })}
                
                <button 
                    onClick={() => onTabChange('notifications')} 
                    className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                        activeTab === 'notifications' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                    <Bell className={`w-5 h-5 ${activeTab === 'notifications' ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">Notifications</span>
                </button>

                <button 
                    onClick={() => handleTabClick('profile')} 
                    className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                        isActive('profile')
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                    <User className={`w-5 h-5 ${isActive('profile') ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">Profile</span>
                    {isActive('profile') && (
                        <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                </button>
            </nav>
        </aside>
    );
}