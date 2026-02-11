import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

export function createClient(): SupabaseClient {
  const url = (import.meta.env as any).VITE_SUPABASE_URL || (import.meta.env as any).NEXT_PUBLIC_SUPABASE_URL || (process.env as any).NEXT_PUBLIC_SUPABASE_URL
  const anon = (import.meta.env as any).VITE_SUPABASE_ANON_KEY || (import.meta.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY || (process.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    console.warn('Supabase env vars are not set: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return createSupabaseClient(String(url || ''), String(anon || ''))
}
