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
            
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                authService.setAxiosAuthHeader(response.token);
                
                localStorage.setItem('userType', loginType);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', response.userId || userId || '');
                localStorage.setItem('userRole', response.role || (loginType === 'admin' ? 'ADMIN' : 'USER'));
                localStorage.setItem('fullName', response.fullName || (loginType === 'admin' ? 'Admin User' : 'User'));

                localStorage.setItem('emailVerified', 'true');

                if (response.status) {
                    localStorage.setItem('userStatus', response.status);
                }

                if (response.businessReference) {
                    localStorage.setItem('businessReference', response.businessReference);
                }

                if (response.requiresPackageSelection === true) {
                    localStorage.setItem('requiresPackageSelection', 'true');
                } else {
                    localStorage.removeItem('requiresPackageSelection');
                }
                
                if (loginType === 'admin') {
                    localStorage.setItem('isAdmin', 'true');
                }
                
                sessionStorage.removeItem('pendingLogin');
                
                const userData = {
                    userId: response.userId || userId || '',
                    email: response.email || email,
                    role: response.role || (loginType === 'admin' ? 'ADMIN' : 'USER'),
                    fullName: response.fullName,
                    businessReference: response.businessReference,
                    status: response.status,
                    token: response.token,
                    requiresTwoFactor: response.requiresTwoFactor
                };
                
                login(userData);
                
                if (response.requiresPackageSelection === true) {
                    window.location.href = '/select-package';
                } else {
                    setTimeout(() => {
                        if (loginType === 'admin') {
                            window.location.href = '/admin/dashboard/overview';
                        } else {
                            window.location.href = '/dashboard/overview';
                        }
                    }, 300);
                }
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${loginType === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        <span className="inline-flex items-center gap-2">
                            {loginType === 'admin' ? (
                                <>
                                    <Shield className="w-4 h-4" />
                                    <span>Admin Login</span>
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
                            Enter the 6-digit code from your email/console
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