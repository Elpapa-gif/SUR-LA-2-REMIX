import { createClient } from '@supabase/supabase-js';

// Project configuration loaded STRICTLY from environment variables
export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  'https://kehnwhvvlpmerjqssaym.supabase.co';

const getSupabaseAnonKey = (): string => {
  if (typeof import.meta !== 'undefined') {
    if (import.meta.env?.VITE_SUPABASE_ANON_KEY) return import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (import.meta.env?.VITE_SUPABASE_KEY) return import.meta.env.VITE_SUPABASE_KEY;
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_SUPABASE_ANON_KEY) return process.env.VITE_SUPABASE_ANON_KEY;
    if (process.env.SUPABASE_ANON_KEY) return process.env.SUPABASE_ANON_KEY;
    if (process.env.SUPABASE_KEY) return process.env.SUPABASE_KEY;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  return '';
};

export const SUPABASE_ANON_KEY = getSupabaseAnonKey();

// Create and export the Supabase client safely
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || 'missing-supabase-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20);
};
