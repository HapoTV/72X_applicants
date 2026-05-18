import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import RoleLoginPage from './components/RoleLoginPage';

const CocAdminLogin: React.FC = () => {
    const {
        isLoading,
        errorMessage,
        setErrorMessage,
        handleCocAdminLogin,
    } = useLogin();

    return (
        <RoleLoginPage
            subtitle="Sign in to your COC admin dashboard"
            badgeClassName="bg-indigo-100 text-indigo-700"
            badgeIcon={<Shield className="w-4 h-4" />}
            badgeLabel="COC Admin Login"
            emailPlaceholder="Enter your COC admin email"
            submitLabel="Sign In as COC Admin"
            submitButtonClassName="bg-primary-500 hover:bg-primary-600"
            errorMessage={errorMessage}
            isLoading={isLoading}
            setErrorMessage={setErrorMessage}
            onSubmit={handleCocAdminLogin}
            footerLinks={
                <>
                    <p className="text-sm text-gray-600 text-center">
                        Are you a regular user?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in as User
                        </Link>
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                        HAPO admin?{' '}
                        <Link to="/login/asadmin" className="text-green-600 hover:text-green-700 font-medium">
                            Sign in as Admin
                        </Link>
                    </p>
                </>
            }
        />
    );
};

export default CocAdminLogin;
