// src/components/PaymentRedirect.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentRedirectProps {
  children: React.ReactNode;
}

const PaymentRedirect: React.FC<PaymentRedirectProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStatus = localStorage.getItem('userStatus');
    const selectedPackage = localStorage.getItem('selectedPackage');
    const currentPath = window.location.pathname;
    
    console.log('🔄 PaymentRedirect check:', { 
      userStatus, 
      selectedPackage: !!selectedPackage,
      currentPath 
    });
    
    // ✅ FIX: Allow navigation FROM payments/new TO select-package
    if (currentPath === '/select-package') {
      console.log('✅ User is navigating to package selection - allowed');
      return;
    }
    
    // Skip if already on payment page
    if (currentPath === '/payments/new') {
      console.log('✅ Already on payment page - no redirect needed');
      return;
    }
    
    // 🔴 Only redirect if user has PENDING_PAYMENT and trying to access dashboard
    if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
      // Only redirect if trying to access dashboard or other protected routes
      if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard/')) {
        console.log('🚫 PENDING_PAYMENT user trying to access dashboard, redirecting to payment');
        navigate('/payments/new', { replace: true });
      }
    }
  }, [navigate]);

  return <>{children}</>;
};

export default PaymentRedirect;