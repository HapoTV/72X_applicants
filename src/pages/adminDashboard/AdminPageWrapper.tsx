import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { getActiveTabFromPathname } from './utils/adminTabRouting';

interface AdminPageWrapperProps {
  children: React.ReactNode;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSuperAdmin, isCocAdmin } = useAuth();

  const activeTab = useMemo(() => getActiveTabFromPathname(location.pathname) ?? 'applicants', [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar onLogout={() => { localStorage.removeItem('authToken'); localStorage.removeItem('userType'); localStorage.removeItem('userEmail'); localStorage.removeItem('userOrganisation'); localStorage.removeItem('userRole'); navigate('/'); }} />
      <div className="flex">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={(_, path) => {
            navigate(path);
          }}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminPageWrapper;
