// src/sso/SignInPage.tsx
// Reusable sign-in page for all sub-apps.
// Account creation is on 72x.co.za only — this page is sign-in only.

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:5173'

interface Props {
  appName: string
  appColor?: string // tailwind gradient e.g. 'from-sky-500 to-blue-600'
  onSignIn: (email: string, password: string) => Promise<void>
  errorMessage?: string | null
}

export function SignInPage({ appName, appColor = 'from-sky-500 to-blue-600', onSignIn, errorMessage }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const error = localError || errorMessage

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLocalError(null)
    setLoading(true)
    try {
      await onSignIn(email.trim(), password)
    } catch (err: any) {
      setLocalError(err?.message || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo + app name */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${appColor} flex items-center justify-center text-white font-bold text-lg shadow-md mb-4`}>
            72X
          </div>
          <h1 className="text-xl font-bold text-gray-900">{appName}</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-gray-400"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
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
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-4 text-center">
            <a
              href={`${MAIN_APP_URL}/reset-password`}
              className="text-xs text-primary-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* No account */}
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
