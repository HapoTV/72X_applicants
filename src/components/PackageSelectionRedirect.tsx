// src/components/PackageSelectionRedirect.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PackageSelectionRedirectProps {
  children: React.ReactNode;
}

const PackageSelectionRedirect: React.FC<PackageSelectionRedirectProps> = ({ children }) => {
  const navigate = useNavigate();

// Update the useEffect in PackageSelectionRedirect.tsx
useEffect(() => {
  const userStatus = localStorage.getItem('userStatus');
  const requiresPackageSelection = localStorage.getItem('requiresPackageSelection');
  const selectedPackage = localStorage.getItem('selectedPackage');
  const currentPath = window.location.pathname;
  
  console.log('📦 PackageSelectionRedirect check:', {
    userStatus,
    requiresPackageSelection,
    selectedPackage: !!selectedPackage,
    currentPath
  });
  
  // ✅ FIX: Allow navigation from payments/new to select-package
  if (currentPath === '/select-package') {
    console.log('✅ User is on package selection page - allowed');
    return;
  }
  
  // Don't redirect if user is already on payment page
  if (currentPath === '/payments/new') {
    console.log('✅ Already on payment page - no redirect needed');
    return;
  }
  
  // Check PENDING_PAYMENT status with package
  if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
    // Only redirect if trying to access dashboard
    if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard/')) {
      console.log('💳 PENDING_PAYMENT user trying to access dashboard, redirecting to payment');
      navigate('/payments/new', { replace: true });
    }
    return;
  }
  
  // Redirect if user has PENDING_PACKAGE status and trying to access dashboard
  if ((userStatus === 'PENDING_PACKAGE' || requiresPackageSelection === 'true') && 
      (currentPath === '/dashboard' || currentPath.startsWith('/dashboard/'))) {
    console.log('🔄 PENDING_PACKAGE user trying to access dashboard, redirecting to package selection');
    navigate('/select-package', { replace: true });
  }
}, [navigate]);

  return <>{children}</>;
};

export default PackageSelectionRedirect;