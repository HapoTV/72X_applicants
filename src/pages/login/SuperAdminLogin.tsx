// src/pages/login/SuperAdminLogin.tsx
import React from 'react';
import { Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import RoleLoginPage from './components/RoleLoginPage';

const SuperAdminLogin: React.FC = () => {
    const {
        isLoading,
        errorMessage,
        setErrorMessage,
        handleSuperAdminLogin,
    } = useLogin();

    return (
        <RoleLoginPage
            subtitle="Sign in to your super admin dashboard"
            badgeClassName="bg-purple-100 text-purple-700"
            badgeIcon={<Crown className="w-4 h-4" />}
            badgeLabel="Super Admin Login"
            emailPlaceholder="Enter your super admin email"
            submitLabel="Sign In as Super Admin"
            submitButtonClassName="bg-purple-600 hover:bg-purple-700"
            errorMessage={errorMessage}
            isLoading={isLoading}
            setErrorMessage={setErrorMessage}
            onSubmit={handleSuperAdminLogin}
            footerLinks={
                <>
                    <p className="text-sm text-gray-600 text-center">
                        Are you a regular user?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in as User
                        </Link>
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                        Admin?{' '}
                        <Link to="/login/asadmin" className="text-green-600 hover:text-green-700 font-medium">
                            Sign in as Admin
                        </Link>
                    </p>
                </>
            }
        />
    );
};

export default SuperAdminLogin;