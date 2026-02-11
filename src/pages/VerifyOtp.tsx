// src/pages/VerifyOtp.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

const VerifyOtp: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [otpSent, setOtpSent] = useState(false);
    const [debugInfo, setDebugInfo] = useState<any>({});
    
    // Get data from login page
    const { 
        email, 
        loginType, 
        businessReference, 
        userId,
        requiresOtpVerification,
        otpCode: generatedOtp
    } = location.state || {};
    
    // If no email or OTP verification not required, redirect to login
    useEffect(() => {
        console.log('🔍 VerifyOtp Mounted:', {
            email,
            loginType,
            requiresOtpVerification,
            hasGeneratedOtp: !!generatedOtp
        });
        
        if (!email || requiresOtpVerification === false) {
            console.log('❌ Missing required data, redirecting to login');
            navigate('/login');
        }
        
        // Load pending login from session storage
        const pendingLogin = sessionStorage.getItem('pendingLogin');
        if (pendingLogin) {
            console.log('📋 Found pending login:', JSON.parse(pendingLogin));
        }
    }, [email, requiresOtpVerification, navigate, generatedOtp, loginType]);
    
    // Show development OTP if available
    useEffect(() => {
        if (generatedOtp && !otpSent) {
            console.log('🔑 Auto-filling OTP:', generatedOtp);
            setOtp(generatedOtp);
            setError(`Development OTP: ${generatedOtp}`);
            setOtpSent(true);
        }
    }, [generatedOtp, otpSent]);
    
    // Countdown for resend button
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
            console.log('🔐 Verifying OTP...', { 
                email, 
                otp, 
                loginType,
                businessReference 
            });
            
            // Call verify-otp endpoint
            const response = await authService.verifyOtp({
                email,
                otpCode: otp,
                businessReference,
                loginType
            });
            
            console.log('✅ OTP verification RESPONSE:', response);
            console.log('🔍 Response status:', response.status);
            console.log('🔍 Response success:', response.success);
            console.log('🔍 Has token?', !!response.token);
            console.log('🔍 Token value:', response.token ? 'Present' : 'Missing');
            console.log('🔍 Response data keys:', Object.keys(response));
            
            // Store response for debugging
            localStorage.setItem('lastOtpResponse', JSON.stringify(response));
            setDebugInfo(response);
            
            if (response.token) {
                console.log('🎉 OTP VERIFIED SUCCESSFULLY!');
                
                // STORE ALL AUTH DATA
                const authData = {
                    token: response.token,
                    user: response.user || {
                        email: email,
                        role: response.role || (loginType === 'admin' ? 'ADMIN' : 'USER'),
                        loginType: loginType,
                        isAdmin: loginType === 'admin'
                    }
                };
                
                console.log('💾 Storing auth data:', authData);
                
                // Store token
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('refreshToken', response.refreshToken || '');
                authService.setAxiosAuthHeader(response.token);
                
                // Store user info
                localStorage.setItem('userType', loginType);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', response.userId || userId || '');
                localStorage.setItem('userRole', response.role || (loginType === 'admin' ? 'ADMIN' : 'USER'));
                localStorage.setItem('fullName', response.fullName || (loginType === 'admin' ? 'Admin User' : 'User'));
                
                // Force admin flag for admin users
                if (loginType === 'admin') {
                    localStorage.setItem('isAdmin', 'true');
                }
                
                // Clear pending login
                sessionStorage.removeItem('pendingLogin');
                
                console.log('📋 LocalStorage after auth:');
                console.log('- Token:', localStorage.getItem('authToken'));
                console.log('- UserType:', localStorage.getItem('userType'));
                console.log('- UserRole:', localStorage.getItem('userRole'));
                console.log('- IsAdmin:', localStorage.getItem('isAdmin'));
                console.log('- FullName:', localStorage.getItem('fullName'));
                
                // Update auth context
                const userData = {
                    email: email,
                    role: response.role || (loginType === 'admin' ? 'ADMIN' : 'USER'),
                    isAdmin: loginType === 'admin',
                    isAuthenticated: true,
                    token: response.token,
                    loginType: loginType,
                    userId: response.userId || userId,
                    fullName: response.fullName,
                    ...response
                };
                
                login(userData);
                
                // Check if user needs to select a package
                if (response.requiresPackageSelection === true) {
                    console.log("📦 User needs to select a package, redirecting...");
                    window.location.href = '/select-package';
                } else {
                    // Redirect to dashboard based on user type
                    console.log('🎉 Login complete! Redirecting...');
                    
                    // Use setTimeout to ensure state is saved
                    setTimeout(() => {
                        if (loginType === 'admin') {
                            console.log('👑 Redirecting to admin dashboard...');
                            window.location.href = '/admin/dashboard/overview';
                        } else {
                            console.log('👤 Redirecting to user dashboard...');
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
            
            // Show detailed error for debugging
            if (error.response?.data) {
                console.log('🔍 Detailed error data:', error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleResendOTP = async () => {
        setError('');
        setResendDisabled(true);
        setCountdown(30);
        setOtp(''); // Clear old OTP
        
        try {
            console.log('🔄 Resending OTP...', { email, loginType });
            
            const response = await authService.resendOtp({
                email,
                businessReference,
                loginType
            });
            
            console.log('📨 Resend response:', response);
            
            if (response.success || response.otpGenerated) {
                // If new OTP is returned, auto-fill it for development
                if (response.otpCode) {
                    console.log('🆕 New OTP received:', response.otpCode);
                    setOtp(response.otpCode);
                    setError(`New OTP: ${response.otpCode}`);
                } else {
                    setError('New OTP sent. Please check console/logs for OTP code.');
                }
            } else {
                setError('Failed to resend OTP. Please try again.');
                setResendDisabled(false);
            }
        } catch (error: any) {
            console.error('❌ Resend OTP error:', error);
            setError('Failed to resend OTP. Please try again.');
            setResendDisabled(false);
        }
    };
    
    const handleBackToLogin = () => {
        // Clear any pending login data
        sessionStorage.removeItem('pendingLogin');
        navigate('/login');
    };
    
    const handleChangeOtp = (value: string) => {
        // Only allow numbers and limit to 6 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setOtp(numericValue);
        setError(''); // Clear error when user types
    };
    
    const handleDebug = () => {
        console.log('🔍 Current State:', {
            email,
            loginType,
            otp,
            loading,
            localStorage: {
                token: localStorage.getItem('authToken'),
                userType: localStorage.getItem('userType'),
                userRole: localStorage.getItem('userRole'),
                isAdmin: localStorage.getItem('isAdmin')
            }
        });
        
        // Navigate to debug page
        navigate('/debug-auth');
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Verify OTP
                </h2>
                
                <p className="text-center text-gray-600 mb-6">
                    Enter the 6-digit code sent to <br />
                    <strong className="text-primary-600">{email}</strong>
                </p>
                
                {/* Login Type Badge */}
                <div className="flex justify-center mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${loginType === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {loginType === 'admin' ? '👑 Admin Login' : '👤 User Login'}
                    </span>
                </div>
                
                {/* Development OTP message */}
                {error && error.includes('Development OTP:') && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 text-sm">
                            <strong>Development Mode:</strong> {error}
                        </p>
                        <p className="text-yellow-600 text-xs mt-1">
                            In production, this would be sent via email/SMS
                        </p>
                    </div>
                )}
                
                {/* Success/Error message */}
                {error && !error.includes('Development OTP:') && !error.includes('New OTP:') && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            {error}
                        </p>
                    </div>
                )}
                
                {/* Success message for resend */}
                {error && error.includes('New OTP:') && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm">
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
                        
                        <button
                            onClick={handleDebug}
                            className="block w-full text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            🐞 Debug Authentication
                        </button>
                    </div>
                </div>
                
                {/* Debug info (development only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                        <p className="font-medium">Debug Info:</p>
                        <p>Email: {email}</p>
                        <p>Login Type: {loginType}</p>
                        {businessReference && <p>Business Ref: {businessReference}</p>}
                        <p>OTP Length: {otp.length}/6</p>
                        <p className="mt-2">Last Response:</p>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-24">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyOtp;