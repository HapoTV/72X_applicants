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
    unauthorizedRedirectTo,
}) => {
    const location = useLocation();
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole')?.toUpperCase();
    const userStatus = localStorage.getItem('userStatus');
    const selectedPackage = localStorage.getItem('selectedPackage');
    const skipUntilRaw = localStorage.getItem('skipPackageSelectionUntil');
    const skipUntil = skipUntilRaw ? Number(skipUntilRaw) : 0;
    const hasActiveSkip = !!(skipUntil && !Number.isNaN(skipUntil) && Date.now() < skipUntil);

    const currentPath = location.pathname;

    if (requireAuth && !authToken) {
        const redirectTo = unauthenticatedRedirectTo || (requireAdmin ? '/login/asadmin' : '/login');
        return <Navigate to={redirectTo} replace state={{ from: currentPath }} />;
    }

    if (requireAuth && requireAdmin && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && userRole !== 'COC_ADMIN') {
        const redirectTo = unauthorizedRedirectTo || '/login/asadmin';
        return <Navigate to={redirectTo} replace />;
    }

    if (requireAuth && userStatus === 'PENDING_PAYMENT' && selectedPackage) {
        if (currentPath === '/select-package') return <>{children}</>;
        if (currentPath === '/payments/new') return <>{children}</>;
        if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard/')) {
            return <Navigate to="/payments/new" replace />;
        }
    }

    if (requireAuth && userStatus === 'PENDING_PACKAGE') {
        if (hasActiveSkip) return <>{children}</>;
        if (currentPath === '/select-package') return <>{children}</>;
        return <Navigate to="/select-package" replace />;
    }

    if (!requireAuth && authToken) {
        if (userStatus === 'PENDING_PACKAGE') {
            if (hasActiveSkip) return <>{children}</>;
            if (currentPath === '/select-package') return <>{children}</>;
            return <Navigate to="/select-package" replace />;
        } else if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
            if (currentPath === '/payments/new') return <>{children}</>;
            return <Navigate to="/payments/new" replace />;
        } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
            if (currentPath.startsWith('/admin/dashboard')) return <>{children}</>;
            return <Navigate to="/admin/dashboard/overview" replace />;
        } else if (userRole === 'COC_ADMIN') {
            if (currentPath.startsWith('/cocadmin/dashboard')) return <>{children}</>;
            return <Navigate to="/cocadmin/dashboard/applicants" replace />;
        } else {
            if (currentPath.startsWith('/dashboard')) return <>{children}</>;
            return <Navigate to="/dashboard/overview" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
