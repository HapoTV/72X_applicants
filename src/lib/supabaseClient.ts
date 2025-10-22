import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supports both Vite (VITE_) and CRA (REACT_APP_) env styles
const getEnv = (key: string): string | undefined => {
  const vite = (globalThis as any)?.import?.meta?.env || (import.meta as any)?.env;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (vite && vite[key]) || (typeof process !== 'undefined' ? (process as any).env?.[key] : undefined);
};

const SUPABASE_URL =
  getEnv('VITE_SUPABASE_URL') || getEnv('REACT_APP_SUPABASE_URL') || getEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY =
  getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { supabase };
