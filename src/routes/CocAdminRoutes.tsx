import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/adminDashboard/AdminDashboard';
import { useAuth } from '../context/AuthContext';

const CocAdminRoutes: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();

  if (!isAdmin && !isSuperAdmin) {
    return <Navigate to="/login/cocadmin" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cocadmin/dashboard/applicants" replace />} />
      <Route path="/dashboard/*" element={<AdminDashboard dashboardBasePath="/cocadmin/dashboard/" />} />
      <Route path="*" element={<Navigate to="/cocadmin/dashboard/applicants" replace />} />
    </Routes>
  );
};

export default CocAdminRoutes;
