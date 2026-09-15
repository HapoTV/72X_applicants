// src/pages/login/UserLogin.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import AuthWebLayout from '../../components/AuthWebLayout';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29ABE2] focus:border-transparent transition-all bg-white';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

const UserLogin: React.FC = () => {
    const {
        isLoading,
        errorMessage,
        setErrorMessage,
        handleUserLogin,
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
        await handleUserLogin(formData);
    };

    return (
        <AuthWebLayout
            title="Welcome back!"
            subtitle="Sign in to your business account"
        >
            {/* Error Message */}
            {errorMessage && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-xs font-medium text-center">{errorMessage}</p>
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className={inputClass}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-gray-700">Password *</label>
                        <Link
                            to="/reset-password"
                            className="text-xs font-semibold text-[#29ABE2] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Enter your password"
                            className={inputClass + ' pr-11'}
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        className="w-4 h-4 text-[#29ABE2] border-gray-300 rounded focus:ring-[#29ABE2] cursor-pointer"
                        disabled={isLoading}
                    />
                    <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
                        Remember me
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 bg-[#29ABE2] hover:bg-[#1e98cc] text-white rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>
        </AuthWebLayout>
    );
};

export default UserLogin;
