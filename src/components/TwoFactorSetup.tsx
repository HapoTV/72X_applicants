// src/components/TwoFactorSetup.tsx
import React, { useState } from 'react';
import { X, Copy, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { twoFactorService } from '../services/TwoFactorService';

interface TwoFactorSetupProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

type SetupStep = 'initial' | 'qrcode' | 'verify' | 'backupcodes' | 'complete';

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ userId, onClose, onSuccess }) => {
  const [step, setStep] = useState<SetupStep>('initial');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSecret, setShowSecret] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

  const handleGenerateSecret = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await twoFactorService.generateTOTPSecret(userId);
      setSecret(response.secret);
      setQrCode(response.qrCode);
      setBackupCodes(response.backupCodes);
      setStep('qrcode');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate secret');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await twoFactorService.verifyAndEnableTOTP(userId, verificationCode);
      setStep('backupcodes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'backup') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedBackupCodes(true);
      setTimeout(() => setCopiedBackupCodes(false), 2000);
    }
  };

  const handleComplete = () => {
    setStep('complete');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Setup Two-Factor Authentication</h2>
          <button
            onClick={onClose}
            aria-label="Close two-factor authentication setup"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Initial Step */}
          {step === 'initial' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Two-Factor Authentication adds an extra layer of security to your account. You'll need an authenticator app like Google Authenticator or Microsoft Authenticator.
              </p>
              <button
                onClick={handleGenerateSecret}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isLoading ? 'Generating...' : 'Start Setup'}
              </button>
            </div>
          )}

          {/* QR Code Step */}
          {step === 'qrcode' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Can't scan? Enter this key manually in your authenticator:
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <code className="text-sm font-mono">
                  {showSecret ? secret : '••••••••••••••••••••••••••••••••'}
                </code>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                onClick={() => copyToClipboard(secret, 'secret')}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
              >
                {copiedSecret ? (
                  <>
                    <Check size={18} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} /> Copy Secret
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('verify')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                I've Scanned the Code
              </button>
            </div>
          )}

          {/* Verify Code Step */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app:
              </p>

              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500"
                autoFocus
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
              </button>

              <button
                type="button"
                onClick={() => setStep('qrcode')}
                className="w-full text-blue-600 py-2 px-4 hover:bg-blue-50 rounded-lg transition"
              >
                Back
              </button>
            </form>
          )}

          {/* Backup Codes Step */}
          {step === 'backupcodes' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
                <Check size={20} className="text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800 font-medium">
                  Two-Factor Authentication enabled successfully!
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Save your backup codes in a safe place:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 max-h-48 overflow-y-auto">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="text-sm font-mono text-gray-700">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(backupCodes.join('\n'), 'backup')}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
              >
                {copiedBackupCodes ? (
                  <>
                    <Check size={18} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} /> Copy Backup Codes
                  </>
                )}
              </button>

              <button
                onClick={handleComplete}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check size={24} className="text-green-600" />
              </div>
              <p className="text-gray-900 font-medium">
                Two-Factor Authentication is now enabled!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
