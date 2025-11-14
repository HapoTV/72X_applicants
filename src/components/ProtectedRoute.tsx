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
    const userType = localStorage.getItem('userType');

    // If authentication is required but no token exists
    if (requireAuth && !authToken) {
        return <Navigate to="/login" replace />;
    }

    // If admin access is required but user is not admin
    if (requireAuth && requireAdmin && userType !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    // If user is already authenticated but trying to access auth pages (login/signup)
    if (!requireAuth && authToken) {
        // Redirect to appropriate dashboard based on user type
        if (userType === 'admin') {
            return <Navigate to="/admin/dashboard/overview" replace />;
        } else {
            return <Navigate to="/dashboard/overview" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;