// src/pages/adminDashboard/AdminSidebar.tsx
import { Users, Calendar, BookOpen, Handshake, DollarSign, Megaphone, ShieldAlert, CreditCard, Building2, KeyRound } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { organisationBrandingService } from '../../services/OrganisationBrandingService';

export type AdminTab = 'applicants' | 'events' | 'learning' | 'mentorship' | 'funding' | 'ad' | 'profile' | 'payments' | 'monitoring' | 'organisation' | 'admins' | 'business-ref';

interface AdminSidebarProps {
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab: _activeTab, onTabChange }: AdminSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin, isCocAdmin, userOrganisation } = useAuth();
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [organisationLogoUrl, setOrganisationLogoUrl] = useState<string>('');

    const userInitials = useMemo(() => {
        const base = (userOrganisation || 'Admin').toString();
        return base.split(/[._\s-]+/).filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();
    }, [userOrganisation]);

    useEffect(() => {
        const fetchLogo = async () => {
            if (!localStorage.getItem('authToken')) return;
            try {
                const res = await organisationBrandingService.getMine();
                setOrganisationLogoUrl(res?.logoUrl || '');
            } catch {
                setOrganisationLogoUrl('');
            }
        };

        void fetchLogo();
    }, []);

    const basePath = location.pathname.startsWith('/cocadmin') ? '/cocadmin' : '/admin';

    const baseMenuItems = [
        { id: 'applicants' as const, label: 'Applicants', icon: Users, path: `${basePath}/dashboard/applicants` },
        { id: 'events' as const, label: 'Events', icon: Calendar, path: `${basePath}/dashboard/events` },
        { id: 'learning' as const, label: 'Learning Material', icon: BookOpen, path: `${basePath}/dashboard/learning` },
        { id: 'mentorship' as const, label: 'Mentorship', icon: Handshake, path: `${basePath}/dashboard/mentorship` },
        { id: 'funding' as const, label: 'Funding', icon: DollarSign, path: `${basePath}/dashboard/funding` },
    ];

    const menuItems = isSuperAdmin
        ? [...baseMenuItems,
            { id: 'ad' as const, label: 'Ads', icon: Megaphone, path: `${basePath}/dashboard/ad` },
            { id: 'monitoring' as const, label: 'Monitoring', icon: ShieldAlert, path: `${basePath}/dashboard/monitoring` },
            { id: 'payments' as const, label: 'Payments', icon: CreditCard, path: `${basePath}/dashboard/payments` },
            { id: 'organisation' as const, label: 'Organisations', icon: Building2, path: `${basePath}/dashboard/organisation` },
          ]
        : isCocAdmin
            ? [...baseMenuItems,
                { id: 'organisation' as const, label: 'My Organisations', icon: Building2, path: `${basePath}/dashboard/organisation` },
                { id: 'business-ref' as const, label: 'Business Reference', icon: KeyRound, path: `${basePath}/dashboard/business-ref` },
              ]
            : [...baseMenuItems, { id: 'business-ref' as const, label: 'Business Reference', icon: KeyRound, path: `${basePath}/dashboard/business-ref` }];

    const handleUploadPictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingPicture(true);
            const res = await organisationBrandingService.uploadMyLogo(file);
            setOrganisationLogoUrl(res?.logoUrl || '');
            alert('Organisation picture updated successfully!');
        } catch { alert('Failed to upload organisation picture'); }
        finally { setUploadingPicture(false); if (uploadInputRef.current) uploadInputRef.current.value = ''; }
    };

    const handleRemoveLogo = async () => {
        try {
            setUploadingPicture(true);
            await organisationBrandingService.removeMyLogo();
            setOrganisationLogoUrl('');
            alert('Organisation logo removed successfully!');
        } catch (error) {
            console.error('Error removing organisation logo:', error);
            alert('Failed to remove organisation logo');
        } finally {
            setUploadingPicture(false);
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{userOrganisation || (isSuperAdmin ? 'Super Admin' : 'Organisation')}</h2>
            </div>
            <div className="flex flex-col items-center pb-4 mb-4 border-b border-gray-200">
                <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadPictureChange} />
                <button type="button" onClick={() => uploadInputRef.current?.click()} disabled={uploadingPicture}
                    className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-md overflow-hidden disabled:opacity-50">
                    {organisationLogoUrl ? <img src={organisationLogoUrl} alt="Organisation" className="w-full h-full object-cover" onError={() => setOrganisationLogoUrl('')} /> : <span className="text-white text-xl font-bold">{userInitials}</span>}
                </button>
                <p className="text-xs text-gray-500 mt-2">{uploadingPicture ? 'Uploading...' : 'Click to upload logo'}</p>
                {organisationLogoUrl && (
                    <button
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={uploadingPicture}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                        Remove logo
                    </button>
                )}
            </div>
            <nav className="space-y-1">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                        <button key={item.id} onClick={() => { onTabChange(item.id); navigate(item.path); }}
                            className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors ${active ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                            <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span className="font-medium">{item.label}</span>
                            {active && <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
