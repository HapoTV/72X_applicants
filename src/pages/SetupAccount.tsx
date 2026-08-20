import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/AuthService';

const SetupAccount: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupToken, setSetupToken] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    const extractTokenFromUrl = () => {
      try {
        const url = new URL(window.location.href);

        let token: string | null = null;
        token = url.searchParams.get('token');

        if (!token && url.hash) {
          const hashParams = new URLSearchParams(url.hash.substring(1));
          token = hashParams.get('token') || hashParams.get('access_token');
        }

        if (!token) {
          token = url.searchParams.get('code');
        }

        if (!token && url.hash.includes('token=')) {
          const match = url.hash.match(/token=([^&]+)/);
          if (match) token = match[1];
        }

        if (!token) {
          setError('Invalid or missing setup token. Please request a new account setup link.');
          setIsReady(false);
        } else {
          setSetupToken(token);
          setIsReady(true);
        }
      } catch (err) {
        console.error('Error extracting token:', err);
        setError('Invalid setup link format. Please request a new account setup link.');
        setIsReady(false);
      }
    };

    extractTokenFromUrl();
  }, []);

  const checkPasswordRequirements = (pwd: string) => {
    setPasswordRequirements({
      minLength: pwd.length >= 8,
      hasNumber: /\d/.test(pwd),
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    checkPasswordRequirements(value);
    setError(null);
  };

  const validatePassword = (): boolean => {
    if (!password) {
      setError('New password is required');
      return false;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    const requirements = passwordRequirements;
    if (!requirements.hasNumber || !requirements.hasUppercase || !requirements.hasLowercase || !requirements.hasSpecialChar) {
      setError('Password does not meet all requirements');
      return false;
    }

    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!setupToken) {
      setError('Invalid or missing setup token. Please request a new account setup link.');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.setupAccountWithToken(setupToken, password);
      const role = (result as any)?.role ? String((result as any).role).toUpperCase() : null;
      alert('Account setup successful! You can now sign in with your new password.');

      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        navigate('/login/asadmin');
      } else if (role === 'COC_ADMIN') {
        navigate('/login/cocadmin');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      let errorMessage = 'Failed to set up account. Please try again.';

      if (err.message) {
        errorMessage = err.message;
      }

      if (err.message?.toLowerCase().includes('token')) {
        errorMessage = 'Invalid or expired setup token. Please request a new account setup link.';
      }

      setError(errorMessage);
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

  if (!isReady && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Setup Link</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Account</h1>
        <p className="text-sm text-gray-600 mb-6">Choose a secure password to activate your account.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
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
            disabled={isLoading || !isReady}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isLoading ? 'Setting up account...' : 'Set Password'}</span>
          </button>
        </form>

        <div className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{' '}
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

export default SetupAccount;
