import { createClient, SupabaseClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

const SUPABASE_URL = 'https://oxabqoodvqvqskrztrsq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YWJxb29kdnF2cXNrcnp0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzI1MzQsImV4cCI6MjA3NjI0ODUzNH0._BdnLDSSe003i83nf_vfnHMlGJSQdjcfEcKvmlyfqSc';

const createSafeStorage = () => ({
  getItem: (key: string) => {
    try {
      if (!isBrowser) return null;
      return window.localStorage.getItem(key);
    } catch { return null; }
  },
  setItem: (key: string, value: string) => {
    try {
      if (!isBrowser) return;
      window.localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: (key: string) => {
    try {
      if (!isBrowser) return;
      window.localStorage.removeItem(key);
    } catch {}
  },
});

let supabase: SupabaseClient | null = null;

if (isBrowser) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: createSafeStorage(),
      },
    });
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
}

export { supabase };
