import { getSupabaseService } from './server/supabase-admin'
import type { Database } from './supabase'

const supabaseService = getSupabaseService()

type Twin = Database['public']['Tables']['twins']['Row']
type TwinInsert = Database['public']['Tables']['twins']['Insert']
type TwinUpdate = Database['public']['Tables']['twins']['Update']

export const database = {
  // Twin operations
  async createTwin(twinData: TwinInsert, customId?: string): Promise<Twin> {
    if (!supabaseService) {
      throw new Error('Database service not configured')
    }
    
    const insertData = customId ? { id: customId, ...twinData } : twinData
    
    const { data, error } = await supabaseService
      .from('twins')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating twin:', error)
      throw new Error(`Failed to create twin: ${error.message}`)
    }
    
    console.log('Twin created in Supabase:', data)
    return data
  },

  async findTwin(twinId: string, userId?: string): Promise<Twin | null> {
    let query = supabaseService
      .from('twins')
      .select()
      .eq('id', twinId)
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query.single()
    
    if (error) {
      console.log('Twin not found:', twinId, error.message)
      return null
    }
    
    console.log('Found twin:', data)
    return data
  },

  async findTwinBySlug(slug: string): Promise<Twin | null> {
    const { data, error } = await supabaseService
      .from('twins')
      .select()
      .eq('public_url', slug)
      .eq('status', 'PUBLISHED')
      .single()
    
    if (error) {
      console.log('Twin not found for slug:', slug, error.message)
      return null
    }
    
    return data
  },

  async updateTwin(twinId: string, updates: TwinUpdate): Promise<Twin | null> {
    const { data, error } = await supabaseService
      .from('twins')
      .update(updates)
      .eq('id', twinId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating twin:', error)
      return null
    }
    
    console.log('Twin updated:', data)
    return data
  },

  async getAllTwins(): Promise<Twin[]> {
    const { data, error } = await supabaseService
      .from('twins')
      .select()
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching twins:', error)
      return []
    }
    
    return data || []
  },

  async getUserTwins(userId: string): Promise<Twin[]> {
    const { data, error } = await supabaseService
      .from('twins')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user twins:', error)
      return []
    }
    
    return data || []
  },

  // User operations
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabaseService
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      throw new Error(`Failed to create user: ${error.message}`)
    }
    
    return data
  },

  async getUser(userId: string) {
    const { data, error } = await supabaseService
      .from('users')
      .select()
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    
    return data
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabaseService
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      throw new Error(`Failed to update user: ${error.message}`)
    }
    
    return data
  },

  // Session tracking
  async createSession(sessionData: Database['public']['Tables']['twin_sessions']['Insert']) {
    const { data, error } = await supabaseService
      .from('twin_sessions')
      .insert(sessionData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating session:', error)
      throw new Error(`Failed to create session: ${error.message}`)
    }
    
    return data
  }
}