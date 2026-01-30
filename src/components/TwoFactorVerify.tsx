// src/components/TwoFactorVerify.tsx
import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, RotateCw } from 'lucide-react';
import { twoFactorService } from '../services/TwoFactorService';

interface TwoFactorVerifyProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type VerifyMode = 'totp' | 'backup';

export const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({ userId, onSuccess, onCancel }) => {
  const [mode, setMode] = useState<VerifyMode>('totp');
  const [code, setCode] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Timer for TOTP code expiration
  useEffect(() => {
    if (mode !== 'totp') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setError('Please enter a code');
      return;
    }

    if (mode === 'totp' && code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    if (mode === 'backup' && code.length < 8) {
      setError('Please enter a valid backup code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (mode === 'totp') {
        await twoFactorService.verifyTOTPForLogin(userId, code);
      } else {
        await twoFactorService.verifyBackupCodeForLogin(userId, code);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setTimeRemaining(30);
    setCode('');
    setError('');
  };

  const getTimeColor = () => {
    if (timeRemaining > 15) return 'text-green-600';
    if (timeRemaining > 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Verify Your Identity</h2>
          <p className="text-sm text-gray-600 mt-1">
            {mode === 'totp'
              ? 'Enter the code from your authenticator app'
              : 'Enter a backup code'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleVerify} className="space-y-4">
            {/* TOTP Input */}
            {mode === 'totp' && (
              <div className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder="000000"
                  className="w-full text-center text-3xl tracking-widest border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 font-mono"
                  autoFocus
                />

                {/* Timer */}
                <div className={`flex items-center justify-center gap-2 text-sm font-medium ${getTimeColor()}`}>
                  <Clock size={18} />
                  <span>Code expires in {timeRemaining}s</span>
                </div>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg transition"
                >
                  <RotateCw size={16} />
                  Refresh Code
                </button>
              </div>
            )}

            {/* Backup Code Input */}
            {mode === 'backup' && (
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="XXXXXXXX"
                className="w-full text-center text-lg tracking-wider border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 font-mono"
                autoFocus
              />
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || (mode === 'totp' ? code.length !== 6 : code.length < 8)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>

            {/* Mode Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('totp');
                  setCode('');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  mode === 'totp'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Authenticator App
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('backup');
                  setCode('');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  mode === 'backup'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Backup Code
              </button>
            </div>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-gray-600 py-2 px-4 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
