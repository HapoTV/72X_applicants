// src/pages/CreatePassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { authService } from '../services/AuthService';
import { supabase } from '../lib/supabaseClient';
import { checkPasswordRequirements, validateNewPassword, EMPTY_PASSWORD_REQUIREMENTS } from '../utils/passwordHelpers';
import PasswordRequirementsBox from '../components/PasswordRequirementsBox';

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center mb-6">
          <img src={Logo} alt="SeventyTwoX Logo" className="w-20 h-20 mx-auto" />
          <h1 className="text-xl font-semibold text-gray-900 mt-3">Create Password</h1>
          <p className="text-gray-600 text-sm mt-1">
            For account: <span className="font-medium text-primary-600">{userEmail}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => handlePasswordChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>

          <PasswordRequirementsBox requirements={passwordRequirements} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Creating password...' : 'Create Password & Continue'}
          </button>

          <div className="text-center">
            <button type="button" onClick={() => navigate('/signup')} className="text-sm text-gray-600 hover:text-gray-800">
              ← Back to signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
