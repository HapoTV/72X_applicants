// src/sso/SignInPage.tsx
// Two-step sign-in for sub-apps: credentials → OTP → authenticated.
// Accounts are created on 72x.co.za only.

import React, { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff, ArrowLeft, RefreshCw } from 'lucide-react'

const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:5173'

// --- Credentials step ---
interface CredentialsStepProps {
  appName: string
  appColor: string
  onSubmit: (email: string, password: string) => Promise<void>
  error?: string | null
}

function CredentialsStep({ appName, appColor, onSubmit, error }: CredentialsStepProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const displayError = localError || error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setLoading(true)
    try {
      await onSubmit(email.trim(), password)
    } catch (err: any) {
      setLocalError(err?.message || 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* App logo + name */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${appColor} flex items-center justify-center text-white font-bold text-lg shadow-md mb-4`}>
            72X
          </div>
          <h1 className="text-xl font-bold text-gray-900">{appName}</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {displayError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href={`${MAIN_APP_URL}/reset-password`} className="text-xs text-primary-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don't have an account?{' '}
          <a href={`${MAIN_APP_URL}/signup`} className="text-primary-600 font-medium hover:underline">
            Create one on 72X
          </a>
        </p>
      </div>
    </div>
  )
}

// --- OTP step ---
interface OtpStepProps {
  email: string
  onSubmit: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  onBack: () => void
  error?: string | null
}

function OtpStep({ email, onSubmit, onResend, onBack, error }: OtpStepProps) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [resendCountdown, setResendCountdown] = useState(30)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const timer = setInterval(() => {
      setResendCountdown((v) => (v > 0 ? v - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const displayError = localError || error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 4) return
    setLocalError(null)
    setLoading(true)
    try {
      await onSubmit(otp.trim())
    } catch (err: any) {
      setLocalError(err?.message || 'Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCountdown > 0) return
    setLocalError(null)
    setResendCountdown(30)
    await onResend()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-bold text-lg shadow-md mb-4">
            72X
          </div>
          <h1 className="text-xl font-bold text-gray-900">Verify your identity</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            We sent a verification code to<br />
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="otp"
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                required
                autoComplete="one-time-code"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-center tracking-widest text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="------"
              />
            </div>

            {displayError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Verifying...
                </span>
              ) : 'Verify'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 hover:text-gray-700"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendCountdown > 0}
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-3 h-3" />
              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Exported component — orchestrates both steps ---
interface SignInPageProps {
  appName: string
  appColor?: string
  pendingEmail: string
  authState: 'signin' | 'otp'
  error?: string | null
  onCredentials: (email: string, password: string) => Promise<void>
  onOtp: (otp: string) => Promise<void>
  onResendOtp: () => Promise<void>
  onBackToSignIn: () => void
}

export function SignInPage({
  appName,
  appColor = 'from-sky-500 to-blue-600',
  pendingEmail,
  authState,
  error,
  onCredentials,
  onOtp,
  onResendOtp,
  onBackToSignIn,
}: SignInPageProps) {
  if (authState === 'otp') {
    return (
      <OtpStep
        email={pendingEmail}
        onSubmit={onOtp}
        onResend={onResendOtp}
        onBack={onBackToSignIn}
        error={error}
      />
    )
  }

  return (
    <CredentialsStep
      appName={appName}
      appColor={appColor}
      onSubmit={onCredentials}
      error={error}
    />
  )
}
