import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

const ResetPasswordRequest: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [businessRef, setBusinessRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return alert('Please enter your email');
    setIsLoading(true);
    try {
      const res = await authService.requestPasswordReset(email.trim(), businessRef.trim() || undefined);
      alert('Verification code sent (check email).');
      // For dev convenience, if backend fallback returns code, save it in session so user can see it on verify page
      if ((res as any).code) sessionStorage.setItem(`resetCode:${email.trim()}`, (res as any).code);
      // Save the email for the next step
      sessionStorage.setItem('resetEmail', email.trim());
      navigate('/reset-password/verify');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to request verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-lg font-semibold mb-2">Forgot password</h1>
        <p className="text-sm text-gray-600 mb-4">Enter your account email to receive a verification code.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Reference (optional)</label>
            <input type="text" value={businessRef} onChange={e => setBusinessRef(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg">
            {isLoading ? 'Sending...' : 'Send verification code'}
          </button>
        </form>

        <div className="text-sm text-gray-600 mt-4">
          Remembered your password? <button onClick={() => navigate('/login')} className="text-primary-600">Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
