// src/components/PackageSelectionRedirect.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PackageSelectionRedirectProps {
  children: React.ReactNode;
}

const PackageSelectionRedirect: React.FC<PackageSelectionRedirectProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer: number | undefined;

    const evaluate = () => {
      const hydrated = localStorage.getItem('userPackageHydrated');
      if (hydrated !== 'true') {
        // Wait for package hydration to complete before making redirect decisions
        return;
      }
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
        // delay slightly to avoid flicker during initial load
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          const path = window.location.pathname;
          if (path === '/dashboard' || path.startsWith('/dashboard/')) {
            navigate('/payments/new', { replace: true });
          }
        }, 400);
        return;
      }

      if (userStatus === 'PENDING_PACKAGE') {
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          const path = window.location.pathname;
          if (path === '/dashboard' || path.startsWith('/dashboard/')) {
            navigate('/select-package', { replace: true });
          }
        }, 400);
        return;
      }
    };

    // Evaluate once and also when package/user status updates elsewhere in the app.
    evaluate();

    // Re-evaluate when storage changes (other tabs) or when our app dispatches 'user-package-updated'.
    const onStorage = () => evaluate();
    const onUserPackageUpdated = () => evaluate();

    window.addEventListener('storage', onStorage);
    window.addEventListener('user-package-updated', onUserPackageUpdated as EventListener);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('user-package-updated', onUserPackageUpdated as EventListener);
    };
  }, [navigate]);

  return <>{children}</>;
};

export default PackageSelectionRedirect;