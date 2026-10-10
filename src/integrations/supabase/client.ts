import { createClient } from '@supabase/supabase-js';

// Project configuration
export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  'https://kehnwhvvlpmerjqssaym.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_KEY)) ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY || process.env?.SUPABASE_KEY || process.env?.SUPABASE_SERVICE_ROLE_KEY)) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaG53aHZ2bHBtZXJqcXNzYXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2Mzc1MDgsImV4cCI6MjEwNzIxMzUwOH0.CoL4A0AiJsDAjYhT_TXmakLzDG37eAS0N8dUPH_71JE';

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const isSupabaseConfigured = () => {
  return SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('placeholder');
};
