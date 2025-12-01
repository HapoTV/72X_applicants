// src/components/admin/AdminSidebar.tsx
import { 
    Users, 
    Calendar, 
    BookOpen, 
    Handshake, 
    DollarSign,
    User 
} from 'lucide-react';

interface AdminSidebarProps {
    activeTab: 'applicants' | 'events' | 'learning' | 'mentorship' | 'funding' | 'profile';
    onTabChange: (tab: 'applicants' | 'events' | 'learning' | 'mentorship' | 'funding' | 'profile') => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const menuItems = [
        { id: 'applicants' as const, label: 'Applicants', icon: Users },
        { id: 'events' as const, label: 'Events', icon: Calendar },
        { id: 'learning' as const, label: 'Learning Material', icon: BookOpen },
        { id: 'mentorship' as const, label: 'Mentorship', icon: Handshake },
        { id: 'funding' as const, label: 'Funding', icon: DollarSign },
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
            </nav>
        </aside>
    );
}