import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Users, Shield, Building2 } from 'lucide-react';
import Logo from '../assets/Logo.svg';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
    const [formData, setFormData] = useState({
        email: '',
        businessReference: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Development credentials
    const devCredentials = {
        user: { email: 'user@72X.co.za', businessReference: '72001', password: 'user123' },
        admin: { email: 'admin@72X.co.za', businessReference: undefined, password: 'admin123' }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Check if we're using development credentials
            const devUser = devCredentials.user;
            const devAdmin = devCredentials.admin;

            // For admin login
            if (loginType === 'admin') {
                if (formData.email === devAdmin.email && formData.password === devAdmin.password) {
                    // Store auth info in localStorage
                    localStorage.setItem('authToken', `dev-admin-token-${Date.now()}`);
                    localStorage.setItem('userType', 'admin');
                    localStorage.setItem('userEmail', formData.email);
                    localStorage.setItem('userPackage', 'premium');
                    console.log('Development admin login successful, redirecting...');
                    window.location.href = '/admin/dashboard/overview';
                    return;
                } else {
                    console.error('Invalid admin credentials');
                    throw new Error('Invalid admin credentials');
                }
            }

            // For regular user login
            if (formData.email === devUser.email && 
                formData.password === devUser.password && 
                formData.businessReference === devUser.businessReference) {
                
                // Store user data in localStorage
                localStorage.setItem('authToken', `dev-user-token-${Date.now()}`);
                localStorage.setItem('userType', 'user');
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('businessReference', formData.businessReference);
                localStorage.setItem('userId', 'dev-user-123');
                
                // Set default package to startup for new users if not set
                if (!localStorage.getItem('userPackage')) {
                    localStorage.setItem('userPackage', 'startup');
                }
                
                console.log('Development user login successful, redirecting...');
                window.location.href = '/dashboard/overview';
                return;
            }

            // If we get here, credentials didn't match dev credentials
            console.error('Invalid credentials');
            throw new Error('Invalid email, business reference, or password');

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login. Please try again.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const fillDemoCredentials = () => {
        const credentials = devCredentials[loginType];
        setFormData(prev => ({
            ...prev,
            email: credentials.email,
            businessReference: loginType === 'user' ? credentials.businessReference || '' : '',
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
                            <p className="ml-4">Email: user@72X.co.za</p>
                            <p className="ml-4">Business Ref: 72001</p>
                            <p className="ml-4">Password: user123</p>
                            <p className="mt-2"><strong>Admin:</strong></p>
                            <p className="ml-4">Email: admin@72X.co.za</p>
                            <p className="ml-4">Password: admin123</p>
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