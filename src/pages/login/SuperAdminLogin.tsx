// src/pages/login/SuperAdminLogin.tsx
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Crown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import Logo from '../../assets/Logo.svg';

const SuperAdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const {
        isLoading,
        errorMessage,
        setErrorMessage,
        handleSuperAdminLogin,
        fillSuperAdminCredentials,
    } = useLogin();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrorMessage('');
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSuperAdminLogin(formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center">
                        <img src={Logo} alt="SeventyTwoX Logo" className="w-48 h-48" />
                    </div>
                    <p className="text-gray-600 -mt-12">
                        Sign in to your super admin dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {/* Role Badge */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full flex items-center space-x-2">
                            <Crown className="w-4 h-4" />
                            <span className="font-medium">Super Admin Login</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{errorMessage}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter your super admin email"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link
                                to="/reset-password"
                                className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In as Super Admin'
                            )}
                        </button>
                    </form>
{/* 
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Demo Credentials:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Test Super Admin:</strong></p>
                            <p className="ml-4">Email: misa@gmail.com</p>
                            <p className="ml-4">Password: Misa@123</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => fillSuperAdminCredentials(setFormData)}
                            className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Fill demo credentials
                        </button>
                    </div>
 */}

                    {/* Role Links */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;