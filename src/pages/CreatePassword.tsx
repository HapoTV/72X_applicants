// src/pages/CreatePassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/AuthService';
import { supabase } from '../lib/supabaseClient';
import { checkPasswordRequirements, validateNewPassword, EMPTY_PASSWORD_REQUIREMENTS } from '../utils/passwordHelpers';
import PasswordRequirementsBox from '../components/PasswordRequirementsBox';
import AuthWebLayout from '../components/AuthWebLayout';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29ABE2] focus:border-transparent transition-all bg-white';

const getPublicSiteUrl = (): string => {
  const fromEnv = (import.meta as any)?.env?.VITE_PUBLIC_SITE_URL as string | undefined;
  const trimmed = (fromEnv || '').trim();
  if (trimmed) return trimmed.replace(/\/$/, '');
  const base = ((import.meta as any)?.env?.BASE_URL as string | undefined) || '/';
  const normalizedBase = String(base).trim() || '/';
  const baseNoTrailingSlash = normalizedBase.replace(/\/$/, '');
  const origin = window.location.origin.replace(/\/$/, '');
  return baseNoTrailingSlash && baseNoTrailingSlash !== '/' ? `${origin}${baseNoTrailingSlash}` : origin;
};

const CreatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [passwordRequirements, setPasswordRequirements] = useState(EMPTY_PASSWORD_REQUIREMENTS);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const tempUserData = localStorage.getItem('tempUserData');
    if (!email || !tempUserData) { navigate('/signup'); return; }
    setUserEmail(email);
  }, [navigate]);

  const handlePasswordChange = (value: string) => {
    setForm(prev => ({ ...prev, password: value }));
    setPasswordRequirements(checkPasswordRequirements(value));
  };

  const validatePassword = (): boolean => {
    const err = validateNewPassword(form.password, form.confirmPassword, passwordRequirements);
    if (err) { setError(err); return false; }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      const tempUserDataStr = localStorage.getItem('tempUserData');
      if (!tempUserDataStr) throw new Error('User data not found');

      const tempUserData = JSON.parse(tempUserDataStr);
      const businessReference = tempUserData.businessReference;

      await authService.createPassword(userEmail, form.password, businessReference);

      if (businessReference) {
        localStorage.setItem('businessReference', businessReference);
        localStorage.setItem('userProvidedBusinessReference', 'true');
      } else {
        localStorage.setItem('userProvidedBusinessReference', 'false');
      }
      localStorage.removeItem('tempUserData');

      try {
        if (!supabase) {
          console.warn('Supabase client not initialized; skipping Supabase signUp.');
        } else {
          const emailRedirectTo = `${getPublicSiteUrl()}/signup/success/provided`;
          localStorage.removeItem('supabaseVerificationEmailFailed');

          const { error: signUpError } = await supabase.auth.signUp({
            email: userEmail,
            password: form.password,
            options: { emailRedirectTo },
          });
          if (signUpError && typeof signUpError.message === 'string' && signUpError.message.toLowerCase().includes('rate limit')) {
            localStorage.setItem('supabaseEmailRateLimited', 'true');
          }

          const shouldAttemptResend = !signUpError || (typeof signUpError.message === 'string' && signUpError.message.toLowerCase().includes('user already registered'));
          if (shouldAttemptResend) {
            const { error: resendErr } = await supabase.auth.resend({ type: 'signup', email: userEmail, options: { emailRedirectTo } });
            if (resendErr) {
              localStorage.setItem('supabaseVerificationEmailFailed', 'true');
              console.error('Supabase resend error:', resendErr);
            }
          } else if (signUpError) {
            localStorage.setItem('supabaseVerificationEmailFailed', 'true');
            console.error('Supabase signUp error:', signUpError);
          }
        }
      } catch (supabaseErr) {
        localStorage.setItem('supabaseVerificationEmailFailed', 'true');
        console.error('Supabase signUp unexpected error:', supabaseErr);
      }

      navigate('/signup/success');
    } catch (err: any) {
      setError(err.message || 'Failed to create password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthWebLayout
      title="Create Password"
      subtitle={userEmail ? `Setting password for ${userEmail}` : 'Set a secure password for your account'}
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
              value={form.password}
              onChange={e => handlePasswordChange(e.target.value)}
              className={inputClass + ' pr-11'}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={inputClass + ' pr-11'}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <PasswordRequirementsBox requirements={passwordRequirements} />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 bg-[#29ABE2] hover:bg-[#1e98cc] text-white rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating password...
            </>
          ) : 'Create Password & Continue'}
        </button>

        <p className="text-center text-sm text-gray-500">
          <button type="button" onClick={() => navigate('/signup')} className="text-[#29ABE2] font-semibold hover:underline">
            ← Back to signup
          </button>
        </p>
      </form>
    </AuthWebLayout>
  );
};

export default CreatePassword;
