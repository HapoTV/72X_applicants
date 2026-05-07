// src/pages/login/AdminLogin.tsx
import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import RoleLoginPage from './components/RoleLoginPage';

const AdminLogin: React.FC = () => {
    const {
        isLoading,
        errorMessage,
        setErrorMessage,
        handleAdminLogin,
    } = useLogin();

    return (
        <RoleLoginPage
            subtitle="Sign in to your admin dashboard"
            badgeClassName="bg-green-100 text-green-700"
            badgeIcon={<Shield className="w-4 h-4" />}
            badgeLabel="Admin Login"
            emailPlaceholder="Enter your admin email"
            submitLabel="Sign In as Admin"
            submitButtonClassName="bg-primary-500 hover:bg-primary-600"
            errorMessage={errorMessage}
            isLoading={isLoading}
            setErrorMessage={setErrorMessage}
            onSubmit={handleAdminLogin}
            footerLinks={
                <p className="text-sm text-gray-600 text-center">
                    Are you a regular user?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                        Sign in as User
                    </Link>
                </p>
            }
        />
    );
};

export default AdminLogin;