// lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Read env once and fail loudly if misconfigured
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Dev/HMR: keep a single client instance
declare global {
  // eslint-disable-next-line no-var
  var __supabase__: SupabaseClient | undefined;
}

export const supabase: SupabaseClient =
  globalThis.__supabase__ ??
  createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

if (!globalThis.__supabase__) {
  globalThis.__supabase__ = supabase;
}
// This file initializes the Supabase client for use throughout the application.
// It checks for the necessary environment variables and throws an error if they are not set,