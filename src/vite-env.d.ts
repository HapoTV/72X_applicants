/// <reference types="vite/client" />

// Import custom type declarations
import './types/boxicons';

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_PRODUCTION_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
