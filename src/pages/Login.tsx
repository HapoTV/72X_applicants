// src/pages/Login.tsx - UPDATED FOR OTP VERIFICATION
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Users, Shield, Building2 } from 'lucide-react';
import { authService } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest, LoginResponse, User } from '../interfaces/UserData';

import Logo from '../assets/Logo.svg';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
    const [formData, setFormData] = useState({
        email: '',
        businessReference: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrorMessage(''); // Clear error when user types
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            console.log("🚀 Starting login process...");

            const loginRequest: LoginRequest = {
                email: formData.email,
                password: formData.password,
                businessReference: loginType === 'user' ? formData.businessReference : undefined,
                loginType
            };

            console.log("🔑 Calling login endpoint...");
            const loginResponse = await authService.login(loginRequest);

            console.log("✅ Login response received:", loginResponse);

            const requiresOtp =
                loginResponse.requiresOtpVerification === true ||
                loginResponse.requiresTwoFactor === true;

            console.log("🔍 requiresOtp check result:", requiresOtp);

            if (requiresOtp) {
                console.log("📱 OTP verification required, redirecting...");
                navigate('/verify-otp', {
                    state: {
                        email: formData.email,
                        loginType,
                        businessReference: loginType === 'user' ? formData.businessReference : undefined,
                        userId: loginResponse.userId,
                        requiresOtpVerification: true,
                        otpCode: loginResponse.otpCode
                    }
                });
                return;
            }

            // No OTP required, complete login immediately
            console.log("✅ No OTP required, completing login...");
            await completeLogin(loginResponse);
        } catch (error: any) {
            console.error('❌ Login error:', error);
            console.error('❌ Error response:', (error as any).response?.data);
            console.error('❌ Error status:', (error as any).response?.status);

            let message = error.message || 'An error occurred during login. Please try again.';

            if (message.includes('Network Error') || message.includes('Cannot connect')) {
                message = 'Cannot connect to server. Please check if the backend is running.';
            } else if (message.includes('Invalid credentials')) {
                message = 'Invalid email or password. Please try again.';
            } else if (message.includes('Business reference is required')) {
                message = 'Business reference is required for user login.';
            }

            setErrorMessage(message);
            setIsLoading(false);
        }
    };

    const completeLogin = async (loginResponse: LoginResponse) => {
        try {
            // Store auth info permanently
            if (loginResponse.token) {
                localStorage.setItem('authToken', loginResponse.token);
                authService.setAxiosAuthHeader(loginResponse.token);
            }

            localStorage.setItem('userType', loginType);
            localStorage.setItem('userEmail', loginResponse.email);
            localStorage.setItem('userId', loginResponse.userId);
            localStorage.setItem('userRole', loginResponse.role || '');
            localStorage.setItem('fullName', loginResponse.fullName || '');

            // Store user status from backend response
            if (loginResponse.status) {
                localStorage.setItem('userStatus', loginResponse.status);
                console.log('📋 Backend user status:', loginResponse.status);
            }

            if (loginResponse.businessReference) {
                localStorage.setItem('businessReference', loginResponse.businessReference);
            }

            // Store user object for AuthContext
            const userData: User = {
                userId: loginResponse.userId,
                fullName: loginResponse.fullName,
                email: loginResponse.email,
                role: loginResponse.role,
                status: loginResponse.status || 'ACTIVE',
                businessReference: loginResponse.businessReference,
                companyName: loginResponse.companyName,
                profileImageUrl: loginResponse.profileImageUrl
            };

            // Update auth context
            login(userData);

            console.log(
                "🎉 Login complete! Token:",
                loginResponse.token ? loginResponse.token.substring(0, 30) + "..." : 'none'
            );
            console.log("📊 Post-login status check:", {
                status: loginResponse.status,
                isAuthenticated: true
            });

            // Delay redirect slightly to ensure localStorage is updated
            setTimeout(() => {
                if (loginType === 'admin') {
                    window.location.href = '/admin/dashboard/overview';
                } else {
                    // Check user status and redirect accordingly
                    const userStatus = loginResponse.status || localStorage.getItem('userStatus');
                    const selectedPackage = localStorage.getItem('selectedPackage');

                    console.log('🔍 Post-login redirection check:', {
                        userStatus,
                        selectedPackage,
                        loginType
                    });

                    if (userStatus === 'PENDING_PACKAGE') {
                        console.log('📦 User needs package selection, redirecting to /select-package');
                        window.location.href = '/select-package';
                    } else if (userStatus === 'PENDING_PAYMENT' && selectedPackage) {
                        console.log('💳 User needs payment for selected package, redirecting to /payments/new');
                        window.location.href = '/payments/new';
                    } else if (userStatus === 'PENDING_PAYMENT' && !selectedPackage) {
                        console.log('⚠️ User PENDING_PAYMENT but no package selected, redirecting to package selection');
                        window.location.href = '/select-package';
                    } else {
                        console.log('🏠 User is active, going to dashboard');
                        window.location.href = '/dashboard/overview';
                    }
                }
            }, 100);

        } catch (error: any) {
            console.error('❌ Login error in completeLogin:', error);

            let message = error.message || 'An error occurred during login. Please try again.';

            if (message.includes('Network Error') || message.includes('Cannot connect')) {
                message = 'Cannot connect to server. Please check if the backend is running.';
            } else if (message.includes('Invalid credentials')) {
                message = 'Invalid email or password. Please try again.';
            } else if (message.includes('Business reference is required')) {
                message = 'Business reference is required for user login.';
            }

            setErrorMessage(message);

        } finally {
            setIsLoading(false);
        }
    };

    const fillDemoCredentials = () => {
        const demoCredentials = {
            user: { 
                email: 'asandile.nkala@example.com', 
                businessReference: '7272002', 
                password: '@TesterAsandile123' 
            },
            admin: { 
                email: 'asavela.mbengashe@example.com', 
                businessReference: '', 
                password: '@TesterAsavela123' 
            }
        };

        const credentials = demoCredentials[loginType];
        setFormData(prev => ({
            ...prev,
            email: credentials.email,
            businessReference: credentials.businessReference,
            password: credentials.password
        }));
        setErrorMessage('');
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
                        Empowering South African entrepreneurs
                    </p>
                </div>

                {/* Login Type Toggle */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                        <button
                            onClick={() => setLoginType('user')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                                loginType === 'user'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span className="font-medium">User Login</span>
                        </button>
                        <button
                            onClick={() => setLoginType('admin')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                                loginType === 'admin'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Shield className="w-4 h-4" />
                            <span className="font-medium">Admin Login</span>
                        </button>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{errorMessage}</p>
                            <p className="text-red-600 text-xs mt-1">
                                Backend URL: http://localhost:8080/api/authentication/login
                            </p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
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

                        {loginType === 'user' && (
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
                                        required={loginType === 'user'}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        )}

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
                            <button
                                type="button"
                                onClick={() => navigate('/reset-password')}
                                className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                Forgot password?
                            </button>
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
                                `Sign In as ${loginType === 'admin' ? 'Admin' : 'User'}`
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Development Credentials:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>User:</strong></p>
                            <p className="ml-4">Email: asandile.nkala@example.com</p>
                            <p className="ml-4">Business Ref: 7272002</p>
                            <p className="ml-4">Password: @TesterAsandile123</p>
                            <p className="mt-2"><strong>Admin:</strong></p>
                            <p className="ml-4">Email: asavela.mbengashe@example.com</p>
                            <p className="ml-4">Password: @TesterAsavela123</p>
                        </div>
                        <button
                            type="button"
                            onClick={fillDemoCredentials}
                            className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Fill {loginType} credentials
                        </button>
                    </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;