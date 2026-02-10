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
    BarChart3,
    Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
    activeTab: 'applicants' | 'events' | 'learning' | 'mentorship' | 'funding' | 'ad' | 'profile' | 'monitoring' | 'payments' | 'analytics';
    onTabChange: (tab: 'applicants' | 'events' | 'learning' | 'mentorship' | 'funding' | 'ad' | 'monitoring' | 'profile' | 'payments' | 'analytics') => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'applicants' as const, label: 'Applicants', icon: Users },
        { id: 'ad' as const, label: 'Ads', icon: Megaphone },
        { id: 'events' as const, label: 'Events', icon: Calendar },
        { id: 'learning' as const, label: 'Learning Material', icon: BookOpen },
        { id: 'mentorship' as const, label: 'Mentorship', icon: Handshake },
        { id: 'funding' as const, label: 'Funding', icon: DollarSign },
        { id: 'payments' as const, label: 'Payments', icon: CreditCard },
        { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
        { id: 'monitoring' as const, label: 'Monitoring', icon: ShieldAlert },
        { id: 'profile' as const, label: 'Profile', icon: User },
    ];

    const handleTabClick = (tabId: string) => {
        if (tabId === 'payments') {
            navigate('/admin/payments');
        } else if (tabId === 'analytics') {
            navigate('/admin/analytics');
        } else {
            onTabChange(tabId as any);
            navigate(`/admin/dashboard/${tabId}`);
        }
    };

    const isActive = (tabId: string) => {
        if (tabId === 'payments') {
            return location.pathname === '/admin/payments';
        }
        if (tabId === 'analytics') {
            return location.pathname === '/admin/analytics';
        }
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
            </nav>

            {/* Bottom Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                    onClick={() => navigate('/admin/settings')}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 hover:bg-gray-50 text-gray-700"
                >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </aside>
    );
}