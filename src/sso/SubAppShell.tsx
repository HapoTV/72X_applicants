// src/sso/SubAppShell.tsx
// Shell wrapper for all sub-apps.
// Handles SSO exchange, two-step sign-in, and the authenticated app layout.

import React, { useEffect } from 'react'
import { ExternalLink, LogOut } from 'lucide-react'
import { useSsoAuth } from './useSsoAuth'
import { SignInPage } from './SignInPage'

const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:5173'

interface Props {
  appName: string
  appColor?: string
  children: (user: NonNullable<ReturnType<typeof useSsoAuth>['user']>) => React.ReactNode
}

export function SubAppShell({ appName, appColor = 'from-sky-500 to-blue-600', children }: Props) {
  const {
    authState,
    user,
    pendingEmail,
    error,
    exchangeSsoToken,
    submitCredentials,
    submitOtp,
    resendOtp,
    backToSignIn,
    logout,
  } = useSsoAuth()

  // Trigger SSO exchange when state is 'sso'
  useEffect(() => {
    if (authState === 'sso') {
      void exchangeSsoToken()
    }
  }, [authState])

  // Loading / SSO exchange in progress
  if (authState === 'checking' || authState === 'sso') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  // Sign-in or OTP step
  if (authState === 'signin' || authState === 'otp') {
    return (
      <SignInPage
        appName={appName}
        appColor={appColor}
        pendingEmail={pendingEmail}
        authState={authState}
        error={error}
        onCredentials={submitCredentials}
        onOtp={submitOtp}
        onResendOtp={resendOtp}
        onBackToSignIn={backToSignIn}
      />
    )
  }

  // Authenticated — show app with top bar
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              72X
            </div>
            <span className="font-semibold text-gray-900 text-sm">{appName}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`${MAIN_APP_URL}/dashboard`}
              className="hidden sm:flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 hover:underline"
            >
              72X Dashboard <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[160px]">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        {children(user)}
      </main>
    </div>
  )
}
