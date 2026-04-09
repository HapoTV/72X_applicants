import { createClient, SupabaseClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

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
