// src/pages/adminDashboard/AdminSidebar.tsx
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminMenuItems } from './utils/adminMenuItems';
import { useOrganisationLogo } from './hooks/useOrganisationLogo';

export type AdminTab = 'applicants' | 'events' | 'learning' | 'mentorship' | 'funding' | 'ad' | 'profile' | 'payments' | 'monitoring' | 'organisation' | 'admins' | 'business-ref';

interface AdminSidebarProps {
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab: _activeTab, onTabChange }: AdminSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin, isCocAdmin, userOrganisation } = useAuth();
    const {
        uploadInputRef,
        uploadingPicture,
        organisationLogoUrl,
        handleUploadPictureChange,
        handleRemoveLogo,
        clearLogo,
    } = useOrganisationLogo();

    const userInitials = useMemo(() => {
        const base = (userOrganisation || 'Admin').toString();
        return base.split(/[._\s-]+/).filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();
    }, [userOrganisation]);

    const basePath = location.pathname.startsWith('/cocadmin') ? '/cocadmin' : '/admin';
    const menuItems = useMemo(() => {
        return getAdminMenuItems({ basePath, isSuperAdmin, isCocAdmin });
    }, [basePath, isCocAdmin, isSuperAdmin]);

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{userOrganisation || (isSuperAdmin ? 'Super Admin' : 'Organisation')}</h2>
            </div>
            <div className="flex flex-col items-center pb-4 mb-4 border-b border-gray-200">
                <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadPictureChange} />
                <button type="button" onClick={() => uploadInputRef.current?.click()} disabled={uploadingPicture}
                    className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-md overflow-hidden disabled:opacity-50">
                    {organisationLogoUrl ? <img src={organisationLogoUrl} alt="Organisation" className="w-full h-full object-cover" onError={clearLogo} /> : <span className="text-white text-xl font-bold">{userInitials}</span>}
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
