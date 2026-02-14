// TODO: Install @supabase/ssr when Supabase is configured
// import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Supabase not configured in local-first mode
  // When NEXT_PUBLIC_SUPABASE_URL is set, this will use the actual Supabase client
  return null;
}

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
