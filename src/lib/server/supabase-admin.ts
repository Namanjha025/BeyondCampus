import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

export function getSupabaseService(): SupabaseClient | null {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceKey) {
    console.warn('Supabase service configuration missing (URL or SERVICE_ROLE_KEY)')
    return null
  }
  
  cached = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  return cached
}

// Export the service client directly for easier imports
export const supabaseService = getSupabaseService()
