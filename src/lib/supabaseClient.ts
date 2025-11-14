import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Environment variable loader that works in both browser and Node.js environments
const getEnv = (key: string): string | undefined => {
  // Check for Vite environment variables (VITE_)
  const viteEnv = (globalThis as any)?.import?.meta?.env || (import.meta as any)?.env;
  if (viteEnv && viteEnv[key]) {
    return viteEnv[key];
  }

  // Check for Node.js process environment variables
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }

  // Check for global window.ENV (useful for some server-side rendering setups)
  if (typeof window !== 'undefined' && (window as any).ENV) {
    return (window as any).ENV[key];
  }

  return undefined;
};

// Hardcoded Supabase configuration for testing
const SUPABASE_URL = 'https://oxabqoodvqvqskrztrsq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YWJxb29kdnF2cXNrcnp0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzI1MzQsImV4cCI6MjA3NjI0ODUzNH0._BdnLDSSe003i83nf_vfnHMlGJSQdjcfEcKvmlyfqSc';

// Log error if environment variables are missing (only in development)
if (process.env.NODE_ENV !== 'production') {
  if (!SUPABASE_URL) console.error('Supabase URL is missing. Please check your environment variables.');
  if (!SUPABASE_ANON_KEY) console.error('Supabase Anon Key is missing. Please check your environment variables.');
}

// Create and export the Supabase client
const supabase: SupabaseClient | null = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export { supabase };
