// src/pages/adminDashboard/AdminSidebar.tsx
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminMenuItems } from './utils/adminMenuItems';
import { useOrganisationLogo } from './hooks/useOrganisationLogo';
import { AdminSidebarProfile } from './components/AdminSidebarProfile';
import { AdminSidebarNav } from './components/AdminSidebarNav';

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

    const handleSelectTab = (tab: AdminTab, path: string) => {
        onTabChange(tab);
        navigate(path);
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{userOrganisation || (isSuperAdmin ? 'Super Admin' : 'Organisation')}</h2>
            </div>
            <AdminSidebarProfile
                uploadInputRef={uploadInputRef}
                uploadingPicture={uploadingPicture}
                organisationLogoUrl={organisationLogoUrl}
                userInitials={userInitials}
                onUploadPictureChange={handleUploadPictureChange}
                onRemoveLogo={handleRemoveLogo}
                onClearLogo={clearLogo}
            />
            <AdminSidebarNav menuItems={menuItems} currentPath={location.pathname} onSelectTab={handleSelectTab} />
        </aside>
    );
}
