// src/sso/useSsoAuth.ts
// Shared SSO auth hook used by all sub-apps.
// Handles: SSO token exchange, direct sign-in, logout, auth state.

import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'

export type SsoAuthState = 'checking' | 'sso' | 'signin' | 'authenticated'

export interface SsoUser {
  userId: string
  email: string
  fullName: string
  role: string
  userPackage?: string
  organisation?: string
}

const AUTH_KEYS = [
  'authToken', 'user', 'userEmail', 'userRole',
  'userPackage', 'userOrganisation', 'userStatus',
  'userPackageHydrated', 'businessReference',
]

function storeAuth(token: string, user: SsoUser, extra?: Record<string, string>) {
  localStorage.setItem('authToken', token)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('userEmail', user.email || '')
  localStorage.setItem('userRole', user.role || '')
  localStorage.setItem('userPackage', user.userPackage || 'essential')
  localStorage.setItem('userStatus', 'ACTIVE')
  localStorage.setItem('userPackageHydrated', 'true')
  if (user.organisation) localStorage.setItem('userOrganisation', user.organisation)
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => localStorage.setItem(k, v))
  }
}

export function useSsoAuth() {
  const [authState, setAuthState] = useState<SsoAuthState>('checking')
  const [user, setUser] = useState<SsoUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  // On mount — determine initial auth state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ssoToken = params.get('sso')
    const existingToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')

    if (ssoToken) {
      setAuthState('sso')
    } else if (existingToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setAuthState('authenticated')
      } catch {
        setAuthState('signin')
      }
    } else {
      setAuthState('signin')
    }
  }, [])

  // Exchange SSO token for a full JWT
  const exchangeSsoToken = async () => {
    const params = new URLSearchParams(window.location.search)
    const ssoToken = params.get('sso')
    if (!ssoToken) { setAuthState('signin'); return }

    try {
      const res = await axiosClient.post('/auth/sso/exchange', { ssoToken })
      const { token, user: userData } = res.data
      storeAuth(token, userData)
      // Remove ?sso= from URL without reload
      const url = new URL(window.location.href)
      url.searchParams.delete('sso')
      window.history.replaceState({}, '', url.toString())
      setUser(userData)
      setAuthState('authenticated')
    } catch {
      // SSO exchange failed — fall back to sign-in page
      const url = new URL(window.location.href)
      url.searchParams.delete('sso')
      window.history.replaceState({}, '', url.toString())
      setAuthState('signin')
      setError('Session link expired. Please sign in.')
    }
  }

  // Direct sign-in with email + password
  const signIn = async (email: string, password: string) => {
    setError(null)
    try {
      const res = await axiosClient.post('/authentication', { email, password })
      const { token, user: userData, userPackage, organisation } = res.data
      const normalized: SsoUser = {
        userId: userData?.userId || userData?.id || '',
        email: userData?.email || email,
        fullName: userData?.fullName || '',
        role: userData?.role || 'USER',
        userPackage: userPackage || userData?.userPackage || 'essential',
        organisation: organisation || userData?.organisation,
      }
      storeAuth(token, normalized)
      setUser(normalized)
      setAuthState('authenticated')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Invalid credentials.'
      setError(msg)
      throw new Error(msg)
    }
  }

  const logout = () => {
    AUTH_KEYS.forEach((k) => localStorage.removeItem(k))
    setUser(null)
    setAuthState('signin')
  }

  return { authState, user, error, exchangeSsoToken, signIn, logout }
}
