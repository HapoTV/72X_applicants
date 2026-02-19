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
	Building2,
	Shield,
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export type AdminTab =
	| 'applicants'
	| 'events'
	| 'learning'
	| 'mentorship'
	| 'funding'
	| 'ad'
	| 'payments'
	| 'monitoring'
	| 'organisation'
	| 'admins';

interface AdminSidebarProps {
	activeTab: AdminTab;
	onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin, userOrganisation } = useAuth();

    // Base menu items for all admins (including super admins)
    const baseMenuItems = [
		{ id: 'applicants' as const, label: 'Applicants', icon: Users, path: '/admin/dashboard/applicants' },
		{ id: 'events' as const, label: 'Events', icon: Calendar, path: '/admin/dashboard/events' },
		{ id: 'learning' as const, label: 'Learning Material', icon: BookOpen, path: '/admin/dashboard/learning' },
		{ id: 'mentorship' as const, label: 'Mentorship', icon: Handshake, path: '/admin/dashboard/mentorship' },
		{ id: 'funding' as const, label: 'Funding', icon: DollarSign, path: '/admin/dashboard/funding' },
	];

    // Items visible to super admins only
    const superAdminOnlyItems = [
		{ id: 'ad' as const, label: 'Ads', icon: Megaphone, path: '/admin/dashboard/ad' },
		{ id: 'monitoring' as const, label: 'Monitoring', icon: ShieldAlert, path: '/admin/dashboard/monitoring' },
		{ id: 'payments' as const, label: 'Payments', icon: CreditCard, path: '/admin/dashboard/payments' },
		{ id: 'organisation' as const, label: 'Organisations', icon: Building2, path: '/admin/dashboard/organisation' },
	];

    // Filter menu items based on role
    const menuItems = isSuperAdmin 
        ? [...baseMenuItems, ...superAdminOnlyItems] // Super admins see base + super admin items
        : baseMenuItems; // Regular admins only see base items

    const handleTabClick = (item: typeof menuItems[0]) => {
        onTabChange(item.id);
        navigate(item.path);
    };

    const isActive = (item: typeof menuItems[0]) => {
        return location.pathname === item.path;
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin Dashboard</h2>
                <p className="text-sm text-gray-600">
                    {isSuperAdmin ? 'Super Admin Portal' : 'Management Portal'}
                </p>
                {userOrganisation && !isSuperAdmin && (
                    <p className="text-xs text-primary-600 mt-1 font-medium">
                        Organisation: {userOrganisation}
                    </p>
                )}
            </div>
            
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    
                    return (
                        <button 
                            key={item.id}
                            onClick={() => handleTabClick(item)} 
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
        </aside>
    );
}