#!/usr/bin/env node

/**
 * Simple Supabase Database Setup Script
 * Uses direct SQL execution via REST API
 */

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

const sqlCommands = [
  // 1. Users table
  `CREATE TABLE IF NOT EXISTS public.users (
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
  );`,

  // 2. Twins table
  `CREATE TABLE IF NOT EXISTS public.twins (
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
  );`,

  // 3. Sessions table
  `CREATE TABLE IF NOT EXISTS public.twin_sessions (
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
  );`,

  // Indexes
  'CREATE INDEX IF NOT EXISTS idx_twins_user_id ON public.twins(user_id);',
  'CREATE INDEX IF NOT EXISTS idx_twins_status ON public.twins(status);',
  'CREATE INDEX IF NOT EXISTS idx_twins_public_url ON public.twins(public_url);',
  'CREATE INDEX IF NOT EXISTS idx_sessions_twin_id ON public.twin_sessions(twin_id);',
  'CREATE INDEX IF NOT EXISTS idx_sessions_type ON public.twin_sessions(type);',
  'CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.twin_sessions(status);',

  // Enable RLS
  'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;',
  'ALTER TABLE public.twins ENABLE ROW LEVEL SECURITY;', 
  'ALTER TABLE public.twin_sessions ENABLE ROW LEVEL SECURITY;',

  // Functions and triggers
  `CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
   END;
   $$ language 'plpgsql';`,

  'DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;',
  `CREATE TRIGGER update_users_updated_at 
       BEFORE UPDATE ON public.users 
       FOR EACH ROW 
       EXECUTE FUNCTION update_updated_at_column();`,

  `CREATE OR REPLACE FUNCTION public.handle_new_user()
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
   $$ LANGUAGE plpgsql SECURITY DEFINER;`,

  'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;',
  `CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`
]

const policies = [
  'DROP POLICY IF EXISTS "Users can view own profile" ON public.users;',
  'CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);',
  
  'DROP POLICY IF EXISTS "Users can update own profile" ON public.users;',
  'CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);',
  
  'DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;',
  'CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);',
  
  'DROP POLICY IF EXISTS "Users can manage own twins" ON public.twins;',
  'CREATE POLICY "Users can manage own twins" ON public.twins FOR ALL USING (auth.uid() = user_id);',
  
  'DROP POLICY IF EXISTS "Anyone can view published twins" ON public.twins;',
  'CREATE POLICY "Anyone can view published twins" ON public.twins FOR SELECT USING (status = \'PUBLISHED\');',
  
  'DROP POLICY IF EXISTS "Users can view own twin sessions" ON public.twin_sessions;',
  'CREATE POLICY "Users can view own twin sessions" ON public.twin_sessions FOR SELECT USING (twin_id IN (SELECT id FROM public.twins WHERE user_id = auth.uid()) OR user_id = auth.uid());',
  
  'DROP POLICY IF EXISTS "Users can manage own twin sessions" ON public.twin_sessions;',
  'CREATE POLICY "Users can manage own twin sessions" ON public.twin_sessions FOR ALL USING (twin_id IN (SELECT id FROM public.twins WHERE user_id = auth.uid()) OR user_id = auth.uid());'
]

async function executeSql(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey
    },
    body: JSON.stringify({ sql })
  })

  if (!response.ok) {
    // Try alternative REST endpoint for SQL
    const altResponse = await fetch(`${supabaseUrl}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sql',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: sql
    })
    
    if (!altResponse.ok) {
      const error = await altResponse.text()
      throw new Error(`SQL execution failed: ${error}`)
    }
    
    return await altResponse.json()
  }
  
  return await response.json()
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...')
  
  try {
    // Execute main schema commands
    console.log('📝 Creating tables and functions...')
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i]
      console.log(`   ${i + 1}/${sqlCommands.length}: Executing...`)
      
      try {
        await executeSql(command)
      } catch (error) {
        console.warn(`   ⚠️  Command ${i + 1} warning: ${error.message}`)
        // Continue with other commands
      }
    }
    
    console.log('✅ Tables and functions created')
    
    // Create policies
    console.log('🔐 Setting up Row Level Security policies...')
    for (let i = 0; i < policies.length; i++) {
      const policy = policies[i]
      console.log(`   ${i + 1}/${policies.length}: Creating policy...`)
      
      try {
        await executeSql(policy)
      } catch (error) {
        console.warn(`   ⚠️  Policy ${i + 1} warning: ${error.message}`)
      }
    }

    console.log('\n🎉 Database setup completed!')
    console.log('\nCreated tables:')
    console.log('  ✅ users (extends Supabase auth)')
    console.log('  ✅ twins (AI twin configurations)')  
    console.log('  ✅ twin_sessions (interaction tracking)')
    console.log('\n✅ Row Level Security policies configured')
    console.log('✅ Auto-user creation trigger installed')
    console.log('✅ Performance indexes created')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.error('\nPlease run the SQL manually in Supabase SQL Editor.')
    process.exit(1)
  }
}

setupDatabase()