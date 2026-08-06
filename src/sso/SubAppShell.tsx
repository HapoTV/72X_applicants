// src/sso/SubAppShell.tsx
// Top bar shell wrapper for all sub-apps.
// Shows app name, user email, link back to main 72X app, and logout.

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

export function SubAppShell({ appName, appColor, children }: Props) {
  const { authState, user, error, exchangeSsoToken, signIn, logout } = useSsoAuth()

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

  // Not authenticated — show sign-in page
  if (authState === 'signin' || !user) {
    return (
      <SignInPage
        appName={appName}
        appColor={appColor}
        onSignIn={signIn}
        errorMessage={error}
      />
    )
  }

  // Authenticated — show app with top bar
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
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
              72X Dashboard
              <ExternalLink className="w-3 h-3" />
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

      {/* App content */}
      <main className="p-4 sm:p-6">
        {children(user)}
      </main>
    </div>
  )
}
