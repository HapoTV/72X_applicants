import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

export interface AuthResponse {
  user: User | null
  error: string | null
}

export const authService = {
  async signUp(email: string, password: string, selectedIndustries: string[]): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            selected_industries: selectedIndustries
          }
        }
      })

      if (error) throw error

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              selected_industries: selectedIndustries
            }
          ])
          .select()
          .single()

        if (profileError) throw profileError

        return { user: profile, error: null }
      }

      return { user: null, error: 'Failed to create user' }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'An error occurred' }
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) throw profileError

        return { user: profile, error: null }
      }

      return { user: null, error: 'Failed to sign in' }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'An error occurred' }
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' }
    }
  },

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) throw error

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        return { user: profile, error: null }
      }

      return { user: null, error: null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'An error occurred' }
    }
  }
}
