// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Users, Shield, Building2 } from 'lucide-react';
import { authService } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';
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

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const loginRequest = {
                email: formData.email,
                password: formData.password,
                businessReference: loginType === 'user' ? formData.businessReference : undefined,
                loginType: loginType
            };

            const userData = await authService.login(loginRequest);
            
            // Store auth info
            localStorage.setItem('authToken', `token-${Date.now()}`);
            localStorage.setItem('userType', loginType);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('userId', userData.userId);
            
            if (userData.businessReference) {
                localStorage.setItem('businessReference', userData.businessReference);
            }
            if (userData.userPackage) {
                localStorage.setItem('userPackage', userData.userPackage);
            }

            // Update auth context
            login(userData);
            
            console.log('Login successful, redirecting...');
            
            // Redirect based on user type
            if (loginType === 'admin') {
                window.location.replace('/admin/dashboard/overview');
            } else {
                window.location.replace('/dashboard/overview');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login. Please try again.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const fillDemoCredentials = () => {
        // Development credentials for testing
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
                                        required
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
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-primary-600 hover:text-primary-700"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                            <p className="ml-4">Email: phelo.madala@example.com</p>
                            <p className="ml-4">Password: @TesterPhelo123</p>
                        </div>
                        <button
                            type="button"
                            onClick={fillDemoCredentials}
                            className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
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
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Sign up for free
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
