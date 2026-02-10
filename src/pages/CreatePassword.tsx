// src/pages/CreatePassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { authService } from '../services/AuthService';
import { supabase } from '../lib/supabaseClient';

const CreatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const tempUserData = localStorage.getItem('tempUserData');
    if (!email || !tempUserData) {
      navigate('/signup');
      return;
    }
    setUserEmail(email);
  }, [navigate]);

  const checkPasswordRequirements = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (value: string) => {
    setForm(prev => ({ ...prev, password: value }));
    checkPasswordRequirements(value);
  };

  const validatePassword = (): boolean => {
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    const requirements = passwordRequirements;
    if (!requirements.hasNumber || !requirements.hasUppercase || 
        !requirements.hasLowercase || !requirements.hasSpecialChar) {
      setError('Password does not meet all requirements');
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);
    try {
      const tempUserDataStr = localStorage.getItem('tempUserData');
      if (!tempUserDataStr) {
        throw new Error('User data not found');
      }

      const tempUserData = JSON.parse(tempUserDataStr);
      const businessReference = tempUserData.businessReference;

      await authService.createPassword(
        userEmail,
        form.password,
        businessReference
      );

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
          const emailRedirectTo = `${window.location.origin}/signup/success/provided`;
          const { error } = await supabase.auth.signUp({
            email: userEmail,
            password: form.password,
            options: { emailRedirectTo }
          });
          if (error && typeof error.message === 'string' && error.message.toLowerCase().includes('rate limit')) {
            localStorage.setItem('supabaseEmailRateLimited', 'true');
          }
          if (error && typeof error.message === 'string' && error.message.toLowerCase().includes('user already registered')) {
            const { error: resendErr } = await supabase.auth.resend({
              type: 'signup',
              email: userEmail,
              options: { emailRedirectTo }
            });
            if (resendErr) console.error('Supabase resend error:', resendErr);
          } else if (error) {
            console.error('Supabase signUp error:', error);
          }
        }
      } catch (supabaseErr) {
        console.error('Supabase signUp unexpected error:', supabaseErr);
      }

      navigate('/signup/success');
    } catch (err: any) {
      setError(err.message || 'Failed to create password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-green-100' : 'bg-gray-100'}`}>
        <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
          {met ? '✓' : '○'}
        </span>
      </div>
      <span className={`text-sm ${met ? 'text-green-700' : 'text-gray-500'}`}>
        {text}
      </span>
    </div>
  );

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h3>
            <RequirementItem met={passwordRequirements.minLength} text="At least 8 characters long" />
            <RequirementItem met={passwordRequirements.hasUppercase} text="One uppercase letter" />
            <RequirementItem met={passwordRequirements.hasLowercase} text="One lowercase letter" />
            <RequirementItem met={passwordRequirements.hasNumber} text="One number" />
            <RequirementItem met={passwordRequirements.hasSpecialChar} text="One special character" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Creating password...' : 'Create Password & Continue'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;