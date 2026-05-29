import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/AuthService';
import { checkPasswordRequirements, validateNewPassword, EMPTY_PASSWORD_REQUIREMENTS } from '../utils/passwordHelpers';
import PasswordRequirementsBox from '../components/PasswordRequirementsBox';
import Spinner from '../components/Spinner';

const ResetPasswordVerify: React.FC = () => {
const navigate = useNavigate();
const [password, setPassword] = useState('');
const [confirm, setConfirm] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [isReady, setIsReady] = useState(false);
const [error, setError] = useState<string | null>(null);
const [resetToken, setResetToken] = useState<string | null>(null);

// Password visibility toggles (like Profile component)
const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

// Real-time password requirements (like Profile component)
const [passwordRequirements, setPasswordRequirements] = useState(EMPTY_PASSWORD_REQUIREMENTS);

useEffect(() => {
const extractTokenFromUrl = () => {
try {
const url = new URL(window.location.href);

// Try different token extraction methods
let token: string | null = null;

// Method 1: Query parameter 'token'
token = url.searchParams.get('token');

// Method 2: Hash fragment 'access_token'
if (!token && url.hash) {
const hashParams = new URLSearchParams(url.hash.substring(1));
token = hashParams.get('access_token');
}

// Method 3: Query parameter 'code'
if (!token) {
token = url.searchParams.get('code');
}

// Method 4: Check if token is in the hash directly
if (!token && url.hash.includes('token=')) {
const match = url.hash.match(/token=([^&]+)/);
if (match) token = match[1];
}

console.log('🔑 Extracted reset token:', token ? 'Found' : 'Not found');

if (!token) {
setError('Invalid or missing reset token. Please request a new password reset link.');
setIsReady(false);
} else {
setResetToken(token);
setIsReady(true);
}
} catch (err) {
console.error('Error extracting token:', err);
setError('Invalid reset link format. Please request a new password reset.');
setIsReady(false);
}
};

extractTokenFromUrl();
}, []);

const handlePasswordChange = (value: string) => {
setPassword(value);
setPasswordRequirements(checkPasswordRequirements(value));
setError(null);
};

const validatePassword = (): boolean => {
const err = validateNewPassword(password, confirm, passwordRequirements);
if (err) { setError(err); return false; }
return true;
};

const onSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setError(null);

if (!resetToken) {
setError('Invalid or missing reset token. Please request a new password reset link.');
return;
}

if (!validatePassword()) {
return;
}

setIsLoading(true);
try {
console.log('🔐 Resetting password with token...');

// Use AuthService to reset password (like Profile component uses changePassword)
await authService.resetPasswordVerify(resetToken, password);

console.log('✅ Password reset successful');
alert('Password reset successful! You can now sign in with your new password.');
navigate('/login');
} catch (err: any) {
console.error('❌ Password reset error:', err);

let errorMessage = 'Failed to reset password. Please try again.';

if (err.message) {
errorMessage = err.message;
}

// Handle specific error cases (like Profile component)
if (err.message?.toLowerCase().includes('token')) {
errorMessage = 'Invalid or expired reset token. Please request a new password reset link.';
} else if (err.message?.toLowerCase().includes('password')) {
errorMessage = err.message;
}

setError(errorMessage);
} finally {
setIsLoading(false);
}
};

// Show error screen if no valid token
if (!isReady && error) {
return (
<div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
<div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
<div className="text-center">
<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
<span className="text-red-600 text-2xl">⚠️</span>
</div>
<h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
<p className="text-gray-600 mb-6">{error}</p>
<button
onClick={() => navigate('/forgot-password')}
className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mb-3"
>
Request New Reset Link
</button>
<button
onClick={() => navigate('/login')}
className="text-primary-600 hover:text-primary-700 font-medium text-sm"
>
Back to Sign In
</button>
</div>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
<div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
<h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
<p className="text-sm text-gray-600 mb-6">
Choose a new secure password for your account.
</p>

<form onSubmit={onSubmit} className="space-y-4">
{/* Error Message */}
{error && (
<div className="bg-red-50 border border-red-200 rounded-lg p-3">
<p className="text-red-600 text-sm">{error}</p>
</div>
)}

{/* New Password */}
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
New Password
</label>
<div className="relative">
<input
type={showPassword ? 'text' : 'password'}
value={password}
onChange={(e) => handlePasswordChange(e.target.value)}
className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
placeholder="Enter new password"
required
disabled={!isReady}
/>
<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
disabled={!isReady}
>
{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
</button>
</div>
</div>

{/* Confirm Password */}
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Confirm New Password
</label>
<div className="relative">
<input
type={showConfirm ? 'text' : 'password'}
value={confirm}
onChange={(e) => {
setConfirm(e.target.value);
setError(null);
}}
className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
placeholder="Confirm new password"
required
disabled={!isReady}
/>
<button
type="button"
onClick={() => setShowConfirm(!showConfirm)}
className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
disabled={!isReady}
>
{showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
</button>
</div>
</div>

<PasswordRequirementsBox requirements={passwordRequirements} />

{/* Submit Button */}
<button
type="submit"
disabled={isLoading || !isReady}
className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
>
{isLoading && <Spinner size="sm" color="white" />}
<span>{isLoading ? 'Resetting Password...' : 'Reset Password'}</span>
</button>
</form>

{/* Back to Login Link */}
<div className="text-sm text-gray-600 mt-4 text-center">
Remembered your password?{' '}
<button
onClick={() => navigate('/login')}
className="text-primary-600 hover:text-primary-700 font-medium"
>
Sign in
</button>
</div>
</div>
</div>
);
};

export default ResetPasswordVerify;