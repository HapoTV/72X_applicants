// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
    unauthenticatedRedirectTo?: string;
    unauthorizedRedirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true,
    requireAdmin = false,
    unauthenticatedRedirectTo,
    unauthorizedRedirectTo
}) => {
    const location = useLocation();
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole')?.toUpperCase();
    const userStatus = localStorage.getItem('userStatus');
    const selectedPackage = localStorage.getItem('selectedPackage');
    const skipUntilRaw = localStorage.getItem('skipPackageSelectionUntil');
    const skipUntil = skipUntilRaw ? Number(skipUntilRaw) : 0;
    const hasActiveSkip = !!(skipUntil && !Number.isNaN(skipUntil) && Date.now() < skipUntil);
    const isAdminLikeRole = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'COC_ADMIN';

    console.log('🛡️ ProtectedRoute check:', {
        path: location.pathname,
        hasToken: !!authToken,
        userRole,
        userStatus,
        selectedPackage: !!selectedPackage,
        requireAuth,
        requireAdmin
    });

    // If authentication is required but no token exists
    if (requireAuth && !authToken) {
        console.log('🔒 No auth token, redirecting to login');
        const redirectTo = unauthenticatedRedirectTo || (requireAdmin ? '/login/asadmin' : '/login');
        return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
    }

    // 🔴 FIXED: If admin access is required but user is not admin or super admin
    if (requireAuth && requireAdmin && !isAdminLikeRole) {
        console.log('🚫 Not admin or super admin, redirecting to login');
        const redirectTo = unauthorizedRedirectTo || '/login/asadmin';
        return <Navigate to={redirectTo} replace />;
    }

    // Get the current path
    const currentPath = location.pathname;

    // 🔴 FIX: Allow navigation BETWEEN payments/new and select-package
    if (requireAuth && userRole === 'USER' && userStatus === 'PENDING_PAYMENT' && selectedPackage) {
        // Allow navigation to select-package from payments/new
        if (currentPath === '/select-package') {
            console.log('✅ Allowing navigation to select-package from payments page');
            return <>{children}</>;
        }
        
        // If already on payments/new, don't redirect
        if (currentPath === '/payments/new') {
            console.log('✅ Already on payment page, no redirect needed');
            return <>{children}</>;
        }
        
        // Only redirect if trying to access dashboard or other protected routes
        if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard/')) {
            console.log('💳 PENDING_PAYMENT user with package, redirecting to payment');
            return <Navigate to="/payments/new" replace />;
        }
    }

    // 🔴 CRITICAL: Don't redirect if already on select-package
    if (requireAuth && userRole === 'USER' && userStatus === 'PENDING_PACKAGE') {
        if (hasActiveSkip) {
            return <>{children}</>;
        }
        // If already on select-package, don't redirect (avoid infinite loop)
        if (currentPath === '/select-package') {
            console.log('✅ Already on package selection page, no redirect needed');
            return <>{children}</>;
        }
        console.log('📦 PENDING_PACKAGE user, redirecting to package selection');
        return <Navigate to="/select-package" replace />;
    }

    // If user is already authenticated but trying to access auth pages (login/signup)
    if (!requireAuth && authToken) {
        console.log('🎯 Already authenticated, checking status for redirect');
        
        // Check if user needs to complete setup
        if (userStatus === 'PENDING_PACKAGE') {
            if (hasActiveSkip) {
                return <>{children}</>;
            }
            if (currentPath === '/select-package') {
                return <>{children}</>;
            }
            return <Navigate to="/select-package" replace />;
        } else if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
            if (currentPath === '/payments/new') {
                return <>{children}</>;
            }
            return <Navigate to="/payments/new" replace />;
        } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
            // 🔴 FIXED: Check for both ADMIN and SUPER_ADMIN
            if (currentPath.startsWith('/admin/dashboard')) {
                return <>{children}</>;
            }
            return <Navigate to="/admin/dashboard/overview" replace />;
        } else {
            if (currentPath.startsWith('/dashboard')) {
                return <>{children}</>;
            }
            return <Navigate to="/dashboard/overview" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;