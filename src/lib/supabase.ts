import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for browser/frontend (safe with NEXT_PUBLIC_* envs)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          onboarding_completed: boolean
          nickname: string | null
          current_education: string | null
          target_countries: string[] | null
          study_timeline: string | null
          preferred_course: string | null
          budget: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          onboarding_completed?: boolean
          nickname?: string | null
          current_education?: string | null
          target_countries?: string[] | null
          study_timeline?: string | null
          preferred_course?: string | null
          budget?: string | null
        }
        Update: {
          first_name?: string
          last_name?: string
          email?: string
          onboarding_completed?: boolean
          nickname?: string | null
          current_education?: string | null
          target_countries?: string[] | null
          study_timeline?: string | null
          preferred_course?: string | null
          budget?: string | null
        }
      }
      twins: {
        Row: {
          id: string
          user_id: string
          user_name: string
          twin_name: string
          tagline: string | null
          personality: string | null
          tone: string | null
          links: any[]
          status: 'TRAINING' | 'PUBLISHED'
          public_url: string | null
          created_at: string
          published_at: string | null
        }
        Insert: {
          user_id: string
          user_name: string
          twin_name: string
          tagline?: string | null
          personality?: string | null
          tone?: string | null
          links?: any[]
          status?: 'TRAINING' | 'PUBLISHED'
          public_url?: string | null
          published_at?: string | null
        }
        Update: {
          user_name?: string
          twin_name?: string
          tagline?: string | null
          personality?: string | null
          tone?: string | null
          links?: any[]
          status?: 'TRAINING' | 'PUBLISHED'
          public_url?: string | null
          published_at?: string | null
        }
      }
      twin_sessions: {
        Row: {
          id: string
          twin_id: string
          user_id: string | null
          type: 'trainer' | 'chat'
          notebook_id: string | null
          chapter_id: string | null
          thread_id: string | null
          status: 'ACTIVE' | 'COMPLETED' | 'ERROR'
          metadata: any
          created_at: string
          ended_at: string | null
        }
        Insert: {
          twin_id: string
          user_id?: string | null
          type: 'trainer' | 'chat'
          notebook_id?: string | null
          chapter_id?: string | null
          thread_id?: string | null
          status?: 'ACTIVE' | 'COMPLETED' | 'ERROR'
          metadata?: any
          ended_at?: string | null
        }
        Update: {
          type?: 'trainer' | 'chat'
          notebook_id?: string | null
          chapter_id?: string | null
          thread_id?: string | null
          status?: 'ACTIVE' | 'COMPLETED' | 'ERROR'
          metadata?: any
          ended_at?: string | null
        }
      }
    }
  }
}