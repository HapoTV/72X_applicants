// src/components/ProtectedPaymentRoutes.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedPaymentRoutes: React.FC = () => {
  const userStatus = localStorage.getItem('userStatus');
  const selectedPackage = localStorage.getItem('selectedPackage');
  
  console.log('💳 ProtectedPaymentRoutes check:', {
    userStatus,
    hasSelectedPackage: !!selectedPackage
  });
  
  // Allow access if:
  // 1. User has PENDING_PAYMENT status OR
  // 2. User has selected a package
  if (!selectedPackage && userStatus !== 'PENDING_PAYMENT') {
    console.log('🔄 Redirecting to package selection - no package selected');
    return <Navigate to="/select-package" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedPaymentRoutes;