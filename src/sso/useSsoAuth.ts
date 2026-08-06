// src/sso/useSsoAuth.ts
// SSO auth hook for sub-apps.
// Mirrors the main app's two-step login: credentials → OTP → JWT.

import { useState, useEffect } from 'react'
import axios from 'axios'

const BACKEND = 'http://localhost:8080/api'

export type SsoAuthState = 'checking' | 'sso' | 'signin' | 'otp' | 'authenticated'

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

// Axios instance for sub-apps — no auth interceptor loop
const api = axios.create({ baseURL: BACKEND, timeout: 15000 })

function storeAuth(token: string, user: SsoUser, userPackage?: string, organisation?: string) {
  localStorage.setItem('authToken', token)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('userEmail', user.email || '')
  localStorage.setItem('userRole', user.role || '')
  localStorage.setItem('userPackage', userPackage || user.userPackage || 'essential')
  localStorage.setItem('userStatus', 'ACTIVE')
  localStorage.setItem('userPackageHydrated', 'true')
  if (organisation || user.organisation) {
    localStorage.setItem('userOrganisation', organisation || user.organisation || '')
  }
}

export function useSsoAuth() {
  const [authState, setAuthState] = useState<SsoAuthState>('checking')
  const [user, setUser] = useState<SsoUser | null>(null)
  const [pendingEmail, setPendingEmail] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

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

  // --- SSO token exchange ---
  const exchangeSsoToken = async () => {
    const params = new URLSearchParams(window.location.search)
    const ssoToken = params.get('sso')
    if (!ssoToken) { setAuthState('signin'); return }

    try {
      const res = await api.post('/auth/sso/exchange', { ssoToken })
      const { token, user: u, userPackage, organisation } = res.data
      const normalized: SsoUser = {
        userId: u?.userId || u?.id || '',
        email: u?.email || '',
        fullName: u?.fullName || '',
        role: u?.role || 'USER',
        userPackage: userPackage || u?.subscriptionType || 'essential',
        organisation: organisation || u?.organisation,
      }
      storeAuth(token, normalized, userPackage, organisation)
      // Remove ?sso= from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('sso')
      window.history.replaceState({}, '', url.toString())
      setUser(normalized)
      setAuthState('authenticated')
    } catch (err: any) {
      const url = new URL(window.location.href)
      url.searchParams.delete('sso')
      window.history.replaceState({}, '', url.toString())
      setError('Session link expired. Please sign in.')
      setAuthState('signin')
    }
  }

  // --- Step 1: submit credentials → triggers OTP send ---
  const submitCredentials = async (email: string, password: string) => {
    setError(null)
    try {
      const res = await api.post('/authentication/login', { email, password })
      const data = res.data

      if (data.requiresOtpVerification) {
        // OTP was sent — move to OTP step
        setPendingEmail(email)
        setAuthState('otp')
      } else if (data.token) {
        // No OTP required (shouldn't happen but handle gracefully)
        _finalizeLogin(data)
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message
        || err?.response?.data
        || err?.message
        || 'Invalid credentials. Please try again.'
      setError(typeof msg === 'string' ? msg : 'Invalid credentials. Please try again.')
      throw new Error(typeof msg === 'string' ? msg : 'Invalid credentials.')
    }
  }

  // --- Step 2: submit OTP → get JWT ---
  const submitOtp = async (otp: string) => {
    setError(null)
    try {
      const res = await api.post('/authentication/verify-otp', {
        email: pendingEmail,
        otp,
        otpCode: otp,
      })
      _finalizeLogin(res.data)
    } catch (err: any) {
      const msg = err?.response?.data?.message
        || err?.response?.data
        || err?.message
        || 'Invalid or expired OTP.'
      setError(typeof msg === 'string' ? msg : 'Invalid or expired OTP.')
      throw new Error(typeof msg === 'string' ? msg : 'Invalid OTP.')
    }
  }

  const _finalizeLogin = (data: any) => {
    const u = data.user || data
    const normalized: SsoUser = {
      userId: u?.userId || u?.id || '',
      email: u?.email || pendingEmail,
      fullName: u?.fullName || '',
      role: u?.role || 'USER',
      userPackage: data.userPackage || u?.subscriptionType || 'essential',
      organisation: data.organisation || u?.organisation,
    }
    storeAuth(data.token, normalized, data.userPackage, data.organisation)
    setUser(normalized)
    setAuthState('authenticated')
  }

  const resendOtp = async () => {
    setError(null)
    try {
      await api.post('/authentication/resend-otp', { email: pendingEmail })
    } catch {
      setError('Failed to resend OTP. Please try again.')
    }
  }

  const backToSignIn = () => {
    setAuthState('signin')
    setPendingEmail('')
    setError(null)
  }

  const logout = () => {
    AUTH_KEYS.forEach((k) => localStorage.removeItem(k))
    setUser(null)
    setPendingEmail('')
    setAuthState('signin')
  }

  return {
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
  }
}
