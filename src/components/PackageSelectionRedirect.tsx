// src/components/PackageSelectionRedirect.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PackageSelectionRedirectProps {
  children: React.ReactNode;
}

const PackageSelectionRedirect: React.FC<PackageSelectionRedirectProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user needs to select a package
    const userStatus = localStorage.getItem('userStatus');
    const requiresPackageSelection = localStorage.getItem('requiresPackageSelection');
    
    console.log('📦 PackageSelectionRedirect check:', {
      userStatus,
      requiresPackageSelection
    });
    
    // Redirect if user has PENDING_PACKAGE status
    if (userStatus === 'PENDING_PACKAGE' || requiresPackageSelection === 'true') {
      console.log('🔄 Redirecting to package selection page');
      navigate('/select-package');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default PackageSelectionRedirect;