// src/components/ProtectedRoute.tsx - UPDATED
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true,
    requireAdmin = false
}) => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole')?.toUpperCase();

    console.log('🛡️ ProtectedRoute check:', {
        hasToken: !!authToken,
        userRole,
        requireAuth,
        requireAdmin
    });

    // If authentication is required but no token exists
    if (requireAuth && !authToken) {
        console.log('🔒 No auth token, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // If admin access is required but user is not admin
    if (requireAuth && requireAdmin && userRole !== 'ADMIN') {
        console.log('🚫 Not admin, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // If user is already authenticated but trying to access auth pages (login/signup)
    if (!requireAuth && authToken) {
        console.log('🎯 Already authenticated, redirecting to dashboard');
        // Redirect to appropriate dashboard based on user role
        if (userRole === 'ADMIN') {
            return <Navigate to="/admin/dashboard/overview" replace />;
        } else {
            return <Navigate to="/dashboard/overview" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;