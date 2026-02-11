import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ResetPasswordVerify: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const exchangeSessionIfPresent = async () => {
      try {
        if (!supabase) return;

        const url = new URL(window.location.href);
        const hasCodeParam = url.searchParams.has('code');
        const hasAccessTokenInHash = window.location.hash.includes('access_token=');

        if (hasCodeParam && typeof (supabase.auth as any).exchangeCodeForSession === 'function') {
          await (supabase.auth as any).exchangeCodeForSession(window.location.href);
        } else if (hasAccessTokenInHash && typeof (supabase.auth as any).getSessionFromUrl === 'function') {
          await (supabase.auth as any).getSessionFromUrl({ storeSession: true });
        }
      } catch {
        // no-op
      } finally {
        setIsReady(true);
      }
    };

    exchangeSessionIfPresent();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return alert('Please enter a new password');
    if (password !== confirm) return alert('Passwords do not match');
    setIsLoading(true);
    try {
      if (!supabase) {
        alert('Password reset service is unavailable. Please try again later.');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

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
        <h1 className="text-lg font-semibold mb-2">Reset password</h1>
        <p className="text-sm text-gray-600 mb-4">Choose a new password for your account.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <button type="submit" disabled={isLoading || !isReady} className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg disabled:opacity-50">
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
