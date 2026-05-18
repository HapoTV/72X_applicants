import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Logo from '../../../assets/Logo.svg';

type FormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type Props = {
  subtitle: string;
  badgeClassName: string;
  badgeLabel: string;
  badgeIcon: React.ReactNode;
  emailPlaceholder: string;
  submitLabel: string;
  submitButtonClassName: string;
  errorMessage: string;
  isLoading: boolean;
  setErrorMessage: (next: string) => void;
  onSubmit: (formData: FormState) => Promise<void>;
  footerLinks?: React.ReactNode;
};

const RoleLoginPage: React.FC<Props> = ({
  subtitle,
  badgeClassName,
  badgeLabel,
  badgeIcon,
  emailPlaceholder,
  submitLabel,
  submitButtonClassName,
  errorMessage,
  isLoading,
  setErrorMessage,
  onSubmit,
  footerLinks,
}) => {
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof FormState, value: FormState[keyof FormState]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <img src={Logo} alt="SeventyTwoX Logo" className="w-48 h-48" />
          </div>
          <p className="text-gray-600 -mt-12">{subtitle}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-center mb-6">
            <div className={`${badgeClassName} px-4 py-2 rounded-full flex items-center space-x-2`}>
              {badgeIcon}
              <span className="font-medium">{badgeLabel}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={emailPlaceholder}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/reset-password" className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium ${submitButtonClassName}`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                submitLabel
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            {footerLinks ?? (
              <p className="text-sm text-gray-600 text-center">
                Are you a regular user?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in as User
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLoginPage;
