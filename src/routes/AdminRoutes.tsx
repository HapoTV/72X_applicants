// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/adminDashboard/AdminDashboard';
import AdminOrganisationManagement from '../pages/adminDashboard/tabs/AdminOrganisationManagement';
import AdminManagement from '../pages/adminDashboard/tabs/AdminManagement';
import AdminAnalytics from '../pages/adminDashboard/tabs/AdminAnalytics';
import AdminNotifications from '../pages/adminDashboard/AdminNotifications';
import AdminPaymentsTab from '../pages/adminDashboard/tabs/AdminPaymentsTab';
import { useAuth } from '../context/AuthContext';

const AdminRoutes: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();

  // Protection is already handled by ProtectedRoute in App.tsx
  // But we keep this as a fallback
  if (!isAdmin && !isSuperAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard/applicants" replace />} />
      <Route path="/dashboard/*" element={<AdminDashboard />} />
      <Route path="/payments" element={<AdminPaymentsTab />} />
      <Route path="/organisations" element={<AdminOrganisationManagement />} />
      <Route path="/admins" element={<AdminManagement />} />
      <Route path="/analytics" element={<AdminAnalytics />} />
      <Route path="/notifications" element={<AdminNotifications />} />
      <Route path="*" element={<Navigate to="/admin/dashboard/applicants" replace />} />
    </Routes>
  );
};

export default AdminRoutes;