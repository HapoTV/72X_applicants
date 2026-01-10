import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/auth'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUser = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await authService.getCurrentUser()
      if (result.error) {
        setError(result.error)
        setUser(null)
      } else {
        setUser(result.user)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await authService.signIn(email, password)
      if (result.error) {
        setError(result.error)
        return false
      } else {
        setUser(result.user)
        return true
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, selectedIndustries: string[]) => {
    setLoading(true)
    setError(null)

    try {
      const result = await authService.signUp(email, password, selectedIndustries)
      if (result.error) {
        setError(result.error)
        return false
      } else {
        setUser(result.user)
        return true
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await authService.signOut()
      if (result.error) {
        setError(result.error)
      } else {
        setUser(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    refreshUser: loadUser
  }
}
