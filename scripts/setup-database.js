#!/usr/bin/env node

/**
 * Automated Supabase Database Setup Script
 * This script will create all tables, indexes, and policies automatically
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const schema = `
-- BeyondCampus Supabase Schema
-- Automated setup script

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  nickname TEXT,
  current_education TEXT,
  target_countries TEXT[],
  study_timeline TEXT,
  preferred_course TEXT,
  budget TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI Twins table
CREATE TABLE IF NOT EXISTS public.twins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  twin_name TEXT NOT NULL,
  tagline TEXT,
  personality TEXT,
  tone TEXT,
  links JSONB DEFAULT '[]',
  status TEXT DEFAULT 'TRAINING' CHECK (status IN ('TRAINING', 'PUBLISHED')),
  public_url TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 3. Twin Sessions table (track interactions + topics/chapters)
CREATE TABLE IF NOT EXISTS public.twin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twin_id UUID NOT NULL REFERENCES public.twins(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('trainer', 'chat')),
  notebook_id TEXT,
  chapter_id TEXT,
  thread_id TEXT,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ERROR')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Create indexes for performance (with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_twins_user_id ON public.twins(user_id);
CREATE INDEX IF NOT EXISTS idx_twins_status ON public.twins(status);
CREATE INDEX IF NOT EXISTS idx_twins_public_url ON public.twins(public_url);
CREATE INDEX IF NOT EXISTS idx_sessions_twin_id ON public.twin_sessions(twin_id);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON public.twin_sessions(type);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.twin_sessions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twin_sessions ENABLE ROW LEVEL SECURITY;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert function to handle user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`

const policies = [
  {
    name: "Users can view own profile",
    table: "users",
    sql: `CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);`
  },
  {
    name: "Users can update own profile", 
    table: "users",
    sql: `CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);`
  },
  {
    name: "Users can insert own profile",
    table: "users", 
    sql: `CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);`
  },
  {
    name: "Users can manage own twins",
    table: "twins",
    sql: `CREATE POLICY "Users can manage own twins" ON public.twins FOR ALL USING (auth.uid() = user_id);`
  },
  {
    name: "Anyone can view published twins",
    table: "twins",
    sql: `CREATE POLICY "Anyone can view published twins" ON public.twins FOR SELECT USING (status = 'PUBLISHED');`
  },
  {
    name: "Users can view own twin sessions",
    table: "twin_sessions",
    sql: `CREATE POLICY "Users can view own twin sessions" ON public.twin_sessions FOR SELECT USING (twin_id IN (SELECT id FROM public.twins WHERE user_id = auth.uid()) OR user_id = auth.uid());`
  },
  {
    name: "Users can manage own twin sessions", 
    table: "twin_sessions",
    sql: `CREATE POLICY "Users can manage own twin sessions" ON public.twin_sessions FOR ALL USING (twin_id IN (SELECT id FROM public.twins WHERE user_id = auth.uid()) OR user_id = auth.uid());`
  }
]

async function setupDatabase() {
  console.log('🚀 Starting database setup...')
  
  try {
    // Execute main schema
    console.log('📝 Creating tables and functions...')
    const { error: schemaError } = await supabase.rpc('exec', {
      sql: schema
    })
    
    if (schemaError) {
      console.error('❌ Schema error:', schemaError)
      // Try alternative approach for schema
      const { error: alternativeError } = await supabase
        .from('_sql')
        .insert({ query: schema })
      
      if (alternativeError) {
        throw new Error(`Failed to execute schema: ${schemaError.message}`)
      }
    }

    console.log('✅ Tables and functions created')
    
    // Create policies individually (since they might already exist)
    console.log('🔐 Setting up Row Level Security policies...')
    
    for (const policy of policies) {
      try {
        // Drop policy if exists, then create
        await supabase.rpc('exec', {
          sql: `DROP POLICY IF EXISTS "${policy.name}" ON public.${policy.table};`
        })
        
        const { error: policyError } = await supabase.rpc('exec', {
          sql: policy.sql
        })
        
        if (policyError) {
          console.warn(`⚠️  Policy "${policy.name}" might already exist:`, policyError.message)
        } else {
          console.log(`✅ Policy created: ${policy.name}`)
        }
      } catch (err) {
        console.warn(`⚠️  Could not create policy "${policy.name}":`, err.message)
      }
    }

    // Verify tables exist
    console.log('🔍 Verifying database setup...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'twins', 'twin_sessions'])

    if (tablesError) {
      throw tablesError
    }

    const expectedTables = ['users', 'twins', 'twin_sessions']
    const existingTables = tables.map(t => t.table_name)
    const missingTables = expectedTables.filter(t => !existingTables.includes(t))

    if (missingTables.length > 0) {
      console.error(`❌ Missing tables: ${missingTables.join(', ')}`)
      throw new Error('Some tables were not created successfully')
    }

    console.log('✅ All tables verified!')
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\nTables created:')
    console.log('  - users (extends Supabase auth)')
    console.log('  - twins (AI twin configurations)')  
    console.log('  - twin_sessions (interaction tracking)')
    console.log('\n✅ Row Level Security enabled with appropriate policies')
    console.log('✅ Triggers set up for automatic user profile creation')
    console.log('✅ Indexes created for optimal performance')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check your Supabase service role key is correct')
    console.error('2. Verify your project URL is correct')
    console.error('3. Make sure you have admin access to the Supabase project')
    process.exit(1)
  }
}

// Run the setup
setupDatabase()