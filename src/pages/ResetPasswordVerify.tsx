import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

const ResetPasswordVerify: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [devCodeVisible, setDevCodeVisible] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('resetEmail') || '';
    setEmail(saved);
    if (saved) {
      const devCode = sessionStorage.getItem(`resetCode:${saved}`) || localStorage.getItem(`passwordResetCode:${saved}`) || null;
      if (devCode) setDevCodeVisible(devCode as string);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !code.trim() || !password.trim()) return alert('Please fill all fields');
    if (password !== confirm) return alert('Passwords do not match');
    setIsLoading(true);
    try {
      await authService.resetPasswordWithCode(email.trim(), code.trim(), password);
      alert('Password reset successful. You can now sign in with your new password.');
      navigate('/login');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-lg font-semibold mb-2">Verify code & reset password</h1>
        <p className="text-sm text-gray-600 mb-4">Enter the code you received and choose a new password.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification code</label>
            <input type="text" value={code} onChange={e => setCode(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            {devCodeVisible && (
              <div className="mt-2 text-xs text-gray-500">(Dev only) code: <strong>{devCodeVisible}</strong></div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg">
            {isLoading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <div className="text-sm text-gray-600 mt-4">
          Remembered your password? <button onClick={() => navigate('/login')} className="text-primary-600">Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordVerify;
