import { createClient } from '@supabase/supabase-js';

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Hardcoded Supabase configuration
const SUPABASE_URL = 'https://oxabqoodvqvqskrztrsq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YWJxb29kdnF2cXNrcnp0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzI1MzQsImV4cCI6MjA3NjI0ODUzNH0._BdnLDSSe003i83nf_vfnHMlGJSQdjcfEcKvmlyfqSc';

// Create and export the Supabase client
const supabase = isBrowser 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
          getItem: (key) => {
            try {
              return window.localStorage.getItem(key);
            } catch (error) {
              console.error('Error accessing localStorage:', error);
              return null;
            }
          },
          setItem: (key, value) => {
            try {
              window.localStorage.setItem(key, value);
            } catch (error) {
              console.error('Error setting localStorage:', error);
            }
          },
          removeItem: (key) => {
            try {
              window.localStorage.removeItem(key);
            } catch (error) {
              console.error('Error removing from localStorage:', error);
            }
          },
        },
      }
    })
  : null;

export { supabase };
