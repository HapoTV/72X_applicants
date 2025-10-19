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

    // Check if user is authenticated
    if (requireAuth && !authToken) {
        return <Navigate to="/login" replace />;
    }

    // Check if admin access is required
    if (requireAdmin && userType !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    // Check if user is trying to access login while already authenticated
    if (!requireAuth && authToken) {
        if (userType === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    // Redirect to splash screen if no auth token and accessing root
    if (!authToken && window.location.pathname === '/') {
        return <Navigate to="/splash" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;