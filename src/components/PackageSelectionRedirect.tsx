// src/components/PackageSelectionRedirect.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PackageSelectionRedirectProps {
  children: React.ReactNode;
}

const PackageSelectionRedirect: React.FC<PackageSelectionRedirectProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStatus = localStorage.getItem('userStatus');
    const selectedPackage = localStorage.getItem('selectedPackage');
    const currentPath = window.location.pathname;
    const skipUntilRaw = localStorage.getItem('skipPackageSelectionUntil');

    const skipUntil = skipUntilRaw ? Number(skipUntilRaw) : 0;
    if (skipUntil && !Number.isNaN(skipUntil) && Date.now() < skipUntil) {
      return;
    }
    if (skipUntilRaw && (Number.isNaN(skipUntil) || Date.now() >= skipUntil)) {
      localStorage.removeItem('skipPackageSelectionUntil');
    }

    if (currentPath === '/select-package') return;

    if (currentPath === '/payments/new') return;

    if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
      if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard/')) {
        navigate('/payments/new', { replace: true });
      }
      return;
    }

    if (userStatus === 'PENDING_PACKAGE') {
      if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard/')) {
        navigate('/select-package', { replace: true });
      }
    }
  }, [navigate]);

  return <>{children}</>;
};

export default PackageSelectionRedirect;