import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';

interface Props {
  children: React.ReactNode;
}

const AdminPageWrapper: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  const activeTab = useMemo<AdminTab>(() => {
    const p = location.pathname;
    if (p.includes('programme-applications')) return 'programme-applications';
    if (p.includes('/programmes') && p.includes('/create')) return 'programmes';
    if (p.includes('/programmes')) return 'programmes';
    if (p.includes('/events')) return 'events';
    if (p.includes('/learning')) return 'learning';
    if (p.includes('/mentorship')) return 'mentorship';
    if (p.includes('/funding')) return 'funding';
    if (p.includes('/ad')) return 'ad';
    if (p.includes('/payments')) return 'payments';
    if (p.includes('/monitor')) return 'monitoring';
    if (p.includes('/organisation')) return 'organisation';
    return 'programmes';
  }, [location.pathname]);

  const handleTabChange = (_tab: AdminTab, path: string) => {
    // navigation is handled inside AdminSidebar -> useNavigate there
    // keep this callback to satisfy prop contract
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar onLogout={() => { /* handled elsewhere */ }} />

      <div className="flex">
        {/* Sidebar stays full-bleed at the left */}
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main content area should match AdminDashboard layout */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPageWrapper;
