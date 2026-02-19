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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/AuthService';

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
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState<string>(() => {
        try {
            const raw = localStorage.getItem('user');
            const parsed = raw ? JSON.parse(raw) : null;
            return parsed?.profileImageUrl || '';
        } catch {
            return '';
        }
    });
    const [isHydratingProfileImage, setIsHydratingProfileImage] = useState(false);

    const userInitials = useMemo(() => {
        const base = (userOrganisation || 'Admin').toString();
        return base
            .split(/[._\s-]+/)
            .filter(Boolean)
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }, [userOrganisation]);

    useEffect(() => {
        const refreshProfileImage = () => {
            try {
                const raw = localStorage.getItem('user');
                const parsed = raw ? JSON.parse(raw) : null;
                setProfileImageUrl(parsed?.profileImageUrl || '');
            } catch {
                setProfileImageUrl('');
            }
        };

        const hydrateFromBackendIfMissing = async () => {
            if (isHydratingProfileImage) return;
            const token = localStorage.getItem('authToken');
            if (!token) return;
            if (profileImageUrl) return;

            setIsHydratingProfileImage(true);
            try {
                const userData = await authService.getCurrentUser();
                const url = userData.profileImageUrl || '';
                if (url) {
                    setProfileImageUrl(url);
                    try {
                        const raw = localStorage.getItem('user');
                        const parsed = raw ? JSON.parse(raw) : {};
                        const nextUser = { ...parsed, profileImageUrl: url };
                        localStorage.setItem('user', JSON.stringify(nextUser));
                    } catch (e) {}
                }
            } catch (error) {
                console.error('Error hydrating profile image:', error);
            } finally {
                setIsHydratingProfileImage(false);
            }
        };

        const handleUserUpdated = () => {
            refreshProfileImage();
        };

        window.addEventListener('storage', refreshProfileImage);
        window.addEventListener('user-updated', handleUserUpdated as EventListener);
        refreshProfileImage();
        void hydrateFromBackendIfMissing();

        return () => {
            window.removeEventListener('storage', refreshProfileImage);
            window.removeEventListener('user-updated', handleUserUpdated as EventListener);
        };
    }, [isHydratingProfileImage, profileImageUrl]);

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

    const handleUploadPictureClick = () => {
        uploadInputRef.current?.click();
    };

    const handleUploadPictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingPicture(true);
            const updatedUser = await authService.updateProfileImage(file);
            setProfileImageUrl(updatedUser.profileImageUrl || '');
            window.dispatchEvent(new CustomEvent('user-updated'));
            alert('Organisation picture updated successfully!');
        } catch (error) {
            console.error('Error uploading organisation picture:', error);
            alert('Failed to upload organisation picture');
        } finally {
            setUploadingPicture(false);
            if (uploadInputRef.current) {
                uploadInputRef.current.value = '';
            }
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                    {userOrganisation || (isSuperAdmin ? 'Super Admin' : 'Organisation')}
                </h2>
            </div>

            <div className="flex flex-col items-center pb-4 mb-4 border-b border-gray-200">
                <input
                    ref={uploadInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadPictureChange}
                />
                <button
                    type="button"
                    onClick={handleUploadPictureClick}
                    disabled={uploadingPicture}
                    className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-md overflow-hidden disabled:opacity-50"
                    aria-label="Upload organisation picture"
                    title="Upload organisation picture"
                >
                    {profileImageUrl ? (
                        <img
                            src={profileImageUrl}
                            alt="Organisation"
                            className="w-full h-full object-cover"
                            onError={() => setProfileImageUrl('')}
                        />
                    ) : (
                        <span className="text-white text-xl font-bold">{userInitials}</span>
                    )}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                    {uploadingPicture ? 'Uploading...' : 'Click to upload logo'}
                </p>
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