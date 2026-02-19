// src/pages/login/UserLogin.tsx
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Building2, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import Logo from '../../assets/Logo.svg';

const UserLogin: React.FC = () => {
    const navigate = useNavigate();
    const {
        isLoading,
        errorMessage,
        setErrorMessage,
        handleUserLogin,
        fillUserCredentials,
    } = useLogin();
    
    const [formData, setFormData] = useState({
        email: '',
        businessReference: '',
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
        await handleUserLogin(formData);
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
                        Sign in to your business account
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {/* Role Badge */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">User Login</span>
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
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Reference
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.businessReference}
                                    onChange={(e) => handleInputChange('businessReference', e.target.value)}
                                    placeholder="Enter your business reference"
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
                            className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    
                    {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Demo Credentials:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Test User:</strong></p>
                            <p className="ml-4">Email: asandile.nkala@example.com</p>
                            <p className="ml-4">Business Ref: 7272002</p>
                            <p className="ml-4">Password: @TesterAsandile123</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => fillUserCredentials(setFormData)}
                            className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Fill demo credentials
                        </button>
                    </div> */}

                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;