import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/AuthService';
import { checkPasswordRequirements, validateNewPassword, EMPTY_PASSWORD_REQUIREMENTS } from '../utils/passwordHelpers';
import PasswordRequirementsBox from '../components/PasswordRequirementsBox';
import Spinner from '../components/Spinner';
import AuthWebLayout from '../components/AuthWebLayout';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29ABE2] focus:border-transparent transition-all bg-white';

const ResetPasswordVerify: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordRequirements, setPasswordRequirements] = useState(EMPTY_PASSWORD_REQUIREMENTS);

  useEffect(() => {
    const extractTokenFromUrl = () => {
      try {
        const url = new URL(window.location.href);
        let token: string | null = null;

        token = url.searchParams.get('token');
        if (!token && url.hash) {
          const hashParams = new URLSearchParams(url.hash.substring(1));
          token = hashParams.get('access_token');
        }
        if (!token) token = url.searchParams.get('code');
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
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      console.log('🔐 Resetting password with token...');
      await authService.resetPasswordVerify(resetToken, password);
      console.log('✅ Password reset successful');
      alert('Password reset successful! You can now sign in with your new password.');
      navigate('/login');
    } catch (err: any) {
      console.error('❌ Password reset error:', err);
      let errorMessage = 'Failed to reset password. Please try again.';
      if (err.message) errorMessage = err.message;
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

  // Error screen if no valid token
  if (!isReady && error) {
    return (
      <AuthWebLayout title="Invalid Reset Link" subtitle="This link is invalid or has expired.">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => navigate('/reset-password')}
            className="w-full py-3.5 bg-[#29ABE2] hover:bg-[#1e98cc] text-white rounded-full font-semibold text-sm transition-all shadow-md"
          >
            Request New Reset Link
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-[#29ABE2] font-semibold text-sm hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </AuthWebLayout>
    );
  }

  return (
    <AuthWebLayout
      title="Reset Password"
      subtitle="Choose a new secure password for your account"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={inputClass + ' pr-11'}
              placeholder="Enter new password"
              required
              disabled={!isReady}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={!isReady}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password *</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(null); }}
              className={inputClass + ' pr-11'}
              placeholder="Confirm new password"
              required
              disabled={!isReady}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={!isReady}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <PasswordRequirementsBox requirements={passwordRequirements} />

        <button
          type="submit"
          disabled={isLoading || !isReady}
          className="w-full mt-2 py-3.5 bg-[#29ABE2] hover:bg-[#1e98cc] text-white rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md"
        >
          {isLoading && <Spinner size="sm" color="white" />}
          <span className={isLoading ? 'ml-2' : ''}>{isLoading ? 'Resetting Password...' : 'Reset Password'}</span>
        </button>

        <p className="text-center text-sm text-gray-500">
          Remembered your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#29ABE2] font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthWebLayout>
  );
};

export default ResetPasswordVerify;