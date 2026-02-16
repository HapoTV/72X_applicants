// src/pages/VerifyOtp.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User } from 'lucide-react';
import { authService } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Logo.svg';

const VerifyOtp: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    
    const { 
        email, 
        loginType, 
        businessReference, 
        userId,
        requiresOtpVerification,
        otpCode: generatedOtp
    } = location.state || {};
    
    useEffect(() => {
        if (!email || requiresOtpVerification === false) {
            navigate('/login');
        }
    }, [email, requiresOtpVerification, navigate, generatedOtp, loginType]);
    
    useEffect(() => {
        if (resendDisabled && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setResendDisabled(false);
            setCountdown(30);
        }
    }, [resendDisabled, countdown]);
    
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await authService.verifyOtp({
                email,
                otpCode: otp,
                businessReference,
                loginType
            });
            
            console.log('✅ OTP verification response:', response);
            console.log('👤 User role from response:', response.role);
            
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                authService.setAxiosAuthHeader(response.token);
                
                // Store user role from response - this is the source of truth
                const userRole = response.role || '';
                console.log('📝 Storing user role:', userRole);
                
                localStorage.setItem('userRole', userRole);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', response.userId || userId || '');
                localStorage.setItem('fullName', response.fullName || '');

                localStorage.setItem('emailVerified', 'true');

                if (response.status) {
                    localStorage.setItem('userStatus', response.status);
                    console.log('📋 Backend user status:', response.status);
                }

                if (response.businessReference) {
                    localStorage.setItem('businessReference', response.businessReference);
                }

                if (response.requiresPackageSelection === true) {
                    localStorage.setItem('requiresPackageSelection', 'true');
                } else {
                    localStorage.removeItem('requiresPackageSelection');
                }
                
                sessionStorage.removeItem('pendingLogin');
                
                const userData = {
                    userId: response.userId || userId || '',
                    email: response.email || email,
                    role: userRole, // Use role from response
                    fullName: response.fullName,
                    businessReference: response.businessReference,
                    status: response.status,
                    token: response.token,
                    requiresTwoFactor: response.requiresTwoFactor
                };
                
                login(userData);
                
                // Use setTimeout to ensure state updates are complete
                setTimeout(() => {
                    // Determine redirect based on role from response
                    const role = userRole.toUpperCase();
                    console.log('🔍 Determining redirect based on role:', role);
                    
                    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
                        console.log('👑 Redirecting to admin dashboard for role:', role);
                        window.location.href = '/admin/dashboard/overview';
                        return; // Important: return to prevent further execution
                    }
                    
                    // If we get here, it's a regular user
                    console.log('👤 Processing regular user redirect with role:', role);
                    
                    if (response.requiresPackageSelection === true) {
                        console.log('📦 User needs package selection, redirecting to /select-package');
                        window.location.href = '/select-package';
                    } else {
                        const userStatus = response.status || localStorage.getItem('userStatus');
                        const selectedPackage = localStorage.getItem('selectedPackage');
                        
                        console.log('🔍 User dashboard redirection check:', {
                            userStatus,
                            selectedPackage,
                            role,
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
                }, 300);
            } else {
                console.error('❌ NO TOKEN IN RESPONSE! Full response:', response);
                setError('Authentication failed: No token received from server');
            }
        } catch (error: any) {
            console.error('❌ OTP verification error:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            
            let errorMsg = 'Invalid OTP code. Please try again.';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }
            
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    
    const handleResendOTP = async () => {
        setError('');
        setResendDisabled(true);
        setCountdown(30);
        setOtp('');
        
        try {
            const response = await authService.resendOtp({
                email,
                businessReference,
                loginType
            });

            if (response?.otpCode) {
                // OTP resent successfully
            }
        } catch (error: any) {
            console.error('❌ Resend OTP error:', error);
            setError('Failed to resend OTP. Please try again.');
            setResendDisabled(false);
        }
    };
    
    const handleBackToLogin = () => {
        sessionStorage.removeItem('pendingLogin');
        navigate('/login');
    };
    
    const handleChangeOtp = (value: string) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setOtp(numericValue);
        setError('');
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-center mb-4">
                    <img src={Logo} alt="SeventyTwoX Logo" className="w-16 h-16" />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Verify OTP
                </h2>
                
                <p className="text-center text-gray-600 mb-6">
                    Enter the 6-digit code sent to <br />
                    <strong className="text-primary-600">{email}</strong>
                </p>
                
                <div className="flex justify-center mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${loginType === 'admin' || loginType === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        <span className="inline-flex items-center gap-2">
                            {loginType === 'admin' ? (
                                <>
                                    <Shield className="w-4 h-4" />
                                    <span>Admin Login</span>
                                </>
                            ) : loginType === 'superadmin' ? (
                                <>
                                    <Shield className="w-4 h-4" />
                                    <span>Super Admin Login</span>
                                </>
                            ) : (
                                <>
                                    <User className="w-4 h-4" />
                                    <span>User Login</span>
                                </>
                            )}
                        </span>
                    </span>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            {error}
                        </p>
                    </div>
                )}
                
                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => handleChangeOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-xl tracking-widest font-mono"
                            maxLength={6}
                            required
                            disabled={loading}
                            autoFocus
                            inputMode="numeric"
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Enter the 6-digit code from your email.
                        </p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Verifying...
                            </>
                        ) : (
                            'Verify & Sign In'
                        )}
                    </button>
                </form>
                
                <div className="mt-6 text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <button
                            onClick={handleResendOTP}
                            disabled={resendDisabled || loading}
                            className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                        >
                            {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
                        </button>
                    </p>
                    
                    <div className="space-y-2">
                        <button
                            onClick={handleBackToLogin}
                            className="block w-full text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            disabled={loading}
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;