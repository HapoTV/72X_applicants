import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/adminDashboard/AdminDashboard';
import AdminNotifications from '../pages/adminDashboard/AdminNotifications';
import { useAuth } from '../context/AuthContext';

const CocAdminRoutes: React.FC = () => {
  const { isAdmin, isSuperAdmin, isCocAdmin } = useAuth();

  if (!isAdmin && !isSuperAdmin && !isCocAdmin) {
    return <Navigate to="/login/cocadmin" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cocadmin/dashboard/applicants" replace />} />
      <Route path="/dashboard/*" element={<AdminDashboard dashboardBasePath="/cocadmin/dashboard/" />} />
      <Route path="/notifications" element={<AdminNotifications />} />
      <Route path="*" element={<Navigate to="/cocadmin/dashboard/applicants" replace />} />
    </Routes>
  );
};

export default CocAdminRoutes;
