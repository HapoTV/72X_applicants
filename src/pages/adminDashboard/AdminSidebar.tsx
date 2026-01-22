// src/components/admin/AdminSidebar.tsx
import {
    Users,
    BookOpen,
    BarChart3,
    Settings,
    Handshake,
    User,
    Bell
} from 'lucide-react';

export type AdminTab =
    | 'users'
    | 'content'
    | 'analytics'
    | 'settings'
    | 'support'
    | 'profile'
    | 'notifications'
    | 'applicants'
    | 'events'
    | 'learning'
    | 'mentorship'
    | 'funding';

interface AdminSidebarProps {
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const menuItems = [
        { id: 'users' as const, label: 'User Management', icon: Users },
        { id: 'content' as const, label: 'Content Management', icon: BookOpen },
        { id: 'analytics' as const, label: 'Analytics & Reports', icon: BarChart3 },
        { id: 'settings' as const, label: 'System Settings', icon: Settings },
        { id: 'support' as const, label: 'Support Tickets', icon: Handshake },
        { id: 'profile' as const, label: 'Profile', icon: User },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button 
                            key={item.id}
                            onClick={() => onTabChange(item.id)} 
                            className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                                activeTab === item.id 
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
                
                {/* Notifications Management */}
                <button 
                    onClick={() => onTabChange('notifications')} 
                    className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors border-t border-gray-200 mt-4 pt-4 ${
                        activeTab === 'notifications' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                    <Bell className={`w-5 h-5 ${activeTab === 'notifications' ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">Notifications</span>
                </button>
            </nav>
        </aside>
    );
}