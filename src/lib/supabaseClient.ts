import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Hardcoded Supabase configuration
const SUPABASE_URL = 'https://oxabqoodvqvqskrztrsq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YWJxb29kdnF2cXNrcnp0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzI1MzQsImV4cCI6MjA3NjI0ODUzNH0._BdnLDSSe003i83nf_vfnHMlGJSQdjcfEcKvmlyfqSc';

// Log configuration for debugging
console.log('Initializing Supabase client with URL:', SUPABASE_URL);

// Create storage wrapper with error handling
const createSafeStorage = () => ({
  getItem: (key: string) => {
    try {
      if (!isBrowser) return null;
      const value = window.localStorage.getItem(key);
      console.log(`Getting ${key} from localStorage:`, value ? '[HIDDEN]' : 'null');
      return value;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      if (!isBrowser) return;
      console.log(`Setting ${key} in localStorage`);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  removeItem: (key: string) => {
    try {
      if (!isBrowser) return;
      console.log(`Removing ${key} from localStorage`);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
});

// Create and export the Supabase client
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
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn('Supabase client not initialized (not in browser environment)');
}

export { supabase };
